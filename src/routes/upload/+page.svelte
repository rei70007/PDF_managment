<script>
	import { invalidateAll } from '$app/navigation';
	import { base } from '$app/paths';

	let { data, form } = $props();
	let deletingId = $state(null);

	async function deletePdf(id) {
		if (!confirm('PDF wirklich löschen?')) return;

		deletingId = id;
		const response = await fetch(`${base}/api/pdfs/${id}`, { method: 'DELETE' });
		deletingId = null;

		if (!response.ok) {
			alert('Die PDF konnte nicht gelöscht werden.');
			return;
		}

		await invalidateAll();
	}
</script>

<svelte:head>
	<title>{data.isAdmin ? 'Alle PDFs' : 'Meine PDFs'} | PDF Management</title>
</svelte:head>

<main class="mx-auto min-h-screen max-w-5xl px-4 py-10 sm:px-6">
	<header class="mb-8 flex items-start justify-between gap-4">
		<div>
			<p class="text-sm font-medium text-sky-700">PDF Management</p>
			<h1 class="text-3xl font-bold text-slate-900">
				{data.isAdmin ? 'Alle hochgeladenen PDFs' : 'Meine PDFs'}
			</h1>
			<p class="mt-1 text-sm text-slate-600">
				Angemeldet als {data.isAdmin ? 'Administrator' : 'Benutzer'}.
			</p>
		</div>
		<form method="POST" action="/logout">
			<button
				class="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-50"
				>Abmelden</button
			>
		</form>
	</header>

	{#if !data.isAdmin}
		<section class="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
			<h2 class="text-lg font-semibold text-slate-900">PDF hochladen</h2>
			{#if form?.error}
				<p class="mt-3 text-sm text-red-700" role="alert">{form.error}</p>
			{/if}
			{#if form?.success}
				<p class="mt-3 text-sm text-green-700" role="status">PDF wurde hochgeladen.</p>
			{/if}
			<form method="POST" action="?/upload" enctype="multipart/form-data" class="mt-4 flex gap-3">
				<label class="sr-only" for="pdf">PDF-Datei</label>
				<input id="pdf" name="pdf" type="file" accept="application/pdf,.pdf" required />
				<button
					class="rounded-lg bg-sky-700 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-800"
					>Hochladen</button
				>
			</form>
		</section>
	{/if}

	<section class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
		{#if data.pdfs.length === 0}
			<p class="p-6 text-sm text-slate-600">Noch keine PDFs vorhanden.</p>
		{:else}
			<div class="overflow-x-auto">
				<table class="w-full text-left text-sm">
					<thead class="bg-slate-50 text-slate-600">
						<tr>
							<th class="px-5 py-3 font-medium">Datei</th>
							{#if data.isAdmin}<th class="px-5 py-3 font-medium">Hochgeladen von</th>{/if}
							<th class="px-5 py-3 font-medium">Hochgeladen am</th>
							{#if data.isAdmin}<th class="px-5 py-3 font-medium">Aktion</th>{/if}
						</tr>
					</thead>
					<tbody>
						{#each data.pdfs as pdf (pdf.id)}
							<tr class="border-t border-slate-100">
								<td class="px-5 py-3">
									<button
										class="text-left text-sky-700 hover:underline"
										onclick={() => window.open(pdf.blob_url, '_blank', 'noopener,noreferrer')}
										>{pdf.filename}</button
									></td
								>
								{#if data.isAdmin}<td class="px-5 py-3">{pdf.uploaded_by}</td>{/if}
								<td class="whitespace-nowrap px-5 py-3"
									>{new Date(pdf.created_at).toLocaleDateString('de-DE')}</td
								>
								{#if data.isAdmin}
									<td class="px-5 py-3"
										><button
											class="rounded bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-60"
											disabled={deletingId === pdf.id}
											onclick={() => deletePdf(pdf.id)}
											>{deletingId === pdf.id ? 'Löscht …' : 'Löschen'}</button
										></td
									>
								{/if}
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</section>
</main>
