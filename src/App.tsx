import Grid from "./components/grid.component";
import Header from "./components/header.component";
import { PathfinderProvider } from "./context/pathfinder-context";

const App = () => (
  <PathfinderProvider>
    <div className="flex flex-col h-screen">
      <Header />
      <Grid />
    </div>
  </PathfinderProvider>
);

export default App;
