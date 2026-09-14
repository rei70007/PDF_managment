import { dev } from '$app/environment';
import { fail, redirect } from '@sveltejs/kit';
import pool from '$lib/server/db.js';
import { createSession, hashPassword } from '$lib/server/auth.js';

// Keep validation intentionally small and easy to maintain for this project.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MINIMUM_PASSWORD_LENGTH = 8;

export const actions = {
	// SvelteKit runs this action for a regular POST from the registration form.
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const email = data.get('email')?.toString().trim().toLowerCase() ?? '';
		const password = data.get('password')?.toString() ?? '';

		// Return friendly validation feedback and preserve the email the user typed.
		if (!EMAIL_PATTERN.test(email)) {
			return fail(400, { error: 'Enter a valid email address.', email });
		}

		if (password.length < MINIMUM_PASSWORD_LENGTH) {
			return fail(400, {
				error: `Password must be at least ${MINIMUM_PASSWORD_LENGTH} characters.`,
				email
			});
		}

		// Check first so we can give a clear message instead of a database error.
		const [existingUsers] = await pool.execute('SELECT id FROM users WHERE email = ? LIMIT 1', [
			email
		]);
		if (existingUsers.length > 0) {
			return fail(400, { error: 'An account with that email already exists.', email });
		}

		// Only the password hash, never the original password, is stored in MySQL.
		const passwordHash = await hashPassword(password);
		const [result] = await pool.execute('INSERT INTO users (email, password) VALUES (?, ?)', [
			email,
			passwordHash
		]);

		// Sign the new user in immediately, using the same session flow as login.
		const sessionId = await createSession(result.insertId);
		cookies.set('session', sessionId, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: !dev,
			maxAge: 60 * 60 * 24 * 30 // 30 days
		});

		redirect(303, '/upload');
	}
};
