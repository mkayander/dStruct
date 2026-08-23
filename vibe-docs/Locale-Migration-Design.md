# Locale migration — design (Pages `i18n` → App `[lang]`)

## Goal

Remove `i18n` from `next.config.mjs` and serve user-facing marketing + app routes from **App Router** `app/[lang]/…`, enabling:

- Consistent locale routing with Instant Navigations / Cache Components (Phase 2+)
- Public URLs unchanged (`/`, `/de`, `/privacy`, `/playground`, …)
- Retire duplicate Pages Router marketing pages

**Prerequisite:** Phase 1 gate — preview smoke green on **Next 16.3.x** with Pages `i18n` still enabled (API `x-matched-path` not `/en/404`).

---

## Current state (post L1–L3b)

| URL | Router | Notes |
|-----|--------|--------|
| `/`, `/privacy`, `/daily`, `/playground`, `/profile/*` | App `(default-locale)/` | default locale (en), indexable |
| `/{locale}`, `/{locale}/*` | App `[lang]/` | non-default locales, indexable |
| `/internal-marketing/*`, `/en/*` | **308 redirect** | L3b → public App routes |
| `/api/*` | Pages API | unchanged |

Shared views already exist: `MarketingHomeView`, `PrivacyPageView`, `DailyPageView`, `PlaygroundPageView`, `ProfilePageView`.

Dual-router bridges: `usePlaygroundRoute`, `useProfileUserId`, `usePagesRouterCompat`, `useSearchParam`.

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

## Phased cutover

### L1 — Public App shell (noindex pilot → public path)

1. Add `src/app/[lang]/` mirroring `internal-marketing/[locale]/` (reuse page modules + metadata helpers).
2. Extend `proxy.ts` to set `APP_ROUTER_LOCALE_HEADER` for `/{locale}` marketing paths once safe (or use param only).
3. **`robots: index`** + real canonicals on new public App routes (remove pilot noindex).
4. Keep Pages routes **live**; compare SEO metadata and e2e smoke.

**Do not** remove `i18n` from config yet.

### L2 — Default-locale App cutover (no rewrites)

Pages `i18n` auto-redirects `/en/*` → unprefixed URLs, so **`next.config` rewrites to `/en` loop**. L2 instead adds App route group `(default-locale)/` at unprefixed paths; App Router takes precedence over duplicate Pages files.

1. `app/(default-locale)/` — home, privacy, daily, playground, profile (`baseLocale` layout).
2. Extend `proxy.ts` locale header for unprefixed marketing paths.
3. Playwright: unprefixed URLs + existing `app/[lang]` + API smoke.
4. Pages marketing files stay until L3 (unused for default-locale traffic).

**Do not** remove `i18n` from config yet.

### L3 — Remove Pages marketing (default locale done in L2)

1. ~~Delete `pages/index.tsx`, `pages/privacy.tsx`, `pages/daily.tsx`~~ (done with L2).
2. ~~Remove `/internal-marketing/*` App pilot~~ — **L3b**: 308 redirects + delete pilot tree.

### L3b — Retire internal-marketing pilot

1. `next.config` 308 redirects: `/internal-marketing/*` → public App; `/en/*` → unprefixed.
2. Delete `src/app/internal-marketing/`.
3. Update `proxy.ts`, `playgroundRoute.ts`, e2e, `preview-smoke`.

### L4 — Playground + profile on App only

1. Move public traffic to `app/[lang]/playground` + `profile` (done in L1/L2).
2. ~~Delete Pages `playground` / `profile`~~ (done L2).
3. ~~**`i18n` block removed** from `next.config.mjs`~~ (done L2).

### L5 — Instant Nav flags (in progress)

1. ~~Enable `cacheComponents`, `partialPrefetching`~~ — enabled.
2. ~~Suspense-split root `headers()` locale read~~ — `RootHtmlShell` + removed root `instant = false`.
3. ~~Cache i18n + Suspense-wrap session/device in locale layouts~~ — `'use cache'` on translations; `instant = true` on marketing pages.
4. ~~`@next/playwright` `instant()` tests~~ — marketing client navigations (`e2e/instant-marketing-nav.spec.ts`).
5. Initial page-load instant shell (hard navigation) — follow-up.
6. Playground/profile instant adoption — optional.

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
- `src/proxy.ts` — locale header for App Router paths
- ~~`src/app/internal-marketing/`~~ — removed L3b (308 redirects to public App)
