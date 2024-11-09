import { useState } from "react";

import {
  callstackSlice,
  selectCallstackIsPlaying,
  selectCallstackLength,
} from "#/features/callstack/model/callstackSlice";
import {
  editorSlice,
  selectIsEditingNodes,
} from "#/features/treeViewer/model/editorSlice";
import { useAppDispatch, useAppSelector, useAppStore } from "#/store/hooks";

import { resetStructuresState } from "../lib";

export const usePlayerControls = () => {
  const dispatch = useAppDispatch();
  const [replayCount, setReplayCount] = useState(0);
  const store = useAppStore();
  const isPlaying = useAppSelector(selectCallstackIsPlaying);
  const callstackLength = useAppSelector(selectCallstackLength);
  const isEditingNodes = useAppSelector(selectIsEditingNodes);

  const handleReset = () => {
    resetStructuresState(dispatch);
  };

  const handleReplay = () => {
    handleReset();
    setReplayCount(replayCount + 1);
    dispatch(callstackSlice.actions.setFrameIndex(-1));
    dispatch(callstackSlice.actions.setIsPlaying(true));
  };

  const handleStepBack = () => {
    const frameIndex = store.getState().callstack.frameIndex;
    if (frameIndex === -1) return;

    dispatch(callstackSlice.actions.setFrameIndex(frameIndex - 1));
  };

  const handlePlay = () => {
    const frameIndex = store.getState().callstack.frameIndex;

    if (frameIndex === callstackLength - 1) return;

    dispatch(callstackSlice.actions.setIsPlaying(!isPlaying));
  };

  const handleStepForward = () => {
    const frameIndex = store.getState().callstack.frameIndex;
    if (frameIndex === callstackLength - 1) return;

    dispatch(callstackSlice.actions.setFrameIndex(frameIndex + 1));
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
