"use client";

import { useEffect } from "react";

import type { SsrDeviceType } from "#/themes";

import { useRuntimeDeviceHint } from "#/app/locale-app/RuntimeDeviceHintContext";

type LocaleAppRuntimeHintsClientProps = {
  ssrDeviceType?: SsrDeviceType;
};

/** Applies streamed proxy device hint to theme without remounting the provider tree. */
export const LocaleAppRuntimeHintsClient: React.FC<
  LocaleAppRuntimeHintsClientProps
> = ({ ssrDeviceType }) => {
  const { applySsrDeviceType } = useRuntimeDeviceHint();

  // Streamed SSR device hint from proxy — updates MUI breakpoints after shell paint.
  useEffect(() => {
    applySsrDeviceType(ssrDeviceType);
  }, [applySsrDeviceType, ssrDeviceType]);

  return null;
};
