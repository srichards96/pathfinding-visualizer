import { Cell } from "../types/cell.type";
import { GridPosition } from "../types/grid-position.type";
import { PathfindingResult } from "../types/pathfinding-result.type";
import { getTreeDescent } from "../util/get-tree-descent";

type DFSNode = {
  position: GridPosition;
  visited: boolean;
  previousNode?: DFSNode;
};

export const dfs = (
  grid: Cell[][],
  startCell: Cell,
  endCell: Cell
): PathfindingResult => {
  const visitedNodesInOrder: DFSNode[] = [];
  let endDFSNode: DFSNode | undefined = undefined;

  const dfsGrid = cellGridtoDFSGrid(grid);

  // Create stack with start cell in it
  const stack: DFSNode[] = [
    dfsGrid[startCell.position.row][startCell.position.col],
  ];

  while (stack.length > 0) {
    const currentNode = stack.pop()!;

    if (currentNode.visited) {
      continue;
    }

    // If node is a wall, ignore it
    const { row, col } = currentNode.position;
    if (grid[row][col].type === "wall") {
      continue;
    }

    currentNode.visited = true;
    visitedNodesInOrder.push(currentNode);

    // If end node has been found, stop searching
    if (row === endCell.position.row && col === endCell.position.col) {
      endDFSNode = currentNode;
      break;
    }

    // Push each unvisited neighbor
    const neighborCells = getNeighbors(currentNode, dfsGrid);
    for (const neighbor of neighborCells) {
      if (!neighbor.visited) {
        neighbor.previousNode = currentNode;
        stack.push(neighbor);
      }
    }
  }

  const path = endDFSNode ? getTreeDescent(endDFSNode) : undefined;
  // Return visited nodes in order and path - only return GridPositions
  return [
    visitedNodesInOrder.map((x) => x.position),
    path?.map((x) => x.position),
  ];
};

const cellGridtoDFSGrid = (grid: Cell[][]): DFSNode[][] =>
  grid.map((row) =>
    row.map((cell) => ({
      position: { ...cell.position },
      visited: false,
      previousNode: undefined,
    }))
  );

const getNeighbors = (currentNode: DFSNode, grid: DFSNode[][]): DFSNode[] => {
  const neighbors = [];

  // Get nodes on all 4 sides of current node (unless out of bounds)
  const { row, col } = currentNode.position;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);

  return neighbors;
};
