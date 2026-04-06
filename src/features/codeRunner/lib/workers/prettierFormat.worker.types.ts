/** Messages from main thread → Prettier format worker. */
export type PrettierWorkerInMessage = {
  type: "FORMAT";
  requestId: string;
  code: string;
};

/** Messages from worker → main thread. */
export type PrettierWorkerOutMessage =
  | { type: "FORMAT_RESULT"; requestId: string; formatted: string }
  | {
      type: "ERROR";
      requestId: string;
      error: { name: string; message: string; stack?: string };
    };
