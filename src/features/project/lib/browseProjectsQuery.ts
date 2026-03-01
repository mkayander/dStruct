import type {
  ProjectCategory,
  ProjectDifficulty,
} from "#/server/db/generated/enums";

export type BrowseProjectsSortBy = "title" | "difficulty" | "date" | "category";
export type BrowseProjectsSortOrder = "asc" | "desc";

export type BrowseProjectsFilterParams = {
  pageSize: number;
  searchQuery: string;
  selectedCategories: ProjectCategory[];
  selectedDifficulties: ProjectDifficulty[];
  showOnlyNew: boolean;
  sortBy: BrowseProjectsSortBy;
  sortOrder: BrowseProjectsSortOrder;
};

export type BrowseProjectsQueryParams = BrowseProjectsFilterParams & {
  page: number;
};

const toApiSortBy = (
  sortBy: BrowseProjectsSortBy,
): "title" | "difficulty" | "createdAt" | "category" =>
  sortBy === "date" ? "createdAt" : sortBy;

/**
 * Builds the query parameters for browseProjects API call.
 */
export const getBrowseProjectsQueryParams = (
  params: BrowseProjectsQueryParams,
) => ({
  page: params.page,
  pageSize: params.pageSize,
  search: params.searchQuery.trim() || undefined,
  categories:
    params.selectedCategories.length > 0
      ? params.selectedCategories
      : undefined,
  difficulties:
    params.selectedDifficulties.length > 0
      ? params.selectedDifficulties
      : undefined,
  showOnlyNew: params.showOnlyNew || undefined,
  showOnlyMine: false,
  sortBy: toApiSortBy(params.sortBy),
  sortOrder: params.sortOrder,
});

/**
 * Generates a stable query key for filter/sort state (excluding page).
 * Used to detect when filters change and reset accumulated projects.
 */
export const getBrowseProjectsQueryKey = (
  params: BrowseProjectsFilterParams,
): string =>
  JSON.stringify({
    pageSize: params.pageSize,
    search: params.searchQuery.trim() || undefined,
    categories:
      params.selectedCategories.length > 0
        ? params.selectedCategories
        : undefined,
    difficulties:
      params.selectedDifficulties.length > 0
        ? params.selectedDifficulties
        : undefined,
    showOnlyNew: params.showOnlyNew || undefined,
    showOnlyMine: false,
    sortBy: toApiSortBy(params.sortBy),
    sortOrder: params.sortOrder,
  });
