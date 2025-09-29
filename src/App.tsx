import { Navigate, Route, Routes } from "react-router-dom";
import { MaterialPromotionContextProvider } from "./components/contexts/MaterialPromotionPageContext";
import MaterialPromotionPage from "./components/pages/MaterialPromotionPage";
import { RecipeTreePage } from "./components/pages/RecipeTreePage";
import { NavBar } from "./components/NavBar";
import { GlobalContextProvider } from "./components/contexts/GlobalContext";
import { RecipeTreeContextProvider } from "./components/contexts/RecipeTreeContext";

function App() {
  return (
    <GlobalContextProvider>
      <NavBar />

      <Routes>
        <Route path='/' element={<Navigate to='/material-promotion' />} />

        <Route
          path='/material-promotion/*'
          element={
            <MaterialPromotionContextProvider>
              <MaterialPromotionPage />
            </MaterialPromotionContextProvider>
          }
        />

        <Route
          path='/recipe-tree/*'
          element={
            <RecipeTreeContextProvider>
              <RecipeTreePage />
            </RecipeTreeContextProvider>
          }
        />
      </Routes>
    </GlobalContextProvider>
  );
}

export default App;
