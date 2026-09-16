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
		}

		const data = await request.formData();
		const file = data.get('pdf');

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