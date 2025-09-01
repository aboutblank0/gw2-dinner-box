import type { PriceSummary } from "../util/marketUtil";

export type GW2Item = {
  id: number;
  name: string;
  icon: string;
  description?: string;
  type?: string;
  rarity?: string;
  price?: PriceSummary;
};

export type GW2ItemListing = {
  id: number;
  buys?: GW2TradeListing[];
  sells?: GW2TradeListing[];
};

export type GW2TradeListing = {
  unit_price: number;
  quantity: number;
  listings: number;
};

const BASE_URL = "https://api.guildwars2.com/v2";

/**
 * Fetches item data for a list of GW2 item IDs.
 * @param ids An array of item IDs.
 * @returns A promise resolving to an array of GW2Item objects.
 */
export async function fetchGW2Items(ids: number[]): Promise<GW2Item[]> {
  if (ids.length === 0) return [];

  const idsParam = ids.join(",");
  const url = `${BASE_URL}/items?ids=${encodeURIComponent(idsParam)}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch GW2 items: ${response.statusText}`);
  }

  const data: GW2Item[] = await response.json();
  return data;
}

export async function fetchGW2ItemsListings(
  ids: number[]
): Promise<Record<number, GW2ItemListing>> {
  if (ids.length === 0) return {};

  const idsParam = ids.join(",");
  const url = `${BASE_URL}/commerce/listings?ids=${encodeURIComponent(
    idsParam
  )}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch GW2 item listings: ${response.statusText}`
    );
  }
  const data = await response.json();

  const listingsMap: Record<number, GW2ItemListing> = {};
  data.forEach((listing: GW2ItemListing) => {
    listingsMap[listing.id] = listing;
  });
  return listingsMap;
}
