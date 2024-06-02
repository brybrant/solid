import autoprefixer from 'autoprefixer';
import purgeCSSPlugin from '@fullhuman/postcss-purgecss';

// https://github.com/postcss/postcss-load-config
export default () => ({
  plugins: [
    autoprefixer({
      flexbox: false,
    }),
    purgeCSSPlugin({
      content: ['index.html', './src/**/*.jsx', './modules/*.json'],
      safelist: ['active'],
      extractors: [
        {
          extractor: content => content.match(/\w+(?="[,}])/g) || [],
          extensions: ['json'],
        },
      ],
    }),
  ],
});
