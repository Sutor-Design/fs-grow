module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "jest"],
  extends: [
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "prettier/@typescript-eslint",
  ],
  env: {
    browser: true,
    node: true,
    es6: true,
    jest: true,
    "jest/globals": true,
  },
  globals: {
    jest: true,
  },
  settings: {
    "import/resolver": {
      typescript: {},
    },
  },
  rules: {
    // Base.
    "comma-dangle": ["error", "always-multiline"],
    "no-console": "warn",
    "no-use-before-define": "off",
    "spaced-comment": "off",

    // Import.
    "import/prefer-default-export": "off",

    // TypeScript.
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-use-before-define": "off",
  },
};
