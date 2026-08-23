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
  // L5: incremental Cache Components adoption (`instant = false` on runtime segments).
  cacheComponents: true,
  partialPrefetching: true,
  // Bundled docs: `node_modules/next/dist/docs/02-pages/04-api-reference/04-config/01-next-config-js/poweredByHeader.md`
  poweredByHeader: false,
  // Bundled docs: `node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/reactCompiler.md`
  reactCompiler: true,
  // Bundled docs: `node_modules/next/dist/docs/02-pages/04-api-reference/04-config/01-next-config-js/bundlePagesRouterDependencies.md`
  bundlePagesRouterDependencies: true,
  experimental: {
    // Bundled docs: `node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/optimizePackageImports.md`
    // @mui/material and @mui/icons-material are optimized by default; add other @mui/* barrel-heavy packages.
    optimizePackageImports: [
      "@hello-pangea/dnd",
      "@monaco-editor/react",
      "@mui/lab",
      "@mui/system",
      "@mui/utils",
      "@mui/x-charts",
      "@mui/x-internal-gestures",
      "overlayscrollbars-react",
    ],
  },
  transpilePackages: [
    "@mui/material-nextjs",
    "@apollo/client",
    "@hello-pangea/dnd",
    "@monaco-editor/react",
    "@mui/lab",
    "@mui/material",
    "@mui/system",
    "@mui/utils",
    "@mui/x-charts",
    "@mui/x-internal-gestures",
    "@popperjs/core",
    "@react-three/fiber",
    "@tanstack/query-core",
    "@trpc/client",
    "@trpc/server",
    "@vercel/analytics",
    "immer",
    "joi",
    "overlayscrollbars-react",
    "postcss",
    "short-uuid",
    "superjson",
    "three",
    "zod",
  ],
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
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/u/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },
  sassOptions: {
    silenceDeprecations: ["legacy-js-api"],
  },
  async redirects() {
    return [
      // L3b: retire `/internal-marketing/*` App pilot → public App routes (308).
      {
        source: "/internal-marketing/en",
        destination: "/",
        permanent: true,
      },
      {
        source: "/internal-marketing/en/:path*",
        destination: "/:path*",
        permanent: true,
      },
      {
        source: "/internal-marketing/:locale",
        destination: "/:locale",
        permanent: true,
      },
      {
        source: "/internal-marketing/:locale/:path*",
        destination: "/:locale/:path*",
        permanent: true,
      },
      // SEO: dedupe default-locale `/en/*` vs unprefixed URLs.
      {
        source: "/en",
        destination: "/",
        permanent: true,
      },
      {
        source: "/en/:path*",
        destination: "/:path*",
        permanent: true,
      },
    ];
  },
  turbopack: {
    rules: {
      "*.txt": {
        loaders: ["raw-loader"],
        as: "*.js",
      },
      "*.py": {
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
          {
            test: /\.py$/,
            loader: "raw-loader",
          },
        ]),
      },
    };
  },
};

export default config;
