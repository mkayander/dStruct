# Locale migration — design (Pages `i18n` → App `[lang]`)

## Goal

Remove `i18n` from `next.config.mjs` and serve user-facing marketing + app routes from **App Router** `app/[lang]/…`, enabling:

- Consistent locale routing with Instant Navigations / Cache Components (Phase 2+)
- Public URLs unchanged (`/`, `/de`, `/privacy`, `/playground`, …)
- Retire duplicate Pages Router marketing pages

**Prerequisite:** Phase 1 gate — preview smoke green on **Next 16.3.x** with Pages `i18n` still enabled (API `x-matched-path` not `/en/404`).

---

## Current state (post #168–#171)

| URL | Router | Notes |
|-----|--------|--------|
| `/`, `/{locale}` | Pages `index.tsx` | `next.config` `i18n` |
| `/privacy`, `/daily` | Pages SSG | same |
| `/playground/[[...slug]]`, `/profile/[userId]` | Pages SSR | same |
| `/internal-marketing/[locale]/*` | App pilot | **noindex**, canonical → public URL |
| `/api/*` | Pages API | must stay routable under `i18n` on Vercel |

Shared views already exist: `MarketingHomeView`, `PrivacyPageView`, `DailyPageView`, `PlaygroundPageView`, `ProfilePageView`.

Dual-router bridges: `usePlaygroundRoute`, `useProfileUserId`, `usePagesRouterCompat`, `useSearchParam`.

---

## Why not flip `i18n` off yet

Pages `i18n` and App `[lang]` **conflict** if both own locale prefixes. Removing `i18n` before App public routes exist breaks `/de`, `/fr`, … and SEO.

Pilot lives under `/internal-marketing/` so public Pages routes stay canonical until cutover.

---

## Target routing

```
app/[lang]/layout.tsx          # Providers, lang from params / proxy header
app/[lang]/page.tsx            # home (was pages/index)
app/[lang]/privacy/page.tsx
app/[lang]/daily/page.tsx
app/[lang]/playground/[[...slug]]/page.tsx
app/[lang]/profile/[userId]/page.tsx
pages/api/*                    # unchanged (interim)
```

Locale list: keep **`src/i18n/i18n-util.ts`** as source of truth; `generateStaticParams` for `[lang]`.

---

## Phased cutover

### L1 — Public App shell (noindex pilot → public path)

1. Add `src/app/[lang]/` mirroring `internal-marketing/[locale]/` (reuse page modules + metadata helpers).
2. Extend `proxy.ts` to set `APP_ROUTER_LOCALE_HEADER` for `/{locale}` marketing paths once safe (or use param only).
3. **`robots: index`** + real canonicals on new public App routes (remove pilot noindex).
4. Keep Pages routes **live**; compare SEO metadata and e2e smoke.

**Do not** remove `i18n` from config yet.

### L2 — Rewrites / default locale

1. `next.config` rewrites: `/` → `/en` App home (or default locale) when ready.
2. Redirect duplicate Pages URLs to App (308) per route.
3. Playwright: public App routes + API smoke on preview.

### L3 — Remove Pages marketing

1. Delete `pages/index.tsx`, `pages/privacy.tsx`, `pages/daily.tsx` (or stub redirects).
2. Remove `/internal-marketing/*` App pilot (or 301 → public App).

### L4 — Playground + profile on App only

1. Move public traffic to `app/[lang]/playground` + `profile` (already prototyped).
2. Delete Pages `playground` / `profile` after parity tests.
3. **`i18n` block removed** from `next.config.mjs`.

### L5 — Instant Nav flags

1. Resolve root `headers()` / Cache Components blockers in `app/layout.tsx`.
2. Enable `cacheComponents`, `partialPrefetching`, `unstable_instant` on marketing routes.
3. Add `@next/playwright` `instant()` tests.

---

## Testing gates (each phase)

| Gate | Command / check |
|------|------------------|
| API routing | `PLAYWRIGHT_EXPECT_MATCHED_PATH=true pnpm preview-smoke` |
| Pilot / public metadata | `pnpm test:e2e` (Vercel preview CI) |
| Unit | `pnpm test`, `pnpm lint` |
| SEO | canonical + hreflang parity vs current Pages |

---

## Risks

| Risk | Mitigation |
|------|------------|
| Vercel `/api/*` → `/en/404` on 16.3 + `i18n` | Phase 1 preview smoke; stay on 16.2.12 until green |
| Duplicate content (Pages + App) | noindex on pilot until L1; short redirect window in L2 |
| 20 locales × static generation | `generateStaticParams`; `'use cache'` where stable |
| typesafe-i18n in RSC | Server loaders (`loadI18nServerProps`) + client `I18nProvider` for interactive UI |

---

## References

- `vibe-docs/Instant-Navigations-Design.md`
- `vibe-docs/Instant-Navigations-TODO.md`
- `src/proxy.ts` — locale header for App pilot
- `src/app/internal-marketing/` — current pilot implementation
