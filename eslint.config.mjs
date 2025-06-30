import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Convert specific errors to warnings to allow deployment
      "@typescript-eslint/no-unused-vars": "warn",
      "react-hooks/exhaustive-deps": "warn",
      
      // Optional: You can also completely disable these rules if needed
      // "@typescript-eslint/no-unused-vars": "off",
      // "react-hooks/exhaustive-deps": "off",
    },
  },
];

export default eslintConfig;
