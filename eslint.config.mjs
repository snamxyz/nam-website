import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  {
    settings: {
      next: {
        rootDir: ["apps/web", "apps/admin"],
      },
    },
  },
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "apps/*/.next/**",
    "out/**",
    "apps/*/out/**",
    "build/**",
    "next-env.d.ts",
    "packages/db/generated/**",
  ]),
]);

export default eslintConfig;
