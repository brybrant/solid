import { onCleanup, onMount, createSignal } from 'solid-js';

let mouseOver = false;

export const mouseenter = () => (mouseOver = true);

export const mouseleave = () => (mouseOver = false);

let mouseX = 0.5;
let mouseY = 1;

/** @param {MouseEvent} event */
export function mousemove(event) {
  mouseX = event.clientX / window.innerWidth;
  mouseY = event.clientY / window.innerHeight;
}

const [coordinates, setCoordinates] = createSignal({ mouseX, mouseY });

export const rad360 = Math.PI * 2;

/**
 * @typedef {Object} Coordinates
 * @prop {Number} mouseX
 * @prop {Number} mouseY
 */

/**
 * Calculates distance from the mouse cursor.
 *
 * Returns value between `0` and `1`.
 * @callback DistanceFunction
 * @param {Number} column
 * @param {Number} row
 * @param {Coordinates} coords
 * @returns {Number}
 */

/**
 * @callback RenderCallback
 * @param {CanvasRenderingContext2D} context
 * @param {Coordinates} coords
 * @param {Path2D} canvasPath
 */

/**
 * @param {Object} props
 * @param {String} props.class
 * @param {Function} [props.resize]
 * @param {RenderCallback} props.render
 */
export function Canvas(props) {
  /** @type {HTMLCanvasElement} */
  let canvas;

  /** @type {CanvasRenderingContext2D} */
  let context;

  /** @type {Number} */
  let aspect;

  const viewbox = {
    marginX: 0,
    marginY: 0,
  };

  function resize() {
    canvas.width = window.innerWidth; // * window.devicePixelRatio;
    canvas.height = window.innerHeight; // * window.devicePixelRatio;

    /** @type {Number} */
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

  /** @type {Number} */
  let frame;

  /** @type {Number} */
  let lastTimestamp;

  /** @type {Number} */
  let deltaTime;

  /**
   * Exponential interpolation
   * @param {Number} previous - Previous value
   * @param {Number} next - Next value
   */
  function lerp(previous, next) {
    // https://www.gamedeveloper.com/programming/improved-lerp-smoothing-
    const lerpFactor = Math.exp(-0.15 * deltaTime);

    return previous * (1 - lerpFactor) + next * lerpFactor;
  }

  let angle = 0;

  /** @param {Number} timestamp */
  function animate(timestamp) {
    context.clearRect(-1, -1, 3, 3);

    deltaTime = timestamp - lastTimestamp;
    lastTimestamp = timestamp;

    const coords = coordinates();

    try {
      if (mouseOver) {
        if (window.innerWidth > window.innerHeight) {
          setCoordinates({
            mouseX: lerp(coords.mouseX, mouseX),
            mouseY: lerp(coords.mouseY, (mouseY - 0.5) * aspect + 0.5),
          });
        } else {
          setCoordinates({
            mouseX: lerp(coords.mouseX, (mouseX - 0.5) * aspect + 0.5),
            mouseY: lerp(coords.mouseY, mouseY),
          });
        }
      } else {
        setCoordinates({
          mouseX: lerp(coords.mouseX, (1 + Math.sin(angle)) * 0.5),
          mouseY: lerp(coords.mouseY, (1 + Math.cos(angle)) * 0.5),
        });

        angle = (angle + 1e-3 * deltaTime) % rad360;
      }

      props.render(context, coordinates(), viewbox);

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

  return <canvas class={props.class} ref={canvas} />;
}
