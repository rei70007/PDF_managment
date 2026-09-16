import { error, fail, redirect } from '@sveltejs/kit';
import { del, put } from '@vercel/blob';
import pool from '$lib/server/db.js';

const MAX_FILE_SIZE = 10 * 1024 * 1024;

function requireUser(user) {
	if (!user) redirect(303, '/login');
	return user;
}

export async function load({ locals }) {
	const user = requireUser(locals.user);
	const isAdmin = user.role === 'admin';

	const [pdfs] = await pool.execute(
		isAdmin
			? `SELECT pdfs.id, pdfs.filename, pdfs.blob_url, pdfs.created_at,
					 users.email AS uploaded_by
				 FROM pdfs
				 INNER JOIN users ON users.id = pdfs.user_id
				 ORDER BY pdfs.created_at DESC`
			: `SELECT id, filename, blob_url, created_at
				 FROM pdfs
				 WHERE user_id = ?
				 ORDER BY created_at DESC`,
		isAdmin ? [] : [user.id]
	);

	return { isAdmin, pdfs };
}

export const actions = {
	upload: async ({ request, locals }) => {
		const user = requireUser(locals.user);

		// The check belongs here as well as in the template: an admin can never
		// upload by submitting a hand-crafted request.
		if (user.role === 'admin') {
			return fail(403, { error: 'Administrators cannot upload PDFs.' });
		}

		const data = await request.formData();
		const file = data.get('pdf');

		if (!(file instanceof File) || file.size === 0) {
			return fail(400, { error: 'Please choose a PDF file.' });
		}
		if (file.type !== 'application/pdf' || !file.name.toLowerCase().endsWith('.pdf')) {
			return fail(400, { error: 'Only PDF files can be uploaded.' });
		}
		if (file.size > MAX_FILE_SIZE) {
			return fail(400, { error: 'The PDF must not exceed 10 MB.' });
		}

		const blob = await put(file.name, file, {
			access: 'public',
			addRandomSuffix: true,
			contentType: 'application/pdf'
		});

		try {
			await pool.execute('INSERT INTO pdfs (user_id, filename, blob_url) VALUES (?, ?, ?)', [
				user.id,
				file.name,
				blob.url
			]);
		} catch (cause) {
			// Keep database and storage in sync even if metadata persistence fails.
			await del(blob.url).catch(() => {});
			console.error('Could not save PDF metadata', cause);
			throw error(500, 'The PDF could not be saved.');
		}

		return { success: true };
	}
};
