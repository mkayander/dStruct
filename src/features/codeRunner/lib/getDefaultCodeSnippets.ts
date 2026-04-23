import { ProjectCategory } from "#/server/db/generated/client";

import defaultArrayTemplate from "./assets/codeTemplates/arrayTemplate.js.txt";
import defaultArrayTemplatePython from "./assets/codeTemplates/arrayTemplate.py.txt";
import defaultBinaryTreeTemplate from "./assets/codeTemplates/binaryTreeTemplate.js.txt";
import defaultBinaryTreeTemplatePython from "./assets/codeTemplates/binaryTreeTemplate.py.txt";
import graphTemplate from "./assets/codeTemplates/graphTemplate.js.txt";
import graphTemplatePython from "./assets/codeTemplates/graphTemplate.py.txt";
import gridTemplate from "./assets/codeTemplates/gridTemplate.js.txt";
import gridTemplatePython from "./assets/codeTemplates/gridTemplate.py.txt";
import linkedListTemplate from "./assets/codeTemplates/linkedListTemplate.js.txt";
import linkedListTemplatePython from "./assets/codeTemplates/linkedListTemplate.py.txt";
import mathTemplate from "./assets/codeTemplates/mathTemplate.js.txt";
import mathTemplatePython from "./assets/codeTemplates/mathTemplate.py.txt";
import trieTemplate from "./assets/codeTemplates/trieTemplate.js.txt";
import trieTemplatePython from "./assets/codeTemplates/trieTemplate.py.txt";

type CodeLanguageProp =
  // JS
  | "code"
  // Python
  | "pythonCode";

type CodeContent = Partial<Record<CodeLanguageProp, string | null | undefined>>;

const arrayCodeContent: CodeContent = {
  code: defaultArrayTemplate,
  pythonCode: defaultArrayTemplatePython,
};

const binaryTreeCodeContent: CodeContent = {
  code: defaultBinaryTreeTemplate,
  pythonCode: defaultBinaryTreeTemplatePython,
};

const linkedListCodeContent: CodeContent = {
  code: linkedListTemplate,
  pythonCode: linkedListTemplatePython,
};

const graphCodeContent: CodeContent = {
  code: graphTemplate,
  pythonCode: graphTemplatePython,
};

const gridCodeContent: CodeContent = {
  code: gridTemplate,
  pythonCode: gridTemplatePython,
};

const trieCodeContent: CodeContent = {
  code: trieTemplate,
  pythonCode: trieTemplatePython,
};

const mathCodeContent: CodeContent = {
  code: mathTemplate,
  pythonCode: mathTemplatePython,
};

const templatesMap: Record<ProjectCategory, CodeContent> = {
  [ProjectCategory.ARRAY]: arrayCodeContent,
  [ProjectCategory.BINARY_TREE]: binaryTreeCodeContent,
  [ProjectCategory.BST]: binaryTreeCodeContent,
  [ProjectCategory.LINKED_LIST]: linkedListCodeContent,
  [ProjectCategory.GRAPH]: graphCodeContent,
  [ProjectCategory.GRID]: gridCodeContent,
  [ProjectCategory.HEAP]: arrayCodeContent,
  [ProjectCategory.STACK]: arrayCodeContent,
  [ProjectCategory.TWO_POINTERS]: arrayCodeContent,
  [ProjectCategory.BINARY_SEARCH]: arrayCodeContent,
  [ProjectCategory.SLIDING_WINDOW]: arrayCodeContent,
  [ProjectCategory.BACKTRACKING]: arrayCodeContent,
  [ProjectCategory.DYNAMIC_PROGRAMMING]: arrayCodeContent,
  [ProjectCategory.TRIE]: trieCodeContent,
  [ProjectCategory.BIT_MANIPULATION]: arrayCodeContent,
  [ProjectCategory.MATH]: mathCodeContent,
};

const mergeCodeContent = (
  initialContent: CodeContent,
  newContent: CodeContent,
): CodeContent => {
  const result = { ...initialContent };
  Object.entries(newContent).forEach(([key, value]) => {
    if (value) {
      result[key as CodeLanguageProp] = value;
    }
  });
  return result;
};

export const getDefaultCodeSnippets = (
  category: ProjectCategory,
): CodeContent => {
  return templatesMap[category];
};

export const getMergedCodeContent = (
  category: ProjectCategory,
  inputCodeContent: CodeContent,
): CodeContent => {
  return mergeCodeContent(getDefaultCodeSnippets(category), inputCodeContent);
};
