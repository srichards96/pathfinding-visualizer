import React, { createContext, useCallback, useState } from "react";
import { dijkstras } from "../algorithms/djikstras";
import { CellType } from "../types/cell-type";
import { Cell } from "../types/cell.type";
import { GridPosition } from "../types/grid-position.type";
import { PathfindingAlgorithm } from "../types/pathfinding-algorithm.type";
import { findStartAndEndCells } from "../util/find-start-and-end-cells";

export type PathfinderContextType = {
  grid: Cell[][];
  setGrid: React.Dispatch<React.SetStateAction<Cell[][]>>;
  algorithmRunning: boolean;
  setCellType: (row: number, col: number, type: CellType) => void;
  selectedCellType: CellType;
  setSelectedCellType: React.Dispatch<React.SetStateAction<CellType>>;
  selectedAlgorithm: PathfindingAlgorithm;
  setSelectedAlgorithm: React.Dispatch<
    React.SetStateAction<PathfindingAlgorithm>
  >;

  resetCellStates: () => void;
  resetGrid: () => void;
  runAlgorithm: () => void;
};

export const PathfinderContext = createContext<PathfinderContextType | null>(
  null
);

type PathfinderContextProps = { children: React.ReactNode };

export const PathfinderProvider = ({ children }: PathfinderContextProps) => {
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [algorithmRunning, setAlgorithmRunning] = useState<boolean>(false);
  const [selectedCellType, setSelectedCellType] = useState<CellType>("wall");
  const [selectedAlgorithm, setSelectedAlgorithm] =
    useState<PathfindingAlgorithm>("dijkstra's algorithm");

  const setCellType = useCallback(
    (row: number, col: number, type: CellType) => {
      setGrid((oldGrid) =>
        oldGrid.map((r) =>
          r.map((c) => {
            const cell = { ...c };
            // If cell is the specified one, update it's type
            if (c.position.row === row && c.position.col === col) {
              return { ...c, type };
            }
            // If a new start/end cell is being added, clear the old one
            if (
              (type === "start" && cell.type === "start") ||
              (type === "end" && cell.type === "end")
            ) {
              cell.type = "air";
            }

            return cell;
          })
        )
      );
    },
    [setGrid]
  );

  // Clear pathfinding/path visuals
  const resetCellStates = () => {
    setGrid((oldGrid) =>
      oldGrid.map((row) => row.map((cell) => ({ ...cell, state: "unvisited" })))
    );
  };

  // Clear pathfinding/path visuals and cell types (make all cell types 'air')
  const resetGrid = () => {
    setGrid((oldGrid) =>
      oldGrid.map((row) =>
        row.map((cell) => ({ ...cell, type: "air", state: "unvisited" }))
      )
    );
  };

  const runAlgorithm = () => {
    // Locate start/end cells. Ensure they exist.
    const [start, end] = findStartAndEndCells(grid);
    if (!start) {
      alert("No start cell found");
      return;
    }
    if (!end) {
      alert("No end cell found");
      return;
    }

    // Clear "state" of all grid cells
    setGrid((oldGrid) =>
      oldGrid.map((row) => row.map((cell) => ({ ...cell, state: "unvisited" })))
    );

    // Disabled editing/re-running until pathfinding and animations have completed
    setAlgorithmRunning(true);

    let nodesVisitedInOrder: GridPosition[] = [];
    let pathInOrder: GridPosition[] | undefined = undefined;
    switch (selectedAlgorithm) {
      case "dijkstra's algorithm":
        [nodesVisitedInOrder, pathInOrder] = dijkstras(grid, start, end);
        break;
      default:
        setAlgorithmRunning(false);
        alert("Selected algorithm not implemented");
        return;
    }

    // todo make state
    const speed = 50;

    // Use timeouts to offset the update of each cell to animate the pathfinding/path.
    let nodesAnimated = 0;

    // Animate pathfinding
    nodesVisitedInOrder.forEach((visitedNode) => {
      setTimeout(() => {
        setGrid((oldGrid) =>
          oldGrid.map((row) =>
            row.map((cell) => {
              const { row, col } = cell.position;
              const updatedCell = { ...cell };
              if (row === visitedNode.row && col === visitedNode.col) {
                updatedCell.state = "visited";
              }
              return updatedCell;
            })
          )
        );
      }, nodesAnimated++ * speed);
    });

    // Animate path if found
    pathInOrder?.forEach((pathNode) => {
      setTimeout(() => {
        setGrid((oldGrid) =>
          oldGrid.map((row) =>
            row.map((cell) => {
              const { row, col } = cell.position;
              const updatedCell = { ...cell };
              if (row === pathNode.row && col === pathNode.col) {
                updatedCell.state = "path";
              }
              return updatedCell;
            })
          )
        );
      }, nodesAnimated++ * speed);
    });

    // Finally, re-enable editing/re-running
    setTimeout(() => {
      setAlgorithmRunning(false);
    }, nodesAnimated * speed);
  };

  return (
    <PathfinderContext.Provider
      value={{
        grid,
        setGrid,
        algorithmRunning,
        setCellType,
        selectedCellType,
        setSelectedCellType,
        selectedAlgorithm,
        setSelectedAlgorithm,
        resetCellStates,
        resetGrid,
        runAlgorithm,
      }}
    >
      {children}
    </PathfinderContext.Provider>
  );
};
