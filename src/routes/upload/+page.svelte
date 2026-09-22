<script>
// Used to generate the correct internal URL for the logout route.
	import { resolve } from '$app/paths';

	// Gets the data loaded by +page.server.js and the result returned by a form action.
	let { data, form } = $props();

	// Converts the database date into a readable format.
	function formatDate(date) {
		return new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(date));
	}
</script>

<svelte:head><title>My PDFs | PDF Management</title></svelte:head> /* Sets the page title in the browser tab. */


<main class="page-shell px-5 py-9 sm:px-8"> /*padding all sides for screens 640px and wider
	<div class="mx-auto max-w-5xl"> /*auto margin, screen can grow to 5xl, centered*/
	<!-- Header with the logged-in user's email and logout link. -->
		<header class="flex items-center justify-between gap-4">
			<div>
				<p class="text-sm font-semibold text-orange-700">PDF Management</p>
				<h1 class="mt-1 text-2xl font-semibold">Hello, {data.user.email}</h1>
			</div>
			<a
				href={resolve('/logout')} /* Generates the correct URL for the logout route. */
				class="btn-secondary px-3.5 py-2"
				>Log out</a
			>
		</header>

		<!-- Upload section: displays server feedback and sends the PDF to the upload action. -->
		<section class="card mt-9 p-6">
			<h2 class="text-xl font-semibold">Add a PDF</h2>
			<p class="mt-1 text-sm text-slate-600">PDF files only, up to 10 MB.</p>

			<!-- Shows a message when the upload was successful. -->
			{#if form?.error}<p class="mt-4 text-sm text-red-700" role="alert"> //role alert -- requires attention for scrreen readers
					{form.error}
				</p>{/if}
				
				{#if form?.success}<p class="mt-4 text-sm text-emerald-700" role="status"> 
					Your PDF was uploaded successfully.
				</p>{/if}

			<!-- Sends the form to the "upload" action; multipart/form-data allows files. -->
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
					class="btn-primary mt-4"
					>Upload PDF</button
				>
			</form>
		</section>

		<!-- Displays the PDFs loaded from the database for this user. -->
		<section class="mt-10">
			<div class="flex items-end justify-between">
				<div>
					<h2 class="text-xl font-semibold">Your PDFs</h2>
					<p class="mt-1 text-sm text-slate-600">Your newest uploads appear first.</p>
				</div>
				<p class="text-sm text-slate-500">{data.pdfs.length} saved</p>
			</div>

			<!-- If the PDF array is empty, show this message. -->	
			{#if data.pdfs.length === 0}<p
					class="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center text-sm text-slate-600"
				>
					No PDFs here yet.
				</p>{:else}<div class="mt-5 grid gap-4 sm:grid-cols-2"> /*on sm screens and larger, show 2 PDFs per row */

					<!-- Loops through the array and creates one card for each PDF. -->
					{#each data.pdfs as pdf (pdf.id)}<article
							class="card p-4"
						>

						<!-- truncate cuts long filenames and shows "..." -->
							<h3 class="truncate text-sm font-semibold" title={pdf.filename}>{pdf.filename}</h3>
							<p class="mt-1 text-sm text-slate-500">Uploaded {formatDate(pdf.uploaded_at)}</p>

							<!-- Uses the stored Vercel Blob URL to download the PDF. -->
							<a
								href={pdf.blob_url} 
								rel="external"	
								download={pdf.filename}
								class="text-link mt-3 inline-flex text-sm" /*uses flexbox, but takes as much space as the element needs*/
								>Download PDF</a
							>
						</article>{/each}
				</div>{/if}
		</section>
	</div>
</main>
