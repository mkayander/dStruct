"use client";

import { ApolloProvider } from "@apollo/client";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
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
  session: Session | null;
  ssrDeviceType?: SsrDeviceType;
};

/**
 * Shared client provider stack for Pages `_app` and App Router layouts.
 * Locale/i18n and router-specific cache wrappers stay outside this tree.
 */
export const AppShellProviders: React.FC<AppShellProvidersProps> = ({
  children,
  session,
  ssrDeviceType,
}) => (
  <TrpcProvider>
    <ReduxProvider>
      <SessionProvider session={session}>
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
                containerAnchorOriginBottomLeft:
                  "snackbar-mobile-bottom-margin",
                containerAnchorOriginBottomCenter:
                  "snackbar-mobile-bottom-margin",
                containerAnchorOriginBottomRight:
                  "snackbar-mobile-bottom-margin",
              }}
            >
              {children}
            </SnackbarProvider>
          </StateThemeProvider>
        </ApolloProvider>
      </SessionProvider>
    </ReduxProvider>
  </TrpcProvider>
);
