import React, {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
} from "react";

import { categoryLabels } from "#/entities/category/model/categoryLabels";
import { difficultyLabels } from "#/entities/difficulty/model/difficultyLabels";
import type {
  ProjectCategory,
  ProjectDifficulty,
} from "#/server/db/generated/enums";
import { useSearchParam } from "#/shared/hooks";

/**
 * Helper functions for parsing/serializing URL query parameters.
 * These functions convert between URL-friendly string formats and typed values.
 * Exported for unit testing.
 */

/**
 * Parses a comma-separated string of category values into an array of ProjectCategory enum values.
 * Uses O(1) lookup via categoryLabels object for efficient validation.
 *
 * @param value - Comma-separated string of category values (e.g., "ARRAY,HEAP,STACK")
 * @returns Array of valid ProjectCategory enum values. Invalid values are filtered out.
 * @example
 * parseCategories("ARRAY,HEAP") // Returns [ProjectCategory.ARRAY, ProjectCategory.HEAP]
 * parseCategories("INVALID,ARRAY") // Returns [ProjectCategory.ARRAY]
 * parseCategories("") // Returns []
 */
export const parseCategories = (value: string): ProjectCategory[] => {
  if (!value) return [];

  return value
    .split(",")
    .filter((cat): cat is ProjectCategory => cat in categoryLabels);
};

/**
 * Serializes an array of ProjectCategory enum values into a comma-separated string.
 *
 * @param categories - Array of ProjectCategory enum values
 * @returns Comma-separated string of category values, or empty string if array is empty
 * @example
 * serializeCategories([ProjectCategory.ARRAY, ProjectCategory.HEAP]) // Returns "ARRAY,HEAP"
 * serializeCategories([]) // Returns ""
 */
export const serializeCategories = (categories: ProjectCategory[]): string => {
  return categories.join(",");
};

/**
 * Parses a comma-separated string of difficulty values into an array of ProjectDifficulty enum values.
 * Uses O(1) lookup via difficultyLabels object for efficient validation.
 *
 * @param value - Comma-separated string of difficulty values (e.g., "EASY,MEDIUM")
 * @returns Array of valid ProjectDifficulty enum values. Invalid values are filtered out.
 * @example
 * parseDifficulties("EASY,MEDIUM") // Returns [ProjectDifficulty.EASY, ProjectDifficulty.MEDIUM]
 * parseDifficulties("INVALID,EASY") // Returns [ProjectDifficulty.EASY]
 * parseDifficulties("") // Returns []
 */
export const parseDifficulties = (value: string): ProjectDifficulty[] => {
  if (!value) return [];

  return value
    .split(",")
    .filter((diff): diff is ProjectDifficulty => diff in difficultyLabels);
};

/**
 * Serializes an array of ProjectDifficulty enum values into a comma-separated string.
 *
 * @param difficulties - Array of ProjectDifficulty enum values
 * @returns Comma-separated string of difficulty values, or empty string if array is empty
 * @example
 * serializeDifficulties([ProjectDifficulty.EASY, ProjectDifficulty.MEDIUM]) // Returns "EASY,MEDIUM"
 * serializeDifficulties([]) // Returns ""
 */
export const serializeDifficulties = (
  difficulties: ProjectDifficulty[],
): string => {
  return difficulties.join(",");
};

/**
 * Parses a string value into a boolean.
 * Accepts "true" or "1" as truthy values, everything else is false.
 *
 * @param value - String value to parse
 * @returns Boolean value
 * @example
 * parseBoolean("true") // Returns true
 * parseBoolean("1") // Returns true
 * parseBoolean("false") // Returns false
 * parseBoolean("") // Returns false
 */
export const parseBoolean = (value: string): boolean => {
  return value === "true" || value === "1";
};

/**
 * Serializes a boolean value into a string for URL query parameters.
 * Returns "true" for true, empty string for false (to keep URLs clean).
 *
 * @param value - Boolean value to serialize
 * @returns "true" if value is true, empty string if false
 * @example
 * serializeBoolean(true) // Returns "true"
 * serializeBoolean(false) // Returns ""
 */
export const serializeBoolean = (value: boolean): string => {
  return value ? "true" : "";
};

/**
 * Constants for sort validation and defaults.
 */
const VALID_SORT_BY = ["title", "difficulty", "date", "category"] as const;
type ValidSortBy = (typeof VALID_SORT_BY)[number];
type ValidSortOrder = "asc" | "desc";

const DEFAULT_SORT_BY: ValidSortBy = "category";
const DEFAULT_SORT_ORDER: ValidSortOrder = "asc";
const DEFAULT_SORT = `${DEFAULT_SORT_BY}${DEFAULT_SORT_ORDER.charAt(0).toUpperCase() + DEFAULT_SORT_ORDER.slice(1)}`; // "categoryAsc"

/**
 * Parses a combined sort parameter string into separate sortBy and sortOrder values.
 * The format is: {sortBy}{Order} where Order is capitalized (e.g., "titleAsc", "difficultyDesc").
 * Case-insensitive matching is supported.
 *
 * @param value - Combined sort string (e.g., "titleAsc", "difficultyDesc", "TITLEASC")
 * @returns Object with sortBy and sortOrder properties. Returns defaults if value is invalid or empty.
 * @example
 * parseSort("titleAsc") // Returns { sortBy: "title", sortOrder: "asc" }
 * parseSort("difficultyDesc") // Returns { sortBy: "difficulty", sortOrder: "desc" }
 * parseSort("invalid") // Returns { sortBy: "category", sortOrder: "asc" } (defaults)
 * parseSort("") // Returns { sortBy: "category", sortOrder: "asc" } (defaults)
 */
export const parseSort = (
  value: string,
): {
  sortBy: ValidSortBy;
  sortOrder: ValidSortOrder;
} => {
  if (!value) {
    return { sortBy: DEFAULT_SORT_BY, sortOrder: DEFAULT_SORT_ORDER };
  }

  // Match pattern: {sortBy}{Order} where Order is Asc or Desc (case insensitive)
  // e.g., "titleAsc", "difficultyDesc", "categoryAsc", "TITLEASC"
  const match = value.match(/^(title|difficulty|date|category)(asc|desc)$/i);
  if (match) {
    const [, sortBy, order] = match;
    if (sortBy && order) {
      const normalizedSortBy = sortBy.toLowerCase();
      const normalizedOrder = order.toLowerCase();
      if (
        VALID_SORT_BY.includes(
          normalizedSortBy as (typeof VALID_SORT_BY)[number],
        ) &&
        (normalizedOrder === "asc" || normalizedOrder === "desc")
      ) {
        return {
          sortBy: normalizedSortBy as ValidSortBy,
          sortOrder: normalizedOrder as ValidSortOrder,
        };
      }
    }
  }

  return { sortBy: DEFAULT_SORT_BY, sortOrder: DEFAULT_SORT_ORDER };
};

/**
 * Serializes separate sortBy and sortOrder values into a combined sort parameter string.
 * The format is: {sortBy}{Order} where Order is capitalized (e.g., "titleAsc", "difficultyDesc").
 *
 * @param sortBy - Sort field ("title", "difficulty", "date", or "category")
 * @param sortOrder - Sort order ("asc" or "desc")
 * @returns Combined sort string (e.g., "titleAsc", "difficultyDesc")
 * @example
 * serializeSort("title", "asc") // Returns "titleAsc"
 * serializeSort("difficulty", "desc") // Returns "difficultyDesc"
 */
export const serializeSort = (
  sortBy: ValidSortBy,
  sortOrder: ValidSortOrder,
): string => {
  const orderCapitalized =
    sortOrder.charAt(0).toUpperCase() + sortOrder.slice(1);
  return `${sortBy}${orderCapitalized}`;
};

/**
 * Context value type for ProjectBrowser state management.
 * All state is synchronized with URL query parameters for shareable URLs.
 */
type ProjectBrowserContextValue = {
  /** Opens the project browser drawer by setting URL param `browser=true` */
  openBrowser: () => void;
  /** Closes the project browser drawer by clearing URL param `browser` */
  closeBrowser: () => void;
  /** Whether the browser drawer is currently open (read from URL param `browser`) */
  isOpen: boolean;

  /** Current search query string (read from URL param `search`) */
  searchQuery: string;
  /** Updates the search query URL parameter */
  setSearchQuery: (query: string) => void;

  /** Currently selected categories (read from URL param `categories`, comma-separated) */
  selectedCategories: ProjectCategory[];
  /** Updates the categories URL parameter */
  setSelectedCategories: (categories: ProjectCategory[]) => void;

  /** Currently selected difficulties (read from URL param `difficulties`, comma-separated) */
  selectedDifficulties: ProjectDifficulty[];
  /** Updates the difficulties URL parameter */
  setSelectedDifficulties: (difficulties: ProjectDifficulty[]) => void;

  /** Whether to show only new projects (read from URL param `new`) */
  showOnlyNew: boolean;
  /** Updates the showOnlyNew URL parameter */
  setShowOnlyNew: (show: boolean) => void;

  /**
   * Current sort field (parsed from URL param `sort`, e.g., "titleAsc" → "title")
   * Combined with sortOrder for a single URL parameter
   */
  sortBy: ValidSortBy;
  /**
   * Current sort order (parsed from URL param `sort`, e.g., "titleAsc" → "asc")
   * Combined with sortBy for a single URL parameter
   */
  sortOrder: ValidSortOrder;
  /**
   * Updates the sort URL parameter with a combined value.
   * @param sort - Combined sort string (e.g., "titleAsc", "difficultyDesc")
   */
  setSort: (sort: string) => void;

  /** Resets all filter URL parameters to empty/default values */
  resetFilters: () => void;
};

/**
 * React Context for ProjectBrowser state management.
 * Provides URL-synchronized state for browser open/close, filters, and sorting.
 */
const ProjectBrowserContext = createContext<ProjectBrowserContextValue | null>(
  null,
);

/**
 * Hook to access ProjectBrowser context values.
 * Must be used within a ProjectBrowserProvider.
 *
 * @returns ProjectBrowserContextValue with all state and setters
 * @throws Error if used outside ProjectBrowserProvider
 * @example
 * const { isOpen, openBrowser, searchQuery, setSearchQuery } = useProjectBrowserContext();
 */
export const useProjectBrowserContext = (): ProjectBrowserContextValue => {
  const context = useContext(ProjectBrowserContext);
  if (!context) {
    throw new Error(
      "useProjectBrowserContext must be used within ProjectBrowserProvider",
    );
  }

  return context;
};

type ProjectBrowserProviderProps = {
  children: ReactNode;
};

/**
 * Provider component that manages ProjectBrowser state synchronized with URL query parameters.
 * All state changes update the URL, enabling shareable filtered project lists.
 *
 * URL Parameters:
 * - `browser` - Controls drawer open/close (boolean: "true" or empty)
 * - `search` - Search query string
 * - `categories` - Comma-separated category values (e.g., "ARRAY,HEAP")
 * - `difficulties` - Comma-separated difficulty values (e.g., "EASY,MEDIUM")
 * - `new` - Show only new projects flag (boolean: "true" or empty)
 * - `sort` - Combined sort value (e.g., "titleAsc", "difficultyDesc")
 *
 * @param props - Component props
 * @param props.children - Child components that can access the context
 *
 * @example
 * ```tsx
 * <ProjectBrowserProvider>
 *   <App />
 * </ProjectBrowserProvider>
 * ```
 */
export const ProjectBrowserProvider: React.FC<ProjectBrowserProviderProps> = ({
  children,
}) => {
  // Browser open/close
  const [browserParam, setBrowserParam] = useSearchParam("browser");
  const isOpen = parseBoolean(browserParam);

  // Filters
  const [searchParam, setSearchParam] = useSearchParam("search");
  const [categoriesParam, setCategoriesParam] = useSearchParam("categories");
  const [difficultiesParam, setDifficultiesParam] =
    useSearchParam("difficulties");
  const [newParam, setNewParam] = useSearchParam("new");
  const [sortParam, setSortParam] = useSearchParam("sort");

  // Parse URL params to typed values
  const selectedCategories = useMemo(
    () => parseCategories(categoriesParam),
    [categoriesParam],
  );
  const selectedDifficulties = useMemo(
    () => parseDifficulties(difficultiesParam),
    [difficultiesParam],
  );
  const showOnlyNew = useMemo(() => parseBoolean(newParam), [newParam]);
  const { sortBy, sortOrder } = useMemo(
    () => parseSort(sortParam),
    [sortParam],
  );

  // Memoize setter functions to prevent unnecessary re-renders
  const openBrowser = useCallback(() => {
    setBrowserParam("true");
  }, [setBrowserParam]);

  const closeBrowser = useCallback(() => {
    setBrowserParam("");
  }, [setBrowserParam]);

  const setSearchQuery = useCallback(
    (query: string) => {
      setSearchParam(query || "");
    },
    [setSearchParam],
  );

  const setSelectedCategories = useCallback(
    (categories: ProjectCategory[]) => {
      setCategoriesParam(serializeCategories(categories));
    },
    [setCategoriesParam],
  );

  const setSelectedDifficulties = useCallback(
    (difficulties: ProjectDifficulty[]) => {
      setDifficultiesParam(serializeDifficulties(difficulties));
    },
    [setDifficultiesParam],
  );

  const setShowOnlyNew = useCallback(
    (show: boolean) => {
      setNewParam(serializeBoolean(show));
    },
    [setNewParam],
  );

  const setSort = useCallback(
    (sort: string) => {
      // Validate format before setting
      const parsed = parseSort(sort);
      const serialized = serializeSort(parsed.sortBy, parsed.sortOrder);
      // Only set if it's not the default (to keep URL clean)
      if (serialized === DEFAULT_SORT) {
        setSortParam("");
      } else {
        setSortParam(serialized);
      }
    },
    [setSortParam],
  );

  const resetFilters = useCallback(() => {
    setSearchParam("");
    setCategoriesParam("");
    setDifficultiesParam("");
    setNewParam("");
    setSortParam("");
  }, [
    setSearchParam,
    setCategoriesParam,
    setDifficultiesParam,
    setNewParam,
    setSortParam,
  ]);

  const value = useMemo<ProjectBrowserContextValue>(
    () => ({
      openBrowser,
      closeBrowser,
      isOpen,
      searchQuery: searchParam || "",
      setSearchQuery,
      selectedCategories,
      setSelectedCategories,
      selectedDifficulties,
      setSelectedDifficulties,
      showOnlyNew,
      setShowOnlyNew,
      sortBy,
      sortOrder,
      setSort,
      resetFilters,
    }),
    [
      isOpen,
      searchParam,
      selectedCategories,
      selectedDifficulties,
      showOnlyNew,
      sortBy,
      sortOrder,
      openBrowser,
      closeBrowser,
      setSearchQuery,
      setSelectedCategories,
      setSelectedDifficulties,
      setShowOnlyNew,
      setSort,
      resetFilters,
    ],
  );

  return (
    <ProjectBrowserContext.Provider value={value}>
      {children}
    </ProjectBrowserContext.Provider>
  );
};
