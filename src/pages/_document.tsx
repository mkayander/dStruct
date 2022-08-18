/* eslint-disable @next/next/no-title-in-document-head */
import { Html, Head, Main, NextScript } from 'next/document';
import theme from '@src/theme';

export default function Document() {
    // noinspection HtmlRequiredTitleElement
    return (
        <Html lang="en">
            <Head>
                {/* PWA primary color */}
                <meta name="theme-color" content={theme.palette.primary.main} />
                <meta name="viewport" content="initial-scale=1, width=device-width" />
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
                />
                <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
