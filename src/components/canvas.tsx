import { onCleanup, onMount } from 'solid-js';

import { useOptions } from '../context.tsx';

export const RAD360 = Math.PI * 2;

/**
 * @param context Canvas 2D context
 * @param currentX Current X coordinate
 * @param currentY Current Y coordinate
 * @param canvasScale Canvas scale (used for both X and Y)
 * @param canvasCenterX Canvas X center
 * @param canvasCenterY Canvas Y center
 */
export type RenderCallback = (
  context: CanvasRenderingContext2D,
  currentX: number,
  currentY: number,
  canvasScale: number,
  canvasCenterX: number,
  canvasCenterY: number,
) => void;

export type ResizeCallback = (marginX: number, marginY: number) => void;

const MAX_CANVAS_SIZE = 768;

type Props = {
  blur: number;
  resize?: ResizeCallback;
  render: RenderCallback;
};

/**
 * The `props` reactive object properties will never change during the lifetime
 * of this component. When navigating to a different page, this component is
 * destroyed and the `onCleanup` callback is run, therefore it is acceptable to
 * disable the "solid/reactivity" eslint rule for this file.
 * @param props {@link Props}
 * @returns Canvas component
 */
export const Canvas = (props: Props) => {
  const options = useOptions();
  /* eslint-disable solid/reactivity */
  const render = props.render;
  const resizeCallback = props.resize;

  /* eslint-disable-next-line no-unassigned-vars */
  let canvas!: HTMLCanvasElement;
  let context: CanvasRenderingContext2D;

  const initialDPR = window.devicePixelRatio;
  let landscape = true;
  let aspect = 1;
  let canvasScale = 1;
  let canvasCenterX = 0.5;
  let canvasCenterY = 0.5;

  const resize = () => {
    const rect = document.documentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio;

    const displayWidth = rect.width * dpr;
    const displayHeight = rect.height * dpr;

    const resolutionScale = Math.min(
      1,
      MAX_CANVAS_SIZE / Math.max(displayWidth, displayHeight),
    );

    const canvasWidth = Math.round(displayWidth * resolutionScale);
    const canvasHeight = Math.round(displayHeight * resolutionScale);
    canvasCenterX = canvasWidth / 2;
    canvasCenterY = canvasHeight / 2;

    const zoomFactor = dpr / initialDPR;
    const blur = props.blur / zoomFactor;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    canvas.style.filter = `blur(${blur}px)`;
    canvas.style.top = canvas.style.left = `-${blur}px`;
    canvas.style.width = canvas.style.height = `calc(100% + ${blur * 2}px)`;

    landscape = canvasWidth > canvasHeight;

    let marginX: number;
    let marginY: number;

    if (landscape) {
      aspect = canvasHeight / canvasWidth;
      canvasScale = canvasWidth;
      marginX = 0;
      marginY = (1 - aspect) / 2;
    } else {
      aspect = canvasWidth / canvasHeight;
      canvasScale = canvasHeight;
      marginX = (1 - aspect) / 2;
      marginY = 0;
    }

    context.setTransform(
      canvasScale,
      0,
      0,
      canvasScale,
      canvasCenterX,
      canvasCenterY,
    );

    resizeCallback?.(marginX, marginY);
  };

  let frame = 0;
  let lastTimestamp = performance.now();
  let angle = 0;

  let currentX = options.currentX;
  let currentY = options.currentY;

  const animation = (timestamp: number) => {
    const deltaTime = timestamp - lastTimestamp;
    lastTimestamp = timestamp;

    /** https://www.gamedeveloper.com/programming/improved-lerp-smoothing- */
    const lerpFactor = 1 - Math.exp(-0.005 * deltaTime);

    let targetX: number;
    let targetY: number;

    if (options.mouseOver) {
      if (landscape) {
        targetX = options.mouseX;
        targetY = (options.mouseY - 0.5) * aspect + 0.5;
      } else {
        targetX = (options.mouseX - 0.5) * aspect + 0.5;
        targetY = options.mouseY;
      }
    } else {
      targetX = (1 + Math.sin(angle)) * 0.5;
      targetY = (1 + Math.cos(angle)) * 0.5;

      angle = (angle + 1e-3 * deltaTime) % RAD360;
    }

    currentX += (targetX - currentX) * lerpFactor;
    currentY += (targetY - currentY) * lerpFactor;

    context.clearRect(-1, -1, 3, 3);

    render(
      context,
      currentX,
      currentY,
      canvasScale,
      canvasCenterX,
      canvasCenterY,
    );

    frame = window.requestAnimationFrame(animation);
  };

  onMount(() => {
    const ctx = canvas.getContext('2d', { alpha: false });

    if (ctx === null) {
      throw new Error('Could not create 2D canvas context');
    }

    context = ctx;

    resize();

    window.addEventListener('resize', resize);

    frame = window.requestAnimationFrame(animation);
  });

  onCleanup(() => {
    options.currentX = currentX;
    options.currentY = currentY;

    window.removeEventListener('resize', resize);

    window.cancelAnimationFrame(frame);
  });

  return <canvas ref={canvas} />;
};
