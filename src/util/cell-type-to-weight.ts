import { CellType } from "../types/cell-type";

export const cellTypeToWeight = (cellType: CellType): number => {
  switch (cellType) {
    case "start":
    case "end":
      return 1;
    case "wall":
      return Infinity;
    case "air":
      return 1;
    case "gravel":
      return 2;
    case "sand":
      return 4;
    case "grass":
      return 8;
    case "long-grass":
      return 16;
    case "mud":
      return 32;
    case "water":
      return 64;
    case "deep-water":
      return 128;
  }
};
