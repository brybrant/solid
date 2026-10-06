import { Title } from '@solidjs/meta';

import {
  Canvas,
  type RenderCallback,
  type ResizeCallback,
} from '../components/canvas.tsx';
import SourceButton from '../components/source-button.tsx';

const ROWS_AND_COLUMNS = 14;
const CENTER = ROWS_AND_COLUMNS / 2;
const SCALE = (ROWS_AND_COLUMNS + 1) / ROWS_AND_COLUMNS;
const CELL_SIZE = (1 / ROWS_AND_COLUMNS) * SCALE;
const LED_WIDTH_HALF = CELL_SIZE / 10;
const LED_HEIGHT_HALF = CELL_SIZE / 3.2;
const LED_SPACE = CELL_SIZE / 3;
const LED_CENTER_X = CELL_SIZE / 6;
const LED_CENTER_Y = CELL_SIZE / 2;

const LED_PATH = new Path2D();
LED_PATH.moveTo(-LED_WIDTH_HALF, -LED_HEIGHT_HALF);
LED_PATH.arc(0, -LED_HEIGHT_HALF, LED_WIDTH_HALF, Math.PI, 0);
LED_PATH.lineTo(LED_WIDTH_HALF, LED_HEIGHT_HALF);
LED_PATH.arc(0, LED_HEIGHT_HALF, LED_WIDTH_HALF, 0, Math.PI);
LED_PATH.closePath();

const MARGIN_X = CELL_SIZE / 5;
const MARGIN_Y = CELL_SIZE / 2;

const COORDINATE_X = new Float32Array(ROWS_AND_COLUMNS);
const COORDINATE_Y = new Float32Array(ROWS_AND_COLUMNS);
const NORMALIZED = new Float32Array(ROWS_AND_COLUMNS);

for (let i = 0; i < ROWS_AND_COLUMNS; i++) {
  NORMALIZED[i] = i / (ROWS_AND_COLUMNS - 1);
  const coordinate = (i - CENTER) * CELL_SIZE;
  COORDINATE_X[i] = coordinate + LED_CENTER_X;
  COORDINATE_Y[i] = coordinate + LED_CENTER_Y;
}

export default () => {
  let marginRows = 0;
  let marginColumns = 0;
  let totalRows = ROWS_AND_COLUMNS;
  let totalColumns = ROWS_AND_COLUMNS;

  const resize: ResizeCallback = (marginX, marginY) => {
    marginColumns = Math.floor((marginX + MARGIN_X) / CELL_SIZE);
    totalColumns = ROWS_AND_COLUMNS - marginColumns;
    marginRows = Math.floor((marginY + MARGIN_Y) / CELL_SIZE);
    totalRows = ROWS_AND_COLUMNS - marginRows;
  };

  const columnFactors = new Float32Array(ROWS_AND_COLUMNS);
  const rowFactors = new Float32Array(ROWS_AND_COLUMNS);

  const render: RenderCallback = (
    context,
    currentX,
    currentY,
    canvasScale,
    canvasCenterX,
    canvasCenterY,
  ) => {
    for (let column = marginColumns; column < totalColumns; column++) {
      const x = currentX - NORMALIZED[column];
      columnFactors[column] = Math.exp(-4 * x * x);
    }

    for (let row = marginRows; row < totalRows; row++) {
      const y = currentY - NORMALIZED[row];
      rowFactors[row] = Math.exp(-4 * y * y);
    }

    context.save();

    context.globalCompositeOperation = 'lighter';

    for (let row = marginRows; row < totalRows; row++) {
      const rowFactor = rowFactors[row];
      const coordinateY = COORDINATE_Y[row];

      for (let column = marginColumns; column < totalColumns; column++) {
        const intensity = columnFactors[column] * rowFactor;
        const coordinateX = COORDINATE_X[column];

        context.globalAlpha = intensity;

        const scaleX = 1 + intensity * 5;
        const scaleY = 1 + intensity;

        context.setTransform(
          canvasScale * scaleX,
          0,
          0,
          canvasScale * scaleY,
          canvasScale * coordinateX + canvasCenterX,
          canvasScale * coordinateY + canvasCenterY,
        );

        const scaledLedSpace = LED_SPACE / scaleX;

        context.fillStyle = '#f00';
        context.fill(LED_PATH);

        context.translate(scaledLedSpace, 0);
        context.fillStyle = '#0f0';
        context.fill(LED_PATH);

        context.translate(scaledLedSpace, 0);
        context.fillStyle = '#00f';
        context.fill(LED_PATH);
      }
    }

    context.restore();
  };

  return (
    <>
      <Title>RGB</Title>
      <Canvas blur={4} resize={resize} render={render} />
      <main>
        <h1>RGB</h1>

        <SourceButton href='/blob/master/src/pages/rgb.tsx' />
      </main>
    </>
  );
};
