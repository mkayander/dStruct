// import type React from 'react';
import { createContext } from "react";

import type { BinaryTreeNode } from "#/hooks/dataStructures/binaryTreeNode";

// type MutableItem<T> = {
//     current: T;
//     setValue: React.Dispatch<React.SetStateAction<T>>;
// };

type PlaygroundRuntimeContextType = {
  tree: BinaryTreeNode | null;
};

export const PlaygroundRuntimeContext =
  createContext<PlaygroundRuntimeContextType>({
    tree: null,
  });
