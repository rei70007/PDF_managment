<script lang="ts">
    import { enhance } from '$app/forms';

    let { data } = $props();
</script>

<div class="max-w-4xl mx-auto px-6 py-8">
    <h1 class="text-2xl font-semibold text-gray-900 mb-6">Admin – Alle PDFs</h1>

    <div class="card overflow-hidden">
        <table class="w-full border-collapse">
            <thead class="bg-gray-50">
                <tr>
                    <th class="text-left text-xs font-semibold uppercase tracking-wide text-gray-500 px-5 py-3.5 border-b border-gray-200">
                        Dateiname
                    </th>
                    <th class="text-left text-xs font-semibold uppercase tracking-wide text-gray-500 px-5 py-3.5 border-b border-gray-200">
                        Hochgeladen von
                    </th>
                    <th class="text-left text-xs font-semibold uppercase tracking-wide text-gray-500 px-5 py-3.5 border-b border-gray-200">
                        Aktion
                    </th>
                </tr>
            </thead>
            <tbody>
                {#each data.pdfs as pdf (pdf.id)}
                    <tr class="hover:bg-gray-50 [&:not(:last-child)>td]:border-b [&:not(:last-child)>td]:border-gray-100">
                        <td class="px-5 py-3.5 text-sm text-gray-800 align-middle">{pdf.filename}</td>
                        <td class="px-5 py-3.5 text-sm text-gray-800 align-middle">{pdf.uploaded_by}</td>
                        <td class="px-5 py-3.5 align-middle">
                            <form method="POST" action="?/deletePdf" use:enhance>
                                <input type="hidden" name="id" value={pdf.id} />
                                <button
                                    type="submit"
                                    class="btn-danger px-3.5 py-1.5"
                                >
                                    Löschen
                                </button>
                            </form>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>

        {#if data.pdfs.length === 0}
            <p class="text-center text-gray-400 text-sm py-8">Keine PDFs vorhanden.</p>
        {/if}
    </div>
</div>
