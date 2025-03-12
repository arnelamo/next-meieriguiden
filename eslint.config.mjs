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
      // Typescript rules
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          vars: "all",
          args: "after-used",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          ignoreRestSiblings: false,
          reportUsedIgnorePattern: false,
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      // Error prevention
      "no-await-in-loop": "warn",
      "no-constant-condition": "warn",
      "require-atomic-updates": "warn",

      // Best practices
      "no-return-await": "warn",
      "no-self-compare": "warn",
      "no-unmodified-loop-condition": "warn",
      "no-useless-concat": "warn",
      "no-with": "error",

      // Modern JavaScript
      "prefer-const": "warn",
      "prefer-arrow-callback": "warn",
      "object-shorthand": ["warn", "always"],
      "no-var": "error",
    },
    ignores: ["tailwind.config.ts", "postcss.config.ts"],
  },
];

export default eslintConfig;
