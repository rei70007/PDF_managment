<<<<<<< HEAD
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
=======
import { fail, redirect } from '@sveltejs/kit';
import { put } from '@vercel/blob';
import { BLOB_READ_WRITE_TOKEN } from '$env/static/private';
import pool from '$lib/server/db.js';

/** Load only the current user's PDFs, newest upload first. */
export async function load({ locals }) {
	// This route is private: users must log in before they can see their files.
	if (!locals.user) {
		redirect(303, '/login');
	}

	// The placeholder prevents SQL injection and ensures users see only their own PDFs.
	const [pdfs] = await pool.execute(
		'SELECT id, filename, blob_url, uploaded_at FROM pdfs WHERE user_id = ? ORDER BY uploaded_at DESC',
		[locals.user.id]
	);

	return { user: locals.user, pdfs };
}

export const actions = {
	/** Upload the selected file to Vercel Blob and save its details in MySQL. */
	default: async ({ request, locals }) => {
		// Form actions can also be called directly, so protect this route here too.
		if (!locals.user) {
			redirect(303, '/login');
>>>>>>> 291474e5e5536862b87cfd556a4b045db1239ea1
		}

		const data = await request.formData();
		const file = data.get('pdf');

<<<<<<< HEAD
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
=======
		// A FormData entry can be a string, so make sure a real non-empty file was sent.
		if (!(file instanceof File) || file.size === 0) {
			return fail(400, { error: 'Please choose a PDF file to upload.' });
		}

		if (file.type !== 'application/pdf') {
			return fail(400, { error: 'Only PDF files can be uploaded.' });
		}

		try {
			// A unique path avoids replacing a file with the same name from an earlier upload.
			const blob = await put(`${locals.user.id}/${Date.now()}-${file.name}`, file, {
				access: 'public',
				token: BLOB_READ_WRITE_TOKEN
			});

			// Store the file information so the upload can appear in this user's list.
			await pool.execute('INSERT INTO pdfs (user_id, filename, blob_url) VALUES (?, ?, ?)', [
				locals.user.id,
				file.name,
				blob.url
			]);
		} catch (error) {
			console.error('PDF upload failed:', error);
			return fail(500, { error: 'Your PDF could not be uploaded. Please try again.' });
		}

		// Reload the page so the new PDF appears in the list immediately.
		return { success: true };
	}
};
>>>>>>> 291474e5e5536862b87cfd556a4b045db1239ea1
