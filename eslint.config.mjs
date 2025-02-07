// import { dirname } from "path";
// import { fileURLToPath } from "url";
// import { FlatCompat } from "@eslint/eslintrc";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const compat = new FlatCompat({
//   baseDirectory: __dirname,
// });

// const eslintConfig = [
//   ...compat.extends("next/core-web-vitals", "next/typescript"),
// ];

// export default eslintConfig;

export default {
  root: true,
  extends: [],
  rules: {
    // Turn off all rules by default
    "no-unused-vars": "off",
    "no-console": "off",
    "@typescript-eslint/no-empty-object-type": "off", // Disable this specific rule as well
    // Add any other rules you want to disable here
  },
};
