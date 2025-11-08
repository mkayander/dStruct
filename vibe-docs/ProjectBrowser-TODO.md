# ProjectBrowser Implementation TODO List

## Phase 1: Foundation & Setup

### 1.1 Project Structure Setup

- [ ] Create `src/features/project/ui/ProjectBrowser/` directory
- [ ] Create component files:
  - [ ] `ProjectBrowser.tsx` (main container)
  - [ ] `ProjectBrowserHeader.tsx` (search, filters, sort controls)
  - [ ] `ProjectBrowserFilters.tsx` (filter UI components)
  - [ ] `ProjectBrowserList.tsx` (virtualized list container)
  - [ ] `ProjectBrowserItem.tsx` (individual project item)
  - [ ] `ProjectBrowserEmpty.tsx` (empty state)
- [ ] Create `src/features/project/model/projectBrowserSlice.ts`
- [ ] Create `src/features/project/hooks/` directory
- [ ] Create hook files:
  - [ ] `useProjectBrowser.ts`
  - [ ] `useProjectFilters.ts`
  - [ ] `useProjectPagination.ts`

### 1.2 Redux State Management

- [ ] Define `ProjectBrowserState` type
- [ ] Create `projectBrowserSlice` with initial state
- [ ] Add reducers:
  - [ ] `setSearchQuery`
  - [ ] `setSelectedCategories`
  - [ ] `setSelectedDifficulties`
  - [ ] `setSortBy`
  - [ ] `setSortOrder`
  - [ ] `setIsOpen`
  - [ ] `setIsLoading`
  - [ ] `setError`
  - [ ] `setCurrentPage`
  - [ ] `setHasMore`
  - [ ] `resetFilters`
- [ ] Add selectors:
  - [ ] `selectSearchQuery`
  - [ ] `selectFilters`
  - [ ] `selectSortOptions`
  - [ ] `selectBrowserState`
- [ ] Register slice in store

### 1.3 Basic UI Layout

- [ ] Create `ProjectBrowser` container component
- [ ] Implement basic layout structure:
  - [ ] Header section
  - [ ] List section
  - [ ] Footer section
- [ ] Wrap with `PanelWrapper`
- [ ] Add basic styling with MUI
- [ ] Implement open/close state management

### 1.4 Search Input

- [ ] Integrate `SearchInput` component
- [ ] Connect to Redux state (`setSearchQuery`)
- [ ] Implement debouncing (200ms)
- [ ] Add search icon and clear button
- [ ] Add placeholder text with I18n
- [ ] Handle search input events

### 1.5 Basic Project List (No Virtualization)

- [ ] Create `ProjectBrowserList` component
- [ ] Fetch projects using `api.project.allBrief.useQuery()`
- [ ] Display projects in simple list
- [ ] Create `ProjectBrowserItem` component
- [ ] Show project title, category, difficulty
- [ ] Add click handler to select project
- [ ] Style project items

## Phase 2: Filtering & Sorting

### 2.1 Filter UI Components

- [ ] Create `ProjectBrowserFilters` component
- [ ] Implement category filter:
  - [ ] Multi-select chip group
  - [ ] Use `categoryLabels` for display
  - [ ] "Select All" / "Clear All" buttons
  - [ ] Visual count badges
- [ ] Implement difficulty filter:
  - [ ] Toggle buttons (Easy/Medium/Hard)
  - [ ] Color-coded badges
  - [ ] Use `difficultyLabels` and `getDifficultyColor`
- [ ] Add "Show only new" checkbox
- [ ] Add "Show only mine" checkbox (if authenticated)
- [ ] Add "Clear all filters" button
- [ ] Style filters section

### 2.2 Filter Logic

- [ ] Create `useProjectFilters` hook
- [ ] Implement client-side filtering logic:
  - [ ] Filter by search query (title)
  - [ ] Filter by selected categories
  - [ ] Filter by selected difficulties
  - [ ] Filter by "new" projects (using `newProjectMarginMs`)
  - [ ] Filter by user's projects
- [ ] Memoize filtered results
- [ ] Connect filters to Redux state

### 2.3 Sort UI

- [ ] Add sort dropdown in header
- [ ] Create sort options:
  - [ ] Title (A-Z, Z-A)
  - [ ] Difficulty (Easy → Hard, Hard → Easy)
  - [ ] Date (Newest First, Oldest First)
  - [ ] Category (A-Z)
- [ ] Use MUI `Select` or `Menu` component
- [ ] Add I18n labels for sort options
- [ ] Style sort dropdown

### 2.4 Sort Logic

- [ ] Implement sorting functions:
  - [ ] Sort by title (alphabetical)
  - [ ] Sort by difficulty (enum order)
  - [ ] Sort by date (createdAt)
  - [ ] Sort by category (alphabetical)
- [ ] Handle ascending/descending order
- [ ] Memoize sorted results
- [ ] Connect to Redux state

### 2.5 API Endpoint Updates

- [ ] Update `projectRouter` in `src/server/api/routers/project.ts`
- [ ] Create `browseProjects` procedure:
  - [ ] Add input schema with filters, sort, pagination
  - [ ] Implement Prisma query with filters
  - [ ] Implement sorting logic
  - [ ] Implement pagination
  - [ ] Return `{ projects, total, hasMore }`
- [ ] Add database indexes (if needed):
  - [ ] Index on `title` for search
  - [ ] Index on `category`
  - [ ] Index on `difficulty`
  - [ ] Index on `createdAt`
- [ ] Test API endpoint with various filters

### 2.6 Connect Filters to API

- [ ] Update `useProjectBrowser` hook to use new API
- [ ] Replace client-side filtering with server-side
- [ ] Pass filter state to API query
- [ ] Handle loading states
- [ ] Handle error states

## Phase 3: Performance Optimization

### 3.1 Server-Side Pagination

- [ ] Implement pagination in API endpoint
- [ ] Add `page` and `pageSize` parameters
- [ ] Calculate `hasMore` flag
- [ ] Return paginated results
- [ ] Test with large datasets

### 3.2 List Virtualization

- [ ] Install/verify `react-virtuoso` dependency
- [ ] Replace simple list with `Virtuoso` component
- [ ] Configure `Virtuoso`:
  - [ ] Set item height (72px or 96px)
  - [ ] Configure `endReached` callback
  - [ ] Set `overscan` for smooth scrolling
- [ ] Test virtualization performance

### 3.3 Infinite Scroll

- [ ] Implement `endReached` handler
- [ ] Load next page when scrolling near bottom
- [ ] Update Redux state with new projects
- [ ] Append new projects to list
- [ ] Handle "no more" state
- [ ] Add loading indicator at bottom

### 3.4 Loading States

- [ ] Add loading skeleton component
- [ ] Show skeleton during initial load
- [ ] Show loading indicator during pagination
- [ ] Use MUI `Skeleton` component
- [ ] Match skeleton to project item layout

### 3.5 Performance Optimizations

- [ ] Memoize `ProjectBrowserItem` with `React.memo`
- [ ] Memoize filtered/sorted lists
- [ ] Use `useMemo` for expensive computations
- [ ] Use `useCallback` for event handlers
- [ ] Optimize re-renders
- [ ] Profile performance with React DevTools

## Phase 4: Polish & Integration

### 4.1 Empty States

- [ ] Create `ProjectBrowserEmpty` component
- [ ] Handle "no projects" state
- [ ] Handle "no search results" state
- [ ] Handle "no filter matches" state
- [ ] Add helpful messages
- [ ] Add "Clear filters" action
- [ ] Style empty states

### 4.2 Error Handling

- [ ] Add error state to Redux
- [ ] Display error messages
- [ ] Add retry button
- [ ] Handle network errors gracefully
- [ ] Handle API errors
- [ ] Log errors appropriately

### 4.3 Keyboard Navigation

- [ ] Implement Tab navigation
- [ ] Implement Arrow key navigation in list
- [ ] Implement Enter to select project
- [ ] Implement Escape to close browser
- [ ] Implement Ctrl/Cmd + F to focus search
- [ ] Add focus management
- [ ] Test with keyboard only

### 4.4 I18n Translations

- [ ] Add translation keys to `src/i18n/en/index.ts`:
  - [ ] `PROJECT_BROWSER`
  - [ ] `SEARCH_PROJECTS`
  - [ ] `FILTER_BY_CATEGORY`
  - [ ] `FILTER_BY_DIFFICULTY`
  - [ ] `SHOW_ONLY_NEW`
  - [ ] `SHOW_ONLY_MINE`
  - [ ] `SORT_BY`
  - [ ] `SORT_TITLE_ASC`, `SORT_TITLE_DESC`
  - [ ] `SORT_DIFFICULTY_ASC`, `SORT_DIFFICULTY_DESC`
  - [ ] `SORT_DATE_ASC`, `SORT_DATE_DESC`
  - [ ] `SORT_CATEGORY_ASC`
  - [ ] `NO_PROJECTS_FOUND`
  - [ ] `NO_PROJECTS_MATCH_FILTERS`
  - [ ] `LOADING_PROJECTS`
  - [ ] `LOAD_MORE`
  - [ ] `CLEAR_FILTERS`
  - [ ] `SELECT_ALL_CATEGORIES`
- [ ] Translate to all supported locales (ru, de, es, sr, uk)
- [ ] Update `i18n-types.ts` (auto-generated)
- [ ] Use translations in components

### 4.5 Accessibility Improvements

- [ ] Add ARIA labels to all interactive elements
- [ ] Add `aria-expanded` to filters
- [ ] Add `aria-live` for loading states
- [ ] Add `role="list"` and `role="listitem"`
- [ ] Add descriptive alt text for avatars
- [ ] Test with screen reader
- [ ] Ensure keyboard navigation works
- [ ] Check color contrast ratios
- [ ] Add focus indicators

### 4.6 Integration with ProjectPanel

- [ ] Add browser entry point to `ProjectPanel.tsx`
- [ ] Add button/icon to open browser
- [ ] Handle project selection from browser
- [ ] Update `usePlaygroundSlugs` integration
- [ ] Close browser after selection (optional)
- [ ] Keep browser state in URL (optional)
- [ ] Test integration flow

### 4.7 Styling & Theming

- [ ] Ensure consistent styling with app theme
- [ ] Use theme colors for difficulty badges
- [ ] Use theme spacing and typography
- [ ] Add hover states
- [ ] Add selected state styling
- [ ] Ensure dark mode compatibility
- [ ] Test responsive design
- [ ] Polish animations and transitions

## Phase 5: Testing

### 5.1 Unit Tests

- [ ] Test filter logic functions
- [ ] Test sort logic functions
- [ ] Test search logic
- [ ] Test Redux slice reducers
- [ ] Test custom hooks
- [ ] Achieve >80% code coverage

### 5.2 Integration Tests

- [ ] Test API endpoint with various filters
- [ ] Test pagination flow
- [ ] Test filter combinations
- [ ] Test sort combinations
- [ ] Test search + filter + sort together

### 5.3 E2E Tests (Optional)

- [ ] Test opening browser
- [ ] Test searching for project
- [ ] Test applying filters
- [ ] Test sorting projects
- [ ] Test selecting project
- [ ] Test keyboard navigation

### 5.4 Performance Tests

- [ ] Test render time with 1000+ projects
- [ ] Test scroll performance
- [ ] Test search debounce timing
- [ ] Test API response times
- [ ] Test memory usage
- [ ] Profile with React DevTools

## Phase 6: Documentation & Cleanup

### 6.1 Code Documentation

- [ ] Add JSDoc comments to all functions
- [ ] Document component props
- [ ] Document hook return values
- [ ] Add inline comments for complex logic
- [ ] Update README if needed

### 6.2 Code Quality

- [ ] Run ESLint and fix issues
- [ ] Run Prettier formatting
- [ ] Check TypeScript errors
- [ ] Remove unused imports
- [ ] Remove console.logs
- [ ] Optimize imports

### 6.3 Migration & Deprecation

- [ ] Add feature flag for browser (optional)
- [ ] Keep `ProjectSelect` for backward compatibility
- [ ] Add toggle between Select and Browser (optional)
- [ ] Document migration path
- [ ] Plan deprecation timeline

## Future Enhancements (Post-MVP)

### Advanced Features

- [ ] Saved filter presets
- [ ] Recent searches
- [ ] Project favorites/bookmarks
- [ ] Advanced search (description, tags)
- [ ] Export filtered results
- [ ] Project statistics (views, likes)
- [ ] Compact view option
- [ ] Grid view option

### Performance Enhancements

- [ ] Cursor-based pagination
- [ ] Full-text search in database
- [ ] Search result highlighting
- [ ] Optimistic updates
- [ ] Cache management

### UX Enhancements

- [ ] Smooth scroll to selected project
- [ ] Project preview on hover
- [ ] Quick actions menu
- [ ] Bulk operations
- [ ] Drag-and-drop reordering

## Notes

- Use PNPM, not NPM
- Follow TypeScript best practices (no `any`, proper types)
- Follow project architecture patterns (feature-based)
- Use absolute imports with `#/` alias
- Follow existing code style and conventions
- Test on multiple browsers
- Ensure mobile responsiveness
