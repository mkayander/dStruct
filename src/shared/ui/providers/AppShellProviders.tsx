"use client";

import { ApolloProvider } from "@apollo/client";
import { SnackbarProvider } from "notistack";
import React, { type ReactNode } from "react";

import { apolloClient } from "#/graphql/apolloClient";
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
 * Shared client provider stack for App Router layouts.
 * SessionProvider lives in StreamingSessionRoot (P10 session stream).
 */
export const AppShellProviders: React.FC<AppShellProvidersProps> = ({
  children,
  ssrDeviceType,
}) => (
  <TrpcProvider>
    <ReduxProvider>
      <ApolloProvider client={apolloClient}>
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
              containerAnchorOriginBottomCenter:
                "snackbar-mobile-bottom-margin",
              containerAnchorOriginBottomRight: "snackbar-mobile-bottom-margin",
            }}
          >
            {children}
          </SnackbarProvider>
        </StateThemeProvider>
      </ApolloProvider>
    </ReduxProvider>
  </TrpcProvider>
);
