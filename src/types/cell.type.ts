import { GridPosition } from "./grid-position.type";
import { CellType } from "./cell-type";

export type Cell = {
  position: GridPosition;
  type: CellType;
  state: "unvisited" | "visited" | "path";
};
