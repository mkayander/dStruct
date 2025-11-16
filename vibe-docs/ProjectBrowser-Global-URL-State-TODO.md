# ProjectBrowser Global Availability & URL State - TODO List

## Phase 1: URL Synchronization (Difficulty: 4/10)

- [ ] Update `src/features/project/ui/ProjectBrowser/ProjectBrowser.tsx`
  - [ ] Import `useSearchParam` from `#/shared/hooks`
  - [ ] Add `useSearchParam("browser")` hook for open/close state
  - [ ] Add `useSearchParam("search")` hook for search query
  - [ ] Add `useSearchParam("categories")` hook for categories filter
  - [ ] Add `useSearchParam("difficulties")` hook for difficulties filter
  - [ ] Add `useSearchParam("new")` hook for showOnlyNew flag
  - [ ] Add `useSearchParam("sortBy")` hook for sort field
  - [ ] Add `useSearchParam("sortOrder")` hook for sort order
  - [ ] Add `parseCategories` helper function (comma-separated string → array)
  - [ ] Add `serializeCategories` helper function (array → comma-separated string)
  - [ ] Add `parseDifficulties` helper function
  - [ ] Add `serializeDifficulties` helper function
  - [ ] Implement URL → Redux sync effect (on mount and route changes)
  - [ ] Implement Redux → URL sync effect (when Redux state changes)
  - [ ] Handle invalid/missing URL params gracefully (fallback to defaults)
- [ ] Create `src/features/project/ui/ProjectBrowser/__tests__/ProjectBrowser.test.tsx` (if not exists)
  - [ ] Test URL → Redux sync on mount
  - [ ] Test Redux → URL sync on state change
  - [ ] Test array parsing (categories, difficulties)
  - [ ] Test boolean parsing (browser, new)
  - [ ] Test invalid param handling
  - [ ] Test missing param handling (use defaults)

## Phase 2: Global Component Placement (Difficulty: 3/10)

- [ ] Update `src/pages/_app.tsx`
  - [ ] Import `ProjectBrowser` component
  - [ ] Add `<ProjectBrowser />` to render tree (after providers, before Analytics)
  - [ ] Note: URL sync logic is already in ProjectBrowser component itself
- [ ] Update `src/features/project/ui/ProjectPanel.tsx`
  - [ ] Remove local `<ProjectBrowser />` rendering (or keep for backward compat)
  - [ ] Update `handleOpenBrowser` to use URL update instead of Redux only
  - [ ] Test that ProjectPanel still works correctly
- [ ] Verify drawer positioning and z-index work globally
  - [ ] Test on different pages
  - [ ] Test with modals/other overlays
  - [ ] Verify mobile responsiveness

## Phase 3: Header Button Integration (Difficulty: 3/10)

- [ ] Update `src/features/appBar/ui/MainAppBar.tsx`
  - [ ] Import `FolderOpen` icon from `@mui/icons-material`
  - [ ] Import `useRouter` from `next/router`
  - [ ] Add IconButton for ProjectBrowser (before user menu)
  - [ ] Add click handler to update URL query parameter (`browser=true`)
  - [ ] Add tooltip with i18n text
  - [ ] Add `aria-label` for accessibility
  - [ ] Style button consistently with header design
- [ ] Add i18n translation keys
  - [ ] Add `OPEN_PROJECT_BROWSER` to `src/i18n/en/index.ts`
  - [ ] Add translations for other locales (ru, de, es, sr, uk)
  - [ ] Run `pnpm typesafe-i18n` (user must run manually, it's a watcher)
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

- [ ] Update component documentation
  - [ ] Add JSDoc to `useProjectBrowserUrlSync` hook
  - [ ] Document URL query parameter format
  - [ ] Document URL examples in code comments
- [ ] Code review and cleanup
  - [ ] Remove unused imports
  - [ ] Verify TypeScript types are correct
  - [ ] Run linter and fix issues
  - [ ] Verify no console errors/warnings

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

- **Debouncing:** Use 300ms delay for URL updates to prevent excessive router.push calls

- **Shallow Routing:** Always use `router.push({ query }, undefined, { shallow: true })` to avoid full page reloads

- **Backward Compatibility:** Keep Redux API unchanged, URL sync is additive

- **i18n:** Remember to run `pnpm typesafe-i18n` after adding translation keys (it's a watcher, user must run manually)
