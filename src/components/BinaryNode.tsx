import { alpha, Box, type SxProps, type Theme, useTheme } from '@mui/material';
import React from 'react';
import { ArcherElement } from 'react-archer';
import type { RelationType } from 'react-archer/lib/types';

import type { BinaryTreeNode } from '#/hooks/useBinaryTree';

import { useAppSelector } from '#/store/hooks';
import { selectNodeDataById } from '#/store/reducers/treeNodeReducer';

const nodeProps: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'center',
  p: 1,
  width: '42px',
  height: '42px',
};

const relationProps = {
  targetAnchor: 'middle',
  sourceAnchor: 'middle',
} as const;

const GapElement = () => <Box sx={{ ...nodeProps, pointerEvents: 'none' }} />;

type BinaryNodeProps = BinaryTreeNode;

export const BinaryNode: React.FC<BinaryNodeProps> = ({
  val,
  left,
  right,
  meta,
}: BinaryNodeProps) => {
  const theme = useTheme();

  const nodeData = useAppSelector(selectNodeDataById(meta.id));

  const gapsActive = !meta.isLeaf;

  const relations: RelationType[] = [];

  if (left) relations.push({ ...relationProps, targetId: left.meta.id });

  if (right) relations.push({ ...relationProps, targetId: right.meta.id });

  return (
    <Box
      sx={{
        display: 'flex',
        position: 'relative',
        zIndex: 1,
        flexFlow: 'column nowrap',
        alignItems: 'center',
        width: 'fit-content',
        gap: 2,
      }}
    >
      <ArcherElement id={meta.id} relations={relations}>
        <Box
          sx={{
            ...nodeProps,
            borderRadius: '50%',
            background: alpha(
              nodeData?.color || theme.palette.primary.main,
              0.3
            ),
            border: `1px solid ${alpha(theme.palette.primary.light, 0.1)}`,
            backdropFilter: 'blur(4px)',
            userSelect: 'none',
            boxShadow: `0px 0px 18px -2px ${alpha(
              theme.palette.primary.dark,
              0.5
            )}`,
            color: theme.palette.primary.contrastText,
            transition: 'background .2s',

            '&:hover': {
              background: alpha(theme.palette.primary.light, 0.4),
            },
          }}
        >
          {val}
        </Box>
      </ArcherElement>

      <Box
        sx={{
          position: 'absolute',
          zIndex: -1,
          top: '13px',
          left: '50%',
          transform: 'translate(-50%, 0)',
          width: '18px',
          height: '18px',
          borderRadius: '50%',
          background: theme.palette.primary.main,
        }}
      />

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
