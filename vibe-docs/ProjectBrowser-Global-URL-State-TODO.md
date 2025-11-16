# ProjectBrowser Global Availability & URL State - TODO List

## Phase 1: URL Synchronization (Difficulty: 4/10)

- [x] Update `src/features/project/ui/ProjectBrowser/ProjectBrowser.tsx`
  - [x] Import `useSearchParam` from `#/shared/hooks`
  - [x] Add `useSearchParam("browser")` hook for open/close state
  - [x] Add `useSearchParam("search")` hook for search query
  - [x] Add `useSearchParam("categories")` hook for categories filter
  - [x] Add `useSearchParam("difficulties")` hook for difficulties filter
  - [x] Add `useSearchParam("new")` hook for showOnlyNew flag
  - [x] Add `useSearchParam("sortBy")` hook for sort field
  - [x] Add `useSearchParam("sortOrder")` hook for sort order
  - [x] Add `parseCategories` helper function (comma-separated string → array)
  - [x] Add `serializeCategories` helper function (array → comma-separated string)
  - [x] Add `parseDifficulties` helper function
  - [x] Add `serializeDifficulties` helper function
  - [x] Add `parseBoolean` helper function
  - [x] Add `serializeBoolean` helper function
  - [x] Implement URL → Redux sync effect (on mount and route changes)
  - [x] Implement Redux → URL sync effect (when Redux state changes)
  - [x] Handle invalid/missing URL params gracefully (fallback to defaults)
  - [x] Update `handleClose` to use URL param
  - [x] Update `handleSelectProject` to use URL param
- [ ] Create `src/features/project/ui/ProjectBrowser/__tests__/ProjectBrowser.test.tsx` (if not exists)
  - [ ] Test URL → Redux sync on mount
  - [ ] Test Redux → URL sync on state change
  - [ ] Test array parsing (categories, difficulties)
  - [ ] Test boolean parsing (browser, new)
  - [ ] Test invalid param handling
  - [ ] Test missing param handling (use defaults)

## Phase 2: Global Component Placement (Difficulty: 3/10)

- [x] Update `src/pages/_app.tsx`
  - [x] Import `ProjectBrowser` component
  - [x] Add `<ProjectBrowser />` to render tree (after providers, before Analytics)
  - [x] Note: URL sync logic is already in ProjectBrowser component itself
- [x] Update `src/features/project/ui/ProjectPanel.tsx`
  - [x] Remove local `<ProjectBrowser />` rendering (now global)
  - [x] Update `handleOpenBrowser` to use URL update instead of Redux only
  - [x] Remove unused imports (`projectBrowserSlice`)
  - [ ] Test that ProjectPanel still works correctly
- [ ] Verify drawer positioning and z-index work globally
  - [ ] Test on different pages
  - [ ] Test with modals/other overlays
  - [ ] Verify mobile responsiveness

## Phase 3: Header Button Integration (Difficulty: 3/10)

- [x] Update `src/features/appBar/ui/MainAppBar.tsx`
  - [x] Import `FolderOpen` icon from `@mui/icons-material`
  - [x] Import `useSearchParam` from `#/shared/hooks`
  - [x] Add IconButton for ProjectBrowser (before user menu)
  - [x] Add click handler to update URL query parameter (`browser=true`)
  - [x] Add tooltip with i18n text (using existing `PROJECT_BROWSER` key)
  - [x] Add `aria-label` for accessibility
  - [x] Style button consistently with header design
- [x] Add i18n translation keys
  - [x] Verified `PROJECT_BROWSER` already exists in `src/i18n/en/index.ts` (no new key needed)
  - [x] Existing translations cover all locales (ru, de, es, sr, uk)
  - [ ] Run `pnpm typesafe-i18n` (user must run manually, it's a watcher) - Not needed since no new keys
- [ ] Test keyboard navigation
  - [ ] Tab to button
  - [ ] Enter/Space activates button
  - [ ] Focus management

## Phase 4: Testing & Edge Cases (Difficulty: 4/10)

- [ ] Integration tests
  - [ ] Test URL sharing flow (apply filters → copy URL → open in new tab)
  - [ ] Test browser open/close from header
  - [ ] Test filter state persistence across navigation
  - [ ] Test backward compatibility with ProjectPanel
- [ ] Manual testing checklist
  - [ ] Open browser from header button (all pages)
  - [ ] Close browser via close button
  - [ ] Close browser via backdrop click
  - [ ] Apply filters and copy URL
  - [ ] Open copied URL in new tab
  - [ ] Verify filters restored correctly
  - [ ] Test on mobile devices
  - [ ] Test keyboard navigation
  - [ ] Test with invalid URL params
  - [ ] Test with missing URL params
  - [ ] Test rapid filter changes (debouncing)
  - [ ] Test browser state with browser back/forward buttons

## Phase 5: Documentation & Polish (Difficulty: 2/10)

- [x] Update component documentation
  - [x] Added helper function comments (parseCategories, serializeCategories, etc.)
  - [x] Documented URL query parameter format in code
  - [x] URL examples documented in design doc
- [x] Code review and cleanup
  - [x] Removed unused imports (`projectBrowserSlice` from ProjectPanel)
  - [x] Verified TypeScript types are correct
  - [x] Ran linter - no errors found
  - [ ] Verify no console errors/warnings (manual testing needed)

## Testing Coverage Goals

- [ ] Unit tests: >80% coverage for URL sync hook
- [ ] Integration tests: URL sharing flow, state persistence
- [ ] Manual testing: All edge cases covered

## Notes

- **URL Query Parameter Format:**
  - `browser` - boolean (true/false or 1/0) - controls drawer open/close
  - `search` - string - search query (URL-encoded)
  - `categories` - comma-separated array (e.g., `ARRAY,HEAP,STACK`)
  - `difficulties` - comma-separated array (e.g., `EASY,MEDIUM`)
  - `new` - boolean - showOnlyNew flag
  - `sortBy` - string - sort field (`title`, `difficulty`, `date`, `category`)
  - `sortOrder` - string - sort order (`asc`, `desc`)

- **Debouncing:** Not needed - `useSearchParam` hook handles updates efficiently with shallow routing

- **Shallow Routing:** `useSearchParam` hook automatically uses shallow routing via `router.push({ query }, undefined, { shallow: true })`

- **Backward Compatibility:** Keep Redux API unchanged, URL sync is additive

- **i18n:** No new translation keys needed - `PROJECT_BROWSER` already exists and is used for the tooltip

## Implementation Status

✅ **Completed:**

- Phase 1: URL Synchronization (all implementation tasks)
  - ✅ Refactored to use Context + URL pattern (single source of truth)
  - ✅ Combined sortBy and sortOrder into single `sort` parameter (e.g., "titleAsc")
  - ✅ Optimized category/difficulty parsing with O(1) lookups using categoryLabels/difficultyLabels
  - ✅ Comprehensive unit tests for all helper functions (52 tests passing)
- Phase 2: Global Component Placement (all implementation tasks)
- Phase 3: Header Button Integration (all implementation tasks)
- Phase 5: Documentation & Polish
  - ✅ Added comprehensive JSDoc comments to all functions and types
  - ✅ Code cleanup and optimization
  - ✅ Type safety improvements

⏳ **Pending:**

- Phase 4: Testing & Edge Cases (manual and integration testing)
  - ✅ Unit tests completed (52 tests, all passing)
  - ⏳ Manual testing checklist
  - ⏳ Integration testing of URL sharing flow

**Next Steps:**

1. Manual testing of all features (open browser, apply filters, share URLs)
2. Integration testing of URL sharing flow
3. Verify browser back/forward button behavior with URL state
