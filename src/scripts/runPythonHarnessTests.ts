/**
 * Runs `unittest` for the Pyodide harness under src/packages/dstruct-runner/python.
 * Invoked from `pnpm test` after Vitest. Skips with exit 0 if Python is not on PATH.
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..", "..");
const pythonPackageDir = path.join(
  repoRoot,
  "src",
  "packages",
  "dstruct-runner",
  "python",
);

function resolvePythonBinary(): string | null {
  for (const binary of ["python", "python3"] as const) {
    const probe = spawnSync(binary, ["-c", "pass"], { encoding: "utf8" });
    if (!probe.error && probe.status === 0) {
      return binary;
    }
  }
  return null;
}

const pythonBinary = resolvePythonBinary();
if (pythonBinary === null) {
  console.warn(
    "[test:python] Skipped: neither `python` nor `python3` is on PATH.",
  );
  process.exit(0);
}

const result = spawnSync(
  pythonBinary,
  ["-m", "unittest", "discover", "-v", "-s", ".", "-p", "test_*.py"],
  {
    cwd: pythonPackageDir,
    env: { ...process.env, PYTHONPATH: "." },
    stdio: "inherit",
  },
);

process.exit(result.status === null ? 1 : result.status);
