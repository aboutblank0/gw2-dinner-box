import React, { useEffect } from "react";
import { fetchGW2ItemsListings, type GW2ItemListing } from "../../api/gw2";
import { Materials, PhilosopherStone } from "../../constants/materials";
import { getPriceSummary, type PriceSummary } from "../../util/marketUtil";

interface MaterialPromotionContextType {
  prices?: Record<number, PriceSummary>;
  updateItemPrices: (depth: number) => void;
}

const MaterialPromotionContext = React.createContext<
  MaterialPromotionContextType | undefined
>(undefined);

export default MaterialPromotionContext;

export const MaterialPromotionContextProvider: React.FC<
  React.PropsWithChildren<{}>
> = ({ children }) => {
  const [prices, setPrices] = React.useState<
    Record<number, PriceSummary> | undefined
  >(undefined);

  const [apiPrices, setApiPrices] = React.useState<
    Record<number, GW2ItemListing> | undefined
  >(undefined);

  const allMaterialIds = Object.values(Materials)
    .flatMap((tiers) => Object.values(tiers))
    .map((item) => item.id);

  allMaterialIds.push(PhilosopherStone.id);

  useEffect(() => {
    async function fetchPrices() {
      try {
        const prices = await fetchGW2ItemsListings(allMaterialIds);
        setApiPrices(prices);
      } catch (error) {
        console.error("Error fetching GW2 item prices:", error);
      }
    }

    fetchPrices();
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

  const contextValue: MaterialPromotionContextType = {
    prices,
    updateItemPrices,
  };

  return (
    <MaterialPromotionContext.Provider value={contextValue}>
      {children}
    </MaterialPromotionContext.Provider>
  );
};

export const useMaterialPromotionContext = (): MaterialPromotionContextType => {
  const context = React.useContext(MaterialPromotionContext);
  if (!context) {
    throw new Error(
      "useMaterialPromotionContext must be used within a MaterialPromotionContextProvider"
    );
  }
  return context;
};
