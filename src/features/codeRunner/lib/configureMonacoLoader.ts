"use client";

import { loader } from "@monaco-editor/react";

import packageJson from "../../../../package.json";

let isConfigured = false;

function resolveMonacoCdnVersion(): string {
  const specifier = packageJson.dependencies["monaco-editor"];
  const matchedVersion = specifier.match(/\d+\.\d+\.\d+/)?.[0];
  if (!matchedVersion) {
    throw new Error(
      `Could not parse monaco-editor version from package.json: ${specifier}`,
    );
  }
  return matchedVersion;
}

/**
 * Pin Monaco's CDN loader to the installed `monaco-editor` version so workers
 * and editor stay in sync. Bundling via `loader.config({ monaco })` requires
 * `MonacoEnvironment.getWorker`, which is non-trivial under Next/Turbopack.
 */
export function configureMonacoLoader(): void {
  if (isConfigured) {
    return;
  }

  loader.config({
    paths: {
      vs: `https://cdn.jsdelivr.net/npm/monaco-editor@${resolveMonacoCdnVersion()}/min/vs`,
    },
  });
  isConfigured = true;
}

configureMonacoLoader();
