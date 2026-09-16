import { error, fail } from '@sveltejs/kit';
import { del } from '@vercel/blob';
import pool from '$lib/server/db.js';

function requireAdmin(user) {
	if (!user || user.role !== 'admin') error(403, 'Not allowed');
}

export async function load({ locals }) {
	requireAdmin(locals.user);
	const [pdfs] = await pool.execute(
		`SELECT pdfs.id, pdfs.filename, pdfs.blob_url, pdfs.created_at, users.email AS uploaded_by
		 FROM pdfs
		 INNER JOIN users ON users.id = pdfs.user_id
		 ORDER BY pdfs.created_at DESC`
	);
	return { pdfs };
}

export const actions = {
	deletePdf: async ({ request, locals }) => {
		requireAdmin(locals.user);
		const id = Number((await request.formData()).get('id'));
		if (!Number.isInteger(id) || id < 1) return fail(400, { error: 'Invalid PDF.' });

		const [pdfs] = await pool.execute('SELECT blob_url FROM pdfs WHERE id = ? LIMIT 1', [id]);
		const pdf = pdfs[0];
		if (!pdf) return fail(404, { error: 'PDF not found.' });

		await pool.execute('DELETE FROM pdfs WHERE id = ?', [id]);
		await del(pdf.blob_url).catch((cause) => console.error('Could not delete PDF blob', cause));
		return { success: true };
	}
};
