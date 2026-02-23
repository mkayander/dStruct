import createEmotionServer from "@emotion/server/create-instance";
import NextDocument, { Head, Html, Main, NextScript } from "next/document";
import type { DocumentContext, DocumentProps } from "next/document";
import React from "react";

import { createEmotionCache } from "#/shared/emotion/createEmotionCache";
import { EmotionCacheContext } from "#/shared/emotion/EmotionCacheContext";

type MyDocumentProps = DocumentProps & {
  emotionStyleTags?: React.ReactElement;
};

function Document({ emotionStyleTags }: MyDocumentProps) {
  // noinspection HtmlRequiredTitleElement
  return (
    <Html lang="en">
      <Head>
        {emotionStyleTags}
        <meta
          name="description"
          content="dStruct is a web app that helps you understand LeetCode problems. It allows you to visualize your solutions that you write in a built-in code editor."
        />

        <meta property="og:title" content="dStruct" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dstruct.app/" />
        <meta
          property="og:description"
          content="dStruct is a web app that helps you understand LeetCode problems. It allows you to visualize your solutions that you write in a built-in code editor."
        />
        <meta
          property="og:image"
          content="https://dstruct.app/static/screen2.png"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="dstruct.app" />
        <meta property="twitter:url" content="https://dstruct.app/" />
        <meta name="twitter:title" content="dStruct" />
        <meta
          name="twitter:description"
          content="dStruct is a web app that helps you understand LeetCode problems. It allows you to visualize your solutions that you write in a built-in code editor."
        />
        <meta
          name="twitter:image"
          content="https://dstruct.app/static/screen2.png"
        />

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
        <meta name="msapplication-TileColor" content="#da532c" />
        {/*<meta name="theme-color" content="#ffffff"/>*/}

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Share+Tech&display=swap"
          rel="stylesheet"
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

  return {
    ...initialProps,
    emotionStyleTags,
  };
};

export default Document;
