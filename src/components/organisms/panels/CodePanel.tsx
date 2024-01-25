import { AutoFixHigh, ContentCopy, PlayArrow } from "@mui/icons-material";
import { LoadingButton, TabContext, TabList } from "@mui/lab";
import { Box, IconButton, Stack, Tab, Tooltip } from "@mui/material";
import type * as monaco from "monaco-editor";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useSnackbar } from "notistack";
import parserBabel from "prettier/plugins/babel";
import * as prettierPluginEstree from "prettier/plugins/estree";
import prettier from "prettier/standalone";
import React, {
  type MouseEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";

import { SolutionComplexityLabel } from "#/components/atoms/SolutionComplexityLabel";
import prettierIcon from "#/components/molecules/CodeRunner/assets/prettierIcon.svg";
import { CodeRunner } from "#/components/molecules/CodeRunner/CodeRunner";
import {
  EditorState,
  EditorStateIcon,
} from "#/components/molecules/CodeRunner/EditorStateIcon";
import { SolutionSelectBar } from "#/components/molecules/SelectBar/SolutionSelectBar";
import { PanelWrapper } from "#/components/organisms/panels/common/PanelWrapper";
import {
  StyledTabPanel,
  TabListWrapper,
} from "#/components/organisms/panels/common/styled";
import { type PanelContentProps } from "#/components/templates/SplitPanelsLayout/SplitPanelsLayout";
import { useCodeExecution, usePlaygroundSlugs } from "#/hooks";
import { useI18nContext } from "#/hooks";
import { codePrefixLinesCount } from "#/hooks/useCodeExecution";
import { useAppSelector } from "#/store/hooks";
import { selectRuntimeData } from "#/store/reducers/callstackReducer";
import { selectIsEditable } from "#/store/reducers/projectReducer";
import { trpc } from "#/utils";

export const CodePanel: React.FC<PanelContentProps> = ({ verticalSize }) => {
  const session = useSession();
  const trpcUtils = trpc.useUtils();
  const changeTimeoutId = useRef<ReturnType<typeof setTimeout>>();

  const { LL } = useI18nContext();

  const [tabValue, setTabValue] = useState("1");
  const [codeInput, setCodeInput] = useState<string>("");
  const [monacoInstance, setMonacoInstance] = useState<typeof monaco | null>(
    null,
  );
  const [textModel, setTextModel] = useState<monaco.editor.ITextModel | null>(
    null,
  );
  const [editorState, setEditorState] = useState(EditorState.INITIAL);
  const [isFormattingAvailable, setIsFormattingAvailable] = useState(true);

  const { projectSlug = "", solutionSlug = "" } = usePlaygroundSlugs();
  const isEditable = useAppSelector(selectIsEditable);
  const { error } = useAppSelector(selectRuntimeData);

  const selectedProject = trpc.project.getBySlug.useQuery(projectSlug || "", {
    enabled: Boolean(projectSlug),
  });
  const currentSolution = trpc.project.getSolutionBySlug.useQuery(
    {
      projectId: selectedProject.data?.id || "",
      slug: solutionSlug,
    },
    {
      enabled: Boolean(selectedProject.data?.id && solutionSlug),
    },
  );

  const updateSolution = trpc.project.updateSolution.useMutation();

  const { enqueueSnackbar } = useSnackbar();

  const { runCode, runBenchmark } = useCodeExecution(codeInput);

  // Update code on solution change
  useEffect(() => {
    if (!currentSolution.data?.code) return;
    if (!isFormattingAvailable) setIsFormattingAvailable(true);

    setEditorState(EditorState.INITIAL);
    setCodeInput(currentSolution.data.code);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSolution.data?.slug]);

  // Handle code errors
  useEffect(() => {
    if (!monacoInstance || !textModel) return;
    if (!error) {
      monacoInstance.editor.setModelMarkers(
        textModel,
        "javascript",
        [], // clear markers
      );
      return;
    }

    let startLineNumber = 3;
    let endLineNumber = 9;
    let startColumn = 1;
    let endColumn = 10;

    const [, posLine] = error.stack?.split("\n") ?? [];

    if (posLine) {
      const [, line, column] = posLine.match(/:(\d+):(\d+)\)$/) ?? [];

      if (line && column) {
        startLineNumber = Number(line) - 2 - codePrefixLinesCount;
        endLineNumber = startLineNumber;
        startColumn = Number(column);
        endColumn = Number(column) + 10;
      }
    }

    monacoInstance.editor.setModelMarkers(textModel, "javascript", [
      {
        severity: monacoInstance.MarkerSeverity.Error,
        message: `${error.name}: ${error.message}`,
        startLineNumber,
        endLineNumber,
        startColumn,
        endColumn,
      },
    ]);
  }, [error, monacoInstance, textModel]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  const handleRunCode: MouseEventHandler<HTMLButtonElement> = async (event) => {
    if (event.ctrlKey) {
      const result = await runBenchmark();
      console.log("Worker: bench result: ", result);
    } else {
      runCode();
    }
  };

  const handleChangeCode = (
    value: string | undefined,
    ev: monaco.editor.IModelContentChangedEvent,
  ) => {
    setCodeInput(value ?? "");
    if (!isFormattingAvailable) setIsFormattingAvailable(true);
    const range = ev.changes[0]?.rangeLength ?? 0;
    if (session.status === "unauthenticated" && range > 0 && range < 200) {
      setEditorState(EditorState.FORKED_UNAUTHENTICATED);
    } else if (
      projectSlug &&
      solutionSlug &&
      isEditable &&
      currentSolution.data
    ) {
      setEditorState(EditorState.PENDING_CHANGES);

      clearTimeout(changeTimeoutId.current);
      const newTimeout = (changeTimeoutId.current = setTimeout(async () => {
        const data = await updateSolution.mutateAsync({
          projectId: currentSolution.data.projectId,
          solutionId: currentSolution.data.id,
          code: value,
        });
        if (newTimeout === changeTimeoutId.current) {
          trpcUtils.project.getSolutionBySlug.setData(
            {
              projectId: data.projectId,
              slug: data.slug,
            },
            data,
          );
          setEditorState(EditorState.SAVED_ON_SERVER);
        }
      }, 750));
    }
  };

  const handleFormatCode = async () => {
    const formattedCode = await prettier.format(codeInput, {
      parser: "babel",
      plugins: [parserBabel, prettierPluginEstree],
    });
    textModel?.setValue(formattedCode);
    setIsFormattingAvailable(false);
  };

  const copyCode = () => {
    void navigator.clipboard.writeText(codeInput);
    enqueueSnackbar(`${LL.CODE_COPIED_TO_CLIPBOARD()} 🧑‍💻`, {
      variant: "success",
    });
  };

  const isLoading =
    selectedProject.isLoading ||
    currentSolution.isLoading ||
    updateSolution.isLoading;

  let editorHeight = 500;
  if (verticalSize) {
    editorHeight = verticalSize * 9 * (window.innerHeight / 1010);
  }

  return (
    <PanelWrapper>
      <TabContext value={tabValue}>
        <TabListWrapper>
          <TabList onChange={handleTabChange} aria-label={LL.PANEL_TABS()}>
            <Tab label={LL.CODE_RUNNER()} value="1" />
          </TabList>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Tooltip
              title={
                <Box display="flex" alignItems="center" gap="3px">
                  {LL.FORMAT_CODE_WITH()} <b>Prettier</b>{" "}
                  <Image
                    alt={`'Prettier' ${LL.FORMATTING_ICON()}`}
                    {...prettierIcon}
                    width={22}
                    height={22}
                  />
                </Box>
              }
              arrow
            >
              <span>
                <IconButton
                  disabled={!isFormattingAvailable}
                  onClick={handleFormatCode}
                >
                  <AutoFixHigh fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
            <LoadingButton
              variant="text"
              color="success"
              title={LL.RUN_CODE()}
              endIcon={<PlayArrow />}
              loadingPosition="end"
              onClick={handleRunCode}
              sx={{ height: "100%", borderRadius: "0 8px 0 0" }}
            >
              {LL.RUN()}
            </LoadingButton>
          </Stack>
        </TabListWrapper>
        <StyledTabPanel
          value="1"
          useScroll={false}
          scrollContainerStyle={{ zIndex: 1000, overflowY: "hidden" }}
          scrollViewportStyle={{ zIndex: 100, overflowY: "hidden" }}
          sx={{ p: 0, overflowY: "hidden" }}
        >
          <Box
            mx={2}
            my={1}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <SolutionSelectBar selectedProject={selectedProject} />

            <SolutionComplexityLabel solution={currentSolution} />
          </Box>
          <Box
            sx={{
              position: "relative",
            }}
          >
            <CodeRunner
              height={editorHeight}
              value={codeInput}
              onChange={handleChangeCode}
              isUpdating={isLoading}
              setMonacoInstance={setMonacoInstance}
              setTextModel={setTextModel}
            />
            <Stack
              spacing={1}
              sx={{
                position: "absolute",
                top: "6px",
                right: "20px",
                opacity: 0.7,
                alignItems: "center",
              }}
            >
              <EditorStateIcon
                state={editorState}
                isLoading={updateSolution.isLoading}
              />
              <Tooltip
                title={LL.COPY_CODE_TO_CLIPBOARD()}
                arrow
                placement="left"
              >
                <IconButton onClick={copyCode}>
                  <ContentCopy fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>
        </StyledTabPanel>
      </TabContext>
    </PanelWrapper>
  );
};
