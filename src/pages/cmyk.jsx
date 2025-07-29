import { Title } from '@solidjs/meta';

import { Canvas, rad360 } from '../components/canvas';
import SourceButton from '../components/source-button';
import styles from './cmyk.module.scss';

const rowsAndColumns = 10;
const center = rowsAndColumns / 2;
const radian = Math.PI / 180;
const scale = Math.sin(15 * radian) + Math.cos(15 * radian);
const cellSize = (1 / rowsAndColumns) * scale;
const cellSizeHalf = cellSize / 2;
const cellRadius = cellSize / Math.SQRT2;

/** @type {{ centerX: Number, centerY: Number, radius: Number }[]} */
const ellipses = [];

for (let column = 0; column < rowsAndColumns; column++) {
  for (let row = 0; row < rowsAndColumns; row++) {
    ellipses.push({
      centerX: (column - center) * cellSize + cellSizeHalf,
      centerY: (row - center) * cellSize + cellSizeHalf,
      radius: 0,
    });
  }
}

/** @type {import('../components/canvas').DistanceFunction} */
const distance = (column, row, coords) =>
  1 -
  Math.sqrt(
    Math.pow(coords.mouseX - column / rowsAndColumns, 2) +
      Math.pow(coords.mouseY - row / rowsAndColumns, 2),
  ) /
    Math.SQRT2;

/** @type {{ color: String, rotation: Number }[]} */
const inks = [
  {
    color: '#0ff',
    rotation: 15 * radian,
  },
  {
    color: '#f0f',
    rotation: 150 * radian,
  },
  {
    color: '#ff0',
    rotation: 105 * radian,
  },
];

/** @type {import('../components/canvas').RenderCallback} */
function render(context, coords) {
  context.save();

  context.fillStyle = '#fff';

  context.fillRect(-1, -1, 3, 3);

  for (let column = 0, i = 0; column < rowsAndColumns; column++) {
    for (let row = 0; row < rowsAndColumns; row++, i++) {
      ellipses[i].radius = cellRadius * distance(column, row, coords);
    }
  }

  let subtract = false;

  for (const ink of inks) {
    context.fillStyle = ink.color;
    context.rotate(ink.rotation);

    if (subtract) context.globalCompositeOperation = 'multiply';

    for (const ellipse of ellipses) {
      context.beginPath();
      context.ellipse(
        ellipse.centerX,
        ellipse.centerY,
        ellipse.radius,
        ellipse.radius,
        0,
        0,
        rad360,
      );
      context.fill();
    }

    subtract = true;
  }

  context.restore();
}

export default () => (
  <>
    <Title>CMYK</Title>
    <Canvas class={styles.background} render={render} />
    <main>
      <h1>CMYK</h1>

      <SourceButton href='/blob/master/src/pages/cmyk.jsx' />
    </main>
  </>
);
