import { useState } from "react";

import { useAppDispatch, useAppSelector, useAppStore } from "#/store/hooks";
import {
  callstackSlice,
  selectCallstackIsPlaying,
  selectCallstackLength,
} from "#/store/reducers/callstackReducer";
import { resetStructuresState } from "#/utils";

export const usePlayerControls = () => {
  const dispatch = useAppDispatch();
  const [replayCount, setReplayCount] = useState(0);
  const store = useAppStore();
  const isPlaying = useAppSelector(selectCallstackIsPlaying);
  const callstackLength = useAppSelector(selectCallstackLength);

  const handleReset = () => {
    resetStructuresState(dispatch);
    dispatch(callstackSlice.actions.setFrameIndex(-1));
    dispatch(callstackSlice.actions.setIsPlaying(false));
  };

  const handleReplay = () => {
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
