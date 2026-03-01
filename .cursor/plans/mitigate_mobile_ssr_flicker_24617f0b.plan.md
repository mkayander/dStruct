---
name: Mitigate Mobile SSR Flicker
overview: Adopt a CSS-first responsive strategy to eliminate hydration flicker, then add an SSR device hint fallback for places that must render different trees on mobile vs desktop.
todos:
  - id: audit-css-first
    content: Identify places where mobile/desktop can be CSS-only instead of conditional rendering.
    status: completed
  - id: wire-ssr-matchmedia
    content: Add SSR-aware `MuiUseMediaQuery.defaultProps.ssrMatchMedia` and pass server device hint through app/provider.
    status: completed
  - id: header-fallback-policy
    content: Implement UA + optional `Sec-CH-UA-Mobile` parsing policy and response cache `Vary` strategy.
    status: completed
  - id: verify-mobile-flicker
    content: Run mobile verification for hydration mismatch, CLS, and visible first-paint flicker.
    status: completed
isProject: false
---

# Mitigate `useMobileLayout` SSR Flicker

## Why this happens

- `useMediaQuery` in `[c:\Users\maxim\projects\dStruct\src\shared\hooks\useMobileLayout.ts](c:\Users\maxim\projects\dStruct\src\shared\hooks\useMobileLayout.ts)` resolves to `false` on server by default, so first HTML is desktop.
- On mobile, hydration flips to `true`, causing visible layout swap.

## Recommended approach (proven in production)

- **1) Prefer CSS-first responsiveness for first paint**
  - Refactor critical desktop/mobile differences to CSS breakpoints (`sx`, `display`, responsive grid/flex) instead of conditional React trees where feasible.
  - Apply first to current high-impact consumers: `[c:\Users\maxim\projects\dStruct\src\pages\index.tsx](c:\Users\maxim\projects\dStruct\src\pages\index.tsx)`, `[c:\Users\maxim\projects\dStruct\src\pages\playground\[[...slug]].tsx](c:\Users\maxim\projects\dStruct\src\pages\playground\[[...slug]].tsx)`, `[c:\Users\maxim\projects\dStruct\src\features\codeRunner\ui\CodeRunner.tsx](c:\Users\maxim\projects\dStruct\src\features\codeRunner\ui\CodeRunner.tsx)`.
- **2) For unavoidable structural branching, provide SSR hint to MUI `useMediaQuery`**
  - Inject `MuiUseMediaQuery.defaultProps.ssrMatchMedia` in theme creation in `[c:\Users\maxim\projects\dStruct\src\themes.ts](c:\Users\maxim\projects\dStruct\src\themes.ts)`.
  - Derive a coarse server guess (`mobile` vs `desktop`) from request headers in `[c:\Users\maxim\projects\dStruct\src\pages\_app.tsx](c:\Users\maxim\projects\dStruct\src\pages_app.tsx)`, pass into theme provider `[c:\Users\maxim\projects\dStruct\src\shared\ui\providers\StateThemeProvider.tsx](c:\Users\maxim\projects\dStruct\src\shared\ui\providers\StateThemeProvider.tsx)`.
  - Use the same guess for hydration to avoid mismatch, then let client re-evaluate if needed.
- **3) Header strategy**
  - Use `User-Agent` as fallback baseline now.
  - Optionally read `Sec-CH-UA-Mobile` when present; do not rely on viewport-width hints for the first request (they usually require `Accept-CH` negotiation and may only appear on later requests).
  - If response varies by hints, set proper `Vary` headers.
- **4) Validate quality**
  - Measure CLS / first-paint stability on real mobile devices and throttled conditions.
  - Confirm no hydration warnings and reduced layout jumps.

## Notes from docs/research

- MUI explicitly recommends CSS media queries first, and for SSR branching suggests custom `ssrMatchMedia` with UA/Client Hints estimation.
- Next.js supports server-side device parsing via `userAgent` helper (mainly middleware/edge flows), but device detection remains heuristic.
- MDN/web.dev: Client Hints are useful but require negotiation (`Accept-CH`) and cache-aware `Vary`; UA-CH should be treated as complementary, not a guaranteed first-request viewport source.
