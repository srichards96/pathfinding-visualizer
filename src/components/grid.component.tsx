import { useCallback, useContext, useEffect, useRef } from "react";
import {
  PathfinderContext,
  PathfinderContextType,
} from "../context/pathfinder-context";
import { makeGrid } from "../util/make-grid";
import GridCell from "./grid-cell.component";

const cellSize = 25;

const Grid = () => {
  const gridContainer = useRef<HTMLElement>(null);
  const { grid, setGrid, selectedCellType, setCellType } = useContext(
    PathfinderContext
  ) as PathfinderContextType;

  const onWindowResize = useCallback(() => {
    const width = gridContainer.current!.clientWidth;
    const height = gridContainer.current!.clientHeight;
    const newCols = Math.floor(width / cellSize);
    const newRows = Math.floor(height / cellSize);
    const currentCols = grid[0].length; // Assumes all rows have same length
    const currentRows = grid.length;

    if (currentRows === newRows && currentCols === newCols) {
      return;
    }

    // Make new grid - ensure it is at least 2x2
    const newGrid = makeGrid(Math.max(2, newRows), Math.max(2, newCols));
    // Copy over anything that's still inbounds
    for (let r = 0; r < newGrid.length; r++) {
      for (let c = 0; c < newGrid[r].length; c++) {
        if (r < currentRows && c < currentCols) {
          newGrid[r][c] = { ...grid[r][c] };
        }
      }
    }

    setGrid(newGrid);
  }, [grid, setGrid]);

  // Setup initial grid size based on container size
  useEffect(() => {
    const width = gridContainer.current!.clientWidth;
    const height = gridContainer.current!.clientHeight;
    let cols = Math.floor(width / cellSize);
    let rows = Math.floor(height / cellSize);
    // Ensure grid is at least 2x2
    cols = Math.max(2, cols);
    rows = Math.max(2, rows);

    // Create grid - put start/end in top-left/bot-right corners
    const newGrid = makeGrid(rows, cols);
    newGrid[1][1].type = "start";
    newGrid[rows - 2][cols - 2].type = "end";
    setGrid(newGrid);
  }, [setGrid]);

  // Setup event listeners
  useEffect(() => {
    window.addEventListener("resize", onWindowResize);
    return () => {
      window.removeEventListener("resize", onWindowResize);
    };
  }, [onWindowResize]);

  const setCellTypeToSelectedType = useCallback(
    (row: number, col: number) => setCellType(row, col, selectedCellType),
    [setCellType, selectedCellType]
  );
  const clearCellType = useCallback(
    (row: number, col: number) => setCellType(row, col, "air"),
    [setCellType]
  );

  return (
    <main
      className="flex-grow bg-gray-500 flex justify-center items-center overflow-y-hidden"
      ref={gridContainer}
    >
      <table className="flex-grow-0 pathfinder-grid">
        <tbody>
          {grid.map((row, rowI) => (
            <tr key={`row-${rowI}`}>
              {row.map((cell) => (
                <GridCell
                  key={`cell-${cell.position.row}-${cell.position.col}`}
                  row={cell.position.row}
                  col={cell.position.col}
                  type={cell.type}
                  state={cell.state}
                  setCellTypeToSelectedTypeFn={setCellTypeToSelectedType}
                  clearCellTypeFn={clearCellType}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
};

export default Grid;
