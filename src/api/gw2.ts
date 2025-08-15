export type GW2Item = {
  id: number;
  name: string;
  icon: string;
  description?: string;
  type?: string;
  rarity?: string;
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
): Promise<Record<number, number>> {
  if (ids.length === 0) return {};

  const idsParam = ids.join(",");
  const url = `${BASE_URL}/commerce/listings?ids=${encodeURIComponent(
    idsParam
  )}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch GW2 item listings: ${response.statusText}`);
  }
  const test = await response.json();
  console.log(test);

  const data: Array<{ id: number; price: number }> = test;
  return Object.fromEntries(data.map(({ id, price }) => [id, price]));
}
