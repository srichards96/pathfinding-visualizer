import React, { createContext, useCallback, useState } from "react";
import { dijkstras } from "../algorithms/djikstras";
import { CellType } from "../types/cell-type";
import { Cell } from "../types/cell.type";
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
  runDijkstra: () => void;
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

  const runDijkstra = () => {
    // Clear "state" of all grid cells
    setGrid((oldGrid) =>
      oldGrid.map((row) => row.map((cell) => ({ ...cell, state: "unvisited" })))
    );

    const [start, end] = findStartAndEndCells(grid);
    if (!start) {
      alert("No start cell found");
      return;
    }
    if (!end) {
      alert("No end cell found");
      return;
    }

    // Disabled editing/re-running until pathfinding and animations have completed
    setAlgorithmRunning(true);

    const [nodesVisitedInOrder, pathInOrder] = dijkstras(grid, start, end);

    // todo make state
    const speed = 50;

    nodesVisitedInOrder.forEach((visitedNode, i) => {
      setTimeout(
        () =>
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
          ),
        i * speed
      );
    });

    const pathTimeoutOffset = nodesVisitedInOrder.length * speed;
    pathInOrder?.forEach((pathNode, i) => {
      setTimeout(
        () =>
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
          ),
        pathTimeoutOffset + i * speed
      );
    });

    // After pathfinding and animations have finished, re-enable editing/re-running
    const timeoutOffset =
      pathTimeoutOffset + (pathInOrder?.length ?? 0) * speed;
    setTimeout(() => {
      setAlgorithmRunning(false);
    }, timeoutOffset);
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
        runDijkstra,
      }}
    >
      {children}
    </PathfinderContext.Provider>
  );
};
