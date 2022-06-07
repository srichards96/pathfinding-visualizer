import { Cell } from "../types/cell.type";
import { GridPosition } from "../types/grid-position.type";
import { cellTypeToWeight } from "../util/cell-type-to-weight";

type DijkstraNode = {
  position: GridPosition;
  weight: number;
  distance: number;
  visited: boolean;
  previousNode?: DijkstraNode;
};

/**
 *
 * @param grid
 * @param startCell
 * @param endCell
 * @returns
 */
export const dijkstras = (
  grid: Cell[][],
  startCell: Cell,
  endCell: Cell
): [GridPosition[], GridPosition[] | undefined] => {
  const visitedNodesInOrder: DijkstraNode[] = [];

  // Duplicate grid and convert to DijkstraNodes
  // dijkstraGrid is used to update nodes based on their row/col
  // unvisitedNodes is a flat copy of dijkstraGrid - it is looped over
  const [dijkstraGrid, unvisitedNodes] = cellGridToDijkstraNodes(grid);

  // Set start cell to have weight of 0
  dijkstraGrid[startCell.position.row][startCell.position.col].distance = 0;

  let endDijkstraNode: DijkstraNode | undefined = undefined;

  while (unvisitedNodes.length > 0) {
    // Sort nodes by distance in ascending order
    unvisitedNodes.sort((a, b) => a.distance - b.distance);
    const closestNode = unvisitedNodes.shift()!;
    closestNode.visited = true;
    const { row, col } = closestNode.position;

    // If weight is Infinity, node is a wall
    if (closestNode.weight === Infinity) {
      continue;
    }
    // If distance is Infinity, pathfinding has failed - no path exists
    if (closestNode.distance === Infinity) {
      break;
    }

    visitedNodesInOrder.push(closestNode);
    // If closest node is the end node, pathfinding is complete
    if (row === endCell.position.row && col === endCell.position.col) {
      endDijkstraNode = closestNode;
      break;
    }

    // Update neighboring cells then
    updateNeighbors(closestNode, dijkstraGrid);
  }

  const path = endDijkstraNode ? getPath(endDijkstraNode) : undefined;
  // Return visited nodes in order and path - only return GridPositions
  return [
    visitedNodesInOrder.map((x) => x.position),
    path?.map((x) => x.position),
  ];
};

/**
 * Converts grid (Cell[][]) to DijkstraNode grid (DijkstraNode[][])
 * @param grid
 * @returns 2 element array [DijkstraNode grid, flattened DijkstraNode grid]
 */
const cellGridToDijkstraNodes = (
  grid: Cell[][]
): [DijkstraNode[][], DijkstraNode[]] => {
  const dijkstraGrid = grid.map((row) =>
    row.map((cell) => ({
      position: { ...cell.position },
      weight: cellTypeToWeight(cell.type),
      distance: Infinity,
      visited: false,
      previousNode: undefined,
    }))
  );

  return [dijkstraGrid, dijkstraGrid.flat()];
};

const updateNeighbors = (currentNode: DijkstraNode, grid: DijkstraNode[][]) => {
  const unvisitedNeighbors = getNeighbors(currentNode, grid);

  // Update neighbor distance to current distance + neighbor weight
  unvisitedNeighbors.forEach((neighbor) => {
    neighbor.distance = currentNode.distance + neighbor.weight;
    neighbor.previousNode = currentNode;
  });
};

const getNeighbors = (currentNode: DijkstraNode, grid: DijkstraNode[][]) => {
  const neighbors: DijkstraNode[] = [];

  // Get nodes on all 4 sides of current node (unless out of bounds)
  const { row, col } = currentNode.position;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);

  // Return unvisited neighbors
  return neighbors.filter((x) => !x.visited);
};

const getPath = (endNode: DijkstraNode): DijkstraNode[] => {
  const pathInOrder: DijkstraNode[] = [];

  let currentNode = endNode;
  while (!!currentNode.previousNode) {
    pathInOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }

  return pathInOrder;
};
