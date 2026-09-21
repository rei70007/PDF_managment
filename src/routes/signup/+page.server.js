// Prüft, ob die App im Entwicklungsmodus läuft
import { dev } from '$app/environment';

// Für Fehler und Weiterleitungen
import { fail, redirect } from '@sveltejs/kit';

// Verbindung zur Datenbank
import pool from '$lib/server/db.js';

// Funktionen für Passwort-Hash und Session
import { createSession, hashPassword } from '$lib/server/auth.js';

// Prüft, ob die E-Mail gültig ist
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Passwort muss mindestens 8 Zeichen haben
const MINIMUM_PASSWORD_LENGTH = 8;

export const actions = {
	default: async ({ request, cookies }) => {

		// Holt die Daten aus dem Formular
		const data = await request.formData();

		// Holt und normalisiert die E-Mail
		const email = data.get('email')?.toString().trim().toLowerCase() ?? '';

		// Holt das Passwort
		const password = data.get('password')?.toString() ?? '';

		// Prüft die E-Mail-Adresse
		if (!EMAIL_PATTERN.test(email)) {
			return fail(400, { error: 'Enter a valid email address.', email });
		}

		// Prüft die Mindestlänge des Passworts
		if (password.length < MINIMUM_PASSWORD_LENGTH) {
			return fail(400, {
				error: `Password must be at least ${MINIMUM_PASSWORD_LENGTH} characters.`,
				email
			});
		}

		// Prüft, ob die E-Mail bereits registriert ist
		const [existingUsers] = await pool.execute(
			'SELECT id FROM users WHERE email = ? LIMIT 1',
			[email]
		);

		if (existingUsers.length > 0) {
			return fail(400, {
				error: 'An account with that email already exists.',
				email
			});
		}

		// Hasht das Passwort vor dem Speichern
		const passwordHash = await hashPassword(password);

		// Erstellt den neuen Benutzer in der Datenbank
		const [result] = await pool.execute(
			'INSERT INTO users (email, password_hash) VALUES (?, ?)',
			[email, passwordHash]
		);

		// Erstellt eine Session für den neuen Benutzer
		const sessionId = await createSession(result.insertId);

		// Speichert die Session-ID als Cookie
		cookies.set('session', sessionId, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: !dev,
			maxAge: 60 * 60 * 24 * 30
		});

		// Leitet den Benutzer nach der Registrierung weiter
		redirect(303, '/upload');
	}
};