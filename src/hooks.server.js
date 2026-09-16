import { validateSession } from '$lib/server/auth.js';

/**
 * This hook runs before every server request. It makes the signed-in user
 * available to every load function and form action through event.locals.user.
 */
export async function handle({ event, resolve }) {
	// The cookie stores only the session ID; user details stay in the database.
	const sessionId = event.cookies.get('session');

	// A missing, expired, or unknown session simply means this request is anonymous.
	event.locals.user = sessionId ? await validateSession(sessionId) : null;

	return resolve(event);
}
