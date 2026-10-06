import { write } from 'bun';

import { convertOkhsvToOklab, convertOklabToRgb, formatHex } from 'culori';

const okhsvToHex = (h = 0, s = 0, v = 0) => {
  return formatHex(
    convertOklabToRgb(
      convertOkhsvToOklab({
        h,
        s,
        v,
      }),
    ),
  );
};

const hueRed = 29;
const hueGreen = 140;
const hueBlue = 265;
const saturation = 0.85;
const light = 0.65;
const dark = 0.45;

const colors = {
  red: {
    light: okhsvToHex(hueRed, saturation, light),
    dark: okhsvToHex(hueRed, saturation, dark),
  },
  green: {
    light: okhsvToHex(hueGreen, saturation, light),
    dark: okhsvToHex(hueGreen, saturation, dark),
  },
  blue: {
    light: okhsvToHex(hueBlue, saturation, light),
    dark: okhsvToHex(hueBlue, saturation, dark),
  },
};

await write(
  `${process.cwd()}/src/colors.ts`,
  [
    `/* eslint-disable prettier/prettier */`,
    `export const colors = ${JSON.stringify(colors, null, 2)} as const;`,
  ].join('\n'),
);
