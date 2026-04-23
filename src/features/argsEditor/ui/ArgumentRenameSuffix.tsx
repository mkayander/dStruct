"use client";

import DriveFileRenameOutline from "@mui/icons-material/DriveFileRenameOutline";
import {
  IconButton,
  InputAdornment,
  Popover,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useId, useRef, useState } from "react";

import { caseSlice } from "#/entities/argument/model/caseSlice";
import { useI18nContext } from "#/shared/hooks";
import { useAppDispatch } from "#/store/hooks";

const SAVE_DEBOUNCE_MS = 300;

type ArgumentRenameSuffixProps = {
  argumentId: string;
  labelDraft: string;
};

const normalizeLabel = (raw: string): string | undefined => {
  const trimmed = raw.trim();
  return trimmed === "" ? undefined : trimmed;
};

export const ArgumentRenameSuffix: React.FC<ArgumentRenameSuffixProps> = ({
  argumentId,
  labelDraft,
}) => {
  const { LL } = useI18nContext();
  const dispatch = useAppDispatch();
  const titleId = useId();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [localDraft, setLocalDraft] = useState(labelDraft);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flushLabelToStore = useCallback(
    (raw: string) => {
      dispatch(
        caseSlice.actions.updateArgumentLabel({
          name: argumentId,
          label: normalizeLabel(raw),
        }),
      );
    },
    [argumentId, dispatch],
  );

  useEffect(() => {
    setLocalDraft(labelDraft);
  }, [labelDraft]);

  useEffect(() => {
    if (!anchorEl) return;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      debounceRef.current = null;
      flushLabelToStore(localDraft);
    }, SAVE_DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
    };
  }, [anchorEl, flushLabelToStore, localDraft]);

  const handleOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    flushLabelToStore(localDraft);
    setAnchorEl(null);
  }, [flushLabelToStore, localDraft]);

  const open = Boolean(anchorEl);

  return (
    <>
      <Tooltip title={LL.ARGUMENT_RENAME()}>
        <IconButton
          edge="end"
          size="small"
          aria-label={LL.ARGUMENT_RENAME()}
          onClick={handleOpen}
        >
          <DriveFileRenameOutline fontSize="small" />
        </IconButton>
      </Tooltip>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            "aria-labelledby": titleId,
            sx: { p: 1.5, minWidth: 220 },
          },
        }}
      >
        <Typography id={titleId} variant="subtitle2" gutterBottom>
          {LL.ARGUMENT_DISPLAY_NAME()}
        </Typography>
        <TextField
          autoFocus
          size="small"
          fullWidth
          value={localDraft}
          onChange={(event) => setLocalDraft(event.target.value)}
          placeholder={LL.ARGUMENT_DISPLAY_NAME_PLACEHOLDER()}
          helperText={LL.ARGUMENT_DISPLAY_NAME_HELPER()}
        />
      </Popover>
    </>
  );
};

export const argumentRenameEndAdornment = (
  argumentId: string,
  labelDraft: string,
): React.ReactNode => (
  <InputAdornment position="end" sx={{ margin: 0 }}>
    <ArgumentRenameSuffix argumentId={argumentId} labelDraft={labelDraft} />
  </InputAdornment>
);
