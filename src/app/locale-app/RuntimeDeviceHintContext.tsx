"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import type { SsrDeviceType } from "#/themes";

type RuntimeDeviceHintContextValue = {
  ssrDeviceType: SsrDeviceType;
  applySsrDeviceType: (deviceType: SsrDeviceType | undefined) => void;
};

export const RuntimeDeviceHintContext =
  createContext<RuntimeDeviceHintContextValue | null>(null);

export const RuntimeDeviceHintProvider: React.FC<{
  children: React.ReactNode;
  initialSsrDeviceType?: SsrDeviceType;
}> = ({ children, initialSsrDeviceType = "desktop" }) => {
  const [ssrDeviceType, setSsrDeviceType] =
    useState<SsrDeviceType>(initialSsrDeviceType);

  const applySsrDeviceType = useCallback(
    (deviceType: SsrDeviceType | undefined) => {
      if (deviceType === undefined) {
        return;
      }
      setSsrDeviceType((current) =>
        current === deviceType ? current : deviceType,
      );
    },
    [],
  );

  const value = useMemo(
    () => ({ ssrDeviceType, applySsrDeviceType }),
    [applySsrDeviceType, ssrDeviceType],
  );

  return (
    <RuntimeDeviceHintContext.Provider value={value}>
      {children}
    </RuntimeDeviceHintContext.Provider>
  );
};

export const useRuntimeDeviceHint = (): RuntimeDeviceHintContextValue => {
  const context = useContext(RuntimeDeviceHintContext);
  if (context === null) {
    throw new Error(
      "useRuntimeDeviceHint must be used within RuntimeDeviceHintProvider",
    );
  }
  return context;
};
