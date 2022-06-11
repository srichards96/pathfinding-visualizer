import { Cell } from "../types/cell.type";
import { GridPosition } from "../types/grid-position.type";
import { PathfindingResult } from "../types/pathfinding-result.type";
import { getTreeDescent } from "../util/get-tree-descent";

type BFSNode = {
  position: GridPosition;
  visited: boolean;
  previousNode?: BFSNode;
};

export const bfs = (
  grid: Cell[][],
  startCell: Cell,
  endCell: Cell
): PathfindingResult => {
  const visitedNodesInOrder: BFSNode[] = [];
  let endBFSNode: BFSNode | undefined = undefined;

  const bfsGrid = cellGridtoBFSGrid(grid);
  bfsGrid[startCell.position.row][startCell.position.col].visited = true;
  const queue: BFSNode[] = [
    bfsGrid[startCell.position.row][startCell.position.col],
  ];

  while (queue.length > 0) {
    const currentNode = queue.shift()!;
    visitedNodesInOrder.push(currentNode);

    const { row, col } = currentNode.position;
    if (row === endCell.position.row && col === endCell.position.col) {
      endBFSNode = currentNode;
      break;
    }

    // Enqueue each unvisited neighbor
    const neighborCells = getNeighbors(currentNode, bfsGrid);
    for (const neighbor of neighborCells) {
      if (!neighbor.visited) {
        // Neighbor is about to be visited, so set it to visited
        neighbor.visited = true;
        neighbor.previousNode = currentNode;
        queue.push(neighbor);
      }
    }
  }

  const path = endBFSNode ? getTreeDescent(endBFSNode) : undefined;
  // Return visited nodes in order and path - only return GridPositions
  return [
    visitedNodesInOrder.map((x) => x.position),
    path?.map((x) => x.position),
  ];
};

const cellGridtoBFSGrid = (grid: Cell[][]): BFSNode[][] =>
  grid.map((row) =>
    row.map((cell) => ({
      position: { ...cell.position },
      visited: false,
      previousNode: undefined,
    }))
  );

const getNeighbors = (currentNode: BFSNode, grid: BFSNode[][]): BFSNode[] => {
  const neighbors = [];

  // Get nodes on all 4 sides of current node (unless out of bounds)
  const { row, col } = currentNode.position;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);

  return neighbors;
};
