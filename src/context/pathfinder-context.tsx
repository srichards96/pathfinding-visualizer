import React, { createContext, useCallback, useState } from "react";
import { CellType } from "../types/cell-type";
import { Cell } from "../types/cell.type";
import { PathfindingAlgorithm } from "../types/pathfinding-algorithm.type";

export type PathfinderContextType = {
  grid: Cell[][];
  setGrid: React.Dispatch<React.SetStateAction<Cell[][]>>;
  setCellType: (row: number, col: number, type: CellType) => void;
  selectedCellType: CellType;
  setSelectedCellType: React.Dispatch<React.SetStateAction<CellType>>;
  selectedAlgorithm: PathfindingAlgorithm;
  setSelectedAlgorithm: React.Dispatch<
    React.SetStateAction<PathfindingAlgorithm>
  >;
};

export const PathfinderContext = createContext<PathfinderContextType | null>(
  null
);

type PathfinderContextProps = { children: React.ReactNode };

export const PathfinderProvider = ({ children }: PathfinderContextProps) => {
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [selectedCellType, setSelectedCellType] = useState<CellType>("wall");
  const [selectedAlgorithm, setSelectedAlgorithm] =
    useState<PathfindingAlgorithm>("dijkstra's algorithm");

  const setCellType = useCallback(
    (row: number, col: number, type: CellType) => {
      setGrid((oldGrid) =>
        oldGrid.map((r) =>
          r.map((c) => {
            // If cell is the specified one, update it's type
            if (c.position.row === row && c.position.col === col) {
              return { ...c, type };
            }
            // Otherwise return it as is
            return c;
          })
        )
      );
    },
    [setGrid]
  );

  return (
    <PathfinderContext.Provider
      value={{
        grid,
        setGrid,
        setCellType,
        selectedCellType,
        setSelectedCellType,
        selectedAlgorithm,
        setSelectedAlgorithm,
      }}
    >
      {children}
    </PathfinderContext.Provider>
  );
};
