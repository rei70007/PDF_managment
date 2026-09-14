<script>
	import { resolve } from '$app/paths';

	// SvelteKit supplies failed form-action data here after a submission.
	let { form } = $props();
</script>

<svelte:head>
	<title>Create account | PDF Management</title>
	<meta name="description" content="Create a PDF Management account." />
</svelte:head>

<!-- A simple centred layout keeps the form comfortable on both phones and desktops. -->
<main class="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10 sm:px-6">
	<section
		class="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
		aria-labelledby="register-heading"
	>
		<div class="mb-7">
			<p class="mb-2 text-sm font-medium text-sky-700">PDF Management</p>
			<h1 id="register-heading" class="text-2xl font-semibold tracking-tight text-slate-900">
				Create your account
			</h1>
			<p class="mt-2 text-sm leading-6 text-slate-600">
				Start storing and organising your PDFs in one place.
			</p>
		</div>

		<!-- Validation errors are returned by the server without losing the entered email. -->
		{#if form?.error}
			<p
				class="mb-5 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
				role="alert"
			>
				{form.error}
			</p>
		{/if}

		<!-- Standard POST forms work even when JavaScript is unavailable. -->
		<form method="POST" class="space-y-5">
			<div>
				<label for="email" class="mb-1.5 block text-sm font-medium text-slate-700"
					>Email address</label
				>
				<input
					id="email"
					name="email"
					type="email"
					autocomplete="email"
					required
					value={form?.email ?? ''}
					class="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
					placeholder="you@example.com"
				/>
			</div>

			<div>
				<label for="password" class="mb-1.5 block text-sm font-medium text-slate-700"
					>Password</label
				>
				<input
					id="password"
					name="password"
					type="password"
					autocomplete="new-password"
					required
					minlength="8"
					class="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-600 focus:ring-2 focus:ring-sky-100"
					placeholder="At least 8 characters"
				/>
			</div>

			<button
				type="submit"
				class="w-full rounded-lg bg-sky-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:ring-offset-2"
			>
				Create account
			</button>
		</form>

		<p class="mt-6 text-center text-sm text-slate-600">
			Already have an account?
			<a
				href={resolve('/login')}
				class="font-semibold text-sky-700 hover:text-sky-800 hover:underline">Log in</a
			>
		</p>
	</section>
</main>
