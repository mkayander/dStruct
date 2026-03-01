"use client";

import { Box } from "@mui/material";
import Head from "next/head";
import React from "react";

import { ArgsEditor } from "#/features/argsEditor/ui/ArgsEditor";
import { CodePanel } from "#/features/codeRunner/ui/CodePanel";
import { useProjectPanelData } from "#/features/project/hooks/useProjectPanelData";
import { ProjectInfo } from "#/features/project/ui/ProjectInfo";
import { TestCaseSelectBar } from "#/features/project/ui/TestCaseSelectBar";

import { CollapsiblePanel } from "./CollapsiblePanel";

type MobileCodeViewProps = {
  onRunComplete: () => void;
};

export const MobileCodeView: React.FC<MobileCodeViewProps> = ({
  onRunComplete,
}) => {
  const { selectedProject, selectedCase } = useProjectPanelData();

  const argsHeader = (
    <Box sx={{ minWidth: 0, overflow: "hidden" }}>
      <ProjectInfo project={selectedProject.data} />
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <Head>
        <title>
          {selectedProject.data
            ? `${selectedProject.data.title} - dStruct Playground`
            : "dStruct Playground"}
        </title>
      </Head>
      <CollapsiblePanel header={argsHeader}>
        <Box sx={{ p: 1.5, maxHeight: "35vh", overflowY: "auto" }}>
          <TestCaseSelectBar selectedProject={selectedProject} />
          <ArgsEditor selectedCase={selectedCase} />
        </Box>
      </CollapsiblePanel>

      <Box sx={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
        <CodePanel onRunComplete={onRunComplete} />
      </Box>
    </Box>
  );
};
