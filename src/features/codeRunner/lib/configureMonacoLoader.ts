"use client";

import { loader } from "@monaco-editor/react";
import * as monaco from "monaco-editor";

let isConfigured = false;

/** Use the app bundle for Monaco instead of the default jsDelivr CDN loader. */
export function configureMonacoLoader(): void {
  if (isConfigured) {
    return;
  }

  loader.config({ monaco });
  isConfigured = true;
}

configureMonacoLoader();
