// @ts-check
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
void (
  !process.env.SKIP_ENV_VALIDATION && (await import("./src/env/server.mjs"))
);

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  transpilePackages: ["@mui/x-charts"],
  i18n: {
    locales: ["en", "ru", "de", "es", "sr", "uk"],
    defaultLocale: "en",
    localeDetection: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "leetpal.s3.eu-central-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "leetpal-prod.s3.eu-central-1.amazonaws.com",
      },
    ],
  },
  sassOptions: {
    silenceDeprecations: ["legacy-js-api"],
  },
  turbopack: {
    rules: {
      "*.txt": {
        loaders: ["raw-loader"],
        as: "*.js",
      },
    },
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
