import { ProjectCategory } from "@prisma/client";

export const categoryLabels: Record<ProjectCategory, string> = {
  [ProjectCategory.BINARY_TREE]: "Binary Tree",
  [ProjectCategory.LINKED_LIST]: "Linked List",
  [ProjectCategory.ARRAY]: "Array",
  [ProjectCategory.HEAP]: "Heap (Priority Queue)",
  [ProjectCategory.STACK]: "Stack",
  [ProjectCategory.TWO_POINTERS]: "Two Pointers",
  [ProjectCategory.SLIDING_WINDOW]: "Sliding Window",
  [ProjectCategory.BINARY_SEARCH]: "Binary Search",
  [ProjectCategory.BACKTRACKING]: "Backtracking",
  [ProjectCategory.BST]: "BST",
  [ProjectCategory.GRAPH]: "Graph",
  [ProjectCategory.GRID]: "Matrix",
  [ProjectCategory.DYNAMIC_PROGRAMMING]: "Dynamic Programming",
  [ProjectCategory.TRIE]: "Trie",
  [ProjectCategory.BIT_MANIPULATION]: "Bit Manipulation",
};
