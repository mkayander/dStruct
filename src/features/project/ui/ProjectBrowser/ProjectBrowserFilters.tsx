import CheckBox from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlank from "@mui/icons-material/CheckBoxOutlineBlank";
import Clear from "@mui/icons-material/Clear";
import Close from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  IconButton,
  Popover,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
} from "@mui/material";
import { useSession } from "next-auth/react";
import React from "react";

import { getDifficultyColor } from "#/entities/difficulty/lib/getDifficultyColor";
import { difficultyLabels } from "#/entities/difficulty/model/difficultyLabels";
import { ProjectDifficulty } from "#/server/db/generated/enums";
import { useI18nContext } from "#/shared/hooks";

import { useProjectBrowserContext } from "./ProjectBrowserContext";

type ProjectBrowserFiltersProps = {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
};

export const ProjectBrowserFilters: React.FC<ProjectBrowserFiltersProps> = ({
  anchorEl,
  open,
  onClose,
}) => {
  const { LL } = useI18nContext();
  const theme = useTheme();
  const session = useSession();
  const {
    selectedDifficulties,
    showOnlyNew,
    setSelectedDifficulties,
    setShowOnlyNew,
    resetFilters,
  } = useProjectBrowserContext();

  const handleDifficultyToggle = (
    _ev: React.MouseEvent<HTMLElement>,
    newDifficulties: ProjectDifficulty[],
  ) => {
    setSelectedDifficulties(newDifficulties);
  };

  const handleShowOnlyNewChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setShowOnlyNew(ev.target.checked);
  };

  const handleClearAll = () => {
    resetFilters();
  };

  const hasActiveFilters = selectedDifficulties.length > 0 || showOnlyNew;

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      slotProps={{
        paper: {
          sx: {
            mt: 1,
            minWidth: 280,
            maxWidth: 320,
            p: 2,
          },
        },
      }}
    >
      <Stack spacing={2}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6" fontSize={16} fontWeight={600}>
            {LL.FILTERS()}
          </Typography>
          <IconButton size="small" onClick={onClose} aria-label="Close filters">
            <Close fontSize="small" />
          </IconButton>
        </Stack>

        <Divider />

        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            {LL.FILTER_BY_DIFFICULTY()}
          </Typography>
          <ToggleButtonGroup
            value={selectedDifficulties}
            onChange={handleDifficultyToggle}
            aria-label="Difficulty filter"
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 0.5,
              "& .MuiToggleButton-root": {
                border: 1,
                borderColor: "divider",
                px: 1.5,
                py: 0.75,
                textTransform: "none",
                "&.Mui-selected": {
                  backgroundColor: "primary.main",
                  color: "primary.contrastText",
                  "&:hover": {
                    backgroundColor: "primary.dark",
                  },
                },
                "&:focus-visible": {
                  outline: "2px solid",
                  outlineColor: "primary.main",
                  outlineOffset: 2,
                },
              },
            }}
          >
            {Object.values(ProjectDifficulty).map((difficulty) => (
              <ToggleButton
                key={difficulty}
                value={difficulty}
                aria-label={`Filter by ${difficultyLabels[difficulty]} difficulty`}
                sx={{
                  color: selectedDifficulties.includes(difficulty)
                    ? undefined
                    : getDifficultyColor(theme, difficulty),
                }}
              >
                {difficultyLabels[difficulty]}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>

        <Divider />

        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={showOnlyNew}
                onChange={handleShowOnlyNewChange}
                icon={<CheckBoxOutlineBlank />}
                checkedIcon={<CheckBox />}
              />
            }
            label={LL.SHOW_ONLY_NEW()}
          />
        </Box>

        {session.data && (
          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={false}
                  disabled
                  icon={<CheckBoxOutlineBlank />}
                  checkedIcon={<CheckBox />}
                />
              }
              label={LL.SHOW_ONLY_MINE()}
            />
            <Typography variant="caption" color="text.secondary" sx={{ ml: 4 }}>
              Coming soon
            </Typography>
          </Box>
        )}

        {hasActiveFilters && (
          <>
            <Divider />
            <Button
              startIcon={<Clear />}
              onClick={handleClearAll}
              variant="outlined"
              size="small"
              fullWidth
            >
              {LL.CLEAR_ALL_FILTERS()}
            </Button>
          </>
        )}
      </Stack>
    </Popover>
  );
};
