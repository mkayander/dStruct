// @ts-check
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env/server.mjs"));

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ["en", "ru", "de", "es", "sr", "uk"],
    defaultLocale: "en",
    localeDetection: false,
  },
  images: {
    domains: [
      "leetpal.s3.eu-central-1.amazonaws.com",
      "leetpal-prod.s3.eu-central-1.amazonaws.com",
    ],
  },
  webpack: (config) => {
    return {
      ...config,
      module: {
        ...config.module,
        rules: config.module.rules.concat([
          {
            test: /\.txt$/,
            loader: "raw-loader",
          },
        ]),
      },
    };
  },
};
export default config;
