// Importiert Funktionen für sichere Passwörter und zufällige Werte
import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';

// Wird benötigt, um scrypt mit async/await verwenden zu können
import { promisify } from 'node:util';

// Verbindung zur MySQL-Datenbank
import pool from '$lib/server/db.js';

// Wandelt scrypt von einer Callback-Funktion in eine Promise-Funktion um,
// damit wir scrypt mit async/await verwenden können. ---> Callback 
const scrypt = promisify(scryptCallback);


// Hasht ein Passwort, damit es nicht direkt in der Datenbank gespeichert wird
export async function hashPassword(password) {

	// Erstellt einen zufälligen Salt mit 16 Bytes.
	// Der Salt wird zusätzlich zum Passwort verwendet.
	// Dadurch bekommen auch gleiche Passwörter unterschiedliche Hashes.
	const salt = randomBytes(16).toString('hex');

	// Erstellt mit scrypt einen Hash aus dem Passwort und dem Salt.
	// 64 gibt die Länge des erzeugten Hashes an.
	const hash = await scrypt(password, salt, 64);

	// Ein Buffer speichert die Hash-Daten als Bytes.
	// Mit toString('hex') werden die Bytes in lesbaren Hex-Text umgewandelt.
	// Salt und Hash werden gemeinsam gespeichert: salt:hash
	return `${salt}:${Buffer.from(hash).toString('hex')}`;
}


// Überprüft, ob das eingegebene Passwort zum gespeicherten Hash passt
export async function verifyPassword(password, savedHash) {

	// Prüft, ob ein gültiger gespeicherter Hash vorhanden ist
	if (typeof savedHash !== 'string') return false;

	// Trennt den gespeicherten Salt und Hash am Doppelpunkt
	const [salt, storedHash] = savedHash.split(':');

	// Wenn Salt oder Hash fehlen, ist das Passwort ungültig
	if (!salt || !storedHash) return false;

	// Erstellt mit dem eingegebenen Passwort und dem gespeicherten Salt
	// einen neuen Hash.
	// Buffer wandelt das Ergebnis in Bytes um.
	const hash = Buffer.from(await scrypt(password, salt, 64));

	// Der gespeicherte Hash liegt als Hex-Text vor.
	// Buffer.from(..., 'hex') wandelt ihn wieder in Bytes um.
	const storedHashBuffer = Buffer.from(storedHash, 'hex');

	// Vergleicht den neuen Hash mit dem gespeicherten Hash.
	// timingSafeEqual sorgt für einen sicheren Vergleich der Bytes.
	return hash.length === storedHashBuffer.length &&
		timingSafeEqual(hash, storedHashBuffer);
}

// Erstellt eine neue Session für einen eingeloggten Benutzer
export async function createSession(userId) {

	// Erstellt eine zufällige Session-ID
	const sessionId = randomBytes(32).toString('hex');

	// Session ist 30 Tage gültig
	const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

	// Speichert die Session in der Datenbank
	await pool.execute(
		'INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)',
		[
			sessionId,
			userId,
			expiresAt
		]
	);

	// Gibt die Session-ID zurück
	return sessionId;
}


/**
 * Sucht anhand eines Session-Cookies den zugehörigen Benutzer.
 * Gibt Benutzer-ID, E-Mail und Rolle zurück.
 */
export async function getSessionUser(sessionId) {

	// Wenn keine Session-ID vorhanden ist, gibt es keinen Benutzer
	if (!sessionId) return null;

	// Sucht den Benutzer über die Session-ID in der Datenbank
	const [users] = await pool.execute(
		`SELECT users.id, users.email, users.role
		 FROM sessions
		 INNER JOIN users ON users.id = sessions.user_id
		 WHERE sessions.id = ? AND sessions.expires_at > NOW()
		 LIMIT 1`,
		[sessionId]
	);

	// Gibt den gefundenen Benutzer zurück.
	// Wenn kein Benutzer gefunden wurde, wird null zurückgegeben.
	return users[0] ?? null;
}