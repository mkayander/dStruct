# Thanos Disintegrate Library — TODO

> Pick up after reading `vibe-docs/ThanosDisintegrate-Library-Design.md`.

## Phase 1 — Scaffold package

- [ ] Create `packages/thanos-disintegrate/` with `package.json`, `tsconfig`, Vitest
- [ ] Define exports: `.`, `./react`, types
- [ ] Add `peerDependencies`: `react` (optional), `@zumer/snapdom` (optional)
- [ ] Replace `#/` imports with package-relative paths

## Phase 2 — Port source

- [ ] Move `src/shared/ui/effects/thanosDisintegrate/**` → package `src/`
- [ ] Inline or inject `prefersReducedMotion` (remove `#/shared/lib` dep)
- [ ] Keep worker as separate entry; verify Next.js `import.meta.url` worker pattern
- [ ] Do not prewarm the chunk mask worker on mount — create lazily when `maskMode: "chunks"`
- [ ] Port unit tests; `pnpm test` green in package
- [ ] Preserve sticky radial fallback: late chunk sequences must be revoked, never applied mid-wave

## Phase 3 — Wire dStruct consumer

- [ ] Add workspace dependency in root `package.json` / `pnpm-workspace.yaml`
- [ ] Shim `src/shared/ui/effects/thanosDisintegrate/index.ts` to re-export package
- [ ] Run full `pnpm test` + `pnpm lint` in monorepo
- [ ] Manual smoke: cookie consent dismiss on localhost

## Phase 4 — Publish (optional)

- [ ] README with API table, mask mode comparison, React example
- [ ] Changesets / CI publish workflow
- [ ] Remove in-app shim after one stable release

## Out of scope (unless requested)

- Vue/Svelte adapters
- WebGL particle path
- Storybook demo site
