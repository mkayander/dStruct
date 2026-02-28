import type { ExecutionResult } from "../../hooks/useCodeExecution";

/** Messages sent from the main thread to the Pyodide worker. */
export type PythonWorkerInMessage =
  | { type: "INIT"; indexURL?: string }
  | { type: "RUN"; requestId: string; code: string };

/** Messages sent from the Pyodide worker back to the main thread. */
export type PythonWorkerOutMessage =
  | { type: "READY" }
  | { type: "RUN_RESULT"; requestId: string; result: ExecutionResult }
  | {
      type: "ERROR";
      requestId: string;
      error: { name: string; message: string; stack?: string };
    };
