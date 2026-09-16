import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import pool from '$lib/server/db.js';

const scrypt = promisify(scryptCallback);

export async function hashPassword(password) {
	const salt = randomBytes(16).toString('hex');
	const hash = await scrypt(password, salt, 64);
	return `${salt}:${Buffer.from(hash).toString('hex')}`;
}

export async function verifyPassword(password, savedHash) {
	if (typeof savedHash !== 'string') return false;
	const [salt, storedHash] = savedHash.split(':');
	if (!salt || !storedHash) return false;
	const hash = Buffer.from(await scrypt(password, salt, 64));
	const storedHashBuffer = Buffer.from(storedHash, 'hex');
	return hash.length === storedHashBuffer.length && timingSafeEqual(hash, storedHashBuffer);
}

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

/** Resolve a valid session cookie to its current user and role. */
export async function getSessionUser(sessionId) {
	if (!sessionId) return null;
	const [users] = await pool.execute(
		`SELECT users.id, users.email, users.role
		 FROM sessions
		 INNER JOIN users ON users.id = sessions.user_id
		 WHERE sessions.id = ? AND sessions.expires_at > NOW()
		 LIMIT 1`,
		[sessionId]
	);
	return users[0] ?? null;
}
