import { Box, type SxProps, type Theme, useTheme } from '@mui/material';
import React from 'react';

import type { BinaryTreeNode } from '#/hooks/useBinaryTree';

const nodeProps: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'center',
  p: 1,
  width: '42px',
  height: '42px',
};

const GapElement = () => <Box sx={{ ...nodeProps, pointerEvents: 'none' }} />;

type BinaryNodeProps = BinaryTreeNode;

export const BinaryNode: React.FC<BinaryNodeProps> = ({
  value,
  left,
  right,
  meta,
}: BinaryNodeProps) => {
  const theme = useTheme();

  const gapsActive =
    (meta.rootNode?.meta.maxDepth ?? 0) - meta.depth >= 1 || null;

  return (
    <Box
      sx={{
        display: 'flex',
        flexFlow: 'column nowrap',
        alignItems: 'center',
        width: 'fit-content',
        gap: 2,
      }}
    >
      <Box
        boxShadow={6}
        sx={{
          ...nodeProps,
          borderRadius: '50%',
          background: theme.palette.primary.main,
          border: `1px solid ${theme.palette.primary.light}`,
          color: theme.palette.primary.contrastText,
          transition: 'background .2s',
          '&:hover': {
            background: theme.palette.primary.light,
          },
        }}
      >
        {value}
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexFlow: 'row nowrap',
          alignItems: 'flex-start',
          justifyContent: 'center',
          gap: 4,
        }}
      >
        {left ? <BinaryNode {...left} /> : gapsActive && <GapElement />}
        {right ? <BinaryNode {...right} /> : gapsActive && <GapElement />}
      </Box>
    </Box>
  );
};
