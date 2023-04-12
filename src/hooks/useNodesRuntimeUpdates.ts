import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "#/store/hooks";
import { selectCallstack } from "#/store/reducers/callstackReducer";
import { arrayStructureSlice } from "#/store/reducers/structures/arrayReducer";
import { treeNodeSlice } from "#/store/reducers/structures/treeNodeReducer";
import { resetStructuresState, validateAnimationName } from "#/utils";

export const useNodesRuntimeUpdates = (
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

      const treeName = frame.treeName;
      const slice =
        frame.structureType === "array" ? arrayStructureSlice : treeNodeSlice;

      switch (frame.name) {
        case "setColor":
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

        case "setColorMap":
          dispatch(
            slice.actions.setColorMap({
              name: treeName,
              data: {
                colorMap: frame.args[0],
              },
            })
          );
          break;

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

        case "addNode":
          dispatch(
            slice.actions.add({
              name: treeName,
              data: {
                id: frame.nodeId,
                value: frame.args[0],
                depth: 0,
                y: 0,
                x: 0,
                childrenIds: [],
              },
            })
          );
          break;

        case "deleteNode":
          dispatch(
            slice.actions.remove({
              name: treeName,
              data: {
                id: frame.nodeId,
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
          break;

        default:
          console.error("Unknown frame name: ", frame.name);
      }

      isStarted = true;

      i++;
    }, playbackInterval);

    return () => {
      clearInterval(intervalId);
      isStarted && resetStructuresState(dispatch);
    };
  }, [callstack, callstackIsReady, dispatch, playbackInterval, replayCount]);
};
