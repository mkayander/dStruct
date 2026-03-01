import type { ExecutionResult } from "../../hooks/useCodeExecution";
import type { SerializedPythonArg } from "../createPythonRuntimeArgs";

/** Messages sent from the main thread to the Pyodide worker. */
export type PythonWorkerInMessage =
  | { type: "INIT"; indexURL?: string }
  | {
      type: "RUN";
      requestId: string;
      code: string;
      args?: SerializedPythonArg[];
    };

/** Progress during INIT: value 0–100, stage label for UI. */
export type PythonWorkerProgressMessage = {
  type: "PROGRESS";
  value: number;
  stage: string;
};

/** Messages sent from the Pyodide worker back to the main thread. */
export type PythonWorkerOutMessage =
  | { type: "READY" }
  | PythonWorkerProgressMessage
  | { type: "RUN_RESULT"; requestId: string; result: ExecutionResult }
  | {
      type: "ERROR";
      requestId: string;
      error: { name: string; message: string; stack?: string };
    };
