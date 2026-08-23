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

- [x] Retire `/internal-marketing/*` pilot (L3b redirects + delete tree)

## Phase 2 — App Router shell (locale migration complete)

- [x] `TrpcProvider` + `AppRootLayoutClient`
- [x] `src/app/layout.tsx` + public App locale routes
- [x] `MarketingHomeView` shared by App marketing routes
- [x] Dual-router shell (`next/compat/router`)
- [x] Public `/` served from App `(default-locale)`
- [x] `proxy.ts`: `/api/config` + locale header for App Router paths
- [x] App layout metadata (viewport, icons, Material Icons)
- [x] Playground SSR device hints on App routes (`playground/layout.tsx` + proxy `Accept-CH`)
- [x] Remove unused `@trpc/next` dependency
- [x] Extract `authOptions` to `src/server/auth/authOptions.ts`
- [x] Extract `AppShellProviders` shared by `_app` and `AppRootLayoutClient`
- [x] SSR i18n preload for playground + profile
- [x] Localized SEO titles/descriptions for home, playground landing, profile

## Phase 3 — Instant Nav / Cache Components (L5 in progress)

- [x] **`cacheComponents` + `partialPrefetching`** enabled (incremental — `instant = false` on runtime segments)
- [ ] Remove `instant = false` from marketing routes (cache session/i18n or Suspense-split root `headers()`)
- [ ] `unstable_instant` on marketing routes
- [ ] `@next/playwright` `instant()` tests
