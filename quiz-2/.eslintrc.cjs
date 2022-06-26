/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript/recommended',
    '@vue/eslint-config-prettier',
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': 'off',
    'vue/multi-word-component-names': 'off',
  },
  overrides: [
    {
      files: ['*.config.js'],
      env: { node: true },
    },
  ],
}
