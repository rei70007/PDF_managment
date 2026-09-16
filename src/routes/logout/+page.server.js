import { redirect } from '@sveltejs/kit';
import pool from '$lib/server/db.js';

// Remove the session record when possible, then always remove the browser cookie.
export const load = async ({ cookies }) => {
	const sessionId = cookies.get('session');

	if (sessionId) {
		await pool.execute('DELETE FROM sessions WHERE id = ?', [sessionId]);
	}

	cookies.delete('session', { path: '/' });
	redirect(303, '/');
};
