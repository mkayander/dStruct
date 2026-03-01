# Python Execution via Pyodide (In-Browser)

dStruct runs Python code directly in the browser using [Pyodide](https://pyodide.org/) -- a full CPython interpreter compiled to WebAssembly. No local Python installation or server is required.

## How It Works

1. When a user opens a Python problem page, the `usePythonCodeRunner` hook eagerly calls `pythonRunner.init()` to warm up a dedicated **Web Worker**.
2. The worker downloads the Pyodide runtime (~30 MB, cached by the browser after first load) from the jsDelivr CDN. It then writes the dStruct Python harness files (`exec.py`, `array_tracker.py`, etc.) into Pyodide's virtual Emscripten filesystem and pre-imports `safe_exec`.
3. When the user clicks **Run**, the code string and optional test-case arguments (e.g. binary tree root) are posted to the worker. The existing `safe_exec(code, args)` harness performs AST transformation (list tracking via `TrackedList`), reconstructs arguments (TreeNode, ListNode, etc.) from the serialized payload, executes the code in a sandboxed namespace, and returns a structured `ExecutionResult` as JSON back to the main thread.
4. If execution exceeds the timeout (default 30 s), the main-thread runner terminates the worker via `Worker.terminate()` and automatically recreates a fresh one for subsequent runs.

```
Main thread                           Web Worker
    |                                     |
    |--- INIT { indexURL? } ------------->|
    |                                     |  loadPyodide(indexURL)
    |<------------- PROGRESS { value, stage } --- (5, 45, 70, 100)
    |                                     |  FS.writeFile(harness .py files)
    |                                     |  importlib.invalidate_caches()
    |                                     |  from exec import safe_exec
    |<------------- READY ----------------|
    |                                     |
    |--- RUN { requestId, code, args? } ->|
    |                                     |  safe_exec(code, args) -> JSON
    |<-- RUN_RESULT { requestId, ... } ---|
    |                                     |
    |--- RUN { ... } (timeout fires) ---->|
    |    Worker.terminate()               X  (killed)
    |    resetWorker() -> state = idle
    |    auto-recreate on next run()
```

## Worker Message Protocol

```typescript
type SerializedPythonArg = { type: string; value: unknown };

// Main thread -> Worker
type PythonWorkerInMessage =
  | { type: "INIT"; indexURL?: string }
  | { type: "RUN"; requestId: string; code: string; args?: SerializedPythonArg[] };

// Worker -> Main thread
type PythonWorkerOutMessage =
  | { type: "READY" }
  | { type: "PROGRESS"; value: number; stage: string }  // during INIT (5, 45, 70, 100)
  | { type: "RUN_RESULT"; requestId: string; result: ExecutionResult }
  | { type: "ERROR"; requestId: string;
      error: { name: string; message: string; stack?: string } };
```

During INIT, the worker sends **PROGRESS** messages (value 0–100, stage label) so the UI can show a loading snackbar. The main thread subscribes via `usePyodideProgressSnackbar`.

Calls are **serialized**: only one RUN is in-flight at a time. The `requestId` (a short UUID) is still included for correctness. If `run()` is called while a previous run is still executing, the new call awaits a gate promise that resolves when the current run finishes.

## `ExecutionResult` Shape

This is the contract between the runner and the UI, shared with the JavaScript runner:

```typescript
interface ExecutionResult {
  output: string;               // captured stdout (via tracked_print)
  callstack: any[];             // array operation frames from TrackedList
  runtime: number;              // wall-clock ms
  startTimestamp: number;       // performance.now() at start
  error?: {
    name: string;               // e.g. "SyntaxError", "TimeoutError"
    message: string;
    stack?: string;             // Python traceback when available
  };
}
```

The `run()` method **never rejects**. All failure modes (timeout, worker crash, init failure, Python error) resolve with an `ExecutionResult` containing a populated `error` field.

## Configuration

### Execution Mode

Set the `NEXT_PUBLIC_PYTHON_EXEC_MODE` environment variable to control the backend:

| Value | Description |
|---|---|
| `pyodide` **(default)** | In-browser execution via Pyodide Web Worker. No setup needed. |
| `server` | Legacy mode: sends code to the local Express runner on `localhost:8085`. Requires `pnpm dev:all`. |

If the variable is not set, **pyodide** mode is used automatically.

### Pyodide CDN URL

By default, Pyodide WASM/JS assets are fetched from jsDelivr. The URL is derived from the installed `pyodide` npm package version at build time:

```
https://cdn.jsdelivr.net/pyodide/v{version}/full/
```

This is necessary because webpack bundles the worker into `/_next/static/chunks/`, and Pyodide's auto-detected `indexURL` would resolve there instead of at the CDN. We import the `version` export from the `pyodide` package and construct the URL explicitly.

### Self-Hosting Pyodide Assets

To avoid the CDN dependency (e.g. for air-gapped deployments):

1. Copy the contents of `node_modules/pyodide/` to a static directory served by your app (e.g. `public/pyodide/`).
2. Pass a custom `indexURL` when constructing the `PythonRunner`:
   ```ts
   const runner = new PythonRunner("/pyodide/");
   ```
   Or send it via the INIT message: `worker.postMessage({ type: "INIT", indexURL: "/pyodide/" })`.
3. Serve the files with long-lived cache headers (`Cache-Control: public, max-age=31536000, immutable`) since they are versioned.

## Key Files

| File | Purpose |
|---|---|
| `src/features/codeRunner/lib/workers/pythonExec.worker.ts` | Web Worker: loads Pyodide, writes harness to FS, handles INIT/RUN messages |
| `src/features/codeRunner/lib/workers/pythonExec.worker.types.ts` | TypeScript types for the worker message protocol |
| `src/features/codeRunner/lib/createPythonRuntimeArgs.ts` | Serializes case arguments to `SerializedPythonArg[]` for the Python harness |
| `src/features/codeRunner/lib/pythonRunner.ts` | Main-thread singleton: worker lifecycle, timeout, auto-recreate, serialization gate |
| `src/features/codeRunner/hooks/usePythonCodeRunner.ts` | React hook: preloads worker on mount, delegates to `pythonRunner.run()` |
| `src/features/codeRunner/hooks/usePyodideProgressSnackbar.tsx` | Shows loading snackbar when Pyodide INIT sends PROGRESS messages |
| `src/features/codeRunner/hooks/useCodeExecution.ts` | Unified orchestrator: calls `runPythonCode`, handles `ExecutionResult` |
| `src/packages/dstruct-runner/python/exec.py` | Python harness: AST transform + sandboxed exec, receives `safe_exec(code, args)` |
| `src/packages/dstruct-runner/python/tree_utils.py` | `TreeNode`, `ListNode`, `build_tree`, `build_list` for argument reconstruction |
| `src/packages/dstruct-runner/python/array_tracker.py` | `TrackedList` implementation for callstack frame generation |
| `src/packages/dstruct-runner/python/array_tracker_transformer.py` | AST transformer: rewrites list literals to `TrackedList(...)` |
| `src/packages/dstruct-runner/python/output.py` | `tracked_print`: captures print output into `__stdout__` global |
| `src/packages/dstruct-runner/python/shared_types.py` | Python TypedDicts for `ExecutionResult`, `CallFrame`, etc. |
| `next.config.mjs` | Webpack + Turbopack `*.py` raw-loader rules for embedding Python as strings |
| `src/types/next.d.ts` | `declare module "*.py"` for TypeScript |

## Architecture Decisions

### Why a Web Worker (not the main thread)?

Python execution can be long-running and synchronous (Pyodide runs CPython compiled to WASM). Running on the main thread would freeze the UI. The worker runs in a separate thread, keeping the app responsive.

### Why not a Service Worker?

Service Workers intercept network requests and have a different lifecycle. A dedicated Web Worker is the right primitive for CPU-bound background computation.

### Why serialize runs instead of supporting concurrency?

Pyodide hosts a single CPython interpreter. Python itself is single-threaded (GIL). Running two scripts "concurrently" in the same interpreter would interleave at `await` boundaries and corrupt shared state (`__callstack__`, `__stdout__`). Serialization keeps things simple and correct.

### Why `run()` never rejects

The UI pipeline (`useCodeExecution` -> `handleExecutionResult`) expects an `ExecutionResult`. If `run()` rejected with a plain `Error`, the rejection would bypass the result pipeline and the error would be silently logged (`console.error`) instead of displayed to the user. By always resolving with an `ExecutionResult`, every failure mode flows through the same display path.

### Why `importlib.invalidate_caches()`?

Per the [Pyodide FAQ](https://pyodide.org/en/stable/usage/faq.html#why-can-t-i-import-a-file-i-just-wrote-to-the-file-system), Python's import machinery may not see files written to the virtual FS after startup. Calling `invalidate_caches()` before the first import ensures `from exec import safe_exec` finds the file reliably.

### Why explicit `indexURL` instead of auto-detection?

When the worker is bundled by webpack/Next.js, its script URL is something like `/_next/static/chunks/pythonExec.worker-abc123.js`. Pyodide infers `indexURL` from this, then tries to load `pyodide.asm.js` from `/_next/static/chunks/pyodide.asm.js` -- which doesn't exist. We derive the CDN URL from `import { version } from "pyodide"` so it always matches the installed package version and upgrades automatically.

## Timeout and Recovery

- Default timeout: **30 seconds** (configurable per `run()` call).
- On timeout: `Worker.terminate()` is called, killing the worker immediately. The runner state resets to `idle`.
- On next `run()`: a fresh worker is created and Pyodide is reloaded (cold start ~2-5 s).
- On worker crash (uncaught error): same recovery -- terminate, reset, recreate on next use.
- The `settle()` helper inside `run()` ensures event listeners and the timeout timer are always cleaned up, preventing memory leaks.

## Known Limitations

- **Standard library only.** `micropip` / third-party packages are not installed. Code that imports `numpy`, `pandas`, etc. will fail with `ModuleNotFoundError`.
- **Cold start.** First load downloads ~30 MB of Pyodide assets from CDN. Subsequent page loads serve from browser cache (`disk cache`). Even cached, `loadPyodide()` takes 2-5 seconds to initialize the WASM runtime.
- **Memory.** Pyodide runs inside a single Web Worker backed by a WASM linear memory. Heavy allocations in Python consume browser memory. There is no hard cap beyond the browser's per-tab limit (~2-4 GB).
- **No threading/multiprocessing.** `threading.Thread.start()` and `multiprocessing` raise `RuntimeError` in Pyodide. This doesn't affect the current harness but limits what user code can do.
- **No file I/O persistence.** The Pyodide virtual filesystem is ephemeral (in-memory `MEMFS`). Files written during execution are lost on worker termination or page reload.
- **Timeout is coarse.** The timeout terminates the entire worker via `Worker.terminate()`. There is no cooperative cancellation; long-running C-level operations inside Pyodide WASM cannot be interrupted more gracefully.
- **No benchmark mode** for Python (same as before the migration).
- **`sys.stdout` / `sys.stderr` not globally redirected.** The harness replaces `print` with `tracked_print` in the sandbox builtins, so normal print output is captured. But if code somehow bypasses the sandbox and writes to `sys.stdout` directly, that output goes to the worker's `console.log` and won't appear in the UI. This matches the pre-migration behavior.

## Running Tests

```bash
# Protocol-level unit tests (fast, no Pyodide download)
pnpm vitest run src/features/codeRunner/lib/workers/pythonExec.worker.spec.ts

# Runtime args serialization (createPythonRuntimeArgs, createRawRuntimeArgs)
pnpm vitest run src/features/codeRunner/lib/createRuntimeArgs.spec.ts
```

## Manual Integration Test

1. Start the dev server: `pnpm dev`
2. Open a Python problem page in the browser.
3. Open DevTools Network tab -- confirm no requests to `localhost:8085`.
4. Observe the Pyodide WASM download (~30 MB, one-time) from `cdn.jsdelivr.net`.
5. Click **Run** with a simple solution. Verify:
   - Output appears in the Output panel.
   - Callstack frames appear (if the solution uses lists).
   - Runtime is displayed.
6. Test error handling: submit code with a syntax error, verify traceback appears.
7. Test timeout: submit `def solution():\n    while True: pass` and verify TLE error appears within ~30 s and subsequent runs still work.
