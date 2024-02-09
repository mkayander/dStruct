import * as ts from "typescript";

export const getCompileOptions = () => {
  const tsConfigFileName = ts.findConfigFile(
    "tsconfig.json",
    ts.sys.fileExists,
  );
  if (!tsConfigFileName)
    throw new Error("Could not find a valid 'tsconfig.json'.");
  const tsConfig = ts.readConfigFile(tsConfigFileName, ts.sys.readFile).config;
  return ts.parseJsonConfigFileContent(
    tsConfig,
    ts.sys,
    "./",
    {},
    tsConfigFileName,
  ).options;
};
