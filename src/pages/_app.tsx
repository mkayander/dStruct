import type { Session } from "next-auth";
import { type AppProps } from "next/app";
import React from "react";
import "symbol-observable";

import { CookieConsentRoot } from "#/features/cookieConsent/ui/CookieConsentRoot";
import { ProjectBrowser } from "#/features/project/ui/ProjectBrowser/ProjectBrowser";
import { ProjectBrowserProvider } from "#/features/project/ui/ProjectBrowser/ProjectBrowserContext";
import { type I18nProps } from "#/i18n/getI18nProps";
import { EmotionCacheProvider } from "#/shared/emotion/EmotionCacheContext";
// `_document` is server-only; importing fonts here registers @font-face + CSS vars in the client bundle.
import "#/shared/fonts/appFonts";
import { AppShellProviders } from "#/shared/ui/providers/AppShellProviders";
import { I18nProvider } from "#/shared/ui/providers/I18nProvider";
import type { SsrDeviceType } from "#/themes";

import "#/styles/globals.css";

import "overlayscrollbars/overlayscrollbars.css";

type MyAppProps = {
  session: Session | null;
  i18n?: I18nProps;
  ssrDeviceType?: SsrDeviceType;
};

const MyApp: React.FC<AppProps<MyAppProps>> = ({ Component, pageProps }) => {
  return (
    <EmotionCacheProvider>
      <AppShellProviders
        session={pageProps.session}
        ssrDeviceType={pageProps.ssrDeviceType}
      >
        <I18nProvider i18n={pageProps.i18n}>
          <CookieConsentRoot>
            <ProjectBrowserProvider>
              <Component {...pageProps} />
              <ProjectBrowser />
            </ProjectBrowserProvider>
          </CookieConsentRoot>
        </I18nProvider>
      </AppShellProviders>
    </EmotionCacheProvider>
  );
};

export default MyApp;
