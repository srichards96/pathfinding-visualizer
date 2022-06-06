import React from "react";
import { CellType } from "../types/cell-type";
import { CellState } from "../types/cell-state.type";
import { getMouseButtonsPressed } from "../util/get-mouse-buttons-pressed";

type Props = {
  row: number;
  col: number;
  type: CellType;
  state: CellState;
  setCellTypeToSelectedTypeFn: (row: number, col: number) => void;
  clearCellTypeFn: (row: number, col: number) => void;
  setSelectedCellTypeFn: (newCellType: CellType) => void;
};

const GridCell = React.memo(
  ({
    row,
    col,
    type,
    state,
    setCellTypeToSelectedTypeFn,
    clearCellTypeFn,
    setSelectedCellTypeFn,
  }: Props) => (
    <td
      className={`cell ${type}`}
      key={`cell-${row}-${col}`}
      onMouseMove={(e) => {
        const mouseButtonsPressed = getMouseButtonsPressed(e.buttons);
        if (mouseButtonsPressed.left) {
          setCellTypeToSelectedTypeFn(row, col);
        } else if (mouseButtonsPressed.right) {
          clearCellTypeFn(row, col);
        }
      }}
      onMouseDown={(e) => {
        // Prevent dragging
        e.preventDefault();
        const mouseButtonsPressed = getMouseButtonsPressed(e.buttons);
        if (mouseButtonsPressed.left) {
          setCellTypeToSelectedTypeFn(row, col);
        } else if (mouseButtonsPressed.right) {
          clearCellTypeFn(row, col);
        } else if (mouseButtonsPressed.middle) {
          // Set selected cell type to this cell's CellType
          setSelectedCellTypeFn(type);
        }
      }}
      // Prevent context menu
      onContextMenu={(e) => e.preventDefault()}
    />
  )
);

export default GridCell;
