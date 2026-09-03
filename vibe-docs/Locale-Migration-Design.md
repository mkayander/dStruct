# Locale migration — design (Pages `i18n` → App `[lang]`)

## Goal

Remove `i18n` from `next.config.mjs` and serve user-facing marketing + app routes from **App Router** `app/[lang]/…`, enabling:

- Consistent locale routing with Instant Navigations / Cache Components (Phase 2+)
- Public URLs unchanged (`/`, `/de`, `/privacy`, `/playground`, …)
- Retire duplicate Pages Router marketing pages

**Prerequisite:** Phase 1 gate — preview smoke green on **Next 16.3.x** with Pages `i18n` still enabled (API `x-matched-path` not `/en/404`).

---

## Current state (complete)

| URL | Router | Notes |
|-----|--------|--------|
| `/`, `/privacy`, `/daily`, `/playground`, `/profile/*` | App `(default-locale)/` | default locale (en), indexable |
| `/{locale}`, `/{locale}/*` | App `[lang]/` | non-default locales, indexable |
| `/internal-marketing/*`, `/en/*` | **308 redirect** | L3b → public App routes |
| `/api/*`, `/sitemap.xml` | Pages (interim) | See **App-Router-Migration-Plan.md** P6–P7 |

Shared views: `MarketingHomeView`, `PrivacyPageView`, `DailyPageView`, `PlaygroundPageView`, `ProfilePageView`.

Dual-router bridges (remove in P9): `usePlaygroundRoute`, `useProfileUserId`, `usePagesRouterCompat`, `useSearchParam`.

---

## Why not flip `i18n` off yet (historical)

Pages `i18n` and App `[lang]` **conflicted** if both owned locale prefixes. The pilot lived under `/internal-marketing/` until L3b; **`i18n` was removed in L2/L4** once Pages marketing was deleted.

---

## Target routing (achieved)

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

## Phased cutover (L1–L5) — complete

<details>
<summary>L1–L5 step checklist (archived)</summary>

### L1 — Public App shell

Add `app/[lang]/`; proxy locale header; indexable metadata; Pages routes kept for comparison.

### L2 — Default-locale cutover

`app/(default-locale)/` at unprefixed URLs; proxy header for `/`, `/privacy`, etc.

### L3 / L3b — Remove Pages marketing

Delete Pages marketing files; 308 redirects from `/internal-marketing/*` and `/en/*`; delete pilot tree.

### L4 — Playground + profile on App

App-only playground/profile; **`i18n` removed** from `next.config.mjs`.

### L5 — Instant Nav

`cacheComponents`, marketing + playground `instant = true`, e2e (`instant-marketing-nav`, hard-nav, playground-nav), Suspense device hints.

</details>

**Next:** **`vibe-docs/App-Router-Migration-Plan.md`** (P6–P10) — sitemap, API Route Handlers, delete `pages/`, drop compat router.

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

- `vibe-docs/App-Router-Migration-Plan.md` — **P6–P10:** finish migration (API, sitemap, delete `pages/`)
- `vibe-docs/Instant-Navigations-Design.md`
- `vibe-docs/Instant-Navigations-TODO.md`
- `src/proxy.ts` — locale header for App Router paths
