"use client";

import { SnackbarProvider } from "notistack";
import React, { type ReactNode } from "react";

import { TrpcProvider } from "#/shared/trpc/TrpcProvider";
import { SnackbarCloseButton } from "#/shared/ui/atoms/SnackbarCloseButton";
import { StateThemeProvider } from "#/shared/ui/providers/StateThemeProvider";
import { isSnackbarClosable } from "#/shared/ui/snackbarClosability";
import { ReduxProvider } from "#/store/provider";
import type { SsrDeviceType } from "#/themes";

type AppShellProvidersProps = {
  children: ReactNode;
  ssrDeviceType?: SsrDeviceType;
};

/**
 * Base client providers for all App Router layouts.
 * Apollo mounts in {@link InteractiveDataProviders} on data routes only.
 * SessionProvider is mounted in SessionGate (inside LocaleAppLayout).
 */
export const AppShellProviders: React.FC<AppShellProvidersProps> = ({
  children,
  ssrDeviceType,
}) => (
  <TrpcProvider>
    <ReduxProvider>
      <StateThemeProvider ssrDeviceType={ssrDeviceType}>
        <SnackbarProvider
          maxSnack={4}
          action={(snackbarKey) =>
            isSnackbarClosable(snackbarKey) ? (
              <SnackbarCloseButton snackbarKey={snackbarKey} />
            ) : null
          }
          classes={{
            containerAnchorOriginBottomLeft: "snackbar-mobile-bottom-margin",
            containerAnchorOriginBottomCenter: "snackbar-mobile-bottom-margin",
            containerAnchorOriginBottomRight: "snackbar-mobile-bottom-margin",
          }}
        >
          {children}
        </SnackbarProvider>
      </StateThemeProvider>
    </ReduxProvider>
  </TrpcProvider>
);
