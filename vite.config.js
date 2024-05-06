import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';
import solidSVG from 'vite-plugin-solid-svg';
import eslintPlugin from '@nabla/vite-plugin-eslint';

export default defineConfig(({ command }) => ({
  base: command === 'serve' ? '/' : '/solid/',
  plugins: [
    solid(),
    solidSVG({
      defaultAsComponent: true,
    }),
    eslintPlugin({
      eslintOptions: {
        cache: true,
        cacheStrategy: 'content',
      },
      formatter: 'stylish',
    }),
  ],
  server: {
    host: '127.0.0.1',
    port: 3000,
    strictPort: true,
  },
}));
