<script>
	import { resolve } from '$app/paths';
	let { data, form } = $props();
	function formatDate(date) {
		return new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(date));
	}
</script>

<svelte:head><title>My PDFs | PDF Management</title></svelte:head>

<main class="min-h-screen bg-stone-50 px-5 py-9 text-slate-800 sm:px-8">
	<div class="mx-auto max-w-5xl">
		<header class="flex items-center justify-between gap-4">
			<div>
				<p class="text-sm font-semibold text-sky-700">PDF Management</p>
				<h1 class="mt-1 text-2xl font-semibold">Hello, {data.user.email}</h1>
			</div>
			<a
				href={resolve('/logout')}
				class="rounded-lg border border-slate-300 px-3.5 py-2 text-sm font-semibold hover:bg-white"
				>Log out</a
			>
		</header>
		<section class="mt-9 rounded-2xl border border-sky-100 bg-white p-6 shadow-sm">
			<h2 class="text-xl font-semibold">Add a PDF</h2>
			<p class="mt-1 text-sm text-slate-600">PDF files only, up to 10 MB.</p>
			{#if form?.error}<p class="mt-4 text-sm text-red-700" role="alert">
					{form.error}
				</p>{/if}{#if form?.success}<p class="mt-4 text-sm text-emerald-700" role="status">
					Your PDF was uploaded successfully.
				</p>{/if}
			<form method="POST" action="?/upload" enctype="multipart/form-data" class="mt-5">
				<label for="pdf" class="sr-only">Choose a PDF</label><input
					id="pdf"
					name="pdf"
					type="file"
					accept="application/pdf,.pdf"
					required
					class="block w-full text-sm"
				/><button
					type="submit"
					class="mt-4 rounded-lg bg-sky-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-800"
					>Upload PDF</button
				>
			</form>
		</section>
		<section class="mt-10">
			<div class="flex items-end justify-between">
				<div>
					<h2 class="text-xl font-semibold">Your PDFs</h2>
					<p class="mt-1 text-sm text-slate-600">Your newest uploads appear first.</p>
				</div>
				<p class="text-sm text-slate-500">{data.pdfs.length} saved</p>
			</div>
			{#if data.pdfs.length === 0}<p
					class="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center text-sm text-slate-600"
				>
					No PDFs here yet.
				</p>{:else}<div class="mt-5 grid gap-4 sm:grid-cols-2">
					{#each data.pdfs as pdf (pdf.id)}<article
							class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
						>
							<h3 class="truncate text-sm font-semibold" title={pdf.filename}>{pdf.filename}</h3>
							<p class="mt-1 text-sm text-slate-500">Uploaded {formatDate(pdf.uploaded_at)}</p>
							<a
								href={pdf.blob_url}
								rel="external"
								download={pdf.filename}
								class="mt-3 inline-flex text-sm font-semibold text-sky-700 hover:underline"
								>Download PDF</a
							>
						</article>{/each}
				</div>{/if}
		</section>
	</div>
</main>
