import { defineConfig } from 'vite';
import eslintPlugin from 'vite-plugin-eslint2';
import solidPlugin from 'vite-plugin-solid';
import solidSvgPlugin from 'vite-plugin-solid-svg';
import stylelintPlugin from 'vite-plugin-stylelint';

import * as configs from '@brybrant/configs';

export default defineConfig({
  base: '/solid/',
  css: {
    modules: {
      getJSON: configs.cssModulesExportJSON,
    },
    postcss: configs.postCSSConfig,
  },
  plugins: [
    stylelintPlugin({
      lintInWorker: true,
      config: configs.stylelintConfig,
    }),
    solidPlugin(),
    solidSvgPlugin({
      defaultAsComponent: true,
      svgo: {
        svgoConfig: configs.svgoConfig,
      },
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
