# Tailwind CSS Revert - TODO

This TODO tracks the implementation of the Tailwind CSS migration revert as outlined in `Tailwind-Revert-Plan.md`.

## Phase 1: Restore Component Files (Difficulty: 5/10)

- [ ] Restore `src/shared/ui/atoms/ResizeHandle.tsx` from commit before `a70cf76`
- [ ] Restore `src/shared/ui/atoms/SolutionComplexityLabel.tsx` from commit before `a70cf76`
- [ ] Restore `src/shared/ui/atoms/BooleanToggleInput.tsx` from commit before `a70cf76`
- [ ] Restore `src/shared/ui/atoms/ThemeSwitch.tsx` from commit before `a70cf76`
- [ ] Restore `src/shared/ui/atoms/CircularPercentage/CircularPercentage.tsx` from commit before `a70cf76`
- [ ] Restore `src/shared/ui/atoms/CircularPercentage/CircularPercentage.module.scss` from commit before `a70cf76`
- [ ] Restore `src/shared/ui/atoms/NewLabel.tsx` from commit before `a70cf76`
- [ ] Restore `src/shared/ui/atoms/TopicTag.tsx` from commit before `a70cf76`
- [ ] Restore `src/shared/ui/atoms/RatingButtons.tsx` from commit before `a70cf76`
- [ ] Restore `src/shared/ui/atoms/IconButton.tsx` from commit before `a70cf76`
- [ ] Restore `src/shared/ui/atoms/LoadingSkeletonOverlay.tsx` from commit before `a70cf76`
- [ ] Restore `src/shared/ui/atoms/Ripple.tsx` from commit before `a70cf76`
- [ ] Verify all components compile without errors
- [ ] Check for TypeScript errors in restored components
- [ ] Verify imports are correct

## Phase 2: Remove Configuration Files (Difficulty: 2/10)

- [ ] Delete `tailwind.config.js`
- [ ] Check if `postcss.config.js` existed before migration
  - [ ] If yes, restore previous version
  - [ ] If no, delete the file
- [ ] Delete `components.json`
- [ ] Delete `src/shadcn/ui/` directory recursively
- [ ] Verify files are deleted
- [ ] Check git status shows deletions

## Phase 3: Restore Global Styles (Difficulty: 3/10)

- [ ] View original `src/styles/globals.css` from commit before `a70cf76`
- [ ] Restore `src/styles/globals.css` to pre-migration state
- [ ] Remove Tailwind imports (`@import "tailwindcss"`, `@import "tw-animate-css"`)
- [ ] Remove Tailwind theme variables (`@theme`, `@custom-variant`)
- [ ] Remove Tailwind base layer (`@layer base`)
- [ ] Keep original keyframes (`fade-in`, `blink`)
- [ ] Keep original HTML/body styles
- [ ] Verify CSS compiles without errors
- [ ] Check application styles render correctly

## Phase 4: Remove Dependencies (Difficulty: 4/10)

- [ ] Check current usage of dependencies before removal:
  - [ ] `pnpm why tailwindcss`
  - [ ] `pnpm why tailwind-merge`
  - [ ] `pnpm why class-variance-authority`
  - [ ] `pnpm why next-themes`
  - [ ] `pnpm why @radix-ui/react-switch`
  - [ ] `pnpm why @radix-ui/react-tooltip`
  - [ ] `pnpm why @radix-ui/react-slot`
  - [ ] `pnpm why lucide-react`
- [ ] Search codebase for imports of packages to remove
- [ ] Remove from `package.json` dependencies:
  - [ ] `tailwind-merge`
  - [ ] `class-variance-authority` (if only used for Tailwind)
  - [ ] `next-themes` (if only used for Tailwind)
  - [ ] `@radix-ui/react-switch` (if only used in migrated components)
  - [ ] `@radix-ui/react-tooltip` (if only used in migrated components)
  - [ ] `@radix-ui/react-slot` (if only used in shadcn components)
  - [ ] `lucide-react` (if only used in shadcn components)
- [ ] Remove from `package.json` devDependencies:
  - [ ] `tailwindcss`
  - [ ] `@tailwindcss/postcss`
  - [ ] `autoprefixer` (if only added for Tailwind)
  - [ ] `postcss` (if only added for Tailwind)
  - [ ] `tw-animate-css`
  - [ ] `prettier-plugin-tailwindcss`
- [ ] Run `pnpm install` to update lock file
- [ ] Verify no broken imports
- [ ] Run `pnpm build` to check for missing dependencies

## Phase 5: Clean Up Utilities and Theme (Difficulty: 4/10)

- [ ] Check `src/shared/lib/utils.ts` usage:
  - [ ] Search for imports of `cn` function
  - [ ] Check if `utils.ts` contains other utilities
- [ ] If `utils.ts` only contains Tailwind utilities:
  - [ ] Delete `src/shared/lib/utils.ts`
  - [ ] Update all imports that use `cn` from `utils.ts`
- [ ] If `utils.ts` contains other utilities:
  - [ ] Remove `twMerge` import
  - [ ] Remove `cn` function
  - [ ] Keep other utility functions
  - [ ] Update imports that use `cn`
- [ ] Restore `src/shared/ui/providers/theme/ThemeProvider.tsx` from commit before `a70cf76`
- [ ] Check if `src/shared/hooks/useTheme.ts` existed before migration:
  - [ ] If yes, restore from commit before `a70cf76`
  - [ ] If no, check if it's used elsewhere and decide whether to keep or remove
- [ ] Update `src/pages/_app.tsx`:
  - [ ] Remove Tailwind-related providers (if any)
  - [ ] Restore original theme provider setup
- [ ] Search for all `cn` function usages and update:
  - [ ] Replace with MUI `sx` prop or SCSS classes
  - [ ] Or remove if not needed
- [ ] Verify all imports resolve correctly
- [ ] Verify theme switching still works (if applicable)
- [ ] Check for any remaining references to removed utilities

## Phase 6: Update ESLint Configuration (Difficulty: 2/10)

- [ ] View `eslint.config.mjs` from commit before `a70cf76`
- [ ] Remove Tailwind config file references from `eslint.config.mjs`
- [ ] Remove any Tailwind-specific ESLint rules if added
- [ ] Restore original ESLint configuration
- [ ] Run `pnpm lint` to verify no errors
- [ ] Check ESLint config is valid

## Phase 7: Testing and Verification (Difficulty: 6/10)

- [ ] Run `pnpm build` to verify build succeeds
- [ ] Run `pnpm dev` to verify development server starts
- [ ] Visual testing:
  - [ ] Test `ResizeHandle` component
  - [ ] Test `SolutionComplexityLabel` component
  - [ ] Test `BooleanToggleInput` component
  - [ ] Test `ThemeSwitch` component
  - [ ] Test `CircularPercentage` component
  - [ ] Test `NewLabel` component
  - [ ] Test `TopicTag` component
  - [ ] Test `RatingButtons` component
  - [ ] Test `IconButton` component
  - [ ] Test `LoadingSkeletonOverlay` component
  - [ ] Test `Ripple` component
- [ ] Check browser console for errors
- [ ] Verify theme switching works (if applicable)
- [ ] Test responsive behavior
- [ ] Run `pnpm lint` to check for linting errors
- [ ] Run `pnpm test` to verify tests pass
- [ ] Check bundle size reduction:
  - [ ] Compare bundle size before/after revert
  - [ ] Verify expected size reduction achieved

## Post-Revert Cleanup

- [ ] Review git diff to ensure all Tailwind code is removed
- [ ] Check for any remaining Tailwind class names in codebase
- [ ] Verify no Tailwind-related comments or documentation remain
- [ ] Update project documentation if needed
- [ ] Create commit with clear message: "revert: remove Tailwind CSS migration"

## Notes

- Use `git show a70cf76^:<file-path>` to view files before migration
- Use `git checkout a70cf76^ -- <file-path>` to restore files
- Test after each phase to catch issues early
- Create a feature branch for the revert: `git checkout -b revert/tailwind-migration`
- Commit after each phase for easy rollback

## Rollback Plan

If issues arise during revert:

1. **Immediate Rollback:** `git reset --hard <commit-before-revert>`
2. **Partial Rollback:** Revert specific phases that cause issues
3. **Hybrid Approach:** Keep some Tailwind components if they're too complex to revert

## Verification Checklist

- [ ] Zero Tailwind dependencies in `package.json`
- [ ] Zero Tailwind configuration files
- [ ] Zero Tailwind classes in component code
- [ ] Application builds successfully (`pnpm build`)
- [ ] Development server runs (`pnpm dev`)
- [ ] All components render correctly
- [ ] Bundle size reduced by expected amount
- [ ] No console errors
- [ ] Tests pass (`pnpm test`)
- [ ] Linting passes (`pnpm lint`)
