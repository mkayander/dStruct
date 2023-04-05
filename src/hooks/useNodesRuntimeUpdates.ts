import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "#/store/hooks";
import { selectCallstack } from "#/store/reducers/callstackReducer";
import { type arrayStructureSlice } from "#/store/reducers/structures/arrayReducer";
import { type treeNodeSlice } from "#/store/reducers/structures/treeNodeReducer";
import { validateAnimationName } from "#/utils";

export const useNodesRuntimeUpdates = (
  treeName: string,
  slice: typeof treeNodeSlice | typeof arrayStructureSlice,
  playbackInterval: number,
  replayCount: number
) => {
  const dispatch = useAppDispatch();

  const { isReady: callstackIsReady, frames: callstack } =
    useAppSelector(selectCallstack);

  useEffect(() => {
    let isStarted = false;

    if (!callstackIsReady || callstack.length === 0) return;

    let i = 0;

    const intervalId = setInterval(() => {
      const frame = callstack[i];

      if (i >= callstack.length || !frame) {
        clearInterval(intervalId);
        return;
      }

      switch (frame.name) {
        case "setColor": {
          dispatch(
            slice.actions.update({
              name: treeName,
              data: {
                id: frame.nodeId,
                changes: {
                  color: frame.args[0] ?? undefined,
                  animation: validateAnimationName(frame.args[1]),
                },
              },
            })
          );
          break;
        }

        case "setVal":
          dispatch(
            slice.actions.update({
              name: treeName,
              data: {
                id: frame.nodeId,
                changes: {
                  value: frame.args[0] ?? undefined,
                },
              },
            })
          );
          break;

        case "setNextNode":
        case "setLeftChild":
          "setChildId" in slice.actions &&
            dispatch(
              slice.actions.setChildId({
                name: treeName,
                data: {
                  id: frame.nodeId,
                  index: 0,
                  childId: frame.args[0] ?? undefined,
                },
              })
            );
          break;
        case "setRightChild":
          "setChildId" in slice.actions &&
            dispatch(
              slice.actions.setChildId({
                name: treeName,
                data: {
                  id: frame.nodeId,
                  index: 1,
                  childId: frame.args[0] ?? undefined,
                },
              })
            );
          break;

        case "blink":
          dispatch(
            slice.actions.update({
              name: treeName,
              data: {
                id: frame.nodeId,
                changes: {
                  animation: "blink",
                },
              },
            })
          );
      }

      isStarted = true;

      i++;
    }, playbackInterval);

    return () => {
      clearInterval(intervalId);
      isStarted && dispatch(slice.actions.resetAll());
    };
  }, [
    callstack,
    callstackIsReady,
    dispatch,
    playbackInterval,
    slice.actions,
    treeName,
    replayCount,
  ]);
};
