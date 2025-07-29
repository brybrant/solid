import { Title } from '@solidjs/meta';

import { Canvas } from '../components/canvas';
import SourceButton from '../components/source-button';
import styles from './xyz.module.scss';

import colors from '../colors.js';

const columns = 6;
const rows = 12;
const centerX = columns / 2;
const centerY = rows / 2;

const cubeWidth = 1 / columns;
const cubeWidthHalf = cubeWidth / 2;
const cubeHeight = cubeWidth / Math.sqrt(3);
const cubeHeightHalf = cubeHeight / 2;

const faceLeft = new Path2D();
faceLeft.moveTo(0, 0);
faceLeft.lineTo(cubeWidthHalf, cubeHeightHalf);
faceLeft.lineTo(cubeWidthHalf, cubeWidth);
faceLeft.lineTo(0, cubeWidth - cubeHeightHalf);
faceLeft.closePath();

const faceRight = new Path2D();
faceRight.moveTo(cubeWidth, 0);
faceRight.lineTo(cubeWidth, cubeWidth - cubeHeightHalf);
faceRight.lineTo(cubeWidthHalf, cubeWidth);
faceRight.lineTo(cubeWidthHalf, cubeHeightHalf);
faceRight.closePath();

const faceTop = new Path2D();
faceTop.moveTo(0, 0);
faceTop.lineTo(cubeWidthHalf, -cubeHeightHalf);
faceTop.lineTo(cubeWidth, 0);
faceTop.lineTo(cubeWidthHalf, cubeHeightHalf);
faceTop.closePath();

const dummyCanvas = document.createElement('canvas');
const dummyContext = dummyCanvas.getContext('2d', { alpha: false });

const gradientCoordinates = [
  cubeWidthHalf,
  cubeHeightHalf,
  0,
  cubeWidthHalf,
  cubeHeightHalf,
  cubeWidthHalf * Math.SQRT2,
];

const gradientLeft = dummyContext.createRadialGradient(...gradientCoordinates);
gradientLeft.addColorStop(0, colors.blue.light);
gradientLeft.addColorStop(1, colors.blue.dark);

const gradientRight = dummyContext.createRadialGradient(...gradientCoordinates);
gradientRight.addColorStop(0, colors.red.light);
gradientRight.addColorStop(1, colors.red.dark);

const gradientTop = dummyContext.createRadialGradient(...gradientCoordinates);
gradientTop.addColorStop(0, colors.green.light);
gradientTop.addColorStop(1, colors.green.dark);

/** @type {{ centerX: Number, centerY: Number }[]} */
const cubes = [];

for (let row = 0; row < rows; row++) {
  const odd = row % 2 > 0;

  const rowCenterY = (row + 0.25 - centerY) * cubeHeight - cubeHeightHalf;

  for (let column = 0; column < columns; column++) {
    cubes.push({
      centerX: (column - centerX) * cubeWidth - (odd ? cubeWidthHalf : 0),
      centerY: rowCenterY,
    });
  }

  if (odd) {
    cubes.push({
      centerX: (columns - centerX) * cubeWidth - cubeWidthHalf,
      centerY: rowCenterY,
    });
  }
}

/** @type {import('../components/canvas').DistanceFunction} */
const distance = (column, row, coords) =>
  Math.sin(
    (Math.sqrt(
      Math.pow(coords.mouseX - column / (columns - (1 - (row % 2))), 2) +
        Math.pow(coords.mouseY - row / rows, 2),
    ) /
      Math.SQRT2) *
      Math.PI,
  );

const marginY = cubeHeightHalf / 2.5;

let marginRows = 0;
let marginRowsEven = 0;
let marginColumns = 0;
let marginColumnsEven = 0;
let marginColumnsOdd = 0;
let totalRows = rows;
let totalColumnsEven = columns;
let totalColumnsOdd = columns + 1;

/** @param {{ marginX: Number, marginY: Number }} viewbox */
function resize(viewbox) {
  marginColumns = Math.floor(viewbox.marginX / cubeWidthHalf);
  marginColumnsEven = Math.floor(marginColumns / 2);
  marginColumnsOdd = Math.ceil(marginColumns / 2);
  totalColumnsEven = columns - marginColumnsEven;
  totalColumnsOdd = columns + 1 - marginColumnsOdd;
  marginRows = Math.floor((viewbox.marginY + marginY) / cubeHeight);
  marginRowsEven = Math.floor(marginRows / 2);
  totalRows = rows - marginRows;
}

/**
 * @param {CanvasRenderingContext2D} context
 * @param {Number} index
 * @param {Number} offset
 */
function drawCube(context, index, offset) {
  context.save();

  const cube = cubes[index];

  context.translate(cube.centerX, cube.centerY + offset);

  context.fillStyle = gradientLeft;
  context.fill(faceLeft);

  context.fillStyle = gradientRight;
  context.fill(faceRight);

  context.fillStyle = gradientTop;
  context.fill(faceTop);

  context.restore();
}

/** @type {import('../components/canvas').RenderCallback} */
function render(context, coords) {
  let i = marginRows * columns + marginRowsEven + marginColumnsEven;

  for (let row = marginRows; row < totalRows; row++) {
    if (row % 2 > 0) {
      for (
        let column = marginColumnsOdd;
        column < totalColumnsOdd;
        column++, i++
      ) {
        drawCube(context, i, cubeHeightHalf * distance(column, row, coords));
      }
    } else {
      for (
        let column = marginColumnsEven;
        column < totalColumnsEven;
        column++, i++
      ) {
        drawCube(context, i, cubeHeightHalf * distance(column, row, coords));
      }
    }

    i += marginColumns;
  }
}

export default () => (
  <>
    <Title>XYZ</Title>
    <Canvas class={styles.background} resize={resize} render={render} />
    <main>
      <h1>XYZ</h1>

      <SourceButton href='/blob/master/src/pages/xyz.jsx' />
    </main>
  </>
);
