import { defineConfig } from 'vite';
import eslintPlugin from 'vite-plugin-eslint2';
import solidPlugin from 'vite-plugin-solid';
import solidSvgPlugin from 'vite-plugin-solid-svg';
import stylelintPlugin from 'vite-plugin-stylelint';

export default defineConfig({
  base: '/solid/',
  define: {
    __GITHUB__: JSON.stringify('https://github.com/brybrant/solid'),
  },
  plugins: [
    // https://stylelint.io/user-guide/configure/
    // https://stylelint.io/awesome-stylelint/
    stylelintPlugin({
      lintInWorker: true,
      config: {
        cache: true,
        extends: [
          'stylelint-config-standard-scss',
          'stylelint-config-prettier-scss',
          'stylelint-config-hudochenkov/order',
        ],
        fix: false,
        plugins: [
          'stylelint-high-performance-animation',
        ],
        rules: {
          'hue-degree-notation': 'number',
          'selector-pseudo-element-colon-notation': 'single',
          'value-keyword-case': ['lower', {
            camelCaseSvgKeywords: true
          }],
          'plugin/no-low-performance-animation-properties': true
        },
      },
    }),
    solidPlugin(),
    solidSvgPlugin({
      defaultAsComponent: true,
    }),
    eslintPlugin({
      lintInWorker: true,
    }),
  ],
  server: {
    host: '127.0.0.1',
    port: 3000,
    strictPort: true,
  },
});
