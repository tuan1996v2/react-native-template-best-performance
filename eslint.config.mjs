import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import reactNativePlugin from "eslint-plugin-react-native";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import unusedImports from "eslint-plugin-unused-imports";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

export default tseslint.config(
  {
    // Cấu hình thay thế .eslintignore
    ignores: [
      "**/node_modules/**",
      "**/android/**",
      "**/ios/**",
      "**/build/**",
      "**/dist/**",
      "**/*.log",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "react": reactPlugin,
      "react-native": reactNativePlugin,
      "react-hooks": reactHooksPlugin,
      "unused-imports": unusedImports,
      "prettier": prettierPlugin,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      // Các rule từ file cũ của bạn
      "semi": "off",
      "comma-dangle": "off",
      "no-shadow": "off",
      "no-undef": "off",
      "unused-imports/no-unused-imports": "error",
      "arrow-body-style": ["error", "as-needed"],
      "@typescript-eslint/no-shadow": ["error"],
      "@typescript-eslint/no-empty-interface": "warn",
      "react-native/no-unused-styles": "error",
      "react-native/no-inline-styles": "error",
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/no-unused-vars": ["warn"],
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      
      // Kích hoạt Prettier gạch chân lỗi format
      "prettier/prettier": "error",
    },
  },
  prettierConfig // Phải để cuối cùng để ghi đè các rule xung đột
);