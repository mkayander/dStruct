import React from "react";

import { ArgumentType } from "#/entities/argument/model/argumentObject";
import { ArrayStructureView } from "#/entities/dataStructures/array/ui/ArrayStructureView";
import { MapStructureView } from "#/entities/dataStructures/map/ui/MapStructureView";
import { useAppSelector } from "#/store/hooks";
import {
  type ArrayData,
  type ArrayItemData,
  selectArrayStateByName,
} from "#/store/reducers/structures/arrayReducer";

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
