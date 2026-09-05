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
| `/api/*` | App Route Handlers | P7 (P8 removed `pages/api`) |

Shared views: `MarketingHomeView`, `PrivacyPageView`, `DailyPageView`, `PlaygroundPageView`, `ProfilePageView`.

App-native route hooks: `usePlaygroundRoute`, `useProfileUserId`, `useSearchParam`, `useRoutePathname` (`next/navigation` only; P9).

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
app/api/*/route.ts             # Route Handlers (P7)
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

1. Move public traffic to `app/[lang]/playground` + `profile` (done in L1/L2).
2. ~~Delete Pages `playground` / `profile`~~ (done L2).
3. ~~**`i18n` block removed** from `next.config.mjs`~~ (done L2).

### L5 — Instant Nav flags (complete)

1. ~~Enable `cacheComponents`, `partialPrefetching`~~ — enabled.
2. ~~Root `headers()` locale read~~ — direct read in `RootHtmlShell` with root `instant = false` (correct RTL; no Suspense fallback flash).
3. ~~Single provider mount + cached i18n~~ — one `AppRootLayoutClient`; `'use cache'` on translations; locale layouts `instant = false`.
4. ~~`@next/playwright` `instant()` tests~~ — marketing client navigations (`e2e/instant-marketing-nav.spec.ts`).
5. ~~Initial page-load instant shell (hard navigation)~~ — `instant-marketing-hard-nav` e2e (prod/preview PPR; skips in dev).
6. ~~Session / device hints~~ — `LocaleAppLayout` passes proxy `ssrDeviceType` into the theme; session streams via `ServerSessionStream` Suspense (P10).
7. ~~Playground + profile instant adoption~~ — `instant = true` with Suspense skeletons; `e2e/instant-playground-nav.spec.ts`, `e2e/instant-profile-nav.spec.ts` (P10).

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

- `vibe-docs/App-Router-Migration-Plan.md` — **P6–P9 complete**; P10 optional polish
- `vibe-docs/Instant-Navigations-Design.md`
- `vibe-docs/Instant-Navigations-TODO.md`
- `src/proxy.ts` — locale header for App Router paths
