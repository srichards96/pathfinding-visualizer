/**
 * Determines which mouse buttons are pressed
 * @param bits Bitmask of mouse buttons pressed - e.g. event.buttons
 * @returns Which mouse buttons are pressed (left/right/middle)
 */
export const getMouseButtonsPressed = (bits: number) => {
  const left = (bits & 1) !== 0;
  const right = (bits & (1 << 1)) !== 0;
  const middle = (bits & (1 << 2)) !== 0;

  return { left, right, middle };
};
