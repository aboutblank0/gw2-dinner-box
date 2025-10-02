import React, { useCallback, useEffect, useState } from "react";
import {
  fetchGW2Items,
  getAllCurrencies,
  getAllitemsWithListings,
  getAllMaterials,
  getAllRecipes,
  type GW2Currency,
  type GW2Item,
  type ItemWithListing,
  type Recipe,
} from "../../api/gw2";
import type { PriceType } from "../../util/marketUtil";

interface GlobalContextType {
  itemMap: Record<number, GW2Item>;
  fetchItems(ids: number[]): Promise<Record<number, GW2Item>>;

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
  const [itemMap, setItemMap] = useState<Record<number, GW2Item>>({});

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

    const fetchAllMaterials = async () => {
      const materials = await getAllMaterials();
      setItemMap(materials);
    };

    fetchAllItemWithListings();
    fetchAllRecipes();
    fetchAllCurrencies();
    fetchAllMaterials();
  }, []);

  const fetchItems = useCallback(
    async (ids: number[]): Promise<Record<number, GW2Item>> => {
      //Get ids of items we already fetched from API
      const existingIds = Object.keys(itemMap).map((id) => parseInt(id, 10));

      //Filter out ids we already have
      const idsToFetch = ids.filter((id) => !existingIds.includes(id));

      if (idsToFetch.length === 0) {
        const existingItems: Record<number, GW2Item> = {};
        ids.forEach((id) => {
          if (itemMap[id]) {
            existingItems[id] = itemMap[id];
          }
        });
        return existingItems;
      }
      const fetchedItems = await fetchGW2Items(idsToFetch);

      //"merge" the two Records
      setItemMap((prevItemMap) => ({
        ...prevItemMap,
        ...fetchedItems,
      }));

      const resultItems: Record<number, GW2Item> = {};
      ids.forEach((id) => {
        if (itemMap[id]) {
          resultItems[id] = itemMap[id];
        } else if (fetchedItems[id]) {
          resultItems[id] = fetchedItems[id];
        }
      });
      return resultItems;
    },
    [itemMap]
  );

  const contextValue: GlobalContextType = {
    itemMap,
    fetchItems,
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
