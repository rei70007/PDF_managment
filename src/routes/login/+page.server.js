import { dev } from '$app/environment';
import { fail, redirect } from '@sveltejs/kit';
import pool from '$lib/server/db.js';
import { createSession, verifyPassword } from '$lib/server/auth.js';

// One generic message avoids revealing whether an email address is registered.
const INVALID_LOGIN_MESSAGE = 'Invalid email or password.';

export const actions = {
	// The default action is called when the form on +page.svelte is submitted.
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const email = data.get('email')?.toString().trim().toLowerCase();
		const password = data.get('password')?.toString();

		// Do not send different errors for missing fields, unknown users, or bad passwords.
		if (!email || !password) {
			return fail(400, { error: INVALID_LOGIN_MESSAGE, email: email ?? '' });
		}

		// Parameter placeholders (?) protect the query from SQL injection.
		const [users] = await pool.execute(
			'SELECT id, password_hash FROM users WHERE email = ? LIMIT 1',
			[email]
		);
		const user = users[0];

		// Verify the submitted password against the stored password hash from the database.
		if (!user || !(await verifyPassword(password, user.password_hash))) {
			return fail(400, { error: INVALID_LOGIN_MESSAGE, email });
		}

		// The auth helper creates the server-side session and returns its ID/token.
		const sessionId = await createSession(user.id);

		// Store only the session ID in a protected browser cookie; never store a password here.
		cookies.set('session', sessionId, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: !dev,
			maxAge: 60 * 60 * 24 * 30 // 30 days
		});

		// A successful login takes the user to the upload page.
		redirect(303, '/upload');
	}
};
