import path from "node:path";
import { fileURLToPath } from "node:url";

import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import react from "eslint-plugin-react";
import reactCompiler from "eslint-plugin-react-compiler";
import reactHooks from "eslint-plugin-react-hooks";
import tailwind from "eslint-plugin-tailwindcss";
import ts from "typescript-eslint";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tailwindCssPath = path.resolve(__dirname, "tailwind-eslint.css");

export default [
  js.configs.recommended,
  ...ts.configs.recommended,
  react.configs.flat["jsx-runtime"],
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "react-hooks": reactHooks,
      "react-compiler": reactCompiler,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-hooks/set-state-in-effect": "warn",
      "react-compiler/react-compiler": "error",
    },
  },
  ...tailwind.configs["flat/recommended"],
  {
    files: ["**/*.{ts,tsx}"],
    settings: {
      tailwindcss: {
        config: tailwindCssPath,
        whitelist: [
          "text-muted-foreground",
          "bg-muted-foreground/30",
          "bg-primary",
          "text-primary-foreground",
        ],
      },
    },
  },
  eslintConfigPrettier,
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "*.config.js",
      "*.config.ts",
      "coverage/**",
    ],
  },
];
