import { redirect } from '@sveltejs/kit';

export const actions = {
	default: async ({ cookies }) => {
		cookies.delete('session', { path: '/' });
		redirect(303, '/');
	}
};
