import { Backspace } from "@mui/icons-material";
import { IconButton, Stack, type SxProps } from "@mui/material";
import React from "react";

import { DebouncedInput } from "#/shared/ui/molecules/DebouncedInput";

type SearchInputProps = {
  searchValue: string;
  setSearchValue: (value: string) => void;
  sx?: SxProps;
};

export const SearchInput: React.FC<SearchInputProps> = ({
  searchValue,
  setSearchValue,
  sx,
}) => {
  const handlePropagation = (ev: React.BaseSyntheticEvent) => {
    ev.stopPropagation();
  };

  const handleChange = (value: string) => {
    setSearchValue(value.trim());
  };

  const handleClear: React.MouseEventHandler<HTMLButtonElement> = (ev) => {
    handlePropagation(ev);
    setSearchValue("");
  };

  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      onClick={handlePropagation}
      sx={{
        p: 1,
        ...sx,
      }}
    >
      <DebouncedInput
        label="Search"
        title="Search project by title"
        name="search-project"
        size="small"
        fullWidth
        value={searchValue}
        onChange={handleChange}
        onClick={handlePropagation}
        onKeyDown={handlePropagation}
        sx={{ pointerEvents: "auto" }}
        timeout={200}
      />
      <span>
        <IconButton
          title="Clear search input"
          size="small"
          onClick={handleClear}
          sx={{ pointerEvents: "auto" }}
        >
          <Backspace fontSize="small" />
        </IconButton>
      </span>
    </Stack>
  );
};
