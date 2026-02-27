import { createContext, useContext } from 'solid-js';

/**
 * @typedef {object} Options
 * @prop {boolean} mouseOver Mouse is inside document?
 * @prop {number} mouseX Normalised mouse X coordinate *(float between 0..1)*
 * @prop {number} mouseY Normalised mouse Y coordinate *(float between 0..1)*
 * @prop {number} canvasX Normalised X coordinate *(float between 0..1)*
 * @prop {number} canvasY Normalised Y coordinate *(float between 0..1)*
 */

/** @type {import('solid-js').Context<[Options, import('solid-js/store').SetStoreFunction<Options>]>} */
export const OptionsContext = createContext();

export const useOptions = () => useContext(OptionsContext);
