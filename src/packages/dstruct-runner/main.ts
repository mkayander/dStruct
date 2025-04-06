#!/usr/bin/env node
import cors from "cors";
import express, { type Request, type Response } from "express";
import { spawn } from "node:child_process";
import path from "path";

import type { CallFrame } from "#/features/callstack/model/callstackSlice";

interface ExecutionResult {
  success: boolean;
  callstack?: CallFrame[];
  error?: string;
}

interface ExecutionRequest {
  code: string;
}

async function execPython(codeInput: string): Promise<ExecutionResult> {
  const child = spawn(`python`, [
    path.join(process.cwd(), "python", "exec.py"),
    codeInput,
  ]);

  let result = "";
  for await (const chunk of child.stdout) {
    result += chunk.toString();
  }

  let error = "";
  for await (const chunk of child.stderr) {
    error += chunk.toString();
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

const PORT = 8085;
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
    const data = req.body;

    try {
      const result = await execPython(data.code);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({
        error: error.message,
      });
    }
  },
);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
