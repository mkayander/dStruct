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
- [x] Preview smoke green on 16.3.x before enabling Instant Nav flags (merged PR #171 — `next@16.3.2`)
- [x] **`next@16.3.2`** on main — Vercel preview smoke + e2e passed merge gate

## Phase 1b — Locale migration (see `Locale-Migration-Design.md`)

- [x] `app/[lang]/` public routes (mirror internal-marketing pilots) — merged #172
- [x] Rewrites/redirects from Pages to App (L2) — `app/(default-locale)/` at unprefixed URLs
- [x] Remove default-locale Pages marketing — L2/L3
- [x] Remove `i18n` from `next.config.mjs` — L2
- [x] Retire `/internal-marketing/*` pilot (L3b redirects + delete tree)

## Phase 2 — App Router pilot

- [x] `TrpcProvider` + `AppRootLayoutClient`
- [x] `src/app/layout.tsx` + public App locale routes
- [x] `MarketingHomeView` shared by Pages home + App pilot
- [x] Dual-router shell (`next/compat/router`) so App pilot does not throw
- [x] Public `/` served from App `(default-locale)` (Pages marketing removed L2/L3)
- [x] `proxy.ts`: `/api/config` + locale header for App Router paths
- [x] App layout metadata (viewport, icons, Material Icons)
- [x] ~~Pilot noindex metadata~~ (removed with L3b internal-marketing pilot)
- [ ] `cacheComponents` / `partialPrefetching` (blocked: root `headers()` + need 16.3)
- [ ] `unstable_instant` on marketing routes (blocked until `cacheComponents`)
- [x] Remove unused `@trpc/next` dependency
- [x] Extract `authOptions` to `src/server/auth/authOptions.ts`
- [x] Extract `AppShellProviders` shared by `_app` and `AppRootLayoutClient`
- [x] SSR i18n preload for playground + profile (`loadI18nServerProps` / `withI18nServerSideProps`)
- [x] Localized SEO titles/descriptions for home, playground landing, profile

## Phase 3+ — Playground / full migration

- [x] Playground App route shell (`app/[lang]/playground`, `(default-locale)/playground`)
- [x] `PlaygroundPageView` shared by Pages + App pilot
- [x] `usePlaygroundRoute` bridge for slug navigation under App Router
- [x] Profile App route shell (`app/[lang]/profile`, `(default-locale)/profile`)
- [x] `ProfilePageView` shared by Pages + App pilot
- [x] `useProfileUserId` bridge for App vs Pages route param
- [x] Playwright locale migration e2e (`e2e/locale-migration-l*.spec.ts`, `e2e/api-smoke.spec.ts`)
- [x] `pnpm preview-smoke` script for Vercel merge-gate checks
- [x] GitHub Actions e2e on Vercel preview (`.github/workflows/e2e-preview.yml`, `deployment_status`)
- [ ] `@next/playwright` `instant()` tests (blocked: `cacheComponents` + `unstable_instant` + 16.3.x)
- [ ] Locale migration epic — **`vibe-docs/Locale-Migration-Design.md`**
