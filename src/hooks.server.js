import { getSessionUser } from '$lib/server/auth.js';

/** Make the signed-in user available to all server routes and actions. */
export async function handle({ event, resolve }) {
	const sessionId = event.cookies.get('session');
	event.locals.user = await getSessionUser(sessionId);
	return resolve(event);
}
