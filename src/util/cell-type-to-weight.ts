import { CellType } from "../types/cell-type";

export const cellTypeToWeight = (cellType: CellType): number => {
  switch (cellType) {
    case "start":
    case "end":
    case "air":
      return 1;
    case "wall":
      return Infinity;
  }
};
