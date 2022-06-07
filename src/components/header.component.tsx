import { useContext } from "react";
import {
  PathfinderContext,
  PathfinderContextType,
} from "../context/pathfinder-context";
import { CellType } from "../types/cell-type";
import { PathfindingAlgorithm } from "../types/pathfinding-algorithm.type";
import { cellTypeToWeight } from "../util/cell-type-to-weight";
import FormSelect from "./form-select.component";

const cellTypeOptions: CellType[] = ["start", "end", "air", "wall"];
const algorithmOptions: PathfindingAlgorithm[] = [
  "dijkstra's algorithm",
  "a* search",
  "breadth first search",
  "depth first search",
];

const Header = () => {
  const {
    selectedCellType,
    setSelectedCellType,
    selectedAlgorithm,
    setSelectedAlgorithm,

    resetCellStates,
    runDijkstra,
  } = useContext(PathfinderContext) as PathfinderContextType;

  return (
    <header className="bg-gray-700 text-white p-4">
      <div className="container mx-auto flex items-center flex-wrap">
        <h1 className="text-2xl mr-8">Pathfinding Visualizer</h1>

        <div className="inline-flex items-center gap-4 flex-wrap">
          <FormSelect
            className="capitalize text-black"
            id="cellTypeSelect"
            value={selectedCellType}
            setValueFn={(newValue) => setSelectedCellType(newValue as CellType)}
            label="Selected Cell Type"
            options={cellTypeOptions.map((cto) => ({
              key: cto,
              value: cto,
              label: `(${cellTypeToWeight(cto)}) ${cto}`,
            }))}
          />

          <FormSelect
            className="capitalize text-black"
            id="algorithmSelect"
            value={selectedAlgorithm}
            setValueFn={(newValue) =>
              setSelectedAlgorithm(newValue as PathfindingAlgorithm)
            }
            label="Selected Algorithm"
            options={algorithmOptions.map((ao) => ({
              key: ao,
              value: ao,
              label: ao,
            }))}
          />

          <button onClick={runDijkstra}>Pathfind</button>
          <button onClick={resetCellStates}>Reset state</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
