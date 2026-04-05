# Obsidian Home Rollout TODO

## Phase 1. Theme Foundation

- [ ] Update `src/themes.ts` with Obsidian palette, typography, surface tokens, and component overrides.
- [ ] Keep the provider wiring stable in `StateThemeProvider`.

## Phase 2. App Shell

- [ ] Restyle `MainAppBar` to use Obsidian glass/surface treatment.
- [ ] Check shared overlay/drawer surfaces for visual consistency.

## Phase 3. Landing Hero

- [ ] Extract the home hero into landing-specific components.
- [ ] Replace the 3D hero focal layout with a coded product preview.
- [ ] Reuse `LogoModelView` as a subtle background accent.
- [ ] Add cross-device gradient atmosphere inspired by the mobile Stitch screen.

## Phase 4. Landing Sections

- [ ] Refactor `HomeLandingSections.tsx` to the new content hierarchy.
- [ ] Restyle the example cards to match the new system.

## Phase 5. FAQ

- [ ] Restyle `HomeLandingFaq.tsx` to match the Obsidian surfaces.

## Phase 6. Verification

- [ ] Run lints for changed files.
- [ ] Verify CTA routes, FAQ anchor, and readability on desktop/mobile.
