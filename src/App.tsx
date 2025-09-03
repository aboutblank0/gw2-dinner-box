import { GlobalProvider } from "./components/GlobalContext";
import GW2DinnerBox from "./GW2DinnerBox";

function App() {
  return (
    <GlobalProvider>
      <GW2DinnerBox />
    </GlobalProvider>
  );
}

export default App;
