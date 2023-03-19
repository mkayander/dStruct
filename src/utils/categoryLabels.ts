import { ProjectCategory } from "@prisma/client";

export const categoryLabels: Record<ProjectCategory, string> = {
  [ProjectCategory.BINARY_TREE]: "Binary Tree",
  [ProjectCategory.ARRAY]: "Array",
  [ProjectCategory.BST]: "BST",
  [ProjectCategory.GRAPH]: "Graph",
  [ProjectCategory.GRID]: "Grid",
};