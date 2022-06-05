import { GridPosition } from "./grid-position.type";
import { CellType } from "./cell-type";
import { CellState } from "./cell-state.type";

export type Cell = {
  position: GridPosition;
  type: CellType;
  state: CellState;
};
