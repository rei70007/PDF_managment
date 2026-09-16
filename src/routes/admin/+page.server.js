import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db';

export async function load({ locals }) {
	if (!locals.user || locals.user.role !== 'admin') {
		throw error(403, 'Nicht erlaubt');
	}

	const pdfs = await db.pdf.findMany({
		include: { user: true }
	});

	return { pdfs };
}

export const actions = {
	deletePdf: async ({ request, locals }) => {
		if (!locals.user || locals.user.role !== 'admin') {
			throw error(403, 'Nicht erlaubt');
		}

		const formData = await request.formData();
		const id = formData.get('id');

		await db.pdf.delete({ where: { id: Number(id) } });

		return { success: true };
	}
};