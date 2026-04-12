import nextPlugin from "@next/eslint-plugin-next";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import testingLibrary from "eslint-plugin-testing-library";
import tseslint from "typescript-eslint";

const eslintConfig = [
  // Global ignores - must be a separate config object
  {
    ignores: [
      ".eslintrc.js",
      "jest.config.cjs",
      "jest.setup.mjs",
      "**/*.worker.js",
      "**/dist/**",
      "**/coverage/**",
      "src/graphql/generated/**",
      "src/server/db/generated/**",
      ".next/**",
      "node_modules/**",
      "next-env.d.ts",
    ],
  },
  // TypeScript ESLint recommended configs
  ...tseslint.configs.recommended,
  // Base config for all TypeScript/JavaScript files
  {
    files: ["**/*.{js,jsx,ts,tsx,mjs,cjs}"],
    plugins: {
      "@next/next": nextPlugin,
      "react-hooks": reactHooksPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      ...reactHooksPlugin.configs.recommended.rules,
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
      // Forbid one-letter variable/parameter/catch names (see .cursor/rules/no-one-letter-identifiers.mdc).
      // "_" is allowed as an intentional discard (e.g. map((_, index) => ...)). i/j/k are allowed for classic for-loop indices only.
      // Object property keys are not checked.
      "id-length": [
        "error",
        {
          min: 2,
          exceptions: ["_", "i", "j", "k", "x", "y", "z"],
          properties: "never",
        },
      ],
      "no-restricted-syntax": [
        "error",
        {
          selector:
            'MemberExpression[object.name="React"][property.name=/^use([A-Z]|$)/]',
          message:
            'Import hooks from "react" and call them directly (e.g. useEffect), not React.useEffect.',
        },
      ],
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["^@mui/material$", "^@mui/icons-material$"],
              message:
                "Import from specific files to avoid loading entire package. Use '@mui/material/Button' instead of '@mui/material' or '@mui/icons-material/Close' instead of '@mui/icons-material'.",
            },
          ],
        },
      ],
    },
  },
  // TypeScript-specific config with parser options
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
  },
  // Testing Library rules for test files only
  {
    files: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
    plugins: {
      "testing-library": testingLibrary,
    },
    rules: {
      ...testingLibrary.configs.react.rules,
    },
  },
  // Last: Prettier as ESLint rule + disable conflicting formatting rules
  eslintPluginPrettierRecommended,
];

export default eslintConfig;
