import { Backspace, FilterList, Search, SwapVert } from "@mui/icons-material";
import {
  Box,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
} from "@mui/material";
import React, { useRef, useState } from "react";

import { useI18nContext } from "#/shared/hooks";
import { DebouncedInput } from "#/shared/ui/molecules/DebouncedInput";
import { useAppDispatch, useAppSelector } from "#/store/hooks";

import {
  projectBrowserSlice,
  selectSelectedDifficulties,
  selectShowOnlyNew,
  selectSortBy,
  selectSortOrder,
} from "../../model/projectBrowserSlice";
import { ProjectBrowserFilters } from "./ProjectBrowserFilters";

type ProjectBrowserHeaderProps = {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchInputRef?: React.RefObject<HTMLInputElement | null>;
};

type SortOption = {
  value: "title" | "difficulty" | "date" | "category";
  label: string;
  ascLabel: string;
  descLabel: string;
};

const SORT_OPTIONS: SortOption[] = [
  {
    value: "title",
    label: "Title",
    ascLabel: "Title (A-Z)",
    descLabel: "Title (Z-A)",
  },
  {
    value: "difficulty",
    label: "Difficulty",
    ascLabel: "Difficulty (Easy → Hard)",
    descLabel: "Difficulty (Hard → Easy)",
  },
  {
    value: "date",
    label: "Date",
    ascLabel: "Date (Newest First)",
    descLabel: "Date (Oldest First)",
  },
  {
    value: "category",
    label: "Category",
    ascLabel: "Category (A-Z)",
    descLabel: "Category (Z-A)",
  },
];

export const ProjectBrowserHeader: React.FC<ProjectBrowserHeaderProps> = ({
  searchValue,
  onSearchChange,
  searchInputRef,
}) => {
  const { LL } = useI18nContext();
  const dispatch = useAppDispatch();
  const sortBy = useAppSelector(selectSortBy);
  const sortOrder = useAppSelector(selectSortOrder);
  const [sortMenuAnchor, setSortMenuAnchor] = useState<null | HTMLElement>(
    null,
  );
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const [filterPopoverOpen, setFilterPopoverOpen] = useState(false);

  const handlePropagation = (ev: React.BaseSyntheticEvent) => {
    ev.stopPropagation();
  };

  const handleChange = (value: string) => {
    onSearchChange(value.trim());
  };

  const handleClear: React.MouseEventHandler<HTMLButtonElement> = (ev) => {
    handlePropagation(ev);
    onSearchChange("");
  };

  const handleSortMenuOpen = (ev: React.MouseEvent<HTMLElement>) => {
    handlePropagation(ev);
    setSortMenuAnchor(ev.currentTarget);
  };

  const handleSortMenuClose = () => {
    setSortMenuAnchor(null);
  };

  const handleSortSelect = (option: SortOption, order: "asc" | "desc") => {
    dispatch(projectBrowserSlice.actions.setSortBy(option.value));
    dispatch(projectBrowserSlice.actions.setSortOrder(order));
    handleSortMenuClose();
  };

  const handleFilterClick = () => {
    setFilterPopoverOpen(!filterPopoverOpen);
  };

  const handleFilterClose = () => {
    setFilterPopoverOpen(false);
  };

  const currentSortOption = SORT_OPTIONS.find((opt) => opt.value === sortBy);
  const sortLabel =
    sortOrder === "asc"
      ? currentSortOption?.ascLabel
      : currentSortOption?.descLabel;

  const selectedDifficulties = useAppSelector(selectSelectedDifficulties);
  const showOnlyNew = useAppSelector(selectShowOnlyNew);
  const hasActiveFilters = selectedDifficulties.length > 0 || showOnlyNew;

  return (
    <Box
      sx={{
        p: 2,
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <Stack spacing={1.5}>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          onClick={handlePropagation}
        >
          <Box sx={{ flex: 1 }}>
            <DebouncedInput
              inputRef={searchInputRef}
              label={LL.SEARCH_PROJECTS()}
              title={LL.SEARCH_PROJECTS()}
              name="search-project-browser"
              size="small"
              fullWidth
              value={searchValue}
              onChange={handleChange}
              onClick={handlePropagation}
              onKeyDown={handlePropagation}
              sx={{ pointerEvents: "auto" }}
              timeout={200}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: "text.secondary", fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <IconButton
            title="Clear search input"
            size="small"
            onClick={handleClear}
            sx={{ pointerEvents: "auto" }}
            aria-label="Clear search"
          >
            <Backspace fontSize="small" />
          </IconButton>
        </Stack>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          justifyContent="flex-start"
        >
          <Tooltip title={sortLabel || "Sort options"} arrow>
            <IconButton
              onClick={handleSortMenuOpen}
              size="small"
              aria-label="Sort options"
              aria-haspopup="true"
              aria-expanded={Boolean(sortMenuAnchor)}
              sx={{
                border: 1,
                borderColor: "divider",
                borderRadius: 1,
              }}
            >
              <SwapVert fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Advanced filters" arrow>
            <IconButton
              ref={filterButtonRef}
              onClick={handleFilterClick}
              size="small"
              aria-label="Advanced filters"
              aria-haspopup="true"
              aria-expanded={filterPopoverOpen}
              sx={{
                border: 1,
                borderColor: hasActiveFilters ? "primary.main" : "divider",
                borderRadius: 1,
                backgroundColor: hasActiveFilters
                  ? "primary.main"
                  : "transparent",
                color: hasActiveFilters ? "primary.contrastText" : "inherit",
                "&:hover": {
                  backgroundColor: hasActiveFilters
                    ? "primary.dark"
                    : "action.hover",
                },
              }}
            >
              <FilterList fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
      <Menu
        anchorEl={sortMenuAnchor}
        open={Boolean(sortMenuAnchor)}
        onClose={handleSortMenuClose}
        onClick={handlePropagation}
        slotProps={{
          paper: {
            onClick: handlePropagation,
          },
        }}
      >
        {SORT_OPTIONS.map((option) => (
          <MenuItem
            key={`${option.value}-asc`}
            selected={sortBy === option.value && sortOrder === "asc"}
            onClick={() => handleSortSelect(option, "asc")}
          >
            {option.ascLabel}
          </MenuItem>
        ))}
        {SORT_OPTIONS.map((option) => (
          <MenuItem
            key={`${option.value}-desc`}
            selected={sortBy === option.value && sortOrder === "desc"}
            onClick={() => handleSortSelect(option, "desc")}
          >
            {option.descLabel}
          </MenuItem>
        ))}
      </Menu>
      <ProjectBrowserFilters
        anchorEl={filterButtonRef.current}
        open={filterPopoverOpen}
        onClose={handleFilterClose}
      />
    </Box>
  );
};
