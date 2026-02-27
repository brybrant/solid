import { Title } from '@solidjs/meta';

import { useOptions } from '../context';

import { Canvas } from '../components/canvas';
import SourceButton from '../components/source-button';

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

const marginX = cellSize / 5;
const marginY = cellSize / 2;

const colors = ['#f00', '#0f0', '#00f'];

export default () => {
  const [options] = useOptions();

  /** @type {{ centerX: number, centerY: number }[]} */
  const leds = [];

  for (let row = 0; row < rowsAndColumns; row++) {
    for (let column = 0; column < rowsAndColumns; column++) {
      leds.push({
        centerX: (column - center) * cellSize + ledCenterX - ledSpace,
        centerY: (row - center) * cellSize + ledCenterY,
      });
    }
  }

  let marginRows = 0;
  let marginColumns = 0;
  let totalRows = rowsAndColumns;
  let totalColumns = rowsAndColumns;

  /** @type {import('../components/canvas').ResizeCallback} */
  function resize(viewbox) {
    marginColumns = Math.floor((viewbox.marginX + marginX) / cellSize);
    totalColumns = rowsAndColumns - marginColumns;
    marginRows = Math.floor((viewbox.marginY + marginY) / cellSize);
    totalRows = rowsAndColumns - marginRows;
  }

  /** @type {import('../components/canvas').DistanceFunction} */
  const distance = (column, row) =>
    Math.exp(
      -Math.sqrt(
        Math.pow(options.canvasX - column / (rowsAndColumns - 1), 2) +
          Math.pow(options.canvasY - row / (rowsAndColumns - 1), 2),
      ) * 2,
    );

  /** @type {import('../components/canvas').RenderCallback} */
  function render(context) {
    context.save();

    context.globalCompositeOperation = 'lighter';

    let i = marginRows * rowsAndColumns + marginColumns;

    for (let row = marginRows; row < totalRows; row++) {
      for (let column = marginColumns; column < totalColumns; column++, i++) {
        context.save();

        context.translate(leds[i].centerX, leds[i].centerY);

        const intensity = distance(column, row);

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

  return (
    <>
      <Title>RGB</Title>
      <Canvas blur={4} resize={resize} render={render} />
      <main>
        <h1>RGB</h1>

        <SourceButton href='/blob/master/src/pages/rgb.jsx' />
      </main>
    </>
  );
};
