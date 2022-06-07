import { Cell } from "../types/cell.type";

/**
 * Gets start and end cells of the given grid (if they exist)
 * @param grid
 * @returns 2 element array. Item 0 is the start cell. Item 1 is the end cell.
 */
export const findStartAndEndCells = (
  grid: Cell[][]
): [Cell | undefined, Cell | undefined] => {
  let start = undefined;
  let end = undefined;

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      const cell = grid[row][col];

      switch (grid[row][col].type) {
        case "start":
          start = cell;
          break;
        case "end":
          end = cell;
          break;
      }

      // If start and end found, stop
      if (start && end) {
        break;
      }
    }
  }

  return [start, end];
};
