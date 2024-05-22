import js from '@eslint/js';
import eslintPluginSolid from 'eslint-plugin-solid/configs/recommended.js';
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';

export default [
  js.configs.recommended,
  eslintPluginSolid,
  eslintPluginPrettier,
  {
    'prettier/prettier': [
      {
        'endOfLine': 'auto',
      },
    ],
  },
];