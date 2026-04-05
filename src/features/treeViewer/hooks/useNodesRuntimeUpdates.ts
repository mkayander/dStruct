"use client";

import { useCallback, useEffect, useMemo } from "react";
import { batch } from "react-redux";

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
  selectCallstackResetVersion,
} from "#/features/callstack/model/callstackSlice";
import { usePrevious } from "#/shared/hooks/usePrevious";
import { useAppDispatch, useAppSelector } from "#/store/hooks";

import {
  getNextPlaybackFrameIndex,
  getPlaybackStepGroups,
  getPlaybackStepIndex,
  type PlaybackStepGroup,
  validateAnimationName,
} from "../lib";

export const useNodesRuntimeUpdates = (playbackInterval: number) => {
  const dispatch = useAppDispatch();

  const callstackIsPlaying = useAppSelector(selectCallstackIsPlaying);
  const frameIndex = useAppSelector(selectCallstackFrameIndex);
  const prevFrameIndex = usePrevious(frameIndex) ?? -2;
  const resetVersion = useAppSelector(selectCallstackResetVersion);
  const prevResetVersion = usePrevious(resetVersion) ?? resetVersion;
  const { isReady: callstackIsReady, frames: callstack } =
    useAppSelector(selectCallstack);
  const playbackStepGroups = useMemo(
    () => getPlaybackStepGroups(callstack),
    [callstack],
  );

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

  const applyPlaybackStepGroup = useCallback(
    (group: PlaybackStepGroup) => {
      if (group.kind !== "swap") {
        applyFrame(group.primaryFrame);
        return;
      }

      const childUpdates = group.frames
        .filter(
          (
            frame,
          ): frame is typeof group.primaryFrame | typeof group.partnerFrame =>
            frame.id === group.primaryFrame.id ||
            frame.id === group.partnerFrame.id,
        )
        .map((frame) => ({
          index: frame.name === "setLeftChild" ? 0 : 1,
          childId: frame.args.childId ?? undefined,
        }));
      const pairedFrameIds = new Set([
        group.primaryFrame.id,
        group.partnerFrame.id,
      ]);
      const nonGroupedFrames = group.frames.filter(
        (frame) => !pairedFrameIds.has(frame.id),
      );

      batch(() => {
        dispatch(
          treeNodeSlice.actions.setChildIds({
            name: group.primaryFrame.treeName,
            data: {
              id: group.primaryFrame.nodeId,
              updates: childUpdates,
            },
          }),
        );

        for (const frame of nonGroupedFrames) {
          applyFrame(frame);
        }
      });
    },
    [applyFrame, dispatch],
  );

  const revertPlaybackStepGroup = useCallback(
    (group: PlaybackStepGroup) => {
      if (group.kind !== "swap") {
        revertFrame(group.primaryFrame);
        return;
      }

      const childUpdates = [group.primaryFrame, group.partnerFrame]
        .filter(
          (
            frame,
          ): frame is
            | (typeof group.primaryFrame & {
                prevArgs: NonNullable<typeof group.primaryFrame.prevArgs>;
              })
            | (typeof group.partnerFrame & {
                prevArgs: NonNullable<typeof group.partnerFrame.prevArgs>;
              }) => Boolean(frame.prevArgs),
        )
        .map((frame) => ({
          index: frame.name === "setLeftChild" ? 0 : 1,
          childId: frame.prevArgs.childId ?? undefined,
        }));
      const pairedFrameIds = new Set([
        group.primaryFrame.id,
        group.partnerFrame.id,
      ]);
      const nonGroupedFrames = group.frames.filter(
        (frame) => !pairedFrameIds.has(frame.id),
      );

      batch(() => {
        for (let index = nonGroupedFrames.length - 1; index >= 0; index -= 1) {
          const frame = nonGroupedFrames[index];
          if (frame) {
            revertFrame(frame);
          }
        }

        dispatch(
          treeNodeSlice.actions.setChildIds({
            name: group.primaryFrame.treeName,
            data: {
              id: group.primaryFrame.nodeId,
              updates: childUpdates,
            },
          }),
        );
      });
    },
    [dispatch, revertFrame],
  );

  const applyFrameRange = useCallback(
    (fromIndex: number, toIndex: number) => {
      for (let index = fromIndex + 1; index <= toIndex; index += 1) {
        const frame = callstack[index];
        if (frame) {
          applyFrame(frame);
        }
      }
    },
    [applyFrame, callstack],
  );

  const revertFrameRange = useCallback(
    (fromIndex: number, toIndex: number) => {
      for (let index = fromIndex; index > toIndex; index -= 1) {
        const frame = callstack[index];
        if (frame) {
          revertFrame(frame);
        }
      }
    },
    [callstack, revertFrame],
  );

  // Apply or revert frame when frameIndex changes; when playing, advance to next frame after playbackInterval.
  useEffect(() => {
    if (!callstackIsReady || callstack.length === 0) return;
    const didReset = resetVersion !== prevResetVersion;

    const diff = frameIndex - prevFrameIndex;
    const currentGroupIndex = getPlaybackStepIndex(
      playbackStepGroups,
      frameIndex,
    );
    const previousGroupIndex = getPlaybackStepIndex(
      playbackStepGroups,
      prevFrameIndex,
    );
    const currentGroup =
      currentGroupIndex >= 0 ? playbackStepGroups[currentGroupIndex] : null;
    const previousGroup =
      previousGroupIndex >= 0 ? playbackStepGroups[previousGroupIndex] : null;

    const isForward = diff > 0;
    if (!didReset && frameIndex !== prevFrameIndex) {
      if (isForward) {
        if (
          currentGroup?.kind === "swap" &&
          frameIndex === currentGroup.endIndex &&
          prevFrameIndex < currentGroup.startIndex
        ) {
          applyPlaybackStepGroup(currentGroup);
        } else {
          applyFrameRange(prevFrameIndex, frameIndex);
        }
      } else {
        if (
          previousGroup?.kind === "swap" &&
          prevFrameIndex === previousGroup.endIndex &&
          frameIndex < previousGroup.startIndex
        ) {
          revertPlaybackStepGroup(previousGroup);
        } else {
          revertFrameRange(prevFrameIndex, frameIndex);
        }
      }
    }

    if (!callstackIsPlaying) return;

    const timeoutId = setTimeout(() => {
      const nextIndex = getNextPlaybackFrameIndex(callstack, frameIndex);

      if (nextIndex !== -1) {
        dispatch(callstackSlice.actions.setFrameIndex(nextIndex));
      }
      if (nextIndex === -1 || nextIndex >= callstack.length - 1) {
        dispatch(callstackSlice.actions.setIsPlaying(false));
      }
    }, playbackInterval);

    return () => {
      clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    applyFrameRange,
    callstack,
    callstackIsReady,
    callstackIsPlaying,
    frameIndex,
    playbackInterval,
    playbackStepGroups,
    prevResetVersion,
    resetVersion,
    revertFrameRange,
    revertPlaybackStepGroup,
  ]);
};
