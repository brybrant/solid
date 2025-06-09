import { Title } from '@solidjs/meta';

import { coordinates, root2 } from '../components/coordinates';
import SourceButton from '../components/source-button';
import styles from './cmyk.module.scss';

const columns = 10;
const rows = 10;

const BackgroundElement = (props) => (
  <div
    style={{
      transform: `scale(${
        (props.invert ? 0 : root2) -
        Math.sqrt(
          Math.pow(coordinates().x - props.column / (columns - 1), 2) +
            Math.pow(coordinates().y - props.row / (rows - 1), 2),
        )
      })`,
    }}
  />
);

function createElements(invert = false) {
  const elements = [];

  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      elements.push(
        <BackgroundElement column={column} row={row} invert={invert} />,
      );
    }
  }

  return elements;
}

export default () => {
  return (
    <>
      <Title>CMYK</Title>
      <div class={`background ${styles.background}`}>
        <div class={styles.yellow}>{createElements(true)}</div>
        <div class={styles.magenta}>{createElements()}</div>
        <div class={styles.cyan}>{createElements()}</div>
      </div>
      <main>
        <h1>CMYK</h1>

        <SourceButton href='/blob/master/src/pages/cmyk.module.scss' />
      </main>
    </>
  );
};
