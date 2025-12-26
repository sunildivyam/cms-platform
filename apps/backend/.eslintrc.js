module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "google",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["tsconfig.eslint.json"], // Crucial for monorepos
    sourceType: "module",
  },
  ignorePatterns: [
    "/dist/**/*", // Ignore built files
    "/node_modules/**/*",
    "tsup.config.ts",
  ],
  plugins: [
    "@typescript-eslint",
    "import",
  ],
  rules: {
    "quotes": ["error", "double"],
    "import/no-unresolved": 0,
    "indent": 0,
    "object-curly-spacing": ["error", "always"],
    "require-jsdoc": 0,
    "@typescript-eslint/no-non-null-assertion": 0,
    "@typescript-eslint/no-explicit-any": 0,
    "linebreak-style": 0,
  },
};
