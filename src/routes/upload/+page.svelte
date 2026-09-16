<script>
<<<<<<< HEAD
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
=======
	import { resolve } from '$app/paths';

	// `data` comes from the protected server load function; `form` holds action messages.
	let { data, form } = $props();

	function formatDate(date) {
		return new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(date));
>>>>>>> 291474e5e5536862b87cfd556a4b045db1239ea1
	}
</script>

<svelte:head>
<<<<<<< HEAD
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
=======
	<title>My PDFs | PDF Management</title>
	<meta name="description" content="Upload and download your saved PDF files." />
</svelte:head>

<main class="min-h-screen bg-stone-50 text-slate-800">
	<!-- Header: identifies the signed-in account and gives the user a clear exit. -->
	<header class="border-b border-slate-200 bg-white">
		<div class="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-5 sm:px-8">
			<div>
				<p class="text-sm font-semibold text-sky-700">PDF Management</p>
				<h1 class="mt-1 text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
					Hello, {data.user.email}
				</h1>
			</div>
			<a
				href={resolve('/logout')}
				class="rounded-lg border border-slate-300 px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
				>Log out</a
			>
		</div>
	</header>

	<div class="mx-auto max-w-5xl px-5 py-9 sm:px-8 sm:py-12">
		<!-- Upload form: standard multipart form handling keeps the page simple and dependable. -->
		<section
			class="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm sm:p-7"
			aria-labelledby="upload-title"
		>
			<div class="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<p class="text-sm font-semibold text-emerald-700">Your document space</p>
					<h2 id="upload-title" class="mt-1 text-xl font-semibold tracking-tight text-slate-900">
						Add a PDF
					</h2>
					<p class="mt-1 text-sm text-slate-600">
						Choose a file and it will be saved to your collection.
					</p>
				</div>
			</div>

			{#if form?.error}
				<p
					class="mt-5 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
					role="alert"
				>
					{form.error}
				</p>
			{/if}

			{#if form?.success}
				<p
					class="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm text-emerald-800"
					role="status"
				>
					Your PDF was uploaded successfully.
				</p>
			{/if}

			<form method="POST" enctype="multipart/form-data" class="mt-6">
				<label
					for="pdf"
					class="block rounded-xl border border-dashed border-sky-300 bg-sky-50/60 p-5 sm:flex sm:items-center sm:justify-between sm:gap-5"
				>
					<span>
						<span class="block text-sm font-semibold text-slate-800"
							>Select a PDF from your device</span
						>
						<span class="mt-1 block text-sm text-slate-600">PDF files only</span>
					</span>
					<input
						id="pdf"
						name="pdf"
						type="file"
						accept="application/pdf"
						required
						class="mt-3 block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-white file:px-3.5 file:py-2 file:text-sm file:font-semibold file:text-sky-800 file:shadow-sm hover:file:bg-slate-50 sm:mt-0 sm:w-auto"
					/>
				</label>
				<button
					type="submit"
					class="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-sky-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 sm:w-auto"
				>
					Upload PDF
				</button>
			</form>
		</section>

		<!-- PDF collection: this is an empty-state panel until the user has uploads. -->
		<section class="mt-10" aria-labelledby="files-title">
			<div class="flex items-end justify-between gap-4">
				<div>
					<h2 id="files-title" class="text-xl font-semibold tracking-tight text-slate-900">
						Your PDFs
					</h2>
					<p class="mt-1 text-sm text-slate-600">Your newest uploads appear first.</p>
				</div>
				<p class="text-sm font-medium text-slate-500">{data.pdfs.length} saved</p>
			</div>

			{#if data.pdfs.length === 0}
				<div
					class="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center"
				>
					<div class="text-3xl" aria-hidden="true">📄</div>
					<h3 class="mt-3 font-semibold text-slate-800">No PDFs here yet</h3>
					<p class="mx-auto mt-1 max-w-sm text-sm leading-6 text-slate-600">
						Your first upload will appear here, ready to download whenever you need it.
					</p>
				</div>
			{:else}
				<div class="mt-5 grid gap-4 sm:grid-cols-2">
					{#each data.pdfs as pdf (pdf.id)}
						<article
							class="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
						>
							<div
								class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-xl"
								aria-hidden="true"
							>
								📄
							</div>
							<div class="min-w-0 flex-1">
								<h3 class="truncate text-sm font-semibold text-slate-800" title={pdf.filename}>
									{pdf.filename}
								</h3>
								<p class="mt-1 text-sm text-slate-500">Uploaded {formatDate(pdf.uploaded_at)}</p>
								<a
									href={pdf.blob_url}
									rel="external"
									download={pdf.filename}
									class="mt-3 inline-flex text-sm font-semibold text-sky-700 hover:text-sky-900 hover:underline"
									>Download PDF <span class="ml-1" aria-hidden="true">↓</span></a
								>
							</div>
						</article>
					{/each}
				</div>
			{/if}
		</section>
	</div>
>>>>>>> 291474e5e5536862b87cfd556a4b045db1239ea1
</main>
