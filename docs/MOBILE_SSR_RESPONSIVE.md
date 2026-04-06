# Mobile SSR and Responsive Layout

This doc describes how dStruct mitigates SSR flicker on mobile and the CSS-first responsive patterns used across the app.

## The Problem

`useMobileLayout` (MUI `useMediaQuery(theme.breakpoints.down("sm"))`) resolves to `false` on the server because `window.matchMedia` is unavailable. The first HTML is always desktop layout. On mobile, hydration flips to `true`, causing a visible layout swap (flicker).

## Solution Overview

1. **CSS-first responsiveness** — Use responsive `sx` breakpoints (`{ xs: ..., sm: ... }`) instead of conditional React trees where possible.
2. **SSR device hint** — For pages that must branch structurally (e.g. playground mobile vs desktop), derive a coarse device guess from request headers and pass it into the theme so `useMediaQuery` matches on first paint.
3. **Scoped SSR** — Apply device detection only where needed (e.g. playground `getServerSideProps`), not globally in `_app`, to avoid opting out of static optimization for the whole app.

## Key Files

| File | Purpose |
|------|---------|
| `src/shared/hooks/useMobileLayout.ts` | Thin wrapper around MUI `useMediaQuery` for `theme.breakpoints.down("sm")`. Still used where behavior (not just layout) differs. |
| `src/shared/lib/ssrDevice.ts` | `resolveSsrDeviceType(headers)` — parses `Sec-CH-UA-Mobile` and `User-Agent` to return `"mobile"` or `"desktop"`. `setDeviceHintResponseHeaders(res)` — sets `Accept-CH`, merges `Vary` for caching correctness. |
| `src/themes.ts` | `createCustomTheme(deviceType)` — injects `MuiUseMediaQuery.defaultProps.ssrMatchMedia` so media queries resolve correctly during SSR. `queryMatchesViewport` returns `false` for unsupported query types (conservative). |
| `src/shared/ui/providers/StateThemeProvider.tsx` | Accepts `ssrDeviceType`, creates theme via `createCustomTheme(ssrDeviceType)`. |
| `src/pages/playground/[[...slug]].tsx` | Uses `getServerSideProps` to resolve `ssrDeviceType` from `req.headers`, calls `setDeviceHintResponseHeaders(res)`, passes `ssrDeviceType` into page props → `_app` → `StateThemeProvider`. |
| `src/pages/_app.tsx` | Passes `pageProps.ssrDeviceType` into `StateThemeProvider`. No `getInitialProps` — device hint is page-scoped. |

## Header Strategy

- **`Sec-CH-UA-Mobile`** — Read first when present (`?1` = mobile, `?0` = desktop). Low-entropy hint, sent by default in Chromium.
- **`User-Agent`** — Fallback when client hints are absent. Regex matches common mobile UA substrings.
- **`Accept-CH`** — Merged (not overwritten) so other hints can coexist.
- **`Vary`** — Includes `User-Agent` and `Sec-CH-UA-Mobile` so caches serve correct variant per device.

## CSS-First vs `useMobileLayout`

**Prefer CSS-first** when the same component tree can adapt via styles:

- Layout (flex direction, widths, spacing)
- Visibility (display, overflow)
- Typography and sizing

**Keep `useMobileLayout`** when behavior or structure differs:

- Monaco editor options (e.g. `folding: !isMobile`)
- Mobile toolbar vs desktop toolbar (different components)
- Mobile flow state machine (browse/code/results phases)

### Components Using CSS-First (No `useMobileLayout`)

- `src/pages/index.tsx` — Hero clipPath, typography, button widths, stack direction
- `src/features/codeRunner/ui/CodePanel.tsx` — Tab panel flex, editor wrapper layout, editor height
- `src/features/codeRunner/ui/SolutionModal.tsx` — Stack direction for complexity fields
- `src/features/project/ui/ProjectBrowser/ProjectBrowser.tsx` — Drawer paper width (`{ xs: "100%", md: "800px" }`)

### Components Still Using `useMobileLayout`

- `src/pages/playground/[[...slug]].tsx` — Mobile vs desktop layout branch (MobilePlayground vs SplitPanelsLayout)
- `src/features/appBar/ui/MainAppBar.tsx` — Mobile playground toolbar vs desktop toolbar
- `src/features/codeRunner/ui/CodeRunner.tsx` — Monaco `folding` option

## SSR Match Media

MUI's `ssrMatchMedia` receives a function `(query) => ({ matches: boolean })`. Our implementation:

- Parses `min-width` and `max-width` in px from the query string.
- Uses viewport width 375 for mobile, 1024 for desktop.
- Returns `false` for unsupported query types (orientation, feature queries) to avoid false positives and hydration mismatch.

## Architecture Decisions

### Why page-scoped `getServerSideProps` instead of `_app.getInitialProps`?

`getInitialProps` in `_app` opts the entire app out of Automatic Static Optimization. Moving device detection to the playground page keeps SSR only where it matters for flicker and preserves static optimization for other routes.

### Why not fully CSS-first for the playground?

The playground has two distinct interaction models: mobile (browse/code/results phases with routing) vs desktop (four-panel split layout). These are different component trees and data flows, not just layout styling. Merging them into one tree with CSS-only would require significant refactor and risk regressions.

### Why keep Monaco `folding` as a runtime flag?

Monaco's folding behavior affects mobile UX (less clutter on small screens). The option is passed at mount time; CSS cannot change it. This remains a valid use of `useMobileLayout`.

## Known Limitations

- **Device detection is heuristic.** `User-Agent` and `Sec-CH-UA-Mobile` indicate device type, not viewport size. A tablet in landscape may be treated as desktop.
- **First request may lack client hints.** Browsers send `Sec-CH-UA-Mobile` by default in Chromium, but older or non-Chromium browsers may only provide `User-Agent`.
- **Playground is always dynamic.** Because it uses `getServerSideProps`, it is never statically generated. Other pages (e.g. `/`) remain static.

## Verification

When changing SSR or responsive logic:

1. Run `pnpm build` — ensure no static optimization warnings for unintended routes.
2. Test playground on mobile viewport (e.g. 390×844) — reload and verify no visible flicker.
3. Check console for hydration mismatch warnings.
4. Open Project Browser drawer — verify layout at mobile and desktop widths.
