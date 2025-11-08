import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [
  ...compat.config({
    parserOptions: {
      project: "./tsconfig.json",
    },
    extends: ["next/core-web-vitals", "next/typescript"],
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          fixStyle: "inline-type-imports",
        },
      ],
      "@typescript-eslint/no-unused-expressions": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-empty-object-type": "off",
      "no-unused-vars": "off", // Turn off base rule as it conflicts with @typescript-eslint/no-unused-vars
    },
    ignorePatterns: [
      ".eslintrc.js",
      "jest.config.cjs",
      "jest.setup.mjs",
      "*.worker.js",
      "**/dist/**",
      "postcss.config.js",
      "tailwind.config.js",
      "src/graphql/generated/**",
    ],
    overrides: [
      // Only uses Testing Library lint rules in test files
      {
        files: [
          "**/__tests__/**/*.[jt]s?(x)",
          "**/?(*.)+(spec|test).[jt]s?(x)",
        ],
        extends: ["plugin:testing-library/react"],
      },
    ],
  }),
];

export default eslintConfig;
