import React, { useEffect, useState } from "react";
import {
  getAllitemsWithListings,
  getAllRecipes,
  type ItemWithListing,
  type Recipe,
} from "../../api/gw2";
import type { PriceType } from "../../util/marketUtil";

interface GlobalContextType {
  allItemsWithListings: Record<number, ItemWithListing>;
  allRecipes: Record<number, Recipe>;

  ingredientPriceType: PriceType;
  setIngredientPriceType: (type: PriceType) => void;

  resultPriceType: PriceType;
  setResultPriceType: (type: PriceType) => void;
}

const GlobalContext = React.createContext<GlobalContextType | undefined>(
  undefined
);
export default GlobalContext;

export const GlobalContextProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [allItemsWithListings, setAllItemWithListings] = useState<
    Record<number, ItemWithListing>
  >({});

  const [allRecipes, setAllRecipes] = useState<Record<number, Recipe>>({});

  const [ingredientPriceType, setIngredientPriceType] =
    React.useState<PriceType>("buys");

  const [resultPriceType, setResultPriceType] =
    React.useState<PriceType>("buys");

  useEffect(() => {
    const fetchAllItemWithListings = async () => {
      const itemsWithListings = await getAllitemsWithListings();
      setAllItemWithListings(itemsWithListings);
    };

    const fetchAllRecipes = async () => {
      const recipes = await getAllRecipes();
      setAllRecipes(recipes);
    };

    fetchAllItemWithListings();
    fetchAllRecipes();
  }, []);

  const contextValue: GlobalContextType = {
    allItemsWithListings,
    allRecipes,
    ingredientPriceType,
    setIngredientPriceType,
    resultPriceType,
    setResultPriceType,
  };

  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = (): GlobalContextType => {
  const context = React.useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};
