import type { GW2ItemListing, GW2TradeListing } from "../api/gw2";

export type PriceType = "instant" | "listing";

export type PriceSummary = {
  buyPrice: number;
  sellPrice: number;
};

export function getPrice(
  prices: PriceSummary | undefined,
  type: PriceType
): number {
  if (!prices) return -1000;
  return type === "instant" ? prices.sellPrice : prices.buyPrice;
}

export function getPriceSummary(
  listings: Record<number, GW2ItemListing>,
  depth: number = 100
): Record<number, PriceSummary> {
  const summary: Record<number, PriceSummary> = {};

  for (const [itemIdStr, listing] of Object.entries(listings)) {
    const itemId = parseInt(itemIdStr, 10);
    const buyListings = listing.buys || [];
    const sellListings = listing.sells || [];

    const buyPrice = weightedTopPercentage(buyListings, depth);
    const sellPrice = weightedTopPercentage(sellListings, depth);

    summary[itemId] = {
      buyPrice: buyPrice > 0 ? buyPrice : -1000,
      sellPrice: sellPrice > 0 ? sellPrice : -1000,
    };
  }
  return summary;
}

export function weightedTopPercentage(
  listings: GW2TradeListing[],
  depth: number
): number {
  const sorted = [...listings].sort((a, b) => a.unit_price - b.unit_price);
  let accQuantity = 0;
  let accValue = 0;

  for (const l of sorted) {
    const qty = Math.min(l.quantity, depth - accQuantity);
    accValue += l.unit_price * qty;
    accQuantity += qty;
    if (accQuantity >= depth) break;
  }

  const final = accQuantity > 0 ? accValue / accQuantity : 0;
  return parseFloat(final.toFixed(2));
}
