#!/usr/bin/env node
import cors from "cors";
import express, { type Request, type Response } from "express";
import { spawn } from "node:child_process";
import path from "path";

import type { CallFrame } from "#/features/callstack/model/callstackSlice";

const PORT = 8085;
const PYTHON_DIR = path.join(__dirname, "..", "python");
const PYTHON_APP_PATH = path.join(PYTHON_DIR, "exec.py");

interface ExecutionResult {
  success: boolean;
  callstack?: CallFrame[];
  error?: string;
}

interface ExecutionRequest {
  code: string;
}

async function execPython(codeInput: string): Promise<ExecutionResult> {
  console.debug("🐍 Executing Python code: ", codeInput);

  const child = spawn(`py`, [PYTHON_APP_PATH], { cwd: PYTHON_DIR });

  // Write code to stdin
  child.stdin.write(codeInput);
  child.stdin.end();

  let result = "";
  for await (const chunk of child.stdout) {
    const output = chunk.toString();
    console.log("Python stdout:", output);
    result += output;
  }

  let error = "";
  for await (const chunk of child.stderr) {
    const output = chunk.toString();
    console.error("Python stderr:", output);
    error += output;
  }

  const exitCode = await new Promise<number>((resolve) => {
    child.on("exit", resolve);
  });

  if (exitCode !== 0) {
    throw new Error(error);
  }

  const parsedResult: ExecutionResult = JSON.parse(result);
  if (!parsedResult.success) {
    throw new Error(parsedResult.error);
  }

  return parsedResult;
}

async function checkPythonReady(): Promise<{ ready: boolean; error?: string }> {
  // Check if python is available
  const pythonCheck = spawn("py", ["--version"]);
  let pythonVersion = "";
  let pythonError = "";
  for await (const chunk of pythonCheck.stdout) {
    pythonVersion += chunk.toString();
  }
  for await (const chunk of pythonCheck.stderr) {
    pythonError += chunk.toString();
  }
  const pythonExit = await new Promise<number>((resolve) =>
    pythonCheck.on("exit", resolve),
  );
  if (pythonExit !== 0) {
    return {
      ready: false,
      error: `Python not found: ${pythonError || pythonVersion}`,
    };
  }

  // Check if Python version is 3+
  const pythonVersionStr = pythonVersion || "";
  const pythonErrorStr = pythonError || "";
  const versionOutput = (pythonVersionStr + pythonErrorStr).trim();
  const versionMatch = versionOutput.match(/Python (\d+)\.(\d+)\.(\d+)/);
  const version = versionMatch?.[1];
  if (!version) {
    return {
      ready: false,
      error: `Could not parse Python version. Output: ${versionOutput}`,
    };
  }
  if (parseInt(version, 10) < 3) {
    return {
      ready: false,
      error: `Python 3+ is required. Found: ${versionOutput}`,
    };
  }

  return { ready: true };
}

const app = express();

app.use(
  cors({
    credentials: true,
    origin: true,
  }),
);
app.use(express.json());

app.post(
  "/python",
  async (req: Request<{}, {}, ExecutionRequest>, res: Response) => {
    console.debug("🐍 Python request: ", req.body);

    // Run readiness check first
    const readyStatus = await checkPythonReady();
    if (!readyStatus.ready) {
      console.error("❌ Python not ready: ", readyStatus.error);
      res.status(500).json({ error: readyStatus.error });
      return;
    }

    const data = req.body;
    try {
      const result = await execPython(data.code);
      res.json(result);
    } catch (error: any) {
      console.error("❌ Python error: ", error);
      res.status(500).json({
        error: error.message,
      });
    }
  },
);

app.get("/python/check", async (_req, res) => {
  try {
    const status = await checkPythonReady();
    res.json(status);
  } catch (err: any) {
    console.error("Python check error:", err);
    res.status(500).json({ ready: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
