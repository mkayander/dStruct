"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import shortUUID from "short-uuid";

import { useAppSelector } from "#/store/hooks";
import { callstackSlice } from "#/store/reducers/callstackReducer";
import { selectCaseArguments } from "#/store/reducers/caseReducer";
import { arrayDataSelector } from "#/store/reducers/structures/arrayReducer";
import { treeDataSelector } from "#/store/reducers/structures/treeNodeReducer";
import {
  createCaseRuntimeArgs,
  resetStructuresState,
  setGlobalRuntimeContext,
  stringifySolutionResult,
} from "#/utils";

const uuid = shortUUID();

const globalDefinitionsPrefix = `
  const console = {...window.console, log: window.log, error: window.error, warn: window.warn, info: window.info};
  const Array = window.ArrayProxy;
  const String = window.StringProxy;
  const Set = window.SetProxy;
  const Map = window.MapProxy;
`.trim();

export const codePrefixLinesCount = globalDefinitionsPrefix.split("\n").length;

export const useCodeExecution = (codeInput: string) => {
  const dispatch = useDispatch();

  const treeStore = useAppSelector(treeDataSelector);
  const arrayStore = useAppSelector(arrayDataSelector);
  const caseArgs = useAppSelector(selectCaseArguments);

  useEffect(() => {
    setGlobalRuntimeContext(dispatch);
  }, [dispatch]);

  const runCode = () => {
    const args = createCaseRuntimeArgs(
      dispatch,
      treeStore,
      arrayStore,
      caseArgs,
    );

    const prefixedCode = `${globalDefinitionsPrefix}\n${codeInput}`;

    const startTimestamp = performance.now();

    try {
      const getInputFunction = new Function(prefixedCode);
      const runFunction = getInputFunction();

      // Before running the code, clear the callstack
      dispatch(callstackSlice.actions.removeAll());
      resetStructuresState(dispatch);

      const result = runFunction(...args);
      const runtime = performance.now() - startTimestamp;

      const serializedResult = stringifySolutionResult(result);

      // Identify that the callstack is filled and can now be used
      dispatch(
        callstackSlice.actions.setStatus({
          isReady: true,
          error: null,
          result: serializedResult,
          runtime,
          startTimestamp,
        }),
      );
      // Automatically play the callstack
      dispatch(callstackSlice.actions.setIsPlaying(true));
    } catch (e: unknown) {
      const runtime = performance.now() - startTimestamp;
      if (e instanceof Error) {
        dispatch(
          callstackSlice.actions.addOne({
            id: uuid.generate(),
            timestamp: performance.now(),
            name: "error",
          }),
        );
        dispatch(
          callstackSlice.actions.setStatus({
            isReady: true,
            error: { name: e.name, message: e.message, stack: e.stack },
            result: null,
            runtime,
            startTimestamp,
          }),
        );
        console.warn(e);
      } else {
        console.error("Invalid error type: ", e);
      }
    }
  };

  return { runCode };
};
