import { createContext, useContext } from 'solid-js';

export type Options = {
  /** Mouse is inside document? */
  mouseOver: boolean;
  /** Normalised mouse X coordinate *(float between 0..1)* */
  mouseX: number;
  /** Normalised mouse Y coordinate *(float between 0..1)* */
  mouseY: number;
  /** Normalized canvas X coordinate *(float between 0..1)* */
  currentX: number;
  /** Normalized canvas Y coordinate *(float between 0..1)* */
  currentY: number;
};

export const OptionsContext = createContext<Options>();

export const useOptions = () => {
  const context = useContext(OptionsContext);

  if (context === undefined) {
    throw new Error('useOptions must be used inside OptionsContext.Provider');
  }

  return context;
};
