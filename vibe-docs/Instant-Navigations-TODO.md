# Instant Navigations — TODO

## Phase 0 — Agent DX

- [x] `AGENTS.md` bundled-docs block
- [ ] `CLAUDE.md` with `@AGENTS.md`
- [ ] `AGENTS.md` — Instant Nav doc paths + Pages Router guardrail
- [ ] Optional `.mcp.json` for `next-devtools-mcp`

## Phase 1 — 16.3.x on Vercel

- [ ] Bump `next` to latest 16.3.x (not 16.3.0)
- [ ] Preview smoke: `/api/auth/session`, `/api/trpc/project.allBrief`
- [ ] `pnpm lint`, `pnpm test`, `pnpm build`
- [ ] Merge dependency PR when previews green

## Phase 2 — App Router pilot

- [ ] `src/shared/ui/providers/AppProviders.tsx` (extract from `_app.tsx`)
- [ ] `src/app/[lang]/layout.tsx`
- [ ] `src/app/[lang]/page.tsx` (home)
- [ ] `src/app/[lang]/privacy/page.tsx`
- [ ] `src/app/[lang]/daily/page.tsx`
- [ ] `next.config.mjs`: `cacheComponents`, `partialPrefetching`, devtools toggle
- [ ] `unstable_instant` on pilot routes
- [ ] Manual Instant Insights check in dev

## Phase 3+ — Playground / full migration

- [ ] Playground App route shell
- [ ] Profile migration
- [ ] Remove `i18n` from `next.config.mjs`
- [ ] `@next/playwright` `instant()` tests
