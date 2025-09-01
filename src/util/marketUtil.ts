import type { GW2TradeListing } from "../api/gw2";

export type PriceSummary = {
  weightedAverage: number;
  weightedTop: number;
};

export function getPriceSummary(listings: GW2TradeListing[]): PriceSummary {
  return {
    weightedAverage: weightedAverageSellPrice(listings),
    weightedTop: weightedTopPercentage(listings),
  };
}

export function weightedAverageSellPrice(listings: GW2TradeListing[]): number {
  let totalValue = 0;
  let totalQuantity = 0;

  for (const l of listings) {
    totalValue += l.unit_price * l.quantity;
    totalQuantity += l.quantity;
  }

  const final = totalQuantity > 0 ? totalValue / totalQuantity : 0;
  return parseFloat(final.toFixed(2));
}

export function weightedTopPercentage(
  listings: GW2TradeListing[],
  percent = 0.1
): number {
  const sorted = [...listings].sort((a, b) => a.unit_price - b.unit_price);
  const totalQuantity = sorted.reduce((sum, l) => sum + l.quantity, 0);
  const cutoff = totalQuantity * percent;

  let accQuantity = 0;
  let accValue = 0;

  for (const l of sorted) {
    if (accQuantity >= cutoff) break;
    const qty = Math.min(l.quantity, cutoff - accQuantity);
    accValue += l.unit_price * qty;
    accQuantity += qty;
  }

  const final = accQuantity > 0 ? accValue / accQuantity : 0;
  return parseFloat(final.toFixed(2));
}
