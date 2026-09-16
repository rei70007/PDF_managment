import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import pool from '$lib/server/db.js';

// Turn Node's callback-based scrypt function into a function we can await.
const scrypt = promisify(scryptCallback);

/**
 * Hash a password before it is saved to the database.
 *
 * The resulting value includes its random salt, so verifyPassword can safely
 * recreate the same hash later without needing a separate database column.
 */
export async function hashPassword(password) {
	const salt = randomBytes(16).toString('hex');
	const hash = await scrypt(password, salt, 64);

	return `${salt}:${Buffer.from(hash).toString('hex')}`;
}

/** Compare a submitted password to a saved hash without exposing timing clues. */
export async function verifyPassword(password, savedHash) {
	if (typeof savedHash !== 'string') return false;

	const [salt, storedHash] = savedHash.split(':');

	// A malformed database value is never a valid password.
	if (!salt || !storedHash) return false;

	const hash = Buffer.from(await scrypt(password, salt, 64));
	const storedHashBuffer = Buffer.from(storedHash, 'hex');

	return hash.length === storedHashBuffer.length && timingSafeEqual(hash, storedHashBuffer);
}

/**
 * Create a 30-day server-side session and return the token stored in the cookie.
 * This expects a `sessions` table with id, user_id, and expires_at columns.
 */
export async function createSession(userId) {
	const sessionId = randomBytes(32).toString('hex');
	const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

	await pool.execute('INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)', [
		sessionId,
		userId,
		expiresAt
	]);

	return sessionId;
}

/**
 * Find the user that owns a session, but only while that session is still valid.
 * The password hash is deliberately not selected because it is never needed by
 * pages after a user has logged in.
 */
export async function validateSession(sessionId) {
	if (!sessionId) return null;

	const [sessions] = await pool.execute(
		`SELECT users.id, users.email, users.role
		 FROM sessions
		 JOIN users ON users.id = sessions.user_id
		 WHERE sessions.id = ? AND sessions.expires_at > NOW()
		 LIMIT 1`,
		[sessionId]
	);

	return sessions[0] ?? null;
}
