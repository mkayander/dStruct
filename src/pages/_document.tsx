import createEmotionServer from "@emotion/server/create-instance";
import NextDocument, { Head, Html, Main, NextScript } from "next/document";
import type { DocumentContext, DocumentProps } from "next/document";
import React from "react";

import { createEmotionCache } from "#/shared/emotion/createEmotionCache";
import { EmotionCacheContext } from "#/shared/emotion/EmotionCacheContext";

type MyDocumentProps = DocumentProps & {
  emotionStyleTags?: React.ReactElement;
  htmlLang?: string;
};

function Document({ emotionStyleTags, htmlLang = "en" }: MyDocumentProps) {
  // noinspection HtmlRequiredTitleElement
  return (
    <Html lang={htmlLang}>
      <Head>
        {emotionStyleTags}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <meta name="darkreader-lock" />

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#121212" />
        <meta name="theme-color" content="#121212" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="dStruct" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Roboto:300,400,500,700&family=Share+Tech&family=Space+Grotesk:wght@500;700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

Document.getInitialProps = async (ctx: DocumentContext) => {
  const originalRenderPage = ctx.renderPage;
  const cache = createEmotionCache();
  const { extractCritical } = createEmotionServer(cache);

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) =>
        function EnhancedApp(props) {
          return (
            <EmotionCacheContext.Provider value={cache}>
              <App {...props} />
            </EmotionCacheContext.Provider>
          );
        },
    });

  const initialProps = await NextDocument.getInitialProps(ctx);
  const { css, ids } = extractCritical(initialProps.html);
  const emotionStyleTags = (
    <style
      data-emotion={`${cache.key} ${ids.join(" ")}`}
      dangerouslySetInnerHTML={{ __html: css }}
    />
  );

  const htmlLang = ctx.locale ?? "en";

  return {
    ...initialProps,
    emotionStyleTags,
    htmlLang,
  };
};

export default Document;
