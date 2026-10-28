# kb — the support knowledge base

**kb** = knowledge base. What the support desk knows about how our products break, written
down where the code can keep it honest.

One desk takes reports for every product we run: `sched-prod` (calendar invites for about
300k people) and the rest. When something
goes wrong, the reports reach the desk first. This kb is how the desk triages them, what each
incident turned out to be, and why we decided what we decided.

## What's here

```
src/routes/kb/      the pages (.svx: Markdown with components)
  triage/           how the desk handles incoming reports
  incidents/        one page per big ticket
  decisions/        numbered decision records
src/lib/kb/         components and the logic they run
src/lib/layouts/    the frame every page shares
src/lib/data/       exports from the ticket system
```

## Conventions

- Words in the page, logic in `src/lib` (imported as `#lib/…`). A number that can be computed belongs in a component.
- Every page starts with frontmatter: `title`, `owner`, `status`, `reviewed`.
- A decision is never edited after it is accepted. A new record replaces it.
- A page you add is signed: its frontmatter carries your `signature` and it ends with `<RenderStamp {signature} />`, so the desk knows who wrote it.

## Owners

Support desk. Decision records: whoever signed them.

---

Exported 2026-10-04 from the `support` repo, `apps/kb/` → `src/`.

## S01E03 work (ciborro, 2026-10-28)

Ticket #4471 split into one GitHub issue per problem: [#1 parser](https://github.com/ciborro/mega-what-it-shows/issues/1), [#2 hint](https://github.com/ciborro/mega-what-it-shows/issues/2), [#3 one-day](https://github.com/ciborro/mega-what-it-shows/issues/3).

- Page: `src/routes/kb/incidents/4471/split/+page.svx` (owner `ciborro`, signed with the course ticket). It computes the counts with the kb's own data and logic as exported (`causes.ts`, `locales.ts`, `desk-notes.json`); nothing in `src/lib` is changed.
- As the desk sees it: `build/kb/incidents/4471/split/index.html` (static build) and `rendered/kb-incidents-4471-split.png`.
- Build: `npm ci && npm run build` (SvelteKit + mdsvex, config in `vite.config.js`, `#lib/*` via `package.json` imports).
