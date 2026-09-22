import { error, fail, redirect } from '@sveltejs/kit';
import { del, put } from '@vercel/blob';
import { BLOB_READ_WRITE_TOKEN } from '$env/static/private';
import pool from '$lib/server/db.js';


// Sets the maximum allowed PDF size to 10 MB.
const MAX_FILE_SIZE = 10 * 1024 * 1024;


// Checks if a user is logged in. If not, redirects them to the login page.
function requireUser(user) {
	if (!user) redirect(303, '/login');
	return user;
}

// Loads the logged-in user's PDFs from the database.
export async function load({ locals }) {
	const user = requireUser(locals.user);

	// Admins have their own page, so they are redirected there.
	if (user.role === 'admin') redirect(303, '/admin');

	// Gets only the PDFs that belong to the current user.
	const [pdfs] = await pool.execute(
		`SELECT id, filename, blob_url, uploaded_at FROM pdfs WHERE user_id = ? ORDER BY uploaded_at DESC`,
		[user.id]
	);
	return { user, pdfs };
}

// Handles the PDF upload when the upload form is submitted.
export const actions = {
	upload: async ({ request, locals }) => {
		const user = requireUser(locals.user);

		// Gets the PDF selected in the form.
		if (user.role === 'admin') return fail(403, { error: 'Administrators cannot upload PDFs.' });
		const file = (await request.formData()).get('pdf');

		// Checks that a file was selected and that it is not empty.
		if (!(file instanceof File) || file.size === 0)
			return fail(400, { error: 'Please choose a PDF file.' });

        // Makes sure the uploaded file is actually a PDF.
		if (file.type !== 'application/pdf' || !file.name.toLowerCase().endsWith('.pdf'))
			return fail(400, { error: 'Only PDF files can be uploaded.' });

		// Checks that the PDF does not exceed the maximum allowed size.
		if (file.size > MAX_FILE_SIZE) 
			return fail(400, { error: 'The PDF must not exceed 10 MB.' });


		// Uploads the PDF to Vercel Blob storage.
		const blob = await put(file.name, file, {
			access: 'public',
			addRandomSuffix: true, // Prevents files with the same name from conflicting.
			contentType: 'application/pdf', // Ensures the file is served as a PDF.
			token: BLOB_READ_WRITE_TOKEN
		});

		// Saves information about the uploaded PDF in the database.
		try {
			await pool.execute('INSERT INTO pdfs (user_id, filename, blob_url) VALUES (?, ?, ?)', [
				user.id,
				file.name,
				blob.url
			]);
		} catch (cause) {
			await del(blob.url).catch(() => {});

			// If saving to the database fails, deletes the already uploaded file.
			console.error('Could not save PDF metadata', cause); 
			throw error(500, 'The PDF could not be saved.');
		}
		return { success: true };
	}
};