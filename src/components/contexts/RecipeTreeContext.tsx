import { createContext, useContext, useEffect, useState } from "react";
import type { GW2Recipe } from "../../api/gw2";
import { useGlobalContext } from "./GlobalContext";

interface RecipeTreeContextType {
  usedInRecipes: Record<number, GW2Recipe[]>;
}

const RecipeTreeContext = createContext<RecipeTreeContextType | undefined>(
  undefined
);

export default RecipeTreeContext;

export const RecipeTreeContextProvider: React.FC<
  React.PropsWithChildren<{}>
> = ({ children }) => {
  const { allRecipes } = useGlobalContext();

  const [usedInRecipes, setUsedInRecipes] = useState<
    Record<number, GW2Recipe[]> | undefined
  >(undefined);

  useEffect(() => {
    if (!allRecipes) return;

    // Where key is the item ID,
    // and the value is a list of recipes that use that item as an ingredient
    const usedInMap: Record<number, GW2Recipe[]> = {};
    Object.values(allRecipes).forEach((recipe) => {
      recipe.ingredients.forEach((ingredient) => {
        if (!usedInMap[ingredient.item_id]) {
          usedInMap[ingredient.item_id] = [];
        }
        usedInMap[ingredient.item_id].push(recipe);
      });
    });
    setUsedInRecipes(usedInMap);
  }, [allRecipes]);

  const value = {
    usedInRecipes: usedInRecipes || {},
  };
  return (
    <RecipeTreeContext.Provider value={value}>
      {children}
    </RecipeTreeContext.Provider>
  );
};

export const useRecipeTreeContext = (): RecipeTreeContextType => {
  const context = useContext(RecipeTreeContext);
  if (!context) {
    throw new Error(
      "useRecipeTreeContext must be used within a RecipeTreeContextProvider"
    );
  }
  return context;
};
