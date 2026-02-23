import uuid from "short-uuid";

import { arrayDataAdapter } from "../model/arraySlice";

export const generateArrayData = (array: Array<any>) => {
  const data = arrayDataAdapter.getInitialState();

  for (const [index, value] of array.entries()) {
    const id = uuid.generate();
    data.ids.push(id);
    data.entities[id] = {
      id,
      index,
      value,
    };
  }

  return data;
};
