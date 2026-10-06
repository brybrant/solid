import { Title } from '@solidjs/meta';

import {
  Canvas,
  type RenderCallback,
  type ResizeCallback,
} from '../components/canvas.tsx';
import SourceButton from '../components/source-button.tsx';

import { colors } from '../colors.ts';

const COLUMNS = 8;
const ROWS = 16;
const CENTER_X = COLUMNS / 2;
const CENTER_Y = ROWS / 2;

const CUBE_WIDTH = 1 / COLUMNS;
const CUBE_WIDTH_HALF = CUBE_WIDTH / 2;
const CUBE_HEIGHT = CUBE_WIDTH / Math.sqrt(3);
const CUBE_HEIGHT_HALF = CUBE_HEIGHT / 2;

const FACE_LEFT = new Path2D();
FACE_LEFT.moveTo(0, 0);
FACE_LEFT.lineTo(CUBE_WIDTH_HALF, CUBE_HEIGHT_HALF);
FACE_LEFT.lineTo(CUBE_WIDTH_HALF, CUBE_WIDTH);
FACE_LEFT.lineTo(0, CUBE_WIDTH - CUBE_HEIGHT_HALF);
FACE_LEFT.closePath();

const FACE_RIGHT = new Path2D();
FACE_RIGHT.moveTo(CUBE_WIDTH, 0);
FACE_RIGHT.lineTo(CUBE_WIDTH, CUBE_WIDTH - CUBE_HEIGHT_HALF);
FACE_RIGHT.lineTo(CUBE_WIDTH_HALF, CUBE_WIDTH);
FACE_RIGHT.lineTo(CUBE_WIDTH_HALF, CUBE_HEIGHT_HALF);
FACE_RIGHT.closePath();

const FACE_TOP = new Path2D();
FACE_TOP.moveTo(0, 0);
FACE_TOP.lineTo(CUBE_WIDTH_HALF, -CUBE_HEIGHT_HALF);
FACE_TOP.lineTo(CUBE_WIDTH, 0);
FACE_TOP.lineTo(CUBE_WIDTH_HALF, CUBE_HEIGHT_HALF);
FACE_TOP.closePath();

const MARGIN_Y = CUBE_HEIGHT_HALF / 2.5;

const COORDINATE_X_EVEN = new Float32Array(COLUMNS);
const COORDINATE_X_ODD = new Float32Array(COLUMNS + 1);
const COORDINATE_Y = new Float32Array(ROWS);
const NORMALIZED_X_EVEN = new Float32Array(COLUMNS);
const NORMALIZED_X_ODD = new Float32Array(COLUMNS + 1);
const NORMALIZED_Y = new Float32Array(ROWS);

for (let column = 0; column < COLUMNS; column++) {
  COORDINATE_X_EVEN[column] = (column - CENTER_X) * CUBE_WIDTH;
  NORMALIZED_X_EVEN[column] = column / COLUMNS + CUBE_WIDTH_HALF;
}

for (let column = 0; column <= COLUMNS; column++) {
  COORDINATE_X_ODD[column] = (column - CENTER_X) * CUBE_WIDTH - CUBE_WIDTH_HALF;
  NORMALIZED_X_ODD[column] = column / (COLUMNS + 1) + CUBE_WIDTH_HALF;
}

for (let row = 0; row < ROWS; row++) {
  COORDINATE_Y[row] = (row + 0.25 - CENTER_Y) * CUBE_HEIGHT - CUBE_HEIGHT_HALF;
  NORMALIZED_Y[row] = row / ROWS;
}

export default () => {
  const dummyCanvas = document.createElement('canvas');
  const dummyCtx = dummyCanvas.getContext('2d', { alpha: false });

  if (dummyCtx === null) {
    throw new Error('Could not create 2D canvas context');
  }

  const gradientCoordinates = [
    CUBE_WIDTH_HALF,
    CUBE_HEIGHT_HALF,
    0,
    CUBE_WIDTH_HALF,
    CUBE_HEIGHT_HALF,
    CUBE_WIDTH_HALF * Math.SQRT2,
  ] as const;

  const gradientLeft = dummyCtx.createRadialGradient(...gradientCoordinates);
  gradientLeft.addColorStop(0, colors.blue.light);
  gradientLeft.addColorStop(1, colors.blue.dark);

  const gradientRight = dummyCtx.createRadialGradient(...gradientCoordinates);
  gradientRight.addColorStop(0, colors.red.light);
  gradientRight.addColorStop(1, colors.red.dark);

  const gradientTop = dummyCtx.createRadialGradient(...gradientCoordinates);
  gradientTop.addColorStop(0, colors.green.light);
  gradientTop.addColorStop(1, colors.green.dark);

  let marginRows = 0;
  let marginColumns = 0;
  let marginColumnsEven = 0;
  let marginColumnsOdd = 0;
  let totalRows = ROWS;
  let totalColumnsEven = COLUMNS;
  let totalColumnsOdd = COLUMNS + 1;

  const resize: ResizeCallback = (marginX, marginY) => {
    marginColumns = Math.floor(marginX / CUBE_WIDTH_HALF);
    marginColumnsEven = Math.floor(marginColumns / 2);
    marginColumnsOdd = Math.ceil(marginColumns / 2);
    totalColumnsEven = COLUMNS - marginColumnsEven;
    totalColumnsOdd = COLUMNS + 1 - marginColumnsOdd;
    marginRows = Math.floor((marginY + MARGIN_Y) / CUBE_HEIGHT);
    totalRows = ROWS - marginRows;
  };

  const columnFactorsEven = new Float32Array(COLUMNS);
  const columnFactorsOdd = new Float32Array(COLUMNS + 1);
  const rowFactors = new Float32Array(ROWS);

  const render: RenderCallback = (
    context,
    currentX,
    currentY,
    canvasScale,
    canvasCenterX,
    canvasCenterY,
  ) => {
    for (let column = marginColumnsEven; column < totalColumnsEven; column++) {
      const x = currentX - NORMALIZED_X_EVEN[column];
      columnFactorsEven[column] = Math.exp(-3 * x * x);
    }

    for (let column = marginColumnsOdd; column < totalColumnsOdd; column++) {
      const x = currentX - NORMALIZED_X_ODD[column];
      columnFactorsOdd[column] = Math.exp(-3 * x * x);
    }

    for (let row = marginRows; row < totalRows; row++) {
      const y = currentY - NORMALIZED_Y[row];
      rowFactors[row] = Math.exp(-3 * y * y);
    }

    context.save();

    for (let row = marginRows; row < totalRows; row++) {
      const odd = row % 2 > 0;
      const coordinatesX = odd ? COORDINATE_X_ODD : COORDINATE_X_EVEN;
      const coordinateY = COORDINATE_Y[row];
      const columnFactors = odd ? columnFactorsOdd : columnFactorsEven;
      const rowFactor = rowFactors[row];

      const startColumn = odd ? marginColumnsOdd : marginColumnsEven;
      const endColumn = odd ? totalColumnsOdd : totalColumnsEven;

      for (let column = startColumn; column < endColumn; column++) {
        const distanceFactor = columnFactors[column] * rowFactor;

        const offset = CUBE_HEIGHT * Math.sin(distanceFactor * Math.PI);

        context.setTransform(
          canvasScale,
          0,
          0,
          canvasScale,
          canvasScale * coordinatesX[column] + canvasCenterX,
          canvasScale * (coordinateY + offset) + canvasCenterY,
        );

        context.fillStyle = gradientLeft;
        context.fill(FACE_LEFT);

        context.fillStyle = gradientRight;
        context.fill(FACE_RIGHT);

        context.fillStyle = gradientTop;
        context.fill(FACE_TOP);
      }
    }

    context.restore();
  };

  return (
    <>
      <Title>XYZ</Title>
      <Canvas blur={1} resize={resize} render={render} />
      <main>
        <h1>XYZ</h1>

        <SourceButton href='/blob/master/src/pages/xyz.tsx' />
      </main>
    </>
  );
};
