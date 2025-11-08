# Tailwind CSS Migration Revert Plan

## Executive Summary

This document outlines the steps to revert the Tailwind CSS migration that was introduced in commits `a70cf76` through `b43c46f` (approximately 8 commits spanning May 2-4, 2025). The migration added Tailwind CSS v4, PostCSS configuration, shadcn/ui components, and migrated several existing components to use Tailwind utility classes. This revert plan provides a systematic approach to remove Tailwind dependencies and restore components to their previous Material-UI/SCSS-based implementations.

## Current State Analysis

### Tailwind Integration Points

1. **Configuration Files**
   - `tailwind.config.js` - Tailwind configuration with custom colors
   - `postcss.config.js` - PostCSS configuration using `@tailwindcss/postcss`
   - `components.json` - shadcn/ui configuration

2. **Global Styles**
   - `src/styles/globals.css` - Contains Tailwind imports, theme variables, and custom animations

3. **Dependencies Added**
   - `tailwindcss` (^4.1.12) - devDependency
   - `@tailwindcss/postcss` (^4.1.12) - devDependency
   - `autoprefixer` (^10.4.21) - devDependency
   - `postcss` (^8.5.6) - devDependency
   - `tailwind-merge` (^3.3.1) - dependency
   - `clsx` (^2.1.1) - dependency (may have existed before)
   - `class-variance-authority` (^0.7.1) - dependency
   - `tw-animate-css` (^1.3.7) - devDependency
   - `prettier-plugin-tailwindcss` (^0.6.14) - devDependency
   - `next-themes` (^0.4.6) - dependency
   - `@radix-ui/react-switch` (^1.2.6) - dependency
   - `@radix-ui/react-tooltip` (^1.2.8) - dependency
   - `@radix-ui/react-slot` (^1.2.3) - dependency
   - `lucide-react` (^0.539.0) - dependency

4. **New Components Created**
   - `src/shadcn/ui/button.tsx` - Tailwind-based button component
   - `src/shadcn/ui/switch.tsx` - Tailwind-based switch component
   - `src/shadcn/ui/tooltip.tsx` - Tailwind-based tooltip component
   - `src/shadcn/ui/badge.tsx` - Tailwind-based badge component
   - `src/shadcn/ui/skeleton.tsx` - Tailwind-based skeleton component

5. **Components Migrated to Tailwind**
   - `src/shared/ui/atoms/ResizeHandle.tsx` - Uses Tailwind classes
   - `src/shared/ui/atoms/SolutionComplexityLabel.tsx` - Uses Tailwind classes
   - `src/shared/ui/atoms/BooleanToggleInput.tsx` - Migrated to use Radix Switch
   - `src/shared/ui/atoms/ThemeSwitch.tsx` - Migrated to use Radix Switch
   - `src/shared/ui/atoms/CircularPercentage/CircularPercentage.tsx` - Uses Tailwind classes
   - `src/shared/ui/atoms/NewLabel.tsx` - Uses Tailwind classes
   - `src/shared/ui/atoms/TopicTag.tsx` - Uses Tailwind classes
   - `src/shared/ui/atoms/RatingButtons.tsx` - Uses Tailwind classes
   - `src/shared/ui/atoms/IconButton.tsx` - Uses Tailwind classes
   - `src/shared/ui/atoms/LoadingSkeletonOverlay.tsx` - Uses Tailwind classes
   - `src/shared/ui/atoms/Ripple.tsx` - Uses Tailwind classes

6. **Utility Functions**
   - `src/shared/lib/utils.ts` - Contains `cn()` function using `tailwind-merge` and `clsx`

7. **Theme Management**
   - `src/shared/ui/providers/theme/ThemeProvider.tsx` - Refactored to use `next-themes`
   - `src/shared/hooks/useTheme.ts` - Custom hooks for theme management

8. **ESLint Configuration**
   - `eslint.config.mjs` - Updated to include Tailwind config files

## Functional Requirements

### Revert Objectives

1. Remove all Tailwind CSS dependencies and configuration
2. Restore components to their pre-migration state (Material-UI/SCSS)
3. Remove shadcn/ui components that were added
4. Restore original `globals.css` without Tailwind imports
5. Remove Tailwind-related utility functions
6. Restore original theme provider implementation
7. Ensure all migrated components work with Material-UI styling
8. Remove Tailwind-related ESLint configuration

### Success Criteria

- No Tailwind dependencies in `package.json`
- No Tailwind configuration files exist
- All components use Material-UI or SCSS modules
- Application builds and runs without errors
- Visual appearance matches pre-migration state
- No Tailwind classes in component code

## Technical Requirements

### Files to Delete

1. `tailwind.config.js`
2. `postcss.config.js` (or restore to previous state if it existed)
3. `components.json`
4. `src/shadcn/ui/` directory (entire directory)
5. `src/shared/lib/utils.ts` (if it only contains Tailwind utilities)

### Files to Restore

1. `src/styles/globals.css` - Remove Tailwind imports and theme variables
2. `src/shared/ui/atoms/ResizeHandle.tsx` - Restore to SCSS/MUI implementation
3. `src/shared/ui/atoms/SolutionComplexityLabel.tsx` - Restore to MUI implementation
4. `src/shared/ui/atoms/BooleanToggleInput.tsx` - Restore to MUI Switch
5. `src/shared/ui/atoms/ThemeSwitch.tsx` - Restore to MUI implementation
6. `src/shared/ui/atoms/CircularPercentage/CircularPercentage.tsx` - Restore SCSS module
7. `src/shared/ui/atoms/NewLabel.tsx` - Restore to MUI implementation
8. `src/shared/ui/atoms/TopicTag.tsx` - Restore to MUI implementation
9. `src/shared/ui/atoms/RatingButtons.tsx` - Restore to MUI implementation
10. `src/shared/ui/atoms/IconButton.tsx` - Restore to MUI implementation
11. `src/shared/ui/atoms/LoadingSkeletonOverlay.tsx` - Restore to MUI implementation
12. `src/shared/ui/atoms/Ripple.tsx` - Restore to SCSS/MUI implementation
13. `src/shared/ui/providers/theme/ThemeProvider.tsx` - Restore original implementation
14. `src/shared/hooks/useTheme.ts` - Restore or remove if only for Tailwind
15. `src/pages/_app.tsx` - Remove Tailwind-related providers
16. `eslint.config.mjs` - Remove Tailwind config references

### Dependencies to Remove

**From dependencies:**

- `tailwind-merge`
- `class-variance-authority` (if only used for Tailwind)
- `next-themes` (if only used for Tailwind theme)
- `@radix-ui/react-switch` (if only used in migrated components)
- `@radix-ui/react-tooltip` (if only used in migrated components)
- `@radix-ui/react-slot` (if only used in shadcn components)
- `lucide-react` (if only used in shadcn components)

**From devDependencies:**

- `tailwindcss`
- `@tailwindcss/postcss`
- `autoprefixer` (if only added for Tailwind)
- `postcss` (if only added for Tailwind)
- `tw-animate-css`
- `prettier-plugin-tailwindcss`

## Architecture Design

### Revert Strategy

The revert will be performed in phases to minimize risk:

1. **Phase 1: Restore Component Files** - Restore individual components from git history
2. **Phase 2: Remove Configuration** - Delete Tailwind config files
3. **Phase 3: Restore Global Styles** - Restore `globals.css` to pre-migration state
4. **Phase 4: Remove Dependencies** - Remove Tailwind-related packages
5. **Phase 5: Clean Up Utilities** - Remove Tailwind utility functions
6. **Phase 6: Update ESLint** - Remove Tailwind config references
7. **Phase 7: Testing** - Verify application builds and runs correctly

### Component Restoration Approach

For each migrated component:

1. Check git history for the file before migration: `git show <commit>^:path/to/file`
2. Restore the file from the commit before `a70cf76`
3. Verify component still works with current codebase
4. Update imports if necessary

### Dependency Cleanup

1. Remove packages from `package.json`
2. Run `pnpm install` to update lock file
3. Verify no other parts of codebase depend on removed packages

## Implementation Phases

### Phase 1: Restore Component Files (Difficulty: 5/10)

**Tasks:**

- [ ] Restore `src/shared/ui/atoms/ResizeHandle.tsx` from commit before `a70cf76`
- [ ] Restore `src/shared/ui/atoms/SolutionComplexityLabel.tsx` from commit before `a70cf76`
- [ ] Restore `src/shared/ui/atoms/BooleanToggleInput.tsx` from commit before `a70cf76`
- [ ] Restore `src/shared/ui/atoms/ThemeSwitch.tsx` from commit before `a70cf76`
- [ ] Restore `src/shared/ui/atoms/CircularPercentage/CircularPercentage.tsx` and its SCSS module
- [ ] Restore `src/shared/ui/atoms/NewLabel.tsx` from commit before `a70cf76`
- [ ] Restore `src/shared/ui/atoms/TopicTag.tsx` from commit before `a70cf76`
- [ ] Restore `src/shared/ui/atoms/RatingButtons.tsx` from commit before `a70cf76`
- [ ] Restore `src/shared/ui/atoms/IconButton.tsx` from commit before `a70cf76`
- [ ] Restore `src/shared/ui/atoms/LoadingSkeletonOverlay.tsx` from commit before `a70cf76`
- [ ] Restore `src/shared/ui/atoms/Ripple.tsx` from commit before `a70cf76`

**Verification:**

- Check each component compiles without errors
- Verify imports are correct
- Check for any TypeScript errors

### Phase 2: Remove Configuration Files (Difficulty: 2/10)

**Tasks:**

- [ ] Delete `tailwind.config.js`
- [ ] Delete `postcss.config.js` (or restore previous version if it existed)
- [ ] Delete `components.json`
- [ ] Delete `src/shadcn/ui/` directory recursively

**Verification:**

- Verify files are deleted
- Check git status shows deletions

### Phase 3: Restore Global Styles (Difficulty: 3/10)

**Tasks:**

- [ ] Restore `src/styles/globals.css` from commit before `a70cf76`
- [ ] Remove Tailwind imports (`@import "tailwindcss"`, `@import "tw-animate-css"`)
- [ ] Remove Tailwind theme variables and custom variants
- [ ] Keep original keyframes and styles

**Verification:**

- Verify CSS compiles without errors
- Check application styles render correctly

### Phase 4: Remove Dependencies (Difficulty: 4/10)

**Tasks:**

- [ ] Remove Tailwind dependencies from `package.json`:
  - `tailwindcss`
  - `@tailwindcss/postcss`
  - `autoprefixer` (if only added for Tailwind)
  - `postcss` (if only added for Tailwind)
  - `tw-animate-css`
  - `prettier-plugin-tailwindcss`
  - `tailwind-merge`
  - `class-variance-authority` (if only used for Tailwind)
  - `next-themes` (if only used for Tailwind)
  - `@radix-ui/react-switch` (if only used in migrated components)
  - `@radix-ui/react-tooltip` (if only used in migrated components)
  - `@radix-ui/react-slot` (if only used in shadcn components)
  - `lucide-react` (if only used in shadcn components)
- [ ] Run `pnpm install` to update lock file
- [ ] Verify no broken imports

**Verification:**

- Check `pnpm-lock.yaml` updated correctly
- Verify no import errors in codebase
- Run `pnpm build` to check for missing dependencies

### Phase 5: Clean Up Utilities and Theme (Difficulty: 4/10)

**Tasks:**

- [ ] Check if `src/shared/lib/utils.ts` is only used for Tailwind
  - If yes, delete the file
  - If no, remove Tailwind-specific code (`twMerge`, `cn` function)
- [ ] Restore `src/shared/ui/providers/theme/ThemeProvider.tsx` from commit before `a70cf76`
- [ ] Restore or remove `src/shared/hooks/useTheme.ts` based on original implementation
- [ ] Update `src/pages/_app.tsx` to remove Tailwind-related providers
- [ ] Update any components that import `cn` from `utils.ts`

**Verification:**

- Check all imports resolve correctly
- Verify theme switching still works (if applicable)
- Check for any remaining references to removed utilities

### Phase 6: Update ESLint Configuration (Difficulty: 2/10)

**Tasks:**

- [ ] Remove Tailwind config file references from `eslint.config.mjs`
- [ ] Remove any Tailwind-specific ESLint rules if added

**Verification:**

- Run `pnpm lint` to verify no errors
- Check ESLint config is valid

### Phase 7: Testing and Verification (Difficulty: 6/10)

**Tasks:**

- [ ] Run `pnpm build` to verify build succeeds
- [ ] Run `pnpm dev` to verify development server starts
- [ ] Test all migrated components visually
- [ ] Check browser console for errors
- [ ] Verify theme switching works (if applicable)
- [ ] Test responsive behavior
- [ ] Run `pnpm lint` to check for linting errors
- [ ] Run `pnpm test` to verify tests pass

**Verification:**

- Application builds without errors
- All components render correctly
- No console errors
- Visual appearance matches pre-migration state

## Risk Assessment

### High Risk Areas

1. **Component Dependencies** - Some components may have been refactored to depend on Tailwind utilities
2. **Theme System** - Theme provider changes may affect dark mode functionality
3. **Build Process** - PostCSS configuration changes may affect CSS processing
4. **Import References** - Components importing from `shadcn/ui` will break

### Mitigation Strategies

1. **Incremental Revert** - Revert one component at a time and test
2. **Git Branch** - Create a feature branch for the revert
3. **Commit Checkpoints** - Commit after each phase for easy rollback
4. **Visual Testing** - Compare before/after screenshots
5. **Dependency Check** - Use `pnpm why <package>` to verify dependencies before removal

## Performance Considerations

### Bundle Size Impact

**Expected Reductions:**

- Tailwind CSS (~3-4 MB uncompressed, ~50-100 KB compressed with JIT)
- Tailwind-related dependencies (~200-300 KB)
- shadcn/ui components (~50-100 KB)

**Total Expected Reduction:** ~300-500 KB compressed bundle size

### Build Time Impact

- **Before:** Tailwind JIT compilation adds ~100-200ms to build
- **After:** No Tailwind compilation, faster builds

## Migration Notes

### Components That May Need Special Attention

1. **ResizeHandle** - May have been refactored significantly
2. **ThemeSwitch** - Theme provider integration may need careful restoration
3. **BooleanToggleInput** - Radix Switch migration needs to be reverted to MUI Switch
4. **CircularPercentage** - SCSS module was removed, needs restoration

### Files That May Have Changed Unrelated to Tailwind

Some files may have been modified for other reasons during the migration period. Check git history to identify:

- Changes unrelated to Tailwind
- Bug fixes that should be preserved
- Feature additions that should be kept

## Rollback Plan

If the revert causes issues:

1. **Immediate Rollback:** `git reset --hard <commit-before-revert>`
2. **Partial Rollback:** Revert specific phases that cause issues
3. **Hybrid Approach:** Keep some Tailwind components if they're too complex to revert

## Testing Strategy

### Unit Tests

- Verify component rendering
- Check prop types and interfaces
- Test component interactions

### Integration Tests

- Test component integration with Redux store
- Verify theme provider integration
- Check API integration points

### Visual Regression

- Compare screenshots before/after revert
- Verify responsive breakpoints
- Check dark mode appearance

## Timeline Estimate

- **Phase 1:** 2-3 hours (component restoration)
- **Phase 2:** 15 minutes (file deletion)
- **Phase 3:** 30 minutes (CSS restoration)
- **Phase 4:** 30 minutes (dependency removal)
- **Phase 5:** 1-2 hours (utilities and theme)
- **Phase 6:** 15 minutes (ESLint)
- **Phase 7:** 2-3 hours (testing)

**Total Estimated Time:** 6-9 hours

## Success Metrics

- ✅ Zero Tailwind dependencies in `package.json`
- ✅ Zero Tailwind configuration files
- ✅ Zero Tailwind classes in component code
- ✅ Application builds successfully
- ✅ All components render correctly
- ✅ Bundle size reduced by expected amount
- ✅ No console errors
- ✅ Tests pass

## Appendix

### Git Commands for Restoration

```bash
# View file before migration
git show a70cf76^:src/shared/ui/atoms/ResizeHandle.tsx

# Restore file from specific commit
git checkout a70cf76^ -- src/shared/ui/atoms/ResizeHandle.tsx

# View all changes in a commit
git show --stat <commit-hash>

# View diff between commits
git diff a70cf76^..a70cf76
```

### Key Commits Reference

- `a70cf76` - Initial Tailwind CSS addition (May 2, 2025)
- `64ccab4` - Tailwind config enhancement
- `ddd05cd` - Theme provider integration
- `54bd18d` - Radix UI tooltips
- `220deff` - UI components update
- `4fb2338` - Prettier config and new components
- `781be23` - Ripple effect and Tailwind config
- `b43c46f` - ResizeHandle and SolutionComplexityLabel refactor

### Dependencies to Verify Before Removal

Before removing these dependencies, verify they're not used elsewhere:

```bash
# Check if package is used
pnpm why <package-name>

# Search for imports
grep -r "from.*<package>" src/
grep -r "import.*<package>" src/
```
