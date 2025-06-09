import { Title } from '@solidjs/meta';

import { coordinates, root2 } from '../components/coordinates';
import SourceButton from '../components/source-button';
import styles from './xyz.module.scss';

const columns = 6;
const rows = 11;

const BackgroundElement = (props) => (
  <div
    class={styles.cube_container}
    style={{
      transform: `translateY(-${
        50 +
        Math.sin(
          (Math.sqrt(
            Math.pow(
              coordinates().x -
                props.column / (columns - (1 - (props.row % 2))),
              2,
            ) + Math.pow(coordinates().y - props.row / (rows - 1), 2),
          ) /
            root2) *
            Math.PI,
        ) *
          100
      }%)`,
    }}
  >
    <div class={styles.cube_top} />
  </div>
);

export default () => {
  return (
    <>
      <Title>XYZ</Title>
      <div class={`background ${styles.background}`}>
        {() => {
          const elements = [];

          for (let row = 0; row < rows; row++) {
            for (let column = 0; column < columns; column++) {
              elements.push(<BackgroundElement column={column} row={row} />);
            }

            if (row % 2 > 0) {
              elements.push(<BackgroundElement column={columns} row={row} />);
            }
          }

          return elements;
        }}
      </div>
      <main>
        <h1>XYZ</h1>

        <SourceButton href='/blob/master/src/pages/xyz.module.scss' />
      </main>
    </>
  );
};
