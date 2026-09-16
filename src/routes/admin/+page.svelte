<script lang="ts">
	export let data;
	import { enhance } from '$app/forms';
</script>

<h1>Admin – Alle PDFs</h1>

<table>
	<thead>
		<tr>
			<th>Dateiname</th>
			<th>Hochgeladen von</th>
			<th>Aktion</th>
		</tr>
	</thead>
	<tbody>
		{#each data.pdfs as pdf}
			<tr>
				<td>{pdf.filename}</td>
				<td>{pdf.user?.email}</td>
				<td>
					<form method="POST" action="?/deletePdf" use:enhance>
						<input type="hidden" name="id" value={pdf.id} />
						<button type="submit">Löschen</button>
					</form>
				</td>
			</tr>
		{/each}
	</tbody>
</table>