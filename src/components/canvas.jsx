import { onCleanup, onMount } from 'solid-js';

import { useOptions } from '../context';

export const rad360 = Math.PI * 2;

/**
 * @typedef {object} Viewbox
 * @prop {number} marginX
 * @prop {number} marginY
 */

/**
 * Calculates distance from the mouse cursor.
 *
 * Returns value between `0` and `1`.
 * @callback DistanceFunction
 * @param {number} column
 * @param {number} row
 * @returns {number}
 */

/**
 * @callback RenderCallback
 * @param {CanvasRenderingContext2D} context
 */

/**
 * @callback ResizeCallback
 * @param {Viewbox} viewbox
 */

/**
 * @param {object} props
 * @param {number} props.blur
 * @param {ResizeCallback} [props.resize]
 * @param {RenderCallback} props.render
 */
export function Canvas(props) {
  const [options, setOptions] = useOptions();

  /** @type {HTMLCanvasElement} */
  let canvas;

  /** @type {CanvasRenderingContext2D} */
  let context;

  /** @type {number} */
  let aspect;

  /** @type {Viewbox} */
  const viewbox = {
    marginX: 0,
    marginY: 0,
  };

  /** Callback for `resize` window event */
  function resize() {
    canvas.width = window.innerWidth / 2;
    canvas.height = window.innerHeight / 2;

    /** @type {number} */
    let canvasScale;

    if (window.innerWidth > window.innerHeight) {
      aspect = window.innerHeight / window.innerWidth;
      canvasScale = canvas.width;

      viewbox.marginX = 0;
      viewbox.marginY = (1 - aspect) / 2;
    } else {
      aspect = window.innerWidth / window.innerHeight;
      canvasScale = canvas.height;

      viewbox.marginX = (1 - aspect) / 2;
      viewbox.marginY = 0;
    }

    context.setTransform(
      canvasScale,
      0,
      0,
      canvasScale,
      canvas.width / 2,
      canvas.height / 2,
    );

    if (props.resize) props.resize(viewbox);
  }

  /** @type {number} */
  let frame;

  /** @type {number} */
  let lastTimestamp;

  /** @type {number} */
  let deltaTime;

  /**
   * Exponential interpolation
   * @param {number} previous - Previous value
   * @param {number} next - Next value
   */
  function lerp(previous, next) {
    // https://www.gamedeveloper.com/programming/improved-lerp-smoothing-
    const lerpFactor = Math.exp(-0.15 * deltaTime);

    return previous * (1 - lerpFactor) + next * lerpFactor;
  }

  let angle = 0;

  /** @param {number} timestamp */
  function animate(timestamp) {
    context.clearRect(-1, -1, 3, 3);

    deltaTime = timestamp - lastTimestamp;
    lastTimestamp = timestamp;

    try {
      if (options.mouseOver) {
        if (window.innerWidth > window.innerHeight) {
          setOptions((opts) => ({
            canvasX: lerp(opts.canvasX, opts.mouseX),
            canvasY: lerp(opts.canvasY, (opts.mouseY - 0.5) * aspect + 0.5),
          }));
        } else {
          setOptions((opts) => ({
            canvasX: lerp(opts.canvasX, (opts.mouseX - 0.5) * aspect + 0.5),
            canvasY: lerp(opts.canvasY, opts.mouseY),
          }));
        }
      } else {
        setOptions((opts) => ({
          canvasX: lerp(opts.canvasX, (1 + Math.sin(angle)) * 0.5),
          canvasY: lerp(opts.canvasY, (1 + Math.cos(angle)) * 0.5),
        }));

        angle = (angle + 1e-3 * deltaTime) % rad360;
      }

      props.render(context);

      frame = requestAnimationFrame(animate);
    } catch (error) {
      console.error(error);

      cancelAnimationFrame(frame);
    }
  }

  onMount(() => {
    context = canvas.getContext('2d', { alpha: false });

    resize();

    window.addEventListener('resize', resize, { passive: true });

    frame = requestAnimationFrame((timestamp) => {
      lastTimestamp = timestamp;

      frame = requestAnimationFrame(animate);
    });
  });

  onCleanup(() => {
    cancelAnimationFrame(frame);

    window.removeEventListener('resize', resize);
  });

  return <canvas style={{ filter: `blur(${props.blur}px)` }} ref={canvas} />;
}
