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
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["tsconfig.json", "tsconfig.dev.json"],
    sourceType: "module",
  },
  ignorePatterns: [
    "/lib/**/*", // Ignore built files
  ],
  plugins: [
    "import",
    "@typescript-eslint",
  ],
 rules: {
    "quotes": "off",
    "object-curly-spacing": "off",
    "max-len": "off",
    "comma-dangle": "off",
    "arrow-parens": "off",
    "camelcase": "off",
    "eol-last": "off",
    "import/no-unresolved": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/prefer-const": "off",
    "no-trailing-spaces": "off",
  },
};