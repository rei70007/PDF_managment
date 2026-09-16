<script>
	import { resolve } from '$app/paths';

	let { form } = $props();
</script>

<svelte:head>
	<title>Create account | PDF Management</title>
	<meta name="description" content="Create a PDF Management account." />
</svelte:head>

<main class="page-shell flex items-center justify-center px-4 py-10 sm:px-6">
	<section
		class="card w-full max-w-md p-6 sm:p-8"
		aria-labelledby="signup-heading"
	>
		<div class="mb-7">
			<p class="mb-2 text-sm font-medium text-orange-700">PDF Management</p>
			<h1 id="signup-heading" class="text-2xl font-semibold tracking-tight text-slate-900">
				Create your account
			</h1>
			<p class="mt-2 text-sm leading-6 text-slate-600">
				Start storing and organising your PDFs in one place.
			</p>
		</div>

		{#if form?.error}
			<p
				class="mb-5 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
				role="alert"
			>
				{form.error}
			</p>
		{/if}

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
					class="form-input"
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
					class="form-input"
					placeholder="At least 8 characters"
				/>
			</div>

			<button
				type="submit"
				class="btn-primary w-full"
			>
				Create account
			</button>
		</form>

		<p class="mt-6 text-center text-sm text-slate-600">
			Already have an account?
			<a
				href={resolve('/login')}
				class="text-link">Log in</a
			>
		</p>
	</section>
</main>
