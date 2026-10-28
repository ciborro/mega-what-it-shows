<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import split from '#lib/data/tickets-4471.json';
  import type { Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';
  import { splitTicket } from '#lib/kb/problems';

  let { ticket }: { ticket: number } = $props();

  const result = $derived(splitTicket(reports as Report[], ticket, tenantOf, notes.oneDayMove));
  const tickets: Record<string, { issue: number; title: string }> = split.tickets;
  const filed = $derived(result.groups.filter((g) => g.filedUnder.length));
</script>

<p class="sum">
  <strong>{result.merged}</strong> reports merged into #{ticket} ·
  <strong>{result.groups.length}</strong>
  {result.groups.length === 1 ? 'problem' : 'problems'}, each with a ticket of its own
</p>

<table>
  <thead>
    <tr><th>problem</th><th>reports</th><th>tenants</th><th>seen</th><th>ticket</th></tr>
  </thead>
  <tbody>
    {#each result.groups as g (g.problem)}
      {@const t = tickets[g.problem]}
      <tr class:open={!t}>
        <td><code>{g.problem}</code></td>
        <td>{g.reports.length}</td>
        <td>{g.tenants.length}</td>
        <td>{g.firstSeen} → {g.lastSeen}</td>
        <td>
          {#if t}<a href="{split.repo}/issues/{t.issue}">#{t.issue}</a> {t.title}{:else}no ticket yet{/if}
        </td>
      </tr>
    {/each}
  </tbody>
</table>

{#each filed as g (g.problem)}
  <p class="note">
    The {g.reports.length} <code>{g.problem}</code> reports also stay counted under
    {#each g.filedUnder as c, i (c)}{i ? ', ' : ''}<code>{c}</code>{/each}, where their tenant files them.
  </p>
{/each}

<style>
  .sum { font-size: 1.1rem; }
  .note { color: var(--muted); font-size: 0.85em; }
  .open td { background: var(--warn-bg); }
  .open td:last-child { color: var(--warn); font-weight: 600; }
</style>
