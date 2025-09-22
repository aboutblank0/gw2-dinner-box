import React, { useEffect, useState } from "react";
import {
  fetchAllRecipes,
  fetchGW2Items,
  fetchGW2ItemsListings,
  type GW2Item,
  type GW2ItemListing,
  type GW2Recipe,
} from "../api/gw2";
import { Materials, PhilosopherStone } from "../constants/materials";
import {
  getPriceSummary,
  type PriceSummary,
  type PriceType,
} from "../util/marketUtil";

interface GlobalContextType {
  items?: Record<number, GW2Item>;
  prices?: Record<number, PriceSummary>;
  recipes?: Record<number, GW2Recipe>;
  usedInRecipes?: Record<number, GW2Recipe[]>;

  updateItemPrices: (depth: number) => void;

  ingredientPriceType: PriceType;
  setIngredientPriceType: (type: PriceType) => void;

  resultPriceType: PriceType;
  setResultPriceType: (type: PriceType) => void;
}

const GlobalContext = React.createContext<GlobalContextType | undefined>(
  undefined
);

export default GlobalContext;

export const GlobalProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [items, setItems] = React.useState<Record<number, GW2Item> | undefined>(
    undefined
  );
  const [prices, setPrices] = React.useState<
    Record<number, PriceSummary> | undefined
  >(undefined);

  const [recipes, setRecipes] = useState<Record<number, GW2Recipe> | undefined>(
    undefined
  );

  const [usedInRecipes, setUsedInRecipes] = useState<
    Record<number, GW2Recipe[]> | undefined
  >(undefined);

  const [apiPrices, setApiPrices] = React.useState<
    Record<number, GW2ItemListing> | undefined
  >(undefined);

  const [ingredientPriceType, setIngredientPriceType] =
    React.useState<PriceType>("buys");

  const [resultPriceType, setResultPriceType] =
    React.useState<PriceType>("buys");

  const allMaterialIds = Object.values(Materials)
    .flatMap((tiers) => Object.values(tiers))
    .map((item) => item.id);

  allMaterialIds.push(PhilosopherStone.id);

  useEffect(() => {
    async function fetchItems() {
      try {
        const items = await fetchGW2Items(allMaterialIds);
        const itemsMap: Record<number, GW2Item> = Object.fromEntries(
          items.map((item) => [item.id, item])
        );

        setItems(itemsMap);
      } catch (error) {
        console.error("Error fetching GW2 items:", error);
      }
    }

    async function fetchPrices() {
      try {
        const prices = await fetchGW2ItemsListings(allMaterialIds);
        setApiPrices(prices);
      } catch (error) {
        console.error("Error fetching GW2 item prices:", error);
      }
    }

    async function fetchRecipes() {
      try {
        const recipeMap = await fetchAllRecipes();
        setRecipes(recipeMap);

        // Where key is the item ID,
        // and the value is a list of recipes that use that item as an ingredient
        const usedInMap: Record<number, GW2Recipe[]> = {};
        Object.values(recipeMap).forEach((recipe) => {
          recipe.ingredients.forEach((ingredient) => {
            if (!usedInMap[ingredient.item_id]) {
              usedInMap[ingredient.item_id] = [];
            }
            usedInMap[ingredient.item_id].push(recipe);
          });
        });

        setUsedInRecipes(usedInMap);
      } catch (error) {
        console.error("Error fetching GW2 recipes:", error);
      }
    }

    fetchItems();
    fetchPrices();
    fetchRecipes();
  }, []);

  useEffect(() => {
    if (apiPrices) {
      const priceSummary = getPriceSummary(apiPrices);
      setPrices(priceSummary);
    }
  }, [apiPrices]);

  const updateItemPrices = React.useCallback(
    (marketDepth: number) => {
      if (!apiPrices) return;
      const priceSummary = getPriceSummary(apiPrices, marketDepth);
      setPrices(priceSummary);
    },
    [apiPrices]
  );

  const contextValue: GlobalContextType = {
    items,
    prices,
    recipes,
    usedInRecipes,
    ingredientPriceType,
    resultPriceType,
    setIngredientPriceType,
    setResultPriceType,
    updateItemPrices,
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
