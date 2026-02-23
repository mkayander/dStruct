import { ProjectCategory } from "#/server/db/generated/client";

import defaultArrayTemplate from "./assets/codeTemplates/arrayTemplate.js.txt";
import defaultArrayTemplatePython from "./assets/codeTemplates/arrayTemplate.py.txt";
import defaultBinaryTreeTemplate from "./assets/codeTemplates/binaryTreeTemplate.js.txt";
import defaultBinaryTreeTemplatePython from "./assets/codeTemplates/binaryTreeTemplate.py.txt";
import linkedListTemplate from "./assets/codeTemplates/linkedListTemplate.js.txt";
import linkedListTemplatePython from "./assets/codeTemplates/linkedListTemplate.py.txt";

type CodeLanguageProp =
  // JS
  | "code"
  // Python
  | "pythonCode";

type CodeContent = Partial<Record<CodeLanguageProp, string | null | undefined>>;

const templatesMap: Partial<Record<ProjectCategory, CodeContent>> = {
  [ProjectCategory.ARRAY]: {
    code: defaultArrayTemplate,
    pythonCode: defaultArrayTemplatePython,
  },
  [ProjectCategory.BINARY_TREE]: {
    code: defaultBinaryTreeTemplate,
    pythonCode: defaultBinaryTreeTemplatePython,
  },
  [ProjectCategory.LINKED_LIST]: {
    code: linkedListTemplate,
    pythonCode: linkedListTemplatePython,
  },
};

const defaultCodeContent = {
  code: defaultBinaryTreeTemplate,
  pythonCode: defaultBinaryTreeTemplatePython,
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
  if (templatesMap[category]) {
    return templatesMap[category];
  }

  return defaultCodeContent;
};

export const getMergedCodeContent = (
  category: ProjectCategory,
  inputCodeContent: CodeContent,
): CodeContent => {
  return mergeCodeContent(getDefaultCodeSnippets(category), inputCodeContent);
};
