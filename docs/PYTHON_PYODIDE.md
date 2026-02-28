# Python Execution via Pyodide (In-Browser)

dStruct runs Python code directly in the browser using [Pyodide](https://pyodide.org/) -- a CPython port compiled to WebAssembly. No local Python installation or server is required.

## How It Works

1. When a user opens a Python problem page, the `usePythonCodeRunner` hook eagerly initializes a dedicated **Web Worker**.
2. The worker downloads the Pyodide runtime (~30 MB, cached by the browser after first load) and writes the dStruct Python harness files into Pyodide's virtual filesystem.
3. When the user clicks **Run**, the user's code is posted to the worker. The existing `safe_exec()` harness performs AST transformation (list tracking), executes the code, and returns a structured `ExecutionResult` back to the main thread.
4. If execution exceeds the timeout (default 30 s), the worker is terminated and automatically recreated for subsequent runs.

```
Main thread                         Web Worker
    |                                   |
    |-- INIT (optional indexURL) ------>|
    |                                   |  loadPyodide()
    |                                   |  write harness .py files to FS
    |<------------ READY ---------------|
    |                                   |
    |-- RUN { requestId, code } ------->|
    |                                   |  safe_exec(code) -> JSON
    |<-- RUN_RESULT { requestId, ... }--|
```

## Configuration

### Execution Mode

Set the `NEXT_PUBLIC_PYTHON_EXEC_MODE` environment variable to control which execution backend is used:

| Value | Description |
|---|---|
| `pyodide` (default) | In-browser execution via Pyodide Web Worker |
| `server` | Legacy mode: sends code to the local Express runner on `localhost:8085` |

If the variable is not set, **pyodide** mode is used automatically.

### Pyodide CDN / Self-Hosting

By default, Pyodide assets are fetched from the [jsDelivr CDN](https://cdn.jsdelivr.net/pyodide/). The URL is determined by the `pyodide` npm package version.

To self-host:

1. Copy the contents of `node_modules/pyodide/` to a static directory served by your app (e.g. `public/pyodide/`).
2. Pass a custom `indexURL` when constructing the `PythonRunner`:
   ```ts
   const runner = new PythonRunner("/pyodide/");
   ```
3. Ensure files are served with appropriate cache headers (`Cache-Control: public, max-age=31536000, immutable` for the versioned WASM files).

## Key Files

| File | Purpose |
|---|---|
| `src/features/codeRunner/lib/workers/pythonExec.worker.ts` | Web Worker: loads Pyodide, embeds harness, handles INIT/RUN |
| `src/features/codeRunner/lib/workers/pythonExec.worker.types.ts` | TypeScript types for the worker message protocol |
| `src/features/codeRunner/lib/pythonRunner.ts` | Main-thread singleton: manages worker lifecycle, timeouts, auto-recreate |
| `src/features/codeRunner/hooks/usePythonCodeRunner.ts` | React hook consumed by the UI; preloads worker on mount |
| `src/packages/dstruct-runner/python/exec.py` | Python harness: AST transform + sandboxed exec (unchanged) |

## Known Limitations

- **Standard library only.** `micropip` / third-party packages are not installed. Code that imports `numpy`, `pandas`, etc. will fail.
- **Cold start.** First load downloads ~30 MB of Pyodide assets. Subsequent loads are served from browser cache. Initial `loadPyodide()` takes 2-5 seconds even when cached.
- **Memory.** Pyodide runs inside a single Web Worker. Heavy allocations in Python consume browser memory with no hard cap beyond the browser's per-tab limit.
- **No file I/O.** The Pyodide virtual filesystem is ephemeral. `open()` / `os.path` calls work within the session but are lost on reload.
- **Timeout is coarse.** The timeout terminates the entire worker (via `Worker.terminate()`). There is no cooperative cancellation; long-running C-level operations in Pyodide cannot be interrupted more gracefully.
- **No benchmarking mode** for Python (same as before the migration).

## Running the Smoke Test

```bash
# Protocol-level unit tests (fast, no Pyodide download)
pnpm vitest run src/features/codeRunner/lib/workers/pythonExec.worker.spec.ts
```

For a full integration test, start the dev server (`pnpm dev`) and open a Python problem page. Click **Run** and verify that output, callstack frames, and errors display correctly without any requests to `localhost:8085`.
