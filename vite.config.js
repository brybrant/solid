import { defineConfig } from 'vite';
import eslintPlugin from 'vite-plugin-eslint2';
import solidPlugin from 'vite-plugin-solid';
import solidSvgPlugin from 'vite-plugin-solid-svg';
import stylelintPlugin from 'vite-plugin-stylelint';

import * as configs from '@brybrant/configs';

export default defineConfig(({ mode }) => {
  const development = mode === 'development';

  return {
    base: '/solid/',
    build: {
      minify: development ? true : 'terser',
      terserOptions: {
        compress: {
          booleans_as_integers: true,
          drop_console: true,
          module: true,
          passes: 2,
        },
        mangle: {
          module: true,
        },
        format: {
          comments: false,
        },
      },
    },
    css: {
      modules: {
        getJSON: configs.cssModulesExportJSON,
      },
      postcss: configs.postCSSConfig,
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
        },
      },
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
  };
});
