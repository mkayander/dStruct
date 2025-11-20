import AutoFixHigh from "@mui/icons-material/AutoFixHigh";
import ContentCopy from "@mui/icons-material/ContentCopy";
import PlayArrow from "@mui/icons-material/PlayArrow";
import { TabContext, TabList } from "@mui/lab";
import {
  Box,
  Button,
  IconButton,
  type SelectChangeEvent,
  Stack,
  Tab,
  Tooltip,
} from "@mui/material";
import type * as monaco from "monaco-editor";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useSnackbar } from "notistack";
import React, { useEffect, useRef, useState } from "react";

import { selectCallstackError } from "#/features/callstack/model/callstackSlice";
import {
  getCodeKey,
  isLanguageValid,
  type ProgrammingLanguage,
  useCodeExecution,
} from "#/features/codeRunner/hooks/useCodeExecution";
import { codePrefixLinesCount } from "#/features/codeRunner/lib/setGlobalRuntimeContext";
import prettierIcon from "#/features/codeRunner/ui/assets/prettierIcon.svg";
import { CodeRunner } from "#/features/codeRunner/ui/CodeRunner";
import { EditorLanguageSelect } from "#/features/codeRunner/ui/EditorLanguageSelect";
import {
  EditorState,
  EditorStateIcon,
} from "#/features/codeRunner/ui/EditorStateIcon";
import { SolutionSelectBar } from "#/features/codeRunner/ui/SolutionSelectBar";
import {
  projectSlice,
  selectIsEditable,
} from "#/features/project/model/projectSlice";
import { selectIsEditingNodes } from "#/features/treeViewer/model/editorSlice";
import { api } from "#/shared/api";
import {
  useI18nContext,
  usePlaygroundSlugs,
  useSearchParam,
} from "#/shared/hooks";
import { LoadingSkeletonOverlay } from "#/shared/ui/atoms/LoadingSkeletonOverlay";
import { SolutionComplexityLabel } from "#/shared/ui/atoms/SolutionComplexityLabel";
import {
  PYTHON_SUPPORT_MODAL_ID,
  PythonSupportModal,
} from "#/shared/ui/organisms/PythonSupportModal";
import { PanelWrapper } from "#/shared/ui/templates/PanelWrapper";
import { type PanelContentProps } from "#/shared/ui/templates/SplitPanelsLayout/SplitPanelsLayout";
import { StyledTabPanel } from "#/shared/ui/templates/StyledTabPanel";
import { TabListWrapper } from "#/shared/ui/templates/TabListWrapper";
import { useAppDispatch, useAppSelector } from "#/store/hooks";

export const CodePanel: React.FC<PanelContentProps> = ({ verticalSize }) => {
  const dispatch = useAppDispatch();
  const session = useSession();
  const trpcUtils = api.useUtils();
  const changeTimeoutId = useRef<ReturnType<typeof setTimeout>>(null);

  const { LL } = useI18nContext();

  const [runMode] = useSearchParam("mode");
  const [language, setLanguage] = useSearchParam<ProgrammingLanguage>(
    "language",
    {
      defaultValue: "javascript",
      validate: isLanguageValid,
    },
  );
  const [modalName, setModalName] = useSearchParam("modal");

  const [tabValue, setTabValue] = useState("1");
  const [codeInput, setCodeInput] = useState("");
  const [monacoInstance, setMonacoInstance] = useState<typeof monaco | null>(
    null,
  );
  const [editorInstance, setEditorInstance] =
    useState<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [textModel, setTextModel] = useState<monaco.editor.ITextModel | null>(
    null,
  );
  const [editorState, setEditorState] = useState(EditorState.INITIAL);
  const [isFormattingAvailable, setIsFormattingAvailable] = useState(true);

  const { projectSlug = "", solutionSlug = "" } = usePlaygroundSlugs();
  const isEditable = useAppSelector(selectIsEditable);
  const isEditingNodes = useAppSelector(selectIsEditingNodes);
  const error = useAppSelector(selectCallstackError);

  const selectedProject = api.project.getBySlug.useQuery(projectSlug || "", {
    enabled: Boolean(projectSlug),
  });
  const currentSolution = api.project.getSolutionBySlug.useQuery(
    {
      projectId: selectedProject.data?.id || "",
      slug: solutionSlug,
    },
    {
      enabled: Boolean(selectedProject.data?.id && solutionSlug),
    },
  );

  const updateSolution = api.project.updateSolution.useMutation();

  const { enqueueSnackbar } = useSnackbar();

  const { isProcessing, runCode, runBenchmark } = useCodeExecution(
    codeInput,
    language || "javascript",
  );

  // Update code on solution change
  useEffect(() => {
    if (!currentSolution.data) return;
    if (!isFormattingAvailable) setIsFormattingAvailable(true);

    dispatch(projectSlice.actions.loadFinish());

    const key = getCodeKey(language);
    const newCode = currentSolution.data[key] ?? "";

    setEditorState(EditorState.INITIAL);
    if (textModel && !textModel.isDisposed()) {
      textModel.setValue(newCode);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSolution.data?.slug, language, textModel]);

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
      const [, strLine, strColumn] = posLine.match(/:(\d+):(\d+)\)$/) ?? [];
      const line = Number(strLine) - 2 - codePrefixLinesCount;
      const column = Number(strColumn);

      if (line && column) {
        startLineNumber = line;
        endLineNumber = startLineNumber;
        startColumn = column;
        endColumn = column + 32;

        // set cursor position
        if (editorInstance) {
          editorInstance.setPosition({ lineNumber: line, column });
          editorInstance.revealLineInCenterIfOutsideViewport(line);
        }
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
  }, [editorInstance, error, monacoInstance, textModel]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  const handleLanguageChange = (event: SelectChangeEvent) => {
    setLanguage(event.target.value);
  };

  const handleRunCode = async () => {
    if (runMode === "benchmark") {
      const result = await runBenchmark();
      console.log("Worker: bench result: ", result);
    } else {
      void runCode();
    }
  };

  const updateSolutionOnServer = (
    value: string | undefined,
    ev: monaco.editor.IModelContentChangedEvent,
  ) => {
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

      const key = getCodeKey(language);

      clearTimeout(changeTimeoutId.current ?? undefined);
      const newTimeout = (changeTimeoutId.current = setTimeout(async () => {
        const data = await updateSolution.mutateAsync({
          projectId: currentSolution.data.projectId,
          solutionId: currentSolution.data.id,
          [key]: value,
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

  const handleChangeCode = (
    value: string | undefined,
    ev: monaco.editor.IModelContentChangedEvent,
  ) => {
    setCodeInput(value ?? "");
    if (!isFormattingAvailable) setIsFormattingAvailable(true);

    // Only update the solution on server if it was a user edit
    if (ev.isFlush) {
      return;
    }

    updateSolutionOnServer(value, ev);
  };

  const formatJavaScript = api.code.formatJavaScript.useMutation();

  const handleFormatCode = async () => {
    if (language === "javascript") {
      try {
        const result = await formatJavaScript.mutateAsync({ code: codeInput });
        if (textModel && result.formatted) {
          const edit: monaco.editor.IIdentifiedSingleEditOperation = {
            range: textModel.getFullModelRange(),
            text: result.formatted,
          };
          textModel.pushEditOperations(
            [],
            [edit],
            () => null, // no undo stop
          );
          // Reset cursor to beginning since we don't have cursor offset from server
          editorInstance?.setPosition({ lineNumber: 1, column: 1 });
        }
      } catch (error) {
        console.error("Error formatting code:", error);
        enqueueSnackbar("Failed to format code", { variant: "error" });
      }
    }
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
    updateSolution.isPending;

  let editorHeight = 500;
  if (verticalSize) {
    editorHeight = verticalSize * 9 * (window.innerHeight / 1010);
  }

  return (
    <PanelWrapper
      onKeyDown={(ev) => {
        if (ev.code === "KeyS" && ev.ctrlKey) {
          ev.preventDefault();
          handleRunCode();
        }
      }}
    >
      <PythonSupportModal
        open={modalName === PYTHON_SUPPORT_MODAL_ID}
        onClose={() => setModalName("")}
      />

      <LoadingSkeletonOverlay />

      <TabContext value={tabValue}>
        <TabListWrapper>
          <TabList onChange={handleTabChange} aria-label={LL.PANEL_TABS()}>
            <Tab label={LL.CODE_RUNNER()} value="1" />
          </TabList>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Tooltip
              title={
                <Box display="flex" alignItems="center" gap="3px">
                  {language === "javascript" ? (
                    <>
                      {LL.FORMAT_CODE_WITH()} <b>Prettier</b>{" "}
                      <Image
                        src={prettierIcon}
                        alt={`'Prettier' ${LL.FORMATTING_ICON()}`}
                        width={22}
                        height={22}
                      />
                    </>
                  ) : (
                    <span>Formatting is only available for JavaScript</span>
                  )}
                </Box>
              }
              arrow
            >
              <span>
                <IconButton
                  disabled={!isFormattingAvailable || language !== "javascript"}
                  loading={formatJavaScript.isPending}
                  onClick={handleFormatCode}
                >
                  <AutoFixHigh fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
            <Button
              variant="text"
              color="success"
              title={LL.RUN_CODE()}
              disabled={isEditingNodes}
              endIcon={<PlayArrow />}
              loading={isProcessing}
              loadingPosition="end"
              onClick={handleRunCode}
              sx={{ height: "100%", borderRadius: "0 8px 0 0" }}
            >
              {LL.RUN()}
            </Button>
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
              language={language}
              height={editorHeight}
              value={codeInput}
              onChange={handleChangeCode}
              isUpdating={isLoading}
              setMonacoInstance={setMonacoInstance}
              setEditorInstance={setEditorInstance}
              setTextModel={setTextModel}
            />
            <Stack
              spacing={1}
              sx={{
                position: "absolute",
                top: "6px",
                right: "20px",
                opacity: 0.7,
                alignItems: "end",
              }}
            >
              <Tooltip title="Programming Language" arrow placement="left">
                <Box>
                  <EditorLanguageSelect
                    language={language}
                    handleLanguageChange={handleLanguageChange}
                  />
                </Box>
              </Tooltip>
              <EditorStateIcon
                state={editorState}
                isLoading={updateSolution.isPending}
              />
              <Tooltip
                title={LL.COPY_CODE_TO_CLIPBOARD()}
                arrow
                placement="left"
              >
                <IconButton
                  onClick={copyCode}
                  style={{ marginRight: "-6px", marginTop: "2px" }}
                >
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
