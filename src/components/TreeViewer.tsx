import { alpha, Box, useTheme } from '@mui/material';
import React from 'react';
import { ArcherContainer } from 'react-archer';
import ScrollContainer from 'react-indiana-drag-scroll';

import { BinaryNode } from '#/components/BinaryNode';
import type { BinaryTreeNode } from '#/hooks/dataTypes/binaryTreeNode';

export type TreeViewerProps = {
  tree: BinaryTreeNode | null;
};

export const TreeViewer: React.FC<TreeViewerProps> = ({ tree }) => {
  const theme = useTheme();

  return (
    <Box
      display="flex"
      flexDirection="column"
      rowGap={1}
      my={1}
      borderRadius={1}
    >
      <ScrollContainer>
        <Box sx={{ m: 3 }}>
          <ArcherContainer
            lineStyle="straight"
            strokeColor={alpha(theme.palette.primary.dark, 0.5)}
            strokeWidth={4}
            endMarker={false}
            svgContainerStyle={{ overflow: 'visible' }}
          >
            {tree && <BinaryNode {...tree} />}
          </ArcherContainer>
        </Box>
      </ScrollContainer>
    </Box>
  );
};
