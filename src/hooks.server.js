import { getSessionUser } from '$lib/server/auth.js';

export async function handle({ event, resolve }) {
	const sessionId = event.cookies.get('session');
	event.locals.user = await getSessionUser(sessionId);

	return resolve(event);
}
