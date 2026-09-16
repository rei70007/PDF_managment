<script>
	// Resolve internal links correctly, including when the app uses a base path.
	import { resolve } from '$app/paths';
</script>

<!-- Page metadata. This public page needs no server-side loader. -->
<svelte:head>
	<title>PDF Management — A happy home for your PDFs</title>
	<meta
		name="description"
		content="Give your PDFs a little home. Upload and find your documents in one simple place."
	/>
</svelte:head>

<div class="page-shell">
	<!-- Header: a simple brand mark and a friendly tagline. -->
	<header class="mx-auto flex max-w-6xl items-center justify-between px-6 py-7 sm:px-10">
		<a
			href={resolve('/')}
			class="flex items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-700"
		>
			<span
				class="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-100 text-xl"
				aria-hidden="true">📄</span
			>
			<span class="text-sm font-bold sm:text-base"
				>PDF Management<span class="text-orange-700">.</span></span
			>
		</a>
		<span class="hidden text-sm text-slate-500 sm:block">Less clutter. More calm.</span>
	</header>

	<main class="mx-auto max-w-6xl px-6 sm:px-10">
		<!-- Hero: stacked on mobile, with two columns on large screens. -->
		<section
			class="grid items-center gap-12 py-12 sm:py-20 lg:grid-cols-2 lg:gap-16"
			aria-labelledby="hero-heading"
		>
			<div>
				<p
					class="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-xs font-medium text-orange-800"
				>
					<span aria-hidden="true">✦</span> A little home for your documents
				</p>
				<h1
					id="hero-heading"
					class="max-w-lg text-5xl font-bold leading-tight tracking-tight sm:text-6xl"
				>
					Keep your PDFs<br />safe and <span class="text-orange-700">snug.</span>
				</h1>
				<p class="mt-6 max-w-md text-base leading-relaxed text-slate-600 sm:text-lg">
					Class notes, big ideas, and everything in between. Give your PDFs a cozy place to stay, so
					you can get on with your day.
				</p>

				<!-- Account links styled as buttons, with hover and keyboard-focus states. -->
				<div class="mt-8 flex flex-col gap-3 sm:flex-row">
					<a
						href={resolve('/signup')}
						class="btn-primary gap-3 px-7 py-3.5 shadow-md shadow-orange-200"
						>Sign Up <span aria-hidden="true">↗</span></a
					>
					<a
						href={resolve('/login')}
						class="btn-secondary px-7 py-3.5"
						>Log In</a
					>
				</div>
				<p class="mt-5 text-xs text-slate-500">Your next organized chapter starts here.</p>
			</div>

			<!-- Decorative PDF: utility-class shapes and emoji, hidden from screen readers. -->
			<div
				class="relative mx-auto flex h-80 w-full max-w-md items-center justify-center sm:h-96"
				aria-hidden="true"
			>
				<div
					class="absolute h-64 w-64 rounded-full bg-orange-100 sm:h-80 sm:w-80"
				></div>
				<span class="absolute right-8 top-5 text-4xl text-orange-400">✦</span>
				<span class="absolute bottom-12 left-5 text-3xl text-[#5f7d61]">✧</span>
				<div
					class="absolute h-60 w-44 -rotate-12 rounded-3xl border border-orange-200 bg-orange-100 sm:h-64 sm:w-48"
				></div>
				<div
					class="relative flex h-60 w-44 rotate-6 flex-col rounded-3xl border border-white bg-white p-6 shadow-xl shadow-orange-200/60 sm:h-64 sm:w-48"
				>
					<div class="flex items-center justify-between">
						<span
							class="rounded-lg bg-rose-100 px-3 py-1 text-xs font-bold tracking-wider text-rose-600"
							>PDF</span
						>
						<span class="text-xl text-orange-300">♡</span>
					</div>
					<div class="mt-7 space-y-3">
						<div class="h-2 w-20 rounded-full bg-orange-200"></div>
						<div class="h-2 w-full rounded-full bg-slate-100"></div>
						<div class="h-2 w-full rounded-full bg-slate-100"></div>
						<div class="h-2 w-16 rounded-full bg-slate-100"></div>
					</div>
					<div class="mt-auto text-center text-3xl text-orange-600">◡</div>
				</div>
				<div
					class="absolute bottom-3 right-2 -rotate-6 rounded-2xl border border-white bg-white px-5 py-3 text-sm font-medium text-orange-900 shadow-lg shadow-orange-200/50 sm:bottom-7"
				>
					<span class="mr-2">☁️</span> A happy little PDF place
				</div>
			</div>
		</section>

		<!-- Features: one column on mobile and three columns on wider screens. -->
		<section class="pb-14 sm:pb-20" aria-labelledby="features-heading">
			<h2 id="features-heading" class="mb-7 text-center text-sm font-medium text-slate-500">
				A little simpler. A lot more organized.
			</h2>
			<div class="grid gap-4 sm:grid-cols-3">
				<article class="card p-6">
					<span
						class="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 text-xl"
						aria-hidden="true">📤</span
					>
					<h3 class="font-semibold">Upload & exhale</h3>
					<p class="mt-2 text-sm leading-relaxed text-slate-600">
						Add your PDFs to your collection. One less thing to keep track of.
					</p>
				</article>
				<article class="card p-6">
					<span
						class="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 text-xl"
						aria-hidden="true">🗂️</span
					>
					<h3 class="font-semibold">All together now</h3>
					<p class="mt-2 text-sm leading-relaxed text-slate-600">
						Keep your documents in one place, ready when you need them.
					</p>
				</article>
				<article class="card p-6">
					<span
						class="sage-highlight mb-4 flex h-11 w-11 items-center justify-center rounded-2xl text-xl"
						aria-hidden="true">🌱</span
					>
					<h3 class="font-semibold">Your own little space</h3>
					<p class="mt-2 text-sm leading-relaxed text-slate-600">
						Log in to see your uploads in a simple, personal collection.
					</p>
				</article>
			</div>
		</section>
	</main>

	<!-- Footer: a small, friendly sign-off. -->
	<footer
		class="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 border-t border-orange-100 px-6 py-6 text-xs text-stone-500 sm:flex-row sm:px-10"
	>
		<p>PDF Management</p>
		<p>Made for tidy files & peaceful minds <span aria-hidden="true">♡</span></p>
	</footer>
</div>
