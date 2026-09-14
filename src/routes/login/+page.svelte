<script>
	import { resolve } from '$app/paths';

	// SvelteKit returns data from the form action here (including login errors).
	let { form } = $props();
</script>

<svelte:head>
	<title>Log in | PDF Management</title>
	<meta name="description" content="Log in to access your PDF Management account." />
</svelte:head>

<!-- This wrapper keeps the card centred while leaving comfortable space on small screens. -->
<main class="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10 sm:px-6">
	<section
		class="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
		aria-labelledby="login-heading"
	>
		<div class="mb-7">
			<p class="mb-2 text-sm font-medium text-sky-700">PDF Management</p>
			<h1 id="login-heading" class="text-2xl font-semibold tracking-tight text-slate-900">
				Welcome back
			</h1>
			<p class="mt-2 text-sm leading-6 text-slate-600">Log in to manage your saved documents.</p>
		</div>

		<!-- The server returns this generic message for every failed login attempt. -->
		{#if form?.error}
			<p
				class="mb-5 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
				role="alert"
			>
				{form.error}
			</p>
		{/if}

		<!-- A normal POST form lets SvelteKit progressively enhance this page without client-side state. -->
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
					autocomplete="current-password"
					required
					class="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
					placeholder="Enter your password"
				/>
			</div>

			<button
				type="submit"
				class="w-full rounded-lg bg-sky-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:ring-offset-2"
			>
				Log in
			</button>
		</form>

		<p class="mt-6 text-center text-sm text-slate-600">
			Don't have an account?
			<a
				href={resolve('/signup')}
				class="font-semibold text-sky-700 hover:text-sky-800 hover:underline">Sign up</a
			>
		</p>
	</section>
</main>
