import { Box } from '@mui/material';
import React, { type PropsWithChildren } from 'react';
import { Panel, PanelGroup } from 'react-resizable-panels';

import { ResizeHandle } from '#/components';

import styles from './SplitPanelsLayout.module.scss';

type Panel = React.ReactNode | null | undefined;

type SplitPanelsLayoutProps = {
  children?: [Panel, Panel, Panel, Panel];
};

const PanelWrapper: React.FC<PropsWithChildren> = ({ children }) => (
  <Box
    sx={{
      height: '100%',
      width: '100%',
      borderRadius: 2,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      overflow: 'hidden',
      p: 1,
      boxShadow: 5,
      zIndex: 5,
    }}
  >
    {children}
  </Box>
);

const style = { overflow: 'initial' };

export const SplitPanelsLayout: React.FC<SplitPanelsLayoutProps> = ({
  children,
}) => {
  const [topLeft, topRight, bottomLeft, bottomRight] =
    React.Children.toArray(children);

  return (
    <Box
      sx={{
        height: 'calc(100vh - 69px)',
        width: '100vw',
        p: 1,
        overflow: 'hidden',
      }}
    >
      <PanelGroup autoSaveId="example" direction="horizontal" style={style}>
        <>
          <Panel
            className={styles.Panel}
            defaultSize={20}
            order={1}
            style={style}
          >
            <PanelGroup autoSaveId="example" direction="vertical" style={style}>
              <Panel className={styles.Panel} order={1} style={style}>
                <PanelWrapper>{topLeft}</PanelWrapper>
              </Panel>
              <ResizeHandle />
              <Panel className={styles.Panel} order={2} style={style}>
                <PanelWrapper>{bottomLeft}</PanelWrapper>
              </Panel>
            </PanelGroup>
          </Panel>
          <ResizeHandle />
        </>
        <Panel className={styles.Panel} order={2} style={style}>
          <PanelGroup autoSaveId="example" direction="vertical" style={style}>
            <Panel className={styles.Panel} order={1} style={style}>
              <PanelWrapper>{topRight}</PanelWrapper>
            </Panel>
            <ResizeHandle />
            <Panel className={styles.Panel} order={2} style={style}>
              <PanelWrapper>{bottomRight}</PanelWrapper>
            </Panel>
          </PanelGroup>
        </Panel>
      </PanelGroup>
    </Box>
  );
};
