import eslintPluginSolid from 'eslint-plugin-solid/configs/recommended';
import globals from 'globals';

import eslintConfig from '@brybrant/eslint-config';

export default eslintConfig({
  files: ['./**/*.jsx'],
  languageOptions: {
    globals: globals.browser,
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
  plugins: eslintPluginSolid.plugins,
  rules: eslintPluginSolid.rules,
});
