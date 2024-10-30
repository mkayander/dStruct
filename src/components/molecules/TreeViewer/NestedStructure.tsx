import React from "react";

import { ArrayStructureView } from "#/components/molecules/TreeViewer/ArrayStructureView";
import { MapStructureView } from "#/components/molecules/TreeViewer/MapStructureView";
import { useAppSelector } from "#/store/hooks";
import {
  type ArrayData,
  type ArrayItemData,
  selectArrayStateByName,
} from "#/store/reducers/structures/arrayReducer";
import { ArgumentType } from "#/utils/argumentObject";

type NestedStructureProps = {
  item: ArrayItemData;
  colorMap?: ArrayData["colorMap"];
};

export const NestedStructure: React.FC<NestedStructureProps> = ({
  item: { childName },
  colorMap,
}) => {
  const data = useAppSelector(selectArrayStateByName(childName ?? ""));
  if (!data) return null;

  let Component: typeof ArrayStructureView | null = null;
  switch (data.argType) {
    case ArgumentType.MAP:
    case ArgumentType.OBJECT:
      Component = MapStructureView;
      break;
    case ArgumentType.ARRAY:
    case ArgumentType.STRING:
    case ArgumentType.SET:
      Component = ArrayStructureView;
  }

  if (Component) {
    return <Component data={data} parentColorMap={colorMap} />;
  }

  return null;
};
