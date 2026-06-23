module.exports = {
  env: {
    es6: true,
    node: true,
  },
  parserOptions: {
    "ecmaVersion": 2018,
  },
  extends: [
    "eslint:recommended",
    "google",
  ],
  rules: {
    "no-restricted-globals": ["error", "name", "length"],
    "prefer-arrow-callback": "error",
    "quotes": ["error", "double", {"allowTemplateLiterals": true}],
  },
  overrides: [
    {
      files: ["payments/**/*.js"],
      rules: {
        "require-jsdoc": "off",
        "valid-jsdoc": "off",
        "linebreak-style": "off",
        "quotes": "off",
        "object-curly-spacing": "off",
        "operator-linebreak": "off",
        "max-len": ["error", {"code": 120}],
      },
    },
    {
      files: ["**/*.spec.*"],
      env: {
        mocha: true,
      },
      rules: {},
    },
  ],
  globals: {},
};
