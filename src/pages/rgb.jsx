import { Title } from '@solidjs/meta';

import { Canvas } from '../components/canvas';
import SourceButton from '../components/source-button';
import styles from './rgb.module.scss';

const rowsAndColumns = 12;
const center = rowsAndColumns / 2;
const scale = (rowsAndColumns + 1) / rowsAndColumns;
const cellSize = (1 / rowsAndColumns) * scale;
const ledWidthHalf = cellSize / 10;
const ledHeightHalf = cellSize / 3.2;
const ledSpace = cellSize / 3;
const ledCenterX = cellSize / 6;
const ledCenterY = cellSize / 2;

const led = new Path2D();
led.moveTo(-ledWidthHalf, -ledHeightHalf);
led.arc(0, -ledHeightHalf, ledWidthHalf, Math.PI, 0);
led.lineTo(ledWidthHalf, ledHeightHalf);
led.arc(0, ledHeightHalf, ledWidthHalf, 0, Math.PI);
led.closePath();

/** @type {{ centerX: Number, centerY: Number }[]} */
const leds = [];

for (let row = 0; row < rowsAndColumns; row++) {
  for (let column = 0; column < rowsAndColumns; column++) {
    leds.push({
      centerX: (column - center) * cellSize + ledCenterX - ledSpace,
      centerY: (row - center) * cellSize + ledCenterY,
    });
  }
}

/** @type {import('../components/canvas').DistanceFunction} */
const distance = (column, row, coords) =>
  Math.exp(
    -Math.sqrt(
      Math.pow(coords.mouseX - column / (rowsAndColumns - 1), 2) +
        Math.pow(coords.mouseY - row / (rowsAndColumns - 1), 2),
    ) * 2,
  );

const marginX = cellSize / 5;
const marginY = cellSize / 2;

let marginRows = 0;
let marginColumns = 0;
let totalRows = rowsAndColumns;
let totalColumns = rowsAndColumns;

/** @param {{ marginX: Number, marginY: Number }} viewbox */
function resize(viewbox) {
  marginColumns = Math.floor((viewbox.marginX + marginX) / cellSize);
  totalColumns = rowsAndColumns - marginColumns;
  marginRows = Math.floor((viewbox.marginY + marginY) / cellSize);
  totalRows = rowsAndColumns - marginRows;
}

const colors = ['#f00', '#0f0', '#00f'];

/** @type {import('../components/canvas').RenderCallback} */
function render(context, coords) {
  context.save();

  context.globalCompositeOperation = 'lighter';

  let i = marginRows * rowsAndColumns + marginColumns;

  for (let row = marginRows; row < totalRows; row++) {
    for (let column = marginColumns; column < totalColumns; column++, i++) {
      context.save();

      context.translate(leds[i].centerX, leds[i].centerY);

      const intensity = distance(column, row, coords);

      context.globalAlpha = Math.min(intensity + 0.25, 1);

      const scaleX = 1 + intensity * 5;
      const scaleY = 1 + intensity;

      for (const color of colors) {
        context.translate(ledSpace, 0);

        context.save();
        context.scale(scaleX, scaleY);

        context.fillStyle = color;
        context.fill(led);

        context.restore();
      }

      context.restore();
    }

    i += marginColumns * 2;
  }

  context.restore();
}

export default () => (
  <>
    <Title>RGB</Title>
    <Canvas class={styles.background} resize={resize} render={render} />
    <main>
      <h1>RGB</h1>

      <SourceButton href='/blob/master/src/pages/rgb.jsx' />
    </main>
  </>
);
