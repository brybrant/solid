import viteConfig from '@brybrant/vite-config';

import solidPlugin from 'vite-plugin-solid';

export default viteConfig({
  base: '/solid/',
  plugins: [solidPlugin()],
});
