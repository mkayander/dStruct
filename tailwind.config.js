import { colors } from './src/shared/lib/colors';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: colors.primary,
        secondary: colors.secondary,
        error: colors.error,
        question: colors.question,
      }
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
}
