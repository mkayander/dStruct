# ProjectBrowser Design Document

## Executive Summary

This document outlines the design and implementation plan for a comprehensive ProjectBrowser component to replace the current `ProjectSelect` dropdown. The new browser will provide advanced filtering, searching, sorting, and pagination capabilities similar to LeetCode's problem browser, optimized for handling large datasets efficiently.

**Overall Implementation Difficulty: 6/10** (Medium-Hard)

**Estimated Total Effort:** 16-21 days (including testing)

**Key Challenges:**

- Server-side pagination and filtering (7/10)
- Performance optimization with virtualization (7/10)
- Complex state management with filters and sorting (6/10)
- Comprehensive unit testing with mock data (5/10)

## Current State Analysis

### Existing Implementation (`ProjectSelect.tsx`)

**Limitations:**

- Simple dropdown select component
- All projects loaded at once via `api.project.allBrief.useQuery()`
- Client-side search only (filters by title)
- No pagination or virtualization
- Slow initial render with many projects
- Search feature is flawed (only searches title, no debouncing visible to user)
- Categories shown as ListSubheaders within dropdown
- No advanced filtering (difficulty, category, author)
- No sorting options

**Data Structure:**

```typescript
type ProjectBrief = {
  id: string;
  createdAt: Date;
  slug: string;
  title: string;
  category: ProjectCategory;
  difficulty: ProjectDifficulty | null;
  author: {
    id: string;
    name: string;
    bucketImage: string | null;
  } | null;
};
```

**Available Categories:**

- BINARY_TREE, LINKED_LIST, ARRAY, HEAP, STACK
- TWO_POINTERS, SLIDING_WINDOW, BINARY_SEARCH
- BACKTRACKING, BST, GRAPH, GRID
- DYNAMIC_PROGRAMMING, TRIE, BIT_MANIPULATION, MATH

**Available Difficulties:**

- EASY, MEDIUM, HARD

## Requirements

### Functional Requirements

1. **Location & Entry Point**
   - Opens in the left-side panel (replacing or complementing ProjectSelect)
   - Clear, intuitive entry point (button/icon in ProjectPanel)
   - Should be accessible from the playground page

2. **UI Framework**
   - Use Material-UI (MUI) components consistently
   - Follow existing design patterns (PanelWrapper, StyledTabPanel, etc.)
   - Match the application's theme and color scheme

3. **Core Features (LeetCode-like)**
   - **Search**: Full-text search across project titles and descriptions
   - **Filters**:
     - Category filter (multi-select chips or checkboxes)
     - Difficulty filter (Easy/Medium/Hard)
     - Author filter (optional, for user's own projects)
     - Status filter (New/Recent projects)
   - **Sorting**:
     - By title (A-Z, Z-A)
     - By difficulty (Easy → Hard, Hard → Easy)
     - By date created (Newest first, Oldest first)
     - By category (alphabetical)
   - **View Options**:
     - List view (default)
     - Compact view (optional, for future)

4. **Performance Requirements**
   - Handle large datasets (1000+ projects) efficiently
   - Implement server-side pagination with infinite scroll
   - Use list virtualization (react-virtuoso)
   - Debounced search input (200ms delay)
   - Optimistic UI updates where appropriate

5. **UX/UI Best Practices**
   - Loading states (skeletons/spinners)
   - Empty states with helpful messages
   - Error states with retry options
   - Smooth scrolling and transitions
   - Keyboard navigation support
   - Clear visual hierarchy
   - Responsive design (mobile-friendly)

6. **Internationalization (I18n)**
   - All text strings translatable via typesafe-i18n
   - Support for: en, ru, de, es, sr, uk
   - Category and difficulty labels already translated

7. **Accessibility (A11y)**
   - ARIA labels and roles
   - Keyboard navigation (Tab, Enter, Arrow keys, Escape)
   - Screen reader support
   - Focus management
   - High contrast support
   - Semantic HTML

## Architecture Design

### Component Structure

```
src/features/project/
├── ui/
│   ├── ProjectBrowser/
│   │   ├── ProjectBrowser.tsx          # Main container component
│   │   ├── ProjectBrowserHeader.tsx    # Search, filters, sort controls
│   │   ├── ProjectBrowserFilters.tsx   # Filter chips/checkboxes
│   │   ├── ProjectBrowserList.tsx      # Virtualized list container
│   │   ├── ProjectBrowserItem.tsx     # Individual project item
│   │   └── ProjectBrowserEmpty.tsx     # Empty state component
│   ├── ProjectSelect.tsx               # Keep for backward compatibility
│   └── ProjectPanel.tsx                # Update to include browser entry point
├── model/
│   └── projectBrowserSlice.ts          # Redux slice for browser state
└── hooks/
    ├── useProjectBrowser.ts            # Main hook for browser logic
    ├── useProjectFilters.ts            # Filter management hook
    └── useProjectPagination.ts         # Pagination hook
```

### Component Hierarchy Diagram

```mermaid
graph TD
    A[ProjectPanel] --> B[ProjectBrowser]
    B --> C[ProjectBrowserHeader]
    B --> D[ProjectBrowserList]
    B --> E[ProjectBrowserEmpty]

    C --> F[SearchInput]
    C --> G[ProjectBrowserFilters]
    C --> H[SortDropdown]

    G --> I[CategoryFilter]
    G --> J[DifficultyFilter]
    G --> K[OtherFilters]

    D --> L[Virtuoso]
    L --> M[ProjectBrowserItem]
    M --> N[ProjectTitle]
    M --> O[DifficultyBadge]
    M --> P[CategoryLabel]
    M --> Q[AuthorAvatar]

    B -.-> R[projectBrowserSlice]
    B -.-> S[useProjectBrowser]
    S -.-> T[useProjectFilters]
    S -.-> U[useProjectPagination]
    S -.-> V[api.project.browseProjects]
```

### State Management

**Redux Slice (`projectBrowserSlice.ts`):**

```typescript
type ProjectBrowserState = {
  // Filters
  searchQuery: string;
  selectedCategories: ProjectCategory[];
  selectedDifficulties: ProjectDifficulty[];
  showOnlyNew: boolean;
  showOnlyMine: boolean;

  // Sorting
  sortBy: "title" | "difficulty" | "date" | "category";
  sortOrder: "asc" | "desc";

  // UI State
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;

  // Pagination
  currentPage: number;
  pageSize: number;
  hasMore: boolean;
};
```

**URL State Management:**

- Use `useSearchParam` hook for persistent filter/sort state
- Enables shareable URLs with filters applied
- Syncs with Redux state

### API Design

**New tRPC Endpoint:**

```typescript
// src/server/api/routers/project.ts

browseProjects: publicProcedure
  .input(
    z.object({
      // Pagination
      page: z.number().min(1).default(1),
      pageSize: z.number().min(1).max(100).default(20),

      // Search
      search: z.string().optional(),

      // Filters
      categories: z.array(z.nativeEnum(ProjectCategory)).optional(),
      difficulties: z.array(z.nativeEnum(ProjectDifficulty)).optional(),
      showOnlyNew: z.boolean().optional(),
      showOnlyMine: z.boolean().optional(),

      // Sorting
      sortBy: z
        .enum(["title", "difficulty", "createdAt", "category"])
        .default("category"),
      sortOrder: z.enum(["asc", "desc"]).default("asc"),
    }),
  )
  .query(async ({ ctx, input }) => {
    // Implementation with Prisma
    // Returns: { projects: ProjectBrief[], total: number, hasMore: boolean }
  });
```

**Implementation Difficulty: 7/10**

**Bundle Impact:** No new dependencies (uses existing tRPC)

**Pros:**

- Type-safe API calls
- Server-side filtering reduces client load
- Efficient database queries
- Built-in caching with tRPC

**Cons:**

- Requires database schema updates for indexes
- More complex than client-side filtering

**Benefits:**

- Server-side filtering reduces data transfer
- Efficient database queries with indexes
- Supports pagination natively
- Can add full-text search later

### Virtualization Strategy

**Using react-virtuoso:**

- Already installed in project (`react-virtuoso@^4.14.0`)
- Use `Virtuoso` component for vertical list
- Estimated item height: 72px (compact) or 96px (detailed)
- Implement infinite scroll with `endReached` callback
- Load next page when user scrolls near bottom

**Implementation Difficulty: 6/10**

**Bundle Impact:** Already included (~45KB gzipped), no additional cost

**Example Structure:**

```typescript
<Virtuoso
  data={projects}
  totalCount={total}
  endReached={() => loadNextPage()}
  itemContent={(index, project) => (
    <ProjectBrowserItem project={project} />
  )}
  components={{
    Header: ProjectBrowserHeader,
    EmptyPlaceholder: ProjectBrowserEmpty,
  }}
/>
```

## UI/UX Design

### Layout Structure

```
┌─────────────────────────────────────────┐
│  ProjectBrowser                         │
│  ┌───────────────────────────────────┐  │
│  │ Header:                           │  │
│  │  - Search Input (full width)      │  │
│  │  - Filter Chips Row               │  │
│  │  - Sort Dropdown                  │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │ Virtualized List:                  │  │
│  │  ┌─────────────────────────────┐   │  │
│  │  │ Project Item 1              │   │  │
│  │  │ [Title] [Difficulty] [New]  │   │  │
│  │  └─────────────────────────────┘   │  │
│  │  ┌─────────────────────────────┐   │  │
│  │  │ Project Item 2              │   │  │
│  │  └─────────────────────────────┘   │  │
│  │  ... (virtualized)                │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │ Footer:                            │  │
│  │  - Loading indicator (if loading)  │  │
│  │  - "Load More" button (optional)   │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### Project Item Design

**Compact View (Default):**

```
┌──────────────────────────────────────────────┐
│ Title                    [Easy] [New] [👤]  │
│ Category: Array                              │
└──────────────────────────────────────────────┘
```

**Detailed View (Hover/Selected):**

```
┌──────────────────────────────────────────────┐
│ Title                    [Easy] [New] [👤]  │
│ Category: Array                             │
│ Created: 2 days ago                         │
│ Author: John Doe                            │
└──────────────────────────────────────────────┘
```

### Filter UI

**Category Filter:**

- Multi-select chip group
- "Select All" / "Clear All" buttons
- Visual count badges

**Difficulty Filter:**

- Toggle buttons (Easy/Medium/Hard)
- Color-coded (green/yellow/red)

**Other Filters:**

- Checkboxes for "Show only new projects"
- Checkbox for "Show only my projects" (if authenticated)

### Search UI

- Full-width search input at top
- Debounced (200ms)
- Clear button (X icon)
- Search icon prefix
- Placeholder: "Search projects by title..."

### Sort UI

- Dropdown select
- Options:
  - "Title (A-Z)"
  - "Title (Z-A)"
  - "Difficulty (Easy → Hard)"
  - "Difficulty (Hard → Easy)"
  - "Date (Newest First)"
  - "Date (Oldest First)"
  - "Category (A-Z)"

## Implementation Phases

### Phase 1: Foundation (Week 1) - **Difficulty: 4/10**

1. Create component structure - **Difficulty: 2/10**
2. Set up Redux slice - **Difficulty: 3/10**
3. Create basic UI layout - **Difficulty: 3/10**
4. Implement search input - **Difficulty: 4/10**
5. Basic project list (no virtualization yet) - **Difficulty: 3/10**

**Total Estimated Effort:** 2-3 days

### Phase 2: Filtering & Sorting (Week 1-2) - **Difficulty: 6/10**

1. Implement filter UI components - **Difficulty: 5/10**
2. Add filter logic to Redux - **Difficulty: 4/10**
3. Implement sorting UI and logic - **Difficulty: 5/10**
4. Connect filters to API endpoint - **Difficulty: 6/10**
5. Update API endpoint with filtering - **Difficulty: 7/10**

**Total Estimated Effort:** 4-5 days

### Phase 3: Performance Optimization (Week 2) - **Difficulty: 7/10**

1. Implement server-side pagination API - **Difficulty: 7/10**
2. Add react-virtuoso virtualization - **Difficulty: 6/10**
3. Implement infinite scroll - **Difficulty: 6/10**
4. Add loading states - **Difficulty: 3/10**
5. Optimize re-renders - **Difficulty: 7/10**

**Total Estimated Effort:** 3-4 days

### Phase 4: Polish & Integration (Week 2-3) - **Difficulty: 5/10**

1. Add empty states - **Difficulty: 3/10**
2. Add error handling - **Difficulty: 4/10**
3. Implement keyboard navigation - **Difficulty: 6/10**
4. Add I18n translations - **Difficulty: 4/10**
5. Accessibility improvements - **Difficulty: 6/10**
6. Integration with ProjectPanel - **Difficulty: 5/10**

**Total Estimated Effort:** 4-5 days

### Phase 5: Testing (Week 3) - **Difficulty: 5/10**

1. Set up mock data generators - **Difficulty: 3/10**
2. Write unit tests for business logic - **Difficulty: 3/10**
3. Write unit tests for Redux slice - **Difficulty: 4/10**
4. Write unit tests for components - **Difficulty: 4/10**
5. Write unit tests for custom hooks - **Difficulty: 5/10**
6. Write unit tests for API endpoint - **Difficulty: 6/10**
7. Write integration tests - **Difficulty: 5/10**
8. Achieve coverage goals - **Difficulty: 4/10**

**Total Estimated Effort:** 3-4 days

**Note:** Testing should be done incrementally alongside implementation, not only at the end

### Phase 6: Advanced Features (Future) - **Difficulty: 8/10**

1. Save filter presets - **Difficulty: 7/10**
2. Recent searches - **Difficulty: 6/10**
3. Project favorites/bookmarks - **Difficulty: 8/10**
4. Advanced search (description, tags) - **Difficulty: 8/10**
5. Export filtered results - **Difficulty: 5/10**

**Total Estimated Effort:** TBD (Future enhancement)

## Technical Considerations

### Performance Optimizations

1. **Debouncing:**
   - Search input: 200ms debounce
   - Filter changes: 300ms debounce (if needed)

2. **Memoization:**
   - Memoize filtered/sorted project lists
   - Memoize project item components
   - Use React.memo for expensive components

3. **Virtualization:**
   - Only render visible items
   - Estimate item heights accurately
   - Use overscan for smooth scrolling

4. **API Optimization:**
   - Database indexes on: title, category, difficulty, createdAt
   - Limit initial page size (20 items)
   - Use cursor-based pagination if needed

### Accessibility Features

1. **Keyboard Navigation:**
   - Tab: Navigate between controls
   - Enter: Select project
   - Arrow Up/Down: Navigate list
   - Escape: Close browser
   - Ctrl/Cmd + F: Focus search

2. **ARIA Labels:**
   - `aria-label` for all interactive elements
   - `aria-expanded` for filters
   - `aria-live` for loading states
   - `role="list"` for project list
   - `role="listitem"` for each project

3. **Screen Reader Support:**
   - Announce filter changes
   - Announce search results count
   - Announce loading states
   - Descriptive alt text for avatars

### Error Handling

1. **Network Errors:**
   - Show error message
   - Provide retry button
   - Fallback to cached data if available

2. **Empty States:**
   - No projects found: "No projects match your filters"
   - No search results: "No projects found for '{query}'"
   - Empty database: "No projects available"

3. **Loading States:**
   - Skeleton loaders for list items
   - Loading spinner for initial load
   - Subtle loading indicator for pagination

## I18n Translation Keys

New keys needed:

```typescript
PROJECT_BROWSER: "Project Browser";
SEARCH_PROJECTS: "Search projects by title...";
FILTER_BY_CATEGORY: "Filter by category";
FILTER_BY_DIFFICULTY: "Filter by difficulty";
SHOW_ONLY_NEW: "Show only new projects";
SHOW_ONLY_MINE: "Show only my projects";
SORT_BY: "Sort by";
SORT_TITLE_ASC: "Title (A-Z)";
SORT_TITLE_DESC: "Title (Z-A)";
SORT_DIFFICULTY_ASC: "Difficulty (Easy → Hard)";
SORT_DIFFICULTY_DESC: "Difficulty (Hard → Easy)";
SORT_DATE_ASC: "Date (Newest First)";
SORT_DATE_DESC: "Date (Oldest First)";
SORT_CATEGORY_ASC: "Category (A-Z)";
NO_PROJECTS_FOUND: "No projects found";
NO_PROJECTS_MATCH_FILTERS: "No projects match your filters";
LOADING_PROJECTS: "Loading projects...";
LOAD_MORE: "Load more";
CLEAR_FILTERS: "Clear all filters";
SELECT_ALL_CATEGORIES: "Select all categories";
```

## Testing Strategy

### Unit Tests (Essential Coverage)

**Priority: High** - Write unit tests immediately after implementation

#### Business Logic Tests

- **Filter logic** - **Difficulty: 3/10**
  - Test category filtering
  - Test difficulty filtering
  - Test combined filters
  - Test "show only new" filter
  - Test "show only mine" filter
  - **Mock Data:** Generate mock projects with various categories/difficulties

- **Sort logic** - **Difficulty: 3/10**
  - Test sorting by title (asc/desc)
  - Test sorting by difficulty (asc/desc)
  - Test sorting by date (asc/desc)
  - Test sorting by category
  - **Mock Data:** Projects with varied titles, difficulties, dates

- **Search logic** - **Difficulty: 2/10**
  - Test title matching (case-insensitive)
  - Test partial matches
  - Test empty search
  - Test special characters
  - **Mock Data:** Projects with varied titles

#### Redux Slice Tests

- **projectBrowserSlice reducers** - **Difficulty: 4/10**
  - Test all action creators
  - Test state updates
  - Test filter state management
  - Test pagination state
  - **Mock Data:** Initial state, action payloads

#### Component Tests

- **ProjectBrowserItem** - **Difficulty: 4/10**
  - Test rendering with different project data
  - Test click handler
  - Test selected state styling
  - Test difficulty badge display
  - Test author avatar display
  - **Mock Data:** Mock project objects

- **ProjectBrowserFilters** - **Difficulty: 5/10**
  - Test category selection
  - Test difficulty toggles
  - Test "clear all" functionality
  - Test filter state updates
  - **Mock Data:** Mock filter state, category/difficulty arrays

- **Search Input** - **Difficulty: 3/10**
  - Test debouncing (200ms)
  - Test clear button
  - Test input changes
  - **Mock Data:** Mock search queries

#### Custom Hooks Tests

- **useProjectBrowser** - **Difficulty: 5/10**
  - Test data fetching
  - Test filter application
  - Test pagination
  - Test error handling
  - **Mock Data:** Mock tRPC query responses

- **useProjectFilters** - **Difficulty: 4/10**
  - Test filter state management
  - Test filter combinations
  - Test filter reset
  - **Mock Data:** Mock filter state

- **useProjectPagination** - **Difficulty: 4/10**
  - Test page navigation
  - Test infinite scroll trigger
  - Test hasMore logic
  - **Mock Data:** Mock pagination responses

#### API Endpoint Tests

- **browseProjects procedure** - **Difficulty: 6/10**
  - Test with various filter combinations
  - Test pagination
  - Test sorting
  - Test search query
  - Test error cases
  - **Mock Data:** Mock Prisma queries, mock database results

### Mock Data Structure

```typescript
// Mock project generator
const createMockProject = (
  overrides?: Partial<ProjectBrief>,
): ProjectBrief => ({
  id: faker.string.uuid(),
  createdAt: faker.date.recent(),
  slug: faker.lorem.slug(),
  title: faker.lorem.words(3),
  category: faker.helpers.arrayElement(Object.values(ProjectCategory)),
  difficulty: faker.helpers.arrayElement([
    ...Object.values(ProjectDifficulty),
    null,
  ]),
  author: {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    bucketImage: faker.image.avatar(),
  },
  ...overrides,
});

// Mock projects array generator
const createMockProjects = (
  count: number,
  overrides?: Partial<ProjectBrief>[],
): ProjectBrief[] =>
  Array.from({ length: count }, (_, i) => createMockProject(overrides?.[i]));

// Mock API response
const createMockBrowseResponse = (
  projects: ProjectBrief[],
  hasMore: boolean,
) => ({
  projects,
  total: projects.length,
  hasMore,
});
```

### Integration Tests

- **API endpoint with various filters** - **Difficulty: 5/10**
- **Pagination flow** - **Difficulty: 5/10**
- **Filter combinations** - **Difficulty: 5/10**
- **Search + Filter + Sort integration** - **Difficulty: 6/10**

### E2E Tests (Optional - Lower Priority)

- Open browser
- Search for project
- Apply filters
- Sort projects
- Select project
- Keyboard navigation

### Performance Tests

- Render time with 1000+ projects
- Scroll performance
- Search debounce timing
- API response times

### Test Coverage Goals

- **Unit Tests:** 80%+ coverage for business logic
- **Component Tests:** 70%+ coverage for complex components
- **Integration Tests:** Critical user flows
- **Focus Areas:**
  - Filter logic (100% coverage)
  - Sort logic (100% coverage)
  - Redux reducers (100% coverage)
  - API error handling (100% coverage)

## Migration Strategy

1. **Backward Compatibility:**
   - Keep `ProjectSelect` component
   - Add toggle between Select and Browser
   - Default to Browser, allow fallback to Select

2. **Gradual Rollout:**
   - Feature flag for browser
   - A/B testing (optional)
   - Collect user feedback

3. **Deprecation:**
   - After browser is stable, deprecate Select
   - Remove Select after migration period

## Success Metrics

1. **Performance:**
   - Initial render < 200ms
   - Search response < 100ms
   - Smooth scrolling (60fps)

2. **User Experience:**
   - Reduced time to find project
   - Increased project discovery
   - Positive user feedback

3. **Technical:**
   - Zero memory leaks
   - Proper error handling
   - Full test coverage

## Open Questions

1. Should we support saved filter presets?
2. Do we need project favorites/bookmarks?
3. Should search include project descriptions?
4. Do we need advanced search (tags, multiple criteria)?
5. Should we show project statistics (views, likes)?

## References

- [LeetCode Problems Page](https://leetcode.com/problemset/)
- [react-virtuoso Documentation](https://virtuoso.dev/)
- [MUI Data Grid Patterns](https://mui.com/x/react-data-grid/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## Appendix

### Database Indexes Needed

```sql
-- For search
CREATE INDEX idx_project_title ON PlaygroundProject(title);

-- For filtering
CREATE INDEX idx_project_category ON PlaygroundProject(category);
CREATE INDEX idx_project_difficulty ON PlaygroundProject(difficulty);
CREATE INDEX idx_project_created ON PlaygroundProject(createdAt);

-- Composite for common queries
CREATE INDEX idx_project_category_difficulty ON PlaygroundProject(category, difficulty);
```

**Implementation Difficulty: 2/10** (Database migration)

**Impact:** Improves query performance significantly, minimal code changes required

### Data Flow Diagram

```mermaid
sequenceDiagram
    participant U as User
    participant PB as ProjectBrowser
    participant RS as Redux Store
    participant API as tRPC API
    participant DB as Database

    U->>PB: Type in search
    PB->>RS: Update searchQuery
    RS->>PB: Trigger debounce (200ms)
    PB->>API: browseProjects(query, filters, sort, page)
    API->>DB: Execute filtered query
    DB-->>API: Return paginated results
    API-->>PB: { projects, total, hasMore }
    PB->>RS: Update projects list
    RS->>PB: Re-render virtualized list
    PB-->>U: Display filtered results

    U->>PB: Scroll to bottom
    PB->>API: Load next page
    API->>DB: Fetch next page
    DB-->>API: Return next page
    API-->>PB: Append to list
    PB-->>U: Show more projects
```

### Component Props Interfaces

```typescript
interface ProjectBrowserProps {
  onSelectProject?: (projectSlug: string) => void;
  initialFilters?: Partial<ProjectBrowserState>;
}

interface ProjectBrowserItemProps {
  project: ProjectBrief;
  isSelected: boolean;
  onClick: () => void;
}

interface ProjectBrowserFiltersProps {
  categories: ProjectCategory[];
  difficulties: ProjectDifficulty[];
  selectedCategories: ProjectCategory[];
  selectedDifficulties: ProjectDifficulty[];
  onCategoryChange: (categories: ProjectCategory[]) => void;
  onDifficultyChange: (difficulties: ProjectDifficulty[]) => void;
}
```
