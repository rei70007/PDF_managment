import { error, fail, redirect } from '@sveltejs/kit';
import { del, put } from '@vercel/blob';
import { BLOB_READ_WRITE_TOKEN } from '$env/static/private';
import pool from '$lib/server/db.js';

const MAX_FILE_SIZE = 10 * 1024 * 1024;

function requireUser(user) {
	if (!user) redirect(303, '/login');
	return user;
}

export async function load({ locals }) {
	const user = requireUser(locals.user);
	if (user.role === 'admin') redirect(303, '/admin');
	const [pdfs] = await pool.execute(
		`SELECT id, filename, blob_url, uploaded_at FROM pdfs WHERE user_id = ? ORDER BY uploaded_at DESC`,
		[user.id]
	);
	return { user, pdfs };
}

export const actions = {
	upload: async ({ request, locals }) => {
		const user = requireUser(locals.user);
		if (user.role === 'admin') return fail(403, { error: 'Administrators cannot upload PDFs.' });
		const file = (await request.formData()).get('pdf');
		if (!(file instanceof File) || file.size === 0)
			return fail(400, { error: 'Please choose a PDF file.' });
		if (file.type !== 'application/pdf' || !file.name.toLowerCase().endsWith('.pdf'))
			return fail(400, { error: 'Only PDF files can be uploaded.' });
		if (file.size > MAX_FILE_SIZE) return fail(400, { error: 'The PDF must not exceed 10 MB.' });

		const blob = await put(file.name, file, {
			access: 'public',
			addRandomSuffix: true,
			contentType: 'application/pdf',
			token: BLOB_READ_WRITE_TOKEN
		});
		try {
			await pool.execute('INSERT INTO pdfs (user_id, filename, blob_url) VALUES (?, ?, ?)', [
				user.id,
				file.name,
				blob.url
			]);
		} catch (cause) {
			await del(blob.url).catch(() => {});
			console.error('Could not save PDF metadata', cause);
			throw error(500, 'The PDF could not be saved.');
		}
		return { success: true };
	}
};