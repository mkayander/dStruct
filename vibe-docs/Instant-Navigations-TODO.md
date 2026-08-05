# Instant Navigations — TODO

## Phase 0 — Agent DX

- [x] `AGENTS.md` bundled-docs block
- [x] `CLAUDE.md` with `@AGENTS.md`
- [x] `AGENTS.md` — Instant Nav doc paths + Pages Router guardrail
- [ ] Optional `.mcp.json` for `next-devtools-mcp`

## Phase 1 — 16.3.x on Vercel

- [x] Tried `next@16.3.0` — local OK; Vercel preview `/api/*` → `/en/404`
- [x] **Pinned back to `next@16.2.12`** so previews + App Router pilot can be verified
- [ ] Re-try latest 16.3.x when adapter-vercel i18n API fix is in a release that works on Turbopack previews
- [ ] Preview smoke green on 16.3.x before enabling Instant Nav flags

## Phase 2 — App Router pilot

- [x] `TrpcProvider` + `AppRootLayoutClient`
- [x] `src/app/layout.tsx` + `internal-marketing/[locale]/` pilot
- [x] `MarketingHomeView` shared by Pages home + App pilot
- [x] Dual-router shell (`next/compat/router`) so App pilot does not throw
- [x] Public `/` / `/{locale}` stay on Pages `pages/index` (Pages `i18n` cannot rewrite bare locales into App routes)
- [x] `proxy.ts`: `/api/config` + locale header for direct `/internal-marketing/*`
- [ ] Public cutover of home to App (blocked on removing `next.config` `i18n`)
- [ ] App layout metadata (viewport, icons, Material Icons)
- [ ] `cacheComponents` / `partialPrefetching` (blocked: root `headers()` + need 16.3)
- [ ] `unstable_instant` on pilot routes
- [ ] Extend to `/privacy`, `/daily`

## Phase 3+ — Playground / full migration

- [ ] Playground App route shell
- [ ] Profile migration
- [ ] Remove `i18n` from `next.config.mjs`
- [ ] `@next/playwright` `instant()` tests
