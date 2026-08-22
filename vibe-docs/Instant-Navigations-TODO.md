# Instant Navigations — TODO

## Phase 0 — Agent DX

- [x] `AGENTS.md` bundled-docs block
- [x] `CLAUDE.md` with `@AGENTS.md`
- [x] `AGENTS.md` — Instant Nav doc paths + Pages Router guardrail
- [x] Optional `.mcp.json` for `next-devtools-mcp`

## Phase 1 — 16.3.x on Vercel

- [x] Tried `next@16.3.0` — local OK; Vercel preview `/api/*` → `/en/404` (2026-08, pre-adapter fix)
- [x] Re-tried on PR #165 preview (2026-08-09) — **same regression** (`x-matched-path: /en/404`)
- [x] **Stay on `next@16.2.12`** until Vercel + Pages `i18n` API routing is fixed
- [ ] Preview smoke green on 16.3.x before enabling Instant Nav flags
- [ ] Retrying **`next@16.3.2`** (PR branch) — local lint/test/build OK; **Vercel preview smoke + e2e** is merge gate

## Phase 1b — Locale migration (see `Locale-Migration-Design.md`)

- [ ] `app/[lang]/` public routes (mirror internal-marketing pilots)
- [ ] Remove `i18n` from `next.config.mjs` (after L3–L4 in locale design)

## Phase 2 — App Router pilot

- [x] `TrpcProvider` + `AppRootLayoutClient`
- [x] `src/app/layout.tsx` + `internal-marketing/[locale]/` pilot
- [x] `MarketingHomeView` shared by Pages home + App pilot
- [x] Dual-router shell (`next/compat/router`) so App pilot does not throw
- [x] Public `/` / `/{locale}` stay on Pages `pages/index` (Pages `i18n` cannot rewrite bare locales into App routes)
- [x] `proxy.ts`: `/api/config` + locale header for direct `/internal-marketing/*`
- [x] App layout metadata (viewport, icons, Material Icons)
- [x] `robots: noindex` on pilot routes (`internalMarketingPilotMetadata` + layout default)
- [x] Extend pilot to `/internal-marketing/[locale]/privacy` and `/daily`
- [ ] Public cutover of home to App (blocked on removing `next.config` `i18n`)
- [ ] `cacheComponents` / `partialPrefetching` (blocked: root `headers()` + need 16.3)
- [ ] `unstable_instant` on pilot routes (blocked until `cacheComponents`)
- [x] Remove unused `@trpc/next` dependency
- [x] Extract `authOptions` to `src/server/auth/authOptions.ts`
- [x] Extract `AppShellProviders` shared by `_app` and `AppRootLayoutClient`
- [x] SSR i18n preload for playground + profile (`loadI18nServerProps` / `withI18nServerSideProps`)
- [x] Localized SEO titles/descriptions for home, playground landing, profile

## Phase 3+ — Playground / full migration

- [x] Playground App route shell (`/internal-marketing/[locale]/playground/[[...slug]]`)
- [x] `PlaygroundPageView` shared by Pages + App pilot
- [x] `usePlaygroundRoute` bridge for slug navigation under App Router
- [x] Profile App route shell (`/internal-marketing/[locale]/profile/[userId]`)
- [x] `ProfilePageView` shared by Pages + App pilot
- [x] `useProfileUserId` bridge for App vs Pages route param
- [x] Playwright pilot smoke e2e (`e2e/pilot-routes.spec.ts`, `e2e/api-smoke.spec.ts`)
- [x] `pnpm preview-smoke` script for Vercel merge-gate checks
- [x] GitHub Actions e2e on Vercel preview (`.github/workflows/e2e-preview.yml`, `deployment_status`)
- [ ] `@next/playwright` `instant()` tests (blocked: `cacheComponents` + `unstable_instant` + 16.3.x)
- [ ] Locale migration epic — **`vibe-docs/Locale-Migration-Design.md`**
