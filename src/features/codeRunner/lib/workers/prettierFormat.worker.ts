import * as parserBabel from "prettier/plugins/babel";
import * as prettierPluginEstree from "prettier/plugins/estree";
import * as prettier from "prettier/standalone";

import type {
  PrettierWorkerInMessage,
  PrettierWorkerOutMessage,
} from "./prettierFormat.worker.types";

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

self.addEventListener(
  "message",
  (event: MessageEvent<PrettierWorkerInMessage>) => {
    const data = event.data;
    if (data.type !== "FORMAT") return;

    const { requestId, code } = data;

    void (async () => {
      try {
        const formatted = await prettier.format(code, {
          parser: "babel",
          plugins: [parserBabel.default, prettierPluginEstree.default],
        });
        const msg: PrettierWorkerOutMessage = {
          type: "FORMAT_RESULT",
          requestId,
          formatted,
        };
        self.postMessage(msg);
      } catch (err: unknown) {
        const msg: PrettierWorkerOutMessage = {
          type: "ERROR",
          requestId,
          error: serializeError(err),
        };
        self.postMessage(msg);
      }
    })();
  },
);
