import { Title } from '@solidjs/meta';

import { Canvas, RAD360, type RenderCallback } from '../components/canvas.tsx';
import SourceButton from '../components/source-button.tsx';

const ROWS_AND_COLUMNS = 14;
const CENTER = ROWS_AND_COLUMNS / 2;
const RADIAN = Math.PI / 180;
const SCALE = Math.sin(15 * RADIAN) + Math.cos(15 * RADIAN);
const CELL_SIZE = (1 / ROWS_AND_COLUMNS) * SCALE;
const CELL_SIZE_HALF = CELL_SIZE / 2;
const CELL_RADIUS = CELL_SIZE / Math.SQRT2;

const INKS = [
  {
    color: '#0ff',
    rotation: 15 * RADIAN,
  },
  {
    color: '#f0f',
    rotation: 150 * RADIAN,
  },
  {
    color: '#ff0',
    rotation: 105 * RADIAN,
  },
] as const;

const COORDINATE = new Float32Array(ROWS_AND_COLUMNS);
const NORMALIZED = new Float32Array(ROWS_AND_COLUMNS);

for (let i = 0; i < ROWS_AND_COLUMNS; i++) {
  COORDINATE[i] = (i - CENTER) * CELL_SIZE + CELL_SIZE_HALF;
  NORMALIZED[i] = i / ROWS_AND_COLUMNS;
}

export default () => {
  const columnFactors = new Float32Array(ROWS_AND_COLUMNS);
  const rowFactors = new Float32Array(ROWS_AND_COLUMNS);

  const render: RenderCallback = (context, currentX, currentY) => {
    for (let column = 0; column < ROWS_AND_COLUMNS; column++) {
      const x = currentX - NORMALIZED[column];
      columnFactors[column] = Math.exp(-3 * x * x);
    }

    for (let row = 0; row < ROWS_AND_COLUMNS; row++) {
      const y = currentY - NORMALIZED[row];
      rowFactors[row] = Math.exp(-3 * y * y);
    }

    context.save();

    context.fillStyle = '#fff';
    context.fillRect(-1, -1, 3, 3);

    let subtract = false;

    for (const ink of INKS) {
      context.fillStyle = ink.color;
      context.rotate(ink.rotation);

      if (subtract) context.globalCompositeOperation = 'multiply';

      for (let column = 0; column < ROWS_AND_COLUMNS; column++) {
        const columnFactor = columnFactors[column];
        const coordinateX = COORDINATE[column];

        for (let row = 0; row < ROWS_AND_COLUMNS; row++) {
          const radius = CELL_RADIUS * columnFactor * rowFactors[row];
          const coordinateY = COORDINATE[row];

          context.beginPath();
          context.ellipse(
            coordinateX,
            coordinateY,
            radius,
            radius,
            0,
            0,
            RAD360,
          );
          context.fill();
        }
      }

      subtract = true;
    }

    context.restore();
  };

  return (
    <>
      <Title>CMYK</Title>
      <Canvas blur={8} render={render} />
      <main>
        <h1>CMYK</h1>

        <SourceButton href='/blob/master/src/pages/cmyk.tsx' />
      </main>
    </>
  );
};
