"use client";

import { useCallback, useEffect, useState } from "react";

import { isArgumentArrayType } from "#/entities/argument/lib";
import { ArgumentType } from "#/entities/argument/model/argumentObject";
import { arrayStructureSlice } from "#/entities/dataStructures/array/model/arraySlice";
import { treeNodeSlice } from "#/entities/dataStructures/node/model/nodeSlice";
import {
  type CallFrame,
  callstackSlice,
  selectCallstack,
  selectCallstackFrameIndex,
  selectCallstackIsPlaying,
} from "#/features/callstack/model/callstackSlice";
import { usePrevious } from "#/shared/hooks/usePrevious";
import { useAppDispatch, useAppSelector } from "#/store/hooks";

import { resetStructuresState, validateAnimationName } from "../lib";

export const useNodesRuntimeUpdates = (
  playbackInterval: number,
  replayCount: number,
) => {
  const dispatch = useAppDispatch();

  const [isActive, setIsActive] = useState(false);

  const callstackIsPlaying = useAppSelector(selectCallstackIsPlaying);
  const frameIndex = useAppSelector(selectCallstackFrameIndex);
  const prevFrameIndex = usePrevious(frameIndex) ?? -2;
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
                  color: frame.args.color ?? undefined,
                },
              },
            }),
          );
          if (frame.args["animation"]) {
            dispatch(
              slice.actions.triggerAnimation({
                name: treeName,
                data: {
                  id: frame.nodeId,
                  animation: validateAnimationName(frame.args.animation),
                },
              }),
            );
          }
          break;

        case "setColorMap":
          dispatch(
            slice.actions.setColorMap({
              name: treeName,
              data: {
                colorMap: frame.args.colorMap,
              },
            }),
          );
          break;

        case "setInfo":
          dispatch(
            slice.actions.update({
              name: treeName,
              data: {
                id: frame.nodeId,
                changes: {
                  info: frame.args.info,
                },
              },
            }),
          );
          break;

        case "setHeaders":
          if ("setHeaders" in slice.actions) {
            dispatch(
              slice.actions.setHeaders({
                name: treeName,
                data: {
                  colHeaders: frame.args.colHeaders,
                  rowHeaders: frame.args.rowHeaders,
                },
              }),
            );
          }
          break;

        case "setVal":
          dispatch(
            slice.actions.update({
              name: treeName,
              data: {
                id: frame.nodeId,
                changes: {
                  value: frame.args.value ?? undefined,
                  childName: frame.args.childName,
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
            dispatch(
              slice.actions.add({
                name: treeName,
                data: {
                  id: frame.nodeId,
                  argType: frame.argType,
                  value: frame.args.value,
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
          if (!("setChildId" in slice.actions)) {
            dispatch(
              slice.actions.add({
                name: treeName,
                data: {
                  id: frame.nodeId,
                  ...frame.args,
                },
              }),
            );
          }
          break;

        case "addArray":
          if ("create" in slice.actions && isArgumentArrayType(frame.argType)) {
            dispatch(
              slice.actions.create({
                name: treeName,
                data: {
                  nodes: frame.args.arrayData,
                  argType: frame.argType,
                  options: frame.args.options,
                },
              }),
            );
          }
          break;

        case "deleteNode":
          dispatch(
            slice.actions.hide({ name: treeName, data: { id: frame.nodeId } }),
          );
          break;

        case "setNextNode":
        case "setLeftChild":
          if ("setChildId" in slice.actions) {
            const { childId, childTreeName } = frame.args;
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
            const { childId, childTreeName } = frame.args;
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

        case "readArrayItem":
        case "blink":
          dispatch(
            slice.actions.triggerAnimation({
              name: treeName,
              data: {
                id: frame.nodeId,
                animation: "blink",
              },
            }),
          );
          break;

        case "clearAppearance":
          dispatch(
            slice.actions.clearAppearance({
              name: treeName,
              data: undefined,
            }),
          );
          break;

        default:
          console.error("Unknown frame name: ", frame.name);
      }
    },
    [dispatch],
  );

  const revertFrame = useCallback(
    (frame: CallFrame) => {
      if (!("treeName" in frame)) return;

      const treeName = frame.treeName;
      const slice =
        frame.structureType === "array" ? arrayStructureSlice : treeNodeSlice;

      switch (frame.name) {
        case "setColor":
          if (frame.prevArgs) {
            applyFrame({
              ...frame,
              args: frame.prevArgs,
            });
          }
          break;

        case "setColorMap":
          if (frame.prevArgs) {
            applyFrame({
              ...frame,
              args: frame.prevArgs,
            });
          }
          break;

        case "setVal": {
          if (frame.prevArgs) {
            applyFrame({
              ...frame,
              args: frame.prevArgs,
            });
          }
          break;
        }

        case "addArray":
          if ("delete" in slice.actions) {
            dispatch(slice.actions.delete({ name: treeName, data: undefined }));
          }
          break;

        case "addArrayItem":
        case "addNode":
          dispatch(
            slice.actions.remove({
              name: treeName,
              data: { id: frame.nodeId },
            }),
          );
          break;

        case "deleteNode":
          dispatch(
            slice.actions.reveal({
              name: treeName,
              data: { id: frame.nodeId },
            }),
          );
          break;

        case "setNextNode":
        case "setLeftChild":
          if (frame.prevArgs) {
            if ("revertChildId" in slice.actions)
              dispatch(
                slice.actions.revertChildId({
                  name: treeName,
                  data: {
                    id: frame.nodeId,
                    ...frame.args,
                  },
                }),
              );
            applyFrame({
              ...frame,
              name: "setLeftChild",
              args: frame.prevArgs,
            });
          }
          break;

        case "setRightChild":
          if (frame.prevArgs) {
            applyFrame({
              ...frame,
              name: "setRightChild",
              args: frame.prevArgs,
            });
          }
          break;

        case "readArrayItem":
        case "blink":
          dispatch(
            slice.actions.update({
              name: treeName,
              data: {
                id: frame.nodeId,
                changes: {
                  animation: undefined,
                },
              },
            }),
          );
          break;
      }
    },
    [applyFrame, dispatch],
  );

  useEffect(() => {
    if (!callstackIsReady || callstack.length === 0) return;

    const diff = frameIndex - prevFrameIndex;

    const isForward = diff > 0;
    if (frameIndex !== prevFrameIndex) {
      if (isForward) {
        const currentFrame = callstack[frameIndex];
        if (currentFrame) {
          applyFrame(currentFrame);
        }
      } else {
        const prevFrame = callstack[prevFrameIndex];
        if (prevFrame) {
          revertFrame(prevFrame);
        }
      }
    }

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

      setIsActive(nextIndex < callstack.length - 1);
      if (nextIndex < callstack.length) {
        dispatch(callstackSlice.actions.setFrameIndex(nextIndex));
      }
      if (nextIndex >= callstack.length - 1) {
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
      setIsActive(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, replayCount, callstack, callstackIsReady]);
};
