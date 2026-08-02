# DOM Disintegrate — Standalone Library Design

> **Status:** Proposal — for a future agent session.  
> **Source of truth in dStruct:** `src/shared/ui/effects/domDisintegrate/` (~62 files, 58 unit tests).  
> **First consumer:** cookie consent dismiss (`src/features/cookieConsent/ui/CookieConsentBannerWithDismissEffect.tsx`).  
> **Related PR:** #153 (`cursor/thanos-modal-particle-effect-3657`).

## Executive summary

Extract the DOM disintegration particle effect from dStruct into a **framework-agnostic npm package** with an optional React adapter. The in-repo module is mature enough to extract: dual-layer masks, chunk bitmask worker, sprite rendering, 15+ mask strategies, warm capture, and explicit error types.

**Recommended approach:** publish `@dstruct/dom-disintegrate` (scoped) or `dom-disintegrate` (unscoped) as a **monorepo package** or **separate repo**, depending on the table below.

---

## Comparison: keep in-app vs extract to library

| Criterion | Keep in `src/shared/ui/effects/` | Extract to standalone package |
|-----------|----------------------------------|-------------------------------|
| **Reuse outside dStruct** | Copy-paste or git subtree | `pnpm add @scope/dom-disintegrate` |
| **Bundle size in dStruct** | Tree-shaken with app | Peer deps + smaller app chunk if shared across apps |
| **Release cadence** | Ships with dStruct | Independent semver |
| **Test isolation** | Vitest in monorepo | Package owns its test suite |
| **Capture deps (SnapDOM)** | Already bundled in app | Must be peer or optional dep |
| **Maintenance** | One repo, one PR | Two repos or workspace package |
| **Agent complexity** | Low (done) | Medium (extract + publish pipeline) |

**Recommendation:** Extract when a second consumer is planned (marketing site, mobile web shell, OSS release). Until then, the in-app module is fine. This issue exists so extraction can start without re-discovery.

---

## Comparison: package layout options

| Option | Pros | Cons | Fit for dStruct |
|--------|------|------|-----------------|
| **A. Separate GitHub repo** | Clean OSS story, independent CI | Cross-repo PRs, version sync pain | Medium |
| **B. pnpm workspace package in dStruct** (`packages/dom-disintegrate`) | Single PR for app + lib changes, shared CI | Repo grows; publish step still needed | **Best first step** |
| **C. npm publish from `src/shared/ui/effects/` via build script** | Minimal file moves | Awkward public API, leaks `#/` paths | Poor |
| **D. Git submodule / subtree** | No npm | Worst DX | Avoid |

**Recommendation:** Start with **B** (workspace package), publish to npm when API stabilizes.

---

## Comparison: public API surface

| Export tier | Contents | Consumers |
|-------------|----------|-----------|
| **Core (required)** | `runDomDisintegrate`, `resolveDomDisintegrateOptions`, `DomDisintegrateError`, types, `DOM_DISINTEGRATE_DEFAULTS` | Vanilla JS, any framework |
| **React adapter** | `useDomDisintegrate` | React apps only (separate entry: `dom-disintegrate/react`) |
| **Internal (do not export from package root)** | Mask builders, workers, capture helpers, `MASK_STRATEGY_GENERATORS` | Implementation detail / deep imports only if needed |

---

## Comparison: capture backends

| Backend | Speed | Quality | CORS / security | Current usage |
|---------|-------|---------|-----------------|---------------|
| **SnapDOM** (`@zumer/snapdom`) | Slow (quality warm-up) | Best — real pixels, fonts | Same-origin DOM only | `mode: "quality"` idle warm-up |
| **SVG `foreignObject`** | Fast | Good for simple surfaces | `outerHTML` in SVG — trusted DOM only | `mode: "fast"` on dismiss |
| **DOM color fallback** | Instant | Solid-color squares | Safest, lowest fidelity | When raster capture fails |

**Library implication:** SnapDOM should be an **optional peer dependency** (`peerDependenciesMeta.optional: true`). Core must work with SVG + fallback alone.

---

## Comparison: mask modes

| Mode | Visual | CPU / memory | When to use |
|------|--------|--------------|-------------|
| **`chunks`** (default) | Pixel-accurate dissolve grid | Precomputes up to 96 PNG data-URL steps; worker + main-thread fallback | Surfaces that want bitmap punch-out without a click origin |
| **`radial`** | Smooth circular wave from origin | Cheap CSS gradients | Cookie consent dismiss (current production path); click-origin waves |
| **Opacity-only** | Whole-surface fade | Cheapest | Fallback when there is no origin and no chunk sequence |

**Known behavior (post-#153):**

- Cookie consent passes `maskMode: "radial"` for a reliable click-origin wave.
- In `chunks` mode with an origin: while chunk masks are still building, the effect uses the **radial wave** bridge. Once radial has started, it stays sticky (does not swap to chunk bitmaps mid-animation) and late chunk sequences are revoked immediately.

---

## Comparison: framework adapters

| Adapter | Entry point | Notes |
|---------|-------------|-------|
| **Vanilla** | `runDomDisintegrate(element, options)` | Returns `Promise<void>`; throws `DomDisintegrateError` on hard failures |
| **React** | `useDomDisintegrate()` → `{ targetRef, disintegrate, invalidateCapture }` | Pre-warms capture on mount; invalidates on resize/fonts |
| **Vue / Svelte** | Not implemented | Future: thin wrappers around core `runDomDisintegrate` |

---

## dStruct coupling to remove during extraction

| dStruct-specific | Replacement in library |
|------------------|------------------------|
| `#/` path alias | Relative imports within package |
| `prefersReducedMotion` from `#/shared/lib/prefersReducedMotion` | `options.respectReducedMotion` + default `matchMedia('(prefers-reduced-motion: reduce)')` |
| Cookie consent `zIndex: 1200` | Consumer passes `zIndex` option (already supported) |
| notistack / i18n | Stay in app; library throws or returns result codes |
| Vitest `vitest-canvas-mock` | Package `devDependencies` |

---

## Suggested package structure

```
packages/dom-disintegrate/
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── src/
│   ├── index.ts                 # core exports
│   ├── react.ts                 # useDomDisintegrate
│   ├── core/
│   │   ├── runDomDisintegrate.ts
│   │   ├── buildDisintegrateCapture.ts
│   │   ├── types.ts
│   │   └── ...
│   ├── capture/
│   │   ├── snapdom.ts           # optional peer
│   │   ├── svgForeignObject.ts
│   │   └── fallback.ts
│   ├── masks/
│   │   ├── chunkMaskSequence.ts
│   │   ├── chunkMaskWorker.ts
│   │   └── waveMask.ts
│   └── particles/
│       ├── stepParticles.ts
│       └── drawFrame.ts
└── __tests__/                   # port from src/shared/ui/effects/domDisintegrate/__tests__
```

---

## Error contract (already implemented in dStruct)

| Code | When | Consumer action |
|------|------|-----------------|
| `no_particles` | Capture yielded zero sample points | Show fallback UI / instant dismiss |
| `zero_size_surface` | Element has 0×0 layout | Skip animation |
| `canvas_unavailable` | No 2D context for overlay | Show warning toast |
| `no_target` | React hook called without mounted ref | Log dev error |

`prefers-reduced-motion`: still **silent skip** (not an error) — accessibility requirement.

---

## Testing requirements for extracted package

- [ ] Port all 58 tests from `src/shared/ui/effects/domDisintegrate/__tests__/`
- [ ] Add package-level build test (no `#/` imports leak)
- [ ] Verify worker bundle resolves in Vite / webpack / Turbopack consumers
- [ ] Smoke test in dStruct cookie consent after swapping import path
- [ ] Document peer deps: `react` (optional), `@zumer/snapdom` (optional)

---

## Migration path for dStruct (after package exists)

1. Add `packages/dom-disintegrate` and port source + tests.
2. Point `src/shared/ui/effects/domDisintegrate/index.ts` to re-export from workspace package (shim, one release cycle).
3. Update cookie consent import to `@dstruct/dom-disintegrate/react` or keep shim.
4. Delete shim + in-app copy once stable.
5. Configure Changesets or semantic-release for package publishing.

---

## Open questions for implementing agent

1. **Package name:** `@dstruct/dom-disintegrate` vs unscoped `dom-disintegrate`?
2. **License:** Match dStruct repo license?
3. **Publish target:** npm public, GitHub packages, or private registry only?
4. **SnapDOM:** required peer vs optional — affects default capture quality story.
5. **Worker bundling:** inline worker as `?worker` URL vs separate `chunkMaskWorker.js` asset — test with Next.js Pages Router consumer first.

---

## References

- Implementation: `src/shared/ui/effects/domDisintegrate/`
- Integration example: `src/features/cookieConsent/ui/CookieConsentBannerWithDismissEffect.tsx`
- Architecture rules: `.cursorrules` (MUI, Redux boundaries — library must **not** depend on these)
- Checklist: `vibe-docs/DomDisintegrate-Library-TODO.md`
