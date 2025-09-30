import React, { useEffect, useState } from "react";
import {
  getAllCurrencies,
  getAllitemsWithListings,
  getAllRecipes,
  type GW2Currency,
  type ItemWithListing,
  type Recipe,
} from "../../api/gw2";
import type { PriceType } from "../../util/marketUtil";

interface GlobalContextType {
  allItemsWithListings: Record<number, ItemWithListing>;
  allRecipes: Record<number, Recipe>;
  allCurrencies: Record<number, GW2Currency>;

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
  const [allCurrencies, setAllCurrencies] = useState<
    Record<number, GW2Currency>
  >({});

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

    const fetchAllCurrencies = async () => {
      const currencies = await getAllCurrencies();
      setAllCurrencies(currencies);
    };

    fetchAllItemWithListings();
    fetchAllRecipes();
    fetchAllCurrencies();
  }, []);

  const contextValue: GlobalContextType = {
    allItemsWithListings,
    allRecipes,
    allCurrencies,
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
