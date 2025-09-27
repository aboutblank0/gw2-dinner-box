import { Navigate, Route, Routes } from "react-router-dom";
import { GlobalProvider } from "./components/contexts/GlobalContext";
import MaterialPromotionPage from "./components/pages/MaterialPromotionPage";
import { RecipeTreePage } from "./components/pages/RecipeTreePage";
import { NavBar } from "./components/NavBar";

function App() {
  return (
    <div>
      <NavBar />

      <GlobalProvider>
        <Routes>
          <Route path='/' element={<Navigate to='/material-promotion' />} />
          <Route
            path='/material-promotion/*'
            element={<MaterialPromotionPage />}
          />
          <Route path='/recipe-tree/*' element={<RecipeTreePage />} />
        </Routes>
      </GlobalProvider>
    </div>
  );
}

export default App;
