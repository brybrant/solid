import { createMemo } from 'solid-js';

import { Title } from '@solidjs/meta';

import { coordinates } from '../components/coordinates';
import SourceButton from '../components/source-button';
import styles from './rgb.module.scss';

const columns = 8;
const rows = 8;

const BackgroundElement = (props) => {
  const distance = createMemo(() =>
    Math.exp(
      -Math.sqrt(
        Math.pow(coordinates().x - props.column / (columns - 1), 2) +
          Math.pow(coordinates().y - props.row / (rows - 1), 2),
      ) * 1.5,
    ),
  );

  return (
    <div class={styles.pixel}>
      <div
        class={`${styles.subpixels} ${styles.subpixels1}`}
        style={{
          opacity: distance(),
        }}
      />
      <div
        class={`${styles.subpixels} ${styles.subpixels2}`}
        style={{
          opacity: Math.max((distance() - 0.5) * 2, 0),
        }}
      />
    </div>
  );
};

export default () => {
  return (
    <>
      <Title>RGB</Title>
      <div class={`background ${styles.background}`}>
        {() => {
          const elements = [];

          for (let row = 0; row < rows; row++) {
            for (let column = 0; column < columns; column++) {
              elements.push(<BackgroundElement column={column} row={row} />);
            }
          }

          return elements;
        }}
      </div>
      <main>
        <h1>RGB</h1>

        <SourceButton href='/blob/master/src/pages/rgb.module.scss' />
      </main>
    </>
  );
};
