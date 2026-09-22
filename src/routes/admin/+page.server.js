// Imports SvelteKit helpers:
// error() throws an HTTP error, fail() returns an action error.
import { error, fail } from '@sveltejs/kit';
import { del } from '@vercel/blob';
import pool from '$lib/server/db.js';


// Checks whether the logged-in user is an admin.
function requireAdmin(user) {
    if (!user || user.role !== 'admin') error(403, 'Not allowed');
}

// load() runs when this page is loaded.
export async function load({ locals }) {

    // locals.user contains information about the logged-in user.
    // Only admins are allowed to access this page.
    requireAdmin(locals.user);

     // Runs an SQL query and stores the returned rows in "pdfs".
    const [pdfs] = await pool.execute(
        `SELECT pdfs.id, pdfs.filename, pdfs.blob_url, pdfs.uploaded_at, users.email AS uploaded_by
         FROM pdfs
         INNER JOIN users ON users.id = pdfs.user_id
         ORDER BY pdfs.uploaded_at DESC`
    );
    return { pdfs };
}

export const actions = {
    deletePdf: async ({ request, locals }) => {
        requireAdmin(locals.user);
        const id = Number((await request.formData()).get('id'));
        if (!Number.isInteger(id) || id < 1) return fail(400, { error: 'Invalid PDF.' });


        // Reads the submitted form data and gets the PDF id.
        // Number() converts the value from text into a number.
        const [pdfs] = await pool.execute('SELECT blob_url FROM pdfs WHERE id = ? LIMIT 1', [id]);
       
        // Gets the first PDF returned from the database.
        const pdf = pdfs[0];
        // If there was no PDF with this ID, return a 404 error.
        if (!pdf) return fail(404, { error: 'PDF not found.' });


        // Deletes the PDF entry from the database.
        await pool.execute('DELETE FROM pdfs WHERE id = ?', [id]);

        await del(pdf.blob_url).catch((cause) => console.error('Could not delete PDF blob', cause));
       // If deleting the Blob fails, don't crash the whole action.
            // Instead, print the error in the server console. (catch)
       
       
        return { success: true };


    }
};