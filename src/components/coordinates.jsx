import { createSignal } from 'solid-js';

let x = 0.5;
let y = 0.5;

const [coordinates, setCoordinates] = createSignal({ x, y });

export { coordinates };

export const root2 = Math.sqrt(2);

export function mousemove(event) {
  x = event.clientX / window.innerWidth;
  y = event.clientY / window.innerHeight;
}

let mouseOver = false;

export const mouseenter = () => (mouseOver = true);

export const mouseleave = () => (mouseOver = false);

let aspect = 1;

export function resize() {
  aspect =
    window.innerWidth > window.innerHeight
      ? window.innerHeight / window.innerWidth
      : window.innerWidth / window.innerHeight;
}

let deltaTime = 100 / 6;

function lerp(a, b) {
  // https://www.gamedeveloper.com/programming/improved-lerp-smoothing-
  const lerpFactor = Math.exp(-0.15 * deltaTime);

  return a * (1 - lerpFactor) + b * lerpFactor;
}

const radian = Math.PI / 180;

let counter = 0;

let animation = true;

let lastTimestamp = 0;

export function animate(timestamp) {
  if (!animation) return;

  deltaTime = timestamp - lastTimestamp;
  lastTimestamp = timestamp;

  if (mouseOver) {
    window.innerWidth > window.innerHeight
      ? setCoordinates({
          x: lerp(coordinates().x, x),
          y: lerp(coordinates().y, (y - 0.5) * aspect + 0.5),
        })
      : setCoordinates({
          x: lerp(coordinates().x, (x - 0.5) * aspect + 0.5),
          y: lerp(coordinates().y, y),
        });

    return requestAnimationFrame(animate);
  }

  const angle = counter * radian;

  setCoordinates({
    x: lerp(coordinates().x, (1 + Math.sin(angle)) * 0.5),
    y: lerp(coordinates().y, (1 + Math.cos(angle)) * 0.5),
  });

  counter = (counter + 1) % 360;

  requestAnimationFrame(animate);
}

export const stopAnimation = () => (animation = false);
