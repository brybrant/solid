import * as path from 'node:path';
import * as fs from 'node:fs';

import { defineConfig } from 'vite';
import eslintPlugin from 'vite-plugin-eslint2';
import solidPlugin from 'vite-plugin-solid';
import solidSvgPlugin from 'vite-plugin-solid-svg';
import stylelintPlugin from 'vite-plugin-stylelint';

import stylelintConfig from './stylelint.config';

export default defineConfig({
  base: '/solid/',
  css: {
    modules: {
      getJSON: (cssFileName, json) => {
        const module = path.basename(cssFileName, '.scss');

        fs.mkdir('./modules', {recursive: true}, (error) => {
          if (error) throw error;

          fs.writeFileSync(`./modules/${module}.json`, JSON.stringify(json));
        });
      },
    },
  },
  plugins: [
    stylelintPlugin({
      lintInWorker: true,
      config: stylelintConfig,
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
