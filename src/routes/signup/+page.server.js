import { redirect } from '@sveltejs/kit';

// Keep the requested /signup link working while the registration page lives at /register.
export const load = () => {
	redirect(303, '/register');
};
