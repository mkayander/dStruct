import { useState } from "react";

import {
  callstackSlice,
  selectCallstack,
  selectCallstackIsPlaying,
} from "#/features/callstack/model/callstackSlice";
import {
  editorSlice,
  selectIsEditingNodes,
} from "#/features/treeViewer/model/editorSlice";
import { useAppDispatch, useAppSelector, useAppStore } from "#/store/hooks";

import {
  getLastRenderableFrameIndex,
  getNextPlaybackFrameIndex,
  getPreviousPlaybackFrameIndex,
  resetStructuresState,
} from "../lib";

export const usePlayerControls = () => {
  const dispatch = useAppDispatch();
  const store = useAppStore();
  const [replayCount, setReplayCount] = useState(0);
  const isEditingNodes = useAppSelector(selectIsEditingNodes);

  const handleReset = () => {
    resetStructuresState(dispatch, false);
  };

  const handleReplay = () => {
    handleReset();
    setReplayCount((prevReplayCount) => prevReplayCount + 1);
    dispatch(callstackSlice.actions.setFrameIndex(-1));
    dispatch(callstackSlice.actions.setIsPlaying(true));
  };

  const handleStepBack = () => {
    const callstack = selectCallstack(store.getState());
    const frameIndex = callstack.frameIndex;
    if (frameIndex === -1) return;

    dispatch(
      callstackSlice.actions.setFrameIndex(
        getPreviousPlaybackFrameIndex(callstack.frames, frameIndex),
      ),
    );
  };

  const handlePlay = () => {
    const callstack = selectCallstack(store.getState());
    const isPlaying = selectCallstackIsPlaying(store.getState());
    const frameIndex = callstack.frameIndex;
    const lastRenderableFrameIndex = getLastRenderableFrameIndex(
      callstack.frames,
    );

    if (frameIndex >= lastRenderableFrameIndex) return;

    dispatch(callstackSlice.actions.setIsPlaying(!isPlaying));
  };

  const handleStepForward = () => {
    const callstack = selectCallstack(store.getState());
    const frameIndex = callstack.frameIndex;
    const nextFrameIndex = getNextPlaybackFrameIndex(
      callstack.frames,
      frameIndex,
    );
    if (nextFrameIndex === -1) return;

    dispatch(callstackSlice.actions.setFrameIndex(nextFrameIndex));
  };

  const handleKeyDown: React.KeyboardEventHandler = (event) => {
    if (isEditingNodes) {
      if (event.key === "Escape") {
        dispatch(editorSlice.actions.setIsEditing(false));
      }
      return;
    }

    if (event.key === "ArrowLeft") {
      handleStepBack();
    } else if (event.key === "ArrowRight") {
      handleStepForward();
    } else if (event.key === " ") {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLButtonElement
      )
        return;
      handlePlay();
    } else if (event.key === "r") {
      handleReplay();
    } else if (event.key === "Escape") {
      handleReset();
    }
  };

  return {
    replayCount,
    handleReset,
    handleReplay,
    handleStepBack,
    handlePlay,
    handleStepForward,
    handleKeyDown,
  };
};
