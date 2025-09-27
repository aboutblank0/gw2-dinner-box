import React, { useEffect, useState } from "react";
import {
  getAllitemsWithListings,
  getAllRecipes,
  type GW2Recipe,
  type ItemWithListing,
} from "../../api/gw2";

interface ActualGlobalContextType {
  allItemListings: Record<number, ItemWithListing>;
}

const ActualGlobalContext = React.createContext<
  ActualGlobalContextType | undefined
>(undefined);
export default ActualGlobalContext;

export const GlobalProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [allItemListings, setAllItemListings] = useState<
    Record<number, ItemWithListing>
  >({});

  const [allRecipes, setAllRecipes] = useState<Record<number, GW2Recipe>>({});

  useEffect(() => {
    const fetchAllItemWithListings = async () => {
      const itemsWithListings = await getAllitemsWithListings();
      setAllItemListings(itemsWithListings);
    };

    const fetchAllRecipes = async () => {
      const recipes = await getAllRecipes();
      setAllRecipes(recipes);
    };

    fetchAllItemWithListings();
    fetchAllRecipes();
  }, []);

  const contextValue: ActualGlobalContextType = {
    allItemListings,
  };

  return (
    <ActualGlobalContext.Provider value={contextValue}>
      {children}
    </ActualGlobalContext.Provider>
  );
};
