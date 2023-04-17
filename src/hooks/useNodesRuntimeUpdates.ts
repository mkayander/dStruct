import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "#/store/hooks";
import { selectCallstack } from "#/store/reducers/callstackReducer";
import { arrayStructureSlice } from "#/store/reducers/structures/arrayReducer";
import { treeNodeSlice } from "#/store/reducers/structures/treeNodeReducer";
import { resetStructuresState, validateAnimationName } from "#/utils";
import { ArgumentType } from "#/utils/argumentObject";

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

      if (frame.name === "error") return;

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
          if (
            "setChildId" in slice.actions &&
            (frame.argType === ArgumentType.BINARY_TREE ||
              frame.argType === ArgumentType.LINKED_LIST)
          ) {
            const [value] = frame.args;
            dispatch(
              slice.actions.add({
                name: treeName,
                data: {
                  id: frame.nodeId,
                  argType: frame.argType,
                  value,
                  depth: 0,
                  y: 0,
                  x: 0,
                  childrenIds: [],
                },
              })
            );
            console.log("added node", frame.nodeId);
          }
          break;

        case "addArrayItem":
          !("setChildId" in slice.actions) &&
            dispatch(
              slice.actions.add({
                name: treeName,
                data: {
                  id: frame.nodeId,
                  value: frame.args[0],
                  index: frame.args[1],
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
          if ("setChildId" in slice.actions) {
            const [childId, childTreeName] = frame.args;
            dispatch(
              slice.actions.setChildId({
                name: treeName,
                data: {
                  id: frame.nodeId,
                  index: 0,
                  childId: childId ?? undefined,
                  childTreeName,
                },
              })
            );
          }
          break;
        case "setRightChild":
          if ("setChildId" in slice.actions) {
            const [childId, childTreeName] = frame.args;
            dispatch(
              slice.actions.setChildId({
                name: treeName,
                data: {
                  id: frame.nodeId,
                  index: 1,
                  childId: childId ?? undefined,
                  childTreeName,
                },
              })
            );
          }
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
      isStarted && resetStructuresState(dispatch, false);
    };
  }, [callstack, callstackIsReady, dispatch, playbackInterval, replayCount]);
};
