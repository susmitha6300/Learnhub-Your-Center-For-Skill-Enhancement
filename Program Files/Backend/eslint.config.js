const globals = require("globals");
const pluginJs = require("@eslint/js");

module.exports = [
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest
      }
    },
    files: ["**/*.js"],
    rules: {
      ...pluginJs.configs.recommended.rules,
      // Add custom rules here if needed
      "no-unused-vars": ["error", { "argsIgnorePattern": "^(_|err)" }]
    }
  }
];