<script lang="ts">
    // enhance lets SvelteKit submit the form without a full page reload.
    import { enhance } from '$app/forms';

    // $props() reads the page's props. data.pdfs comes from load() in +page.server.js.
    let { data } = $props();
</script>

<!-- Page container: max-w-4xl limits the width, mx-auto centers it,
     and px-6 / py-8 add horizontal / vertical padding. -->
<div class="max-w-4xl mx-auto px-6 py-8">
    <!-- Page title: text-2xl sets the font size; font-semibold sets its weight. -->
    <h1 class="text-2xl font-semibold text-gray-900 mb-6">Admin – Alle PDFs</h1>

    <!-- card is a shared class from src/app.css. overflow-hidden clips content
         at the card's edges so the table background follows its rounded corners. -->
    <div class="card overflow-hidden">
        <!-- w-full fills the card's width; border-collapse merges adjacent table borders. -->
        <table class="w-full border-collapse">
            <!-- Column headings: uppercase changes the displayed letter case,
                 tracking-wide increases letter spacing, and border-b adds a bottom border.
                 px-5 / py-3.5 provide horizontal / vertical cell padding. -->
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
                <!-- Render one row per PDF. The key (pdf.id) lets Svelte track each
                     row by its ID when the list changes, for example after deletion. -->
                {#each data.pdfs as pdf (pdf.id)}
                    <!-- hover:bg-gray-50 highlights the row on hover.
                         [&:not(:last-child)>td] targets direct td children of every row
                         except the last; the two utilities add a thin, light divider. -->
                    <tr class="hover:bg-gray-50 [&:not(:last-child)>td]:border-b [&:not(:last-child)>td]:border-gray-100">
                        <!-- Braces display values from this PDF. uploaded_by contains
                             the uploader's email; align-middle vertically centers cell content. -->
                        <td class="px-5 py-3.5 text-sm text-gray-800 align-middle">{pdf.filename}</td>
                        <td class="px-5 py-3.5 text-sm text-gray-800 align-middle">{pdf.uploaded_by}</td>
                        <td class="px-5 py-3.5 align-middle">
                            <!-- POST calls the named deletePdf action in +page.server.js.
                                 use:enhance handles submission in the browser and refreshes
                                 page data after success. The form also works without JavaScript. -->
                            <form method="POST" action="?/deletePdf" use:enhance>
                                <!-- Send this PDF's ID with the form without displaying an input. -->
                                <input type="hidden" name="id" value={pdf.id} />
                                <!-- Submits this row's form. btn-danger is the shared delete-button
                                     style; px-3.5 / py-1.5 set horizontal / vertical padding. -->
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

        <!-- Show this empty-state message only when the PDF list has no entries.
             text-center centers the text; py-8 gives the message vertical space. -->
        {#if data.pdfs.length === 0}
            <p class="text-center text-gray-400 text-sm py-8">Keine PDFs vorhanden.</p>
        {/if}
    </div>
</div>
