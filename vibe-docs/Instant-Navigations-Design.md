# Next.js 16.3 Instant Navigations — Design

## Executive summary

**Instant Navigations** (Cache Components, Partial Prefetching, Instant Insights, Navigation Inspector, Playwright `instant()`) is an **App Router–only** opt-in feature set. dStruct today is **100% Pages Router** (`src/pages/`) with **20-locale `i18n` in `next.config.mjs`**, heavy client state (Redux, tRPC, Apollo), and a **playground** route that is almost entirely client-driven.

**Overall implementation difficulty: 9/10** (very hard) for full adoption; **2/10** for agent-native DX and general 16.3 wins that do not require Instant Navigations.

| Track | What you get | Blockers |
|-------|----------------|----------|
| **A. Agent-native DX** | Version-matched bundled docs in `AGENTS.md` | None — already partially done on 16.2.12 |
| **B. 16.3 platform wins** | Less dev RAM, faster builds, prefetch inlining, faster SSR | Vercel preview **i18n + `/api/*`** routing was broken on 16.3.0; retry when fix is in deployed Next (see [adapter-vercel#81](https://github.com/nextjs/adapter-vercel/pull/81)) |
| **C. Instant Navigations** | SPA-like shells, devtools, `'use cache'`, `unstable_instant` | Requires **App Router** + **`cacheComponents`** + migration off Pages `i18n` config |

---

## What Instant Navigations is (16.3)

Enable in `next.config`:

```ts
const nextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    instantNavigationDevToolsToggle: true, // Instant Insights + Navigation Inspector
  },
};
```

Per-route validation:

```tsx
export const unstable_instant = { prefetch: 'static' };
```

Patterns:

- Wrap runtime/dynamic data in `<Suspense>` with explicit fallbacks (loading shells).
- Mark stable data with `'use cache'` + `cacheLife`.
- Use `@next/playwright` `instant()` for regression tests.

**Bundled docs (read before coding):**

- `node_modules/next/dist/docs/01-app/02-guides/instant-navigation.md`
- `node_modules/next/dist/docs/01-app/02-guides/migrating-to-cache-components.md`
- `node_modules/next/dist/docs/01-app/02-guides/adopting-partial-prefetching.md` (if present)
- Blog: [Next.js 16.3 — Instant Navigations](https://nextjs.org/blog/next-16-3-instant-navigations)

---

## Current dStruct routing map

| Route | Data | Instant Nav fit |
|-------|------|-----------------|
| `/` (`index.tsx`) | `getStaticProps` + i18n | **Good first App Router pilot** — mostly static marketing UI |
| `/privacy`, `/daily` | `getStaticProps` + i18n | Good pilots |
| `/profile/[userId]` | `getServerSideProps` | Medium — needs Suspense around user-specific blocks |
| `/playground/[[...slug]]` | `getServerSideProps` + heavy client app | **Poor early target** — Redux/tRPC/Monaco; benefit is mostly shell around chrome |
| `/api/*` | API routes | Unchanged; stay on Pages API (or migrate later) |

**Provider tree today** (`_app.tsx`): Emotion → Redux → NextAuth → Apollo → MUI theme → notistack → i18n → cookie consent → project browser overlay → page.

App Router equivalent needs a **client `Providers` boundary** in `app/layout.tsx` (or per-segment layouts).

---

## i18n conflict (critical)

Pages Router uses `next.config.mjs` → `i18n: { locales, defaultLocale }`. That drives locale prefixes (`/en/...`, `/de/...`) and `getStaticProps` locale context.

**App Router does not use that config.** Standard pattern:

```
app/[lang]/layout.tsx
app/[lang]/page.tsx
app/[lang]/privacy/page.tsx
...
```

Use **`next/root-params`** (`import { lang } from 'next/root-params'`) in Server Components instead of prop-drilling locale.

**Migration implication:** You cannot enable Instant Navigations on App routes while keeping Pages `i18n` as the source of truth without duplicate locale routing. Plan either:

1. **Big-bang locale segment** — add `app/[lang]/...`, remove `i18n` from config once all user-facing routes move; or
2. **English-only App pilot** — `app/(marketing)/page.tsx` without `[lang]` first (loses localized home until phase 2); or
3. **Stay on Pages** for all routes until a dedicated i18n migration epic.

Recommendation: **phase 2** below uses `app/[lang]/` for marketing pages only, with rewrites/redirects from existing `/en` URLs during transition.

---

## Vercel / 16.3 upgrade gate

On branch `cursor/update-nextjs-react-8f0a`, **Next.js 16.3.0** caused preview 404s for `/api/trpc/*` and `/api/auth/session` (`x-matched-path: /en/404`). **16.2.12** restored API routing.

Before enabling `cacheComponents` in production:

1. Bump to **latest 16.3.x** (not 16.3.0 only).
2. Verify preview headers: `x-matched-path: /api/trpc/[trpc]`, not `/en/404`.
3. Confirm [adapter-vercel i18n API fix](https://github.com/nextjs/adapter-vercel/pull/81) is in the release you ship.

Webpack production build is **not** a viable workaround today (`sanitize-html` / `htmlparser2` ESM under `import-esm-externals`).

---

## Recommended phases

### Phase 0 — Agent-native DX (now, no router change)

- [x] `AGENTS.md` with bundled-docs block (16.2+).
- [ ] `CLAUDE.md` → `@AGENTS.md`.
- [ ] Extend `AGENTS.md` with Instant Nav / Cache Components doc paths and **“dStruct is Pages Router until Phase 1”** guardrail.
- [ ] Optional: [Next.js DevTools MCP](https://github.com/vercel/next-devtools-mcp) in `.mcp.json` for upgrade/migration prompts.

**No user-visible nav change.**

### Phase 1 — Re-upgrade to 16.3.x + verify Vercel

- Bump `next` to latest 16.3.x on `cursor/update-nextjs-react-8f0a` (or follow-up branch).
- Smoke-test preview API routes and playground.
- Ship general 16.3 wins (memory, build cache, prefetch inlining) **without** `cacheComponents`.

### Phase 2 — App Router pilot (marketing + i18n segment)

Scope: **home, privacy, daily** under `src/app/[lang]/`.

1. Add `src/app/[lang]/layout.tsx` with shared `Providers` (extract from `_app.tsx`).
2. Port static marketing pages; map `getI18nPropsWithCanonical` → Server Component + `lang()` from `next/root-params`.
3. Keep `src/pages/playground`, `profile`, APIs on Pages Router (coexistence supported).
4. Enable `cacheComponents: true` **only after** first App routes build clean in dev (expect Cache Components errors guiding Suspense/`use cache` fixes).
5. Add `unstable_instant` on pilot routes; turn on `instantNavigationDevToolsToggle` in dev.

**Success:** Instant Insights shows green navigations between `/en`, `/en/privacy`, `/en/daily`; Pages playground still works.

### Phase 3 — Playground shell (optional, high effort)

- Introduce `app/[lang]/playground/[[...slug]]/page.tsx` that renders a **thin Server shell** (app bar, SEO) + existing client `Playground` feature module inside `<Suspense>`.
- tRPC/Redux stay client-side; cache only static chrome and project list skeletons where safe.
- Revisit URL state / project browser integration with App Router navigation.

### Phase 4 — Profile, sitemap, deprecate Pages

- Migrate `profile/[userId]`, `sitemap.xml`.
- Remove `i18n` from `next.config.mjs` when no Pages user routes remain.
- Add Playwright `instant()` tests for marketing navigations.

---

## Architecture (target end state)

```mermaid
flowchart TD
  subgraph appRouter [App Router - Instant Nav]
    LangLayout["app/[lang]/layout.tsx"]
    Home["page.tsx + use cache"]
    Privacy["privacy/page.tsx"]
    Daily["daily/page.tsx"]
    PlaygroundApp["playground/[[...slug]]/page.tsx"]
  end

  subgraph pagesRouter [Pages Router - legacy until migrated]
    API["pages/api/*"]
    MaybePlayground["pages/playground - interim"]
  end

  Providers["Client Providers"]
  Features["features/* UI + Redux + tRPC"]

  LangLayout --> Providers
  Providers --> Home
  Providers --> Privacy
  Providers --> Daily
  Providers --> PlaygroundApp
  PlaygroundApp --> Features
  API --> Features
```

---

## Risks

| Risk | Mitigation |
|------|------------|
| Vercel i18n API regression on 16.3 | Gate on preview smoke tests; stay on 16.2.12 until green |
| Duplicate providers / hydration mismatch | Single `Providers.tsx`; match `_app` order; test Emotion cache |
| typesafe-i18n in Server Components | Keep client `I18nProvider` for interactive UI; pass `LL` or use server-side locale loaders consistently |
| tRPC `api.withTRPC` is Pages-oriented | Use existing `api` hooks in client components; add RSC tRPC only if needed later |
| SEO / canonical URLs | Preserve `getI18nPropsWithCanonical` behavior in App metadata API |
| Build time × 20 locales | `generateStaticParams` for `[lang]`; cache aggressively with `'use cache'` |

---

## What we are **not** doing in Phase 0–1

- Enabling `cacheComponents` on Pages Router (unsupported).
- Removing Pages `i18n` before App `[lang]` routes exist.
- Rewriting playground data layer to Server Components.

---

## Heavy client lifecycle (Activity / `cacheComponents`)

Visited routes can stay mounted in hidden Activity boundaries. Heavy clients must **defer mount one frame**, **dispose on hide/unmount**, and **clear parent refs** so show cycles recreate cleanly.

| Runtime | Shell / hook | Route |
|---------|----------------|-------|
| R3F WebGL | `WebGLCanvasShell` + `useDeferredClientMount` | Home (`instant=true`) |
| Monaco | `CodeRunner` shell + `onEditorUnmount` | Playground |
| Pyodide worker | `pythonRunner.release()` via `usePlaygroundRuntimeRelease` | Playground |
| Shared primitive | `useDeferredClientMount(onCleanup?)` | Reuse for future widgets |

Hard navigation (L5): production PPR shell validated by `instant-marketing-hard-nav` e2e (skips under `next dev`); `DocumentLocaleSync` keeps `lang`/`dir` aligned after hydration.

---

## References

- [Next.js 16.3 blog](https://nextjs.org/blog/next-16-3)
- [Instant Navigations blog](https://nextjs.org/blog/next-16-3-instant-navigations)
- [AI agents guide](https://nextjs.org/docs/app/guides/ai-agents) → `node_modules/next/dist/docs/01-app/02-guides/ai-agents.md`
- PR #160 — dependency upgrade branch (Next pin history)
