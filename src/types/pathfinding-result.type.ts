import { GridPosition } from "./grid-position.type";

export type PathfindingResult = [
  // Nodes visited in order
  GridPosition[],
  // Path nodes in order (if exists)
  GridPosition[] | undefined
];
