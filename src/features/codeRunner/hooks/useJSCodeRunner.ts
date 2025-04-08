import { useCallback } from "react";
import { useDispatch } from "react-redux";
import shortUUID from "short-uuid";

import { selectCaseArguments } from "#/entities/argument/model/caseSlice";
import { callstackSlice } from "#/features/callstack/model/callstackSlice";
import { createRawRuntimeArgs } from "#/features/codeRunner/lib";
import { requestWorkerAction } from "#/features/codeRunner/lib/workers/codeExecWorkerInterface";
import { resetStructuresState } from "#/features/treeViewer/lib";
import { useAppStore } from "#/store/hooks";

import { useJSWorker } from "./useJSWorker";

const uuid = shortUUID();

export const useJSCodeRunner = () => {
  const dispatch = useDispatch();
  const store = useAppStore();
  const { worker } = useJSWorker();

  const runJSBenchmark = useCallback(
    async (codeInput: string) => {
      if (!worker) return;

      const state = store.getState();
      const args = createRawRuntimeArgs(selectCaseArguments(state));

      let startTimestamp = performance.now();

      try {
        const result = await requestWorkerAction(worker, "benchmark", {
          type: "benchmark",
          code: codeInput,
          input: args,
          count: 128,
        });
        startTimestamp = result.workStartTime;
        if (result.error) throw result.error;
        dispatch(
          callstackSlice.actions.setStatus({
            isReady: true,
            error: null,
            result: String(result.output),
            runtime: result.runtime,
            benchmarkResults: result,
            startTimestamp,
          }),
        );
        return result;
      } catch (e: unknown) {
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
              runtime: performance.now() - startTimestamp,
              startTimestamp,
            }),
          );
          console.warn(e);
        } else {
          console.error("Invalid error type: ", e);
        }

        throw e;
      }
    },
    [worker, store, dispatch],
  );

  const runJSCode = useCallback(
    async (codeInput: string) => {
      if (!worker) return;

      const state = store.getState();
      const caseArgs = selectCaseArguments(state);
      const arrayStore = state.arrayStructure;
      const treeStore = state.treeNode;

      // Before running the code, clear the callstack
      dispatch(callstackSlice.actions.removeAll());
      resetStructuresState(dispatch);

      let startTimestamp = performance.now();

      try {
        const { runtime, output, error, callstack, workStartTime } =
          await requestWorkerAction(worker, "run", {
            type: "run",
            code: codeInput,
            caseArgs,
            arrayStore,
            treeStore,
          });
        startTimestamp = workStartTime;
        if (error) throw error;

        // Identify that the callstack is filled and can now be used
        dispatch(
          callstackSlice.actions.setStatus({
            isReady: true,
            error: null,
            result: String(output),
            frames: callstack,
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

        throw e;
      }
    },
    [worker, store, dispatch],
  );

  return { worker, runJSBenchmark, runJSCode };
};
