import React from "react";
import { CellType } from "../types/cell-type";
import { CellState } from "../types/cell-state.type";
import { getMouseButtonsPressed } from "../util/get-mouse-buttons-pressed";

type TableCellMouseEvent = React.MouseEvent<HTMLTableCellElement, MouseEvent>;

type Props = {
  row: number;
  col: number;
  type: CellType;
  state: CellState;
  setCellTypeFn: (row: number, col: number, newCellType: CellType) => void;
};

const GridCell = React.memo(
  ({ row, col, type, state, setCellTypeFn }: Props) => {
    return (
      <td
        className={`cell ${type}`}
        key={`cell-${row}-${col}`}
        onMouseMove={(e) => {
          const mouseButtonsPressed = getMouseButtonsPressed(e.buttons);
          if (mouseButtonsPressed.left) {
            setCellTypeFn(row, col, "wall");
          } else if (mouseButtonsPressed.right) {
            setCellTypeFn(row, col, "air");
          }
        }}
        onMouseDown={(e) => {
          // Prevent dragging
          e.preventDefault();
          const mouseButtonsPressed = getMouseButtonsPressed(e.buttons);
          if (mouseButtonsPressed.left) {
            setCellTypeFn(row, col, "wall");
          } else if (mouseButtonsPressed.right) {
            setCellTypeFn(row, col, "air");
          }
        }}
        // Prevent context menu
        onContextMenu={(e) => e.preventDefault()}
      />
    );
  }
);

export default GridCell;
