<<<<<<< HEAD
import { getSessionUser } from '$lib/server/auth.js';

export async function handle({ event, resolve }) {
	const sessionId = event.cookies.get('session');
	event.locals.user = await getSessionUser(sessionId);
=======
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
>>>>>>> 291474e5e5536862b87cfd556a4b045db1239ea1

	return resolve(event);
}
