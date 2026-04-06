import type {
  CallFrame,
  StructureTypeName,
} from "#/features/callstack/model/callstackSlice";

type RenderableCallFrame = CallFrame & { treeName: string };
type SwapChildFrame = RenderableCallFrame & {
  name: "setLeftChild" | "setRightChild";
  nodeId: string;
  structureType: StructureTypeName;
};

export type PlaybackStepGroup =
  | {
      kind: "single";
      key: string;
      startIndex: number;
      endIndex: number;
      frames: [RenderableCallFrame];
      primaryFrame: RenderableCallFrame;
    }
  | {
      kind: "swap";
      key: string;
      startIndex: number;
      endIndex: number;
      frames: RenderableCallFrame[];
      primaryFrame: SwapChildFrame;
      partnerFrame: SwapChildFrame;
    };

const isRenderableCallFrame = (
  frame: CallFrame | undefined,
): frame is RenderableCallFrame => Boolean(frame && "treeName" in frame);

const isSwapChildFrame = (
  frame: CallFrame | undefined,
): frame is SwapChildFrame =>
  Boolean(
    frame &&
    "treeName" in frame &&
    "nodeId" in frame &&
    (frame.name === "setLeftChild" || frame.name === "setRightChild"),
  );

const getNextRenderableFrameIndex = (
  frames: CallFrame[],
  startIndex: number,
) => {
  for (let i = startIndex + 1; i < frames.length; i += 1) {
    if (isRenderableCallFrame(frames[i])) {
      return i;
    }
  }

  return -1;
};

const areBatchableSwapFrames = (
  firstFrame: CallFrame | undefined,
  secondFrame: CallFrame | undefined,
) => {
  if (!isSwapChildFrame(firstFrame) || !isSwapChildFrame(secondFrame)) {
    return false;
  }

  return (
    firstFrame.treeName === secondFrame.treeName &&
    firstFrame.nodeId === secondFrame.nodeId &&
    firstFrame.structureType === secondFrame.structureType &&
    firstFrame.name !== secondFrame.name
  );
};

const isMatchingSwapPartnerFrame = (
  primaryFrame: SwapChildFrame,
  candidateFrame: CallFrame | undefined,
): candidateFrame is SwapChildFrame =>
  areBatchableSwapFrames(primaryFrame, candidateFrame);

const getSwapBatchPartnerIndex = (frames: CallFrame[], startIndex: number) => {
  const startFrame = frames[startIndex];
  if (!isSwapChildFrame(startFrame)) {
    return startIndex;
  }

  for (let i = startIndex + 1; i < frames.length; i += 1) {
    const frame = frames[i];
    if (!isRenderableCallFrame(frame)) {
      continue;
    }

    if (areBatchableSwapFrames(startFrame, frame)) {
      return i;
    }

    if (
      isSwapChildFrame(frame) &&
      frame.treeName === startFrame.treeName &&
      frame.nodeId === startFrame.nodeId &&
      frame.structureType === startFrame.structureType &&
      frame.name === startFrame.name
    ) {
      break;
    }
  }

  return startIndex;
};

const getRenderableFrameAtIndex = (
  frames: CallFrame[],
  index: number,
): RenderableCallFrame | null => {
  const frame = frames[index];
  return isRenderableCallFrame(frame) ? frame : null;
};

export const getLastRenderableFrameIndex = (frames: CallFrame[]) =>
  getPlaybackStepGroups(frames).at(-1)?.endIndex ?? -1;

export const getNextPlaybackFrameIndex = (
  frames: CallFrame[],
  currentIndex: number,
) => {
  const groups = getPlaybackStepGroups(frames);
  if (groups.length === 0) return -1;

  if (currentIndex < 0) {
    return groups[0]?.endIndex ?? -1;
  }

  const currentStepIndex = getPlaybackStepIndex(groups, currentIndex);
  return currentStepIndex >= 0
    ? (groups[currentStepIndex + 1]?.endIndex ?? -1)
    : -1;
};

export const getPreviousPlaybackFrameIndex = (
  frames: CallFrame[],
  currentIndex: number,
) => {
  if (currentIndex < 0) return -1;

  const groups = getPlaybackStepGroups(frames);
  const currentStepIndex = getPlaybackStepIndex(groups, currentIndex);
  if (currentStepIndex === -1) return -1;

  return groups[currentStepIndex - 1]?.endIndex ?? -1;
};

export const getPlaybackStepGroups = (
  frames: CallFrame[],
): PlaybackStepGroup[] => {
  const groups: PlaybackStepGroup[] = [];

  for (let i = 0; i < frames.length; ) {
    const startIndex = getNextRenderableFrameIndex(frames, i - 1);
    if (startIndex === -1) {
      break;
    }

    const primaryFrame = getRenderableFrameAtIndex(frames, startIndex);
    if (!primaryFrame) {
      i = startIndex + 1;
      continue;
    }

    const endIndex = getSwapBatchPartnerIndex(frames, startIndex);

    if (endIndex > startIndex && isSwapChildFrame(primaryFrame)) {
      const groupFrames = frames
        .slice(startIndex, endIndex + 1)
        .filter(isRenderableCallFrame);
      const partnerFrame = groupFrames.find((frame) =>
        isMatchingSwapPartnerFrame(primaryFrame, frame),
      );

      if (partnerFrame) {
        groups.push({
          kind: "swap",
          key: `${primaryFrame.id}:${partnerFrame.id}`,
          startIndex,
          endIndex,
          frames: groupFrames,
          primaryFrame,
          partnerFrame,
        });
        i = endIndex + 1;
        continue;
      }
    }

    groups.push({
      kind: "single",
      key: primaryFrame.id,
      startIndex,
      endIndex: startIndex,
      frames: [primaryFrame],
      primaryFrame,
    });
    i = startIndex + 1;
  }

  return groups;
};

export const getPlaybackStepIndex = (
  groups: PlaybackStepGroup[],
  frameIndex: number,
) =>
  groups.findIndex(
    (group) => group.startIndex <= frameIndex && frameIndex <= group.endIndex,
  );
