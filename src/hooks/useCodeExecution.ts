import { useEffect } from "react";
import { useDispatch } from "react-redux";
import shortUUID from "short-uuid";

import { useAppSelector } from "#/store/hooks";
import { callstackSlice } from "#/store/reducers/callstackReducer";
import { selectCaseArguments } from "#/store/reducers/caseReducer";
import { arrayDataSelector } from "#/store/reducers/structures/arrayReducer";
import { treeDataSelector } from "#/store/reducers/structures/treeNodeReducer";
import {
  assignGlobalRuntimeContext,
  createCaseRuntimeArgs,
  resetStructuresState,
} from "#/utils";

const uuid = shortUUID();

export const useCodeExecution = (codeInput: string) => {
  const dispatch = useDispatch();

  const treeStore = useAppSelector(treeDataSelector);
  const arrayStore = useAppSelector(arrayDataSelector);
  const caseArgs = useAppSelector(selectCaseArguments);

  useEffect(() => {
    assignGlobalRuntimeContext(dispatch);
  }, [dispatch]);

  const runCode = () => {
    const args = createCaseRuntimeArgs(
      dispatch,
      treeStore,
      arrayStore,
      caseArgs
    );

    const getInputFunction = new Function(codeInput);

    const startTimestamp = performance.now();

    try {
      const runFunction = getInputFunction();

      // Before running the code, clear the callstack
      dispatch(callstackSlice.actions.removeAll());
      resetStructuresState(dispatch);

      const result = runFunction(...args);
      const runtime = performance.now() - startTimestamp;

      const serializedResult =
        typeof result === "object"
          ? JSON.parse(JSON.stringify(result))
          : result;

      // Identify that the callstack is filled and can now be used
      dispatch(
        callstackSlice.actions.setStatus({
          isReady: true,
          error: null,
          result: serializedResult,
          runtime,
          startTimestamp,
        })
      );
    } catch (e: unknown) {
      const runtime = performance.now() - startTimestamp;
      if (e instanceof Error) {
        dispatch(
          callstackSlice.actions.addOne({
            id: uuid.generate(),
            timestamp: performance.now(),
            name: "error",
          })
        );
        dispatch(
          callstackSlice.actions.setStatus({
            isReady: true,
            error: { name: e.name, message: e.message, stack: e.stack },
            result: null,
            runtime,
            startTimestamp,
          })
        );
      } else {
        console.error("Invalid error type: ", e);
      }
    }
  };

  return { runCode };
};
