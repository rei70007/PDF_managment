import { redirect } from '@sveltejs/kit';
import pool from '$lib/server/db.js';

/** Invalidate the server session as well as clearing the browser cookie. */
export async function load({ cookies }) {
	const sessionId = cookies.get('session');
	if (sessionId) await pool.execute('DELETE FROM sessions WHERE id = ?', [sessionId]);
	cookies.delete('session', { path: '/' });
	redirect(303, '/');
}
