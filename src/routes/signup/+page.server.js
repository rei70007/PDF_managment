import { dev } from '$app/environment';
import { fail, redirect } from '@sveltejs/kit';
import pool from '$lib/server/db.js';
import { createSession, hashPassword } from '$lib/server/auth.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MINIMUM_PASSWORD_LENGTH = 8;

export const actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const email = data.get('email')?.toString().trim().toLowerCase() ?? '';
		const password = data.get('password')?.toString() ?? '';

		if (!EMAIL_PATTERN.test(email)) {
			return fail(400, { error: 'Enter a valid email address.', email });
		}

		if (password.length < MINIMUM_PASSWORD_LENGTH) {
			return fail(400, {
				error: `Password must be at least ${MINIMUM_PASSWORD_LENGTH} characters.`,
				email
			});
		}

		const [existingUsers] = await pool.execute('SELECT id FROM users WHERE email = ? LIMIT 1', [
			email
		]);
		if (existingUsers.length > 0) {
			return fail(400, { error: 'An account with that email already exists.', email });
		}

		const passwordHash = await hashPassword(password);
		const [result] = await pool.execute('INSERT INTO users (email, password) VALUES (?, ?)', [
			email,
			passwordHash
		]);

		const sessionId = await createSession(result.insertId);
		cookies.set('session', sessionId, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: !dev,
			maxAge: 60 * 60 * 24 * 30
		});

		redirect(303, '/upload');
	}
};
