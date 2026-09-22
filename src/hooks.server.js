// Get the helper that looks up a user from a session ID
import { getSessionUser } from '$lib/server/auth.js';

/** Make the signed-in user available to all server routes and actions. */

//handle is a special hook that runs when the server receives a request.
//event → contains information about the current request: cookies, URL, locals..
//resolve → a function that continues processing the request and returns a response.
export async function handle({ event, resolve }) {

	// Gets the value of the "session" cookie from the user's browser.
	// The sessionId is used to identify which user is logged in.
	const sessionId = event.cookies.get('session');

	// Finds the user from the session ID and stores it in locals for this request.
	event.locals.user = await getSessionUser(sessionId);

	// resolve(event) tells SvelteKit to continue to the requested page/route.
	return resolve(event);
}
