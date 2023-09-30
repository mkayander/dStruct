"use client";

import { useCallback, useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "#/store/hooks";
import {
  type CallFrame,
  callstackSlice,
  selectCallstack,
  selectCallstackIsPlaying,
} from "#/store/reducers/callstackReducer";
import { arrayStructureSlice } from "#/store/reducers/structures/arrayReducer";
import { treeNodeSlice } from "#/store/reducers/structures/treeNodeReducer";
import { resetStructuresState, validateAnimationName } from "#/utils";
import { ArgumentType, isArgumentArrayType } from "#/utils/argumentObject";

export const useNodesRuntimeUpdates = (
  [frameIndex, setFrameIndex]: [
    number,
    React.Dispatch<React.SetStateAction<number>>,
  ],
  playbackInterval: number,
  replayCount: number,
) => {
  const dispatch = useAppDispatch();

  const [isActive, setIsActive] = useState(false);

  const callstackIsPlaying = useAppSelector(selectCallstackIsPlaying);
  const { isReady: callstackIsReady, frames: callstack } =
    useAppSelector(selectCallstack);

  const applyFrame = useCallback(
    (frame: CallFrame) => {
      if (!("treeName" in frame)) return;

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
            }),
          );
          break;

        case "setColorMap":
          dispatch(
            slice.actions.setColorMap({
              name: treeName,
              data: {
                colorMap: frame.args[0],
              },
            }),
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
            }),
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
              }),
            );
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
              }),
            );
          break;

        case "addArray":
          "create" in slice.actions &&
            isArgumentArrayType(frame.argType) &&
            dispatch(
              slice.actions.create({
                name: treeName,
                data: {
                  nodes: frame.args[0],
                  argType: frame.argType,
                  options: frame.args[1],
                },
              }),
            );
          break;

        case "deleteNode":
          dispatch(
            slice.actions.remove({
              name: treeName,
              data: {
                id: frame.nodeId,
              },
            }),
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
              }),
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
              }),
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
            }),
          );
          break;

        default:
          console.error("Unknown frame name: ", frame.name);
      }
    },
    [dispatch],
  );

  useEffect(() => {
    if (!callstackIsReady || callstack.length === 0) return;

    const currentFrame = callstack[frameIndex];
    currentFrame && applyFrame(currentFrame);

    if (!callstackIsPlaying) return;

    const getNextValidIndex = () => {
      let nextIndex = frameIndex + 1;
      let frame = callstack[nextIndex];

      while (frame && !("treeName" in frame)) {
        nextIndex++;
        frame = callstack[nextIndex];
      }

      return nextIndex;
    };

    const timeoutId = setTimeout(() => {
      const nextIndex = getNextValidIndex();

      if (nextIndex < callstack.length) {
        setIsActive(true);
        setFrameIndex(nextIndex);
      } else {
        dispatch(callstackSlice.actions.setIsPlaying(false));
      }
    }, playbackInterval);

    return () => {
      clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    applyFrame,
    callstack,
    callstackIsReady,
    callstackIsPlaying,
    frameIndex,
    playbackInterval,
  ]);

  useEffect(() => {
    if (isActive) {
      resetStructuresState(dispatch, false);
      setFrameIndex(-1);
      setIsActive(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, replayCount, playbackInterval, callstack, callstackIsReady]);
};
