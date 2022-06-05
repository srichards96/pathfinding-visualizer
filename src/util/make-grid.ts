import { Cell } from "../types/cell.type";

export const makeGrid = (rows: number, cols: number): Cell[][] => {
  const grid: Cell[][] = [];

  for (let r = 0; r < rows; r++) {
    const row: Cell[] = [];
    for (let c = 0; c < cols; c++) {
      row.push({
        position: { row: r, col: c },
        type: "air",
        state: "unvisited",
      });
    }
    grid.push(row);
  }

  return grid;
};
