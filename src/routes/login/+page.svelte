<script>
	import { resolve } from '$app/paths';

	// Form-Daten von SvelteKit übernehmen
	let { form } = $props();
</script>

<!-- Container für das Login-Formular -->
<div class="mx-auto mt-16 max-w-sm">
	.
	<!-- Titel der Seite -->
	<h1 class="mb-6 text-center text-4xl font-black tracking-tight text-[#0d1117]">PDF_Manager</h1>

	<!-- Fehlermeldung anzeigen -->
	{#if form?.error}
		<p
			class="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-600"
		>
			{form.error}
		</p>
	{/if}

	<!-- Login-Formular -->
	<form method="POST" class="flex flex-col gap-3 rounded border border-gray-300 bg-white p-10">
		<!-- Eingabefeld für Benutzername/E-Mail -->
		<div class="flex flex-col gap-1">
			<input
				type="email"
				name="email"
				required
				placeholder="Email address"
				class="rounded border border-gray-300 bg-gray-50 px-3 py-2 text-xs placeholder-gray-400 focus:border-gray-400 focus:outline-none"
			/>
		</div>

		<!-- Eingabefeld für Passwort -->
		<div class="flex flex-col gap-1">
			<input
				type="password"
				name="password"
				required
				placeholder="Password"
				class="rounded border border-gray-300 bg-gray-50 px-3 py-2 text-xs placeholder-gray-400 focus:border-gray-400 focus:outline-none"
			/>
		</div>

		<!-- Login-Button -->
		<button
			type="submit"
			class="mt-1 cursor-pointer rounded-lg bg-pink-500 py-1.5 text-sm font-semibold text-white transition hover:bg-pink-600"
		>
			Log in
		</button>

		<!-- Trennlinie -->
		<div class="my-1 flex items-center gap-3">
			<span class="h-px flex-1 bg-gray-300"></span>
			<span class="text-xs font-semibold tracking-widest text-gray-400">OR</span>
			<span class="h-px flex-1 bg-gray-300"></span>
		</div>

		<!-- Link zur Registrierung -->
		<p class="text-center text-sm text-gray-500">
			Don't have an account?
			<a href={resolve('/signup')} class="font-semibold text-pink-500 hover:underline"> Sign up </a>
		</p>
	</form>
</div>
