import { selectCallstackFrameIndex } from "#/features/callstack/model/callstackSlice";
import { useAppSelector } from "#/store/hooks";

export const FrameIndexLabel = () => {
  const frameIndex = useAppSelector(selectCallstackFrameIndex);

  return <span className="text-xs min-w-[3ch]">{frameIndex}</span>;
};
