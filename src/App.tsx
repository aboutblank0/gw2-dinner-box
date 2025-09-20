import { Navigate, Route, Routes } from "react-router-dom";
import { GlobalProvider } from "./components/GlobalContext";
import GW2DinnerBox from "./components/pages/GW2DinnerBox";
import { RecipeTreePage } from "./components/pages/RecipeTreePage";
import { NavBar } from "./components/NavBar";

function App() {
  return (
    <div>
      <NavBar />

      <GlobalProvider>
        <Routes>
          <Route path='/' element={<Navigate to='/dinner-box' />} />
          <Route path='/dinner-box/*' element={<GW2DinnerBox />} />
          <Route path='/recipe-tree/*' element={<RecipeTreePage />} />
        </Routes>
      </GlobalProvider>
    </div>
  );
}

export default App;
