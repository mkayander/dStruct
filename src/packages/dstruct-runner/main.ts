import cors from "cors";
import express from "express";
import { spawn } from "node:child_process";
import path from "path";

async function execPython(codeInput: string) {
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
  const exitCode = await new Promise((resolve) => {
    child.on("exit", resolve);
  });
  if (exitCode !== 0) {
    throw new Error(error);
  }
  return result;
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

app.post("/python", async (req, res) => {
  const data = req.body;

  try {
    const result = await execPython(data.code);
    res.json({
      result,
    });
  } catch (error: any) {
    res.status(500).json({
      error: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
