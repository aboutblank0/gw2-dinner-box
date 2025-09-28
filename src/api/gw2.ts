const BASE_URL = "https://api.guildwars2.com/v2";
const CHUNK_SIZE = 200;

export type ItemWithListing = {
  id: number;
  name: string;
  buy_quantity: number;
  buy_price: number;
  sell_quantity: number;
  sell_price: number;

  lastUpdate: string; //date string
};

export async function getAllitemsWithListings(): Promise<
  Record<number, ItemWithListing>
> {
  const url = "https://api.datawars2.ie/gw2/v1/items/json";
  const response = await fetch(url);
  const items = await response.json();
  const itemsMap: Record<number, ItemWithListing> = Object.fromEntries(
    items.map((item: GW2Item) => [item.id, item])
  );
  return itemsMap;
}

export type GW2Recipe = {
  id: number;
  type: string;
  output_item_id: number;
  output_item_count: number;
  flags: string[];
  ingredients: { item_id: number; count: number }[];
};

export async function getAllRecipes(): Promise<Record<number, GW2Recipe>> {
  const url = "https://api.datawars2.ie/gw2/v2/recipes";

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch all GW2 recipes: ${response.statusText}`);
  }
  const data: GW2Recipe[] = await response.json();

  const mysticForgeUrl =
    "https://api.datawars2.ie/gw2/v2/recipes?filter=type:MysticForge";
  const mysticResponse = await fetch(mysticForgeUrl);
  if (!mysticResponse.ok) {
    throw new Error(
      `Failed to fetch mystic forge recipes: ${mysticResponse.statusText}`
    );
  }
  const mysticData: GW2Recipe[] = await mysticResponse.json();
  data.push(...mysticData);

  const recipesMap: Record<number, GW2Recipe> = {};
  data.forEach((recipe) => {
    recipesMap[recipe.id] = recipe;
  });
  return recipesMap;
}

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

export type GW2Item = {
  id: number;
  name: string;
  icon: string;
  description?: string;
  type?: string;
  rarity?: string;
};

export async function fetchGW2Items(
  ids: number[]
): Promise<Record<number, GW2Item>> {
  if (ids.length === 0) return [];

  const results: GW2Item[] = [];

  for (let i = 0; i < ids.length; i += CHUNK_SIZE) {
    const batch = ids.slice(i, i + CHUNK_SIZE);
    const idsParam = batch.join(",");
    const url = `${BASE_URL}/items?ids=${encodeURIComponent(idsParam)}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch GW2 items: ${response.statusText}`);
    }

    const data: GW2Item[] = await response.json();
    results.push(...data);
  }

  const itemsMap: Record<number, GW2Item> = Object.fromEntries(
    results.map((item) => [item.id, item])
  );
  return itemsMap;
}

export async function fetchGW2ItemsListings(
  ids: number[]
): Promise<Record<number, GW2ItemListing>> {
  if (ids.length === 0) return {};

  const listingsMap: Record<number, GW2ItemListing> = {};

  for (let i = 0; i < ids.length; i += CHUNK_SIZE) {
    const chunk = ids.slice(i, i + CHUNK_SIZE);
    const idsParam = chunk.join(",");
    const url = `${BASE_URL}/commerce/listings?ids=${encodeURIComponent(
      idsParam
    )}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch listings: ${response.statusText}`);
    }
    const data = await response.json();
    data.forEach((listing: GW2ItemListing) => {
      listingsMap[listing.id] = listing;
    });
  }

  return listingsMap;
}
