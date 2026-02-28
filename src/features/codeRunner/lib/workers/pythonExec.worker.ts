import { loadPyodide, type PyodideInterface, version } from "pyodide";

import arrayTrackerSrc from "#/packages/dstruct-runner/python/array_tracker.py";
import arrayTrackerTransformerSrc from "#/packages/dstruct-runner/python/array_tracker_transformer.py";
import execPySrc from "#/packages/dstruct-runner/python/exec.py";
import outputSrc from "#/packages/dstruct-runner/python/output.py";
import sharedTypesSrc from "#/packages/dstruct-runner/python/shared_types.py";

import type {
  PythonWorkerInMessage,
  PythonWorkerOutMessage,
} from "./pythonExec.worker.types";

let pyodide: PyodideInterface | null = null;

const HARNESS_DIR = "/home/pyodide";

// Bundlers bundle this worker into /_next/static/chunks/, so loadPyodide's
// auto-detected indexURL would point there instead of at the actual Pyodide
// assets. We derive the correct CDN URL from the installed package version.
const DEFAULT_CDN_URL = `https://cdn.jsdelivr.net/pyodide/v${version}/full/`;

const HARNESS_FILES: Record<string, string> = {
  "shared_types.py": sharedTypesSrc,
  "output.py": outputSrc,
  "array_tracker.py": arrayTrackerSrc,
  "array_tracker_transformer.py": arrayTrackerTransformerSrc,
  "exec.py": execPySrc,
};

function serializeError(err: unknown): {
  name: string;
  message: string;
  stack?: string;
} {
  if (err instanceof Error) {
    return { name: err.name, message: err.message, stack: err.stack };
  }
  return { name: "Error", message: String(err) };
}

function postError(requestId: string, err: unknown): void {
  const msg: PythonWorkerOutMessage = {
    type: "ERROR",
    requestId,
    error: serializeError(err),
  };
  self.postMessage(msg);
}

function postProgress(value: number, stage: string): void {
  const msg: PythonWorkerOutMessage = { type: "PROGRESS", value, stage };
  self.postMessage(msg);
}

async function handleInit(indexURL?: string) {
  if (pyodide) {
    postProgress(100, "Ready");
    const msg: PythonWorkerOutMessage = { type: "READY" };
    self.postMessage(msg);
    return;
  }

  postProgress(5, "Loading runtime…");
  pyodide = await loadPyodide({ indexURL: indexURL ?? DEFAULT_CDN_URL });

  postProgress(45, "Preparing harness…");
  for (const [filename, source] of Object.entries(HARNESS_FILES)) {
    pyodide.FS.writeFile(`${HARNESS_DIR}/${filename}`, source);
  }

  postProgress(70, "Importing Python…");
  // Invalidate import caches so Python sees the files we just wrote.
  // See: https://pyodide.org/en/stable/usage/faq.html#why-can-t-i-import-a-file-i-just-wrote-to-the-file-system
  // Configure sys.path via the globals API instead of string interpolation.
  pyodide.globals.set("__harness_dir__", HARNESS_DIR);
  await pyodide.runPythonAsync(`
import importlib, sys, json
importlib.invalidate_caches()
_hdir = __harness_dir__
if _hdir not in sys.path:
    sys.path.insert(0, _hdir)
del _hdir
from exec import safe_exec
`);
  pyodide.globals.delete("__harness_dir__");

  postProgress(100, "Ready");
  const msg: PythonWorkerOutMessage = { type: "READY" };
  self.postMessage(msg);
}

async function handleRun(requestId: string, code: string) {
  if (!pyodide) {
    postError(
      requestId,
      new Error("Pyodide not initialized. Send INIT first."),
    );
    return;
  }

  try {
    pyodide.globals.set("__user_code__", code);

    const resultJson: string = await pyodide.runPythonAsync(`
import json as _json
_result = safe_exec(__user_code__)
_json.dumps(_result)
`);

    const result = JSON.parse(resultJson);
    const msg: PythonWorkerOutMessage = {
      type: "RUN_RESULT",
      requestId,
      result,
    };
    self.postMessage(msg);
  } catch (err: unknown) {
    postError(requestId, err);
  } finally {
    // Clean up the user code from Python globals to avoid retaining large strings
    pyodide?.globals.delete("__user_code__");
  }
}

self.addEventListener(
  "message",
  (event: MessageEvent<PythonWorkerInMessage>) => {
    const { data } = event;

    switch (data.type) {
      case "INIT":
        handleInit(data.indexURL).catch((err: unknown) => {
          console.error("Pyodide INIT failed:", err);
          postError("__init__", err);
        });
        break;

      case "RUN":
        handleRun(data.requestId, data.code).catch((err: unknown) => {
          console.error("Pyodide RUN failed:", err);
          postError(data.requestId, err);
        });
        break;

      default:
        console.error("Unknown message type:", data);
    }
  },
);
