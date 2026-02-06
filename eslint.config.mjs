import js from "@eslint/js";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import globals from "globals";
import eslintConfigPrettier from "eslint-config-prettier/flat";

const config = [
  {
    ignores: [
      ".next/**",
      "out/**",
      "node_modules/**",
      "coverage/**",
      "dist/**",
    ],
  },
  js.configs.recommended,
  ...nextCoreWebVitals,
  {
    files: ["src/**/*.{js,jsx,ts,tsx}"],
    languageOptions: { globals: globals.browser },
  },
  {
    files: [
      "*.{js,cjs,mjs,ts}",
      "eslint.config.mjs",
      "next.config.ts",
      "postcss.config.mjs",
      "*.config.{js,mjs,cjs,ts}",
    ],
    languageOptions: { globals: globals.node },
  },
  eslintConfigPrettier,
];

export default config;
