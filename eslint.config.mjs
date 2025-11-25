import js from "@eslint/js";
import globals from "globals";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import unicornPlugin from "eslint-plugin-unicorn";
export default [
    {
        files: ["**/*.{js,jsx,mjs,cjs,ts,tsx}"],
        ignores: ["node_modules/**", "dist/**", ".vite/**"],
        languageOptions: {
            parser: tsparser,
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                ...globals.browser,
                ...globals.es2021,
            },
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        plugins: {
            "@typescript-eslint": tseslint,
            "react": reactPlugin,
            "react-hooks": reactHooksPlugin,
            "unicorn": unicornPlugin,
        },
        settings: {
            react: {
                version: "detect",
            },
        },
        rules: {
            "no-lonely-if": "error",
            eqeqeq: "error",
            "prefer-const": "error",
            "no-var": "error",
            "prefer-template": "error",
            "prefer-arrow-callback": "error",
            "no-unused-vars": "off",
            "consistent-return": "error",
            "no-alert": "error",
            "unicorn/no-lonely-if": "error",
            "unicorn/prefer-ternary": "error",
            "unicorn/consistent-destructuring": "error",
            "unicorn/error-message": "error",
            "unicorn/no-abusive-eslint-disable": "error",
            "@typescript-eslint/no-unused-vars": ["warn", {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                }],
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "react/prop-types": "off",
            "react/react-in-jsx-scope": "off",
            "react/jsx-uses-react": "off",
            "react-hooks/rules-of-hooks": "error",
            "react-hooks/exhaustive-deps": "warn",
        },
    },
];
