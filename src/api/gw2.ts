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

export type Recipe = {
  id: number;
  output_item_id: number;
  output_item_count: number;
  ingredients: { id: number; count: number; type?: string; item?: GW2Item }[];
  disciplines: string[];
  flags?: string[];
  type?: string;
  name?: string;
};
export async function getAllRecipes(): Promise<Record<number, Recipe>> {
  const craftingRecipes = await getAllCraftingRecipes();
  const customRecipes = await getCustomRecipes();

  const allRecipes: Recipe[] = [];
  craftingRecipes.forEach((recipe) => {
    allRecipes.push({
      id: recipe.id,
      output_item_id: recipe.output_item_id,
      output_item_count: recipe.output_item_count,
      ingredients: recipe.ingredients.map((ing) => ({
        id: ing.item_id,
        count: ing.count,
      })),
      disciplines: recipe.disciplines,
      flags: recipe.flags,
      type: recipe.type,
    } as Recipe);
  });

  customRecipes.forEach((recipe) => {
    allRecipes.push({
      id: recipe.id,
      output_item_id: recipe.output_item_id,
      output_item_count: recipe.output_item_count,
      ingredients: recipe.ingredients.map((ing) => ({
        id: ing.id,
        count: ing.count,
        type: ing.type,
      })),
      name: recipe.name,
      disciplines: recipe.disciplines,
    } as Recipe);
  });

  return allRecipes;
}

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
      console.warn(`Failed to fetch items: ${response.statusText}`);
      continue;
    }

    const data: GW2Item[] = await response.json();
    results.push(...data);
  }

  const itemsMap: Record<number, GW2Item> = Object.fromEntries(
    results.map((item) => [item.id, item])
  );
  return itemsMap;
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

export type CustomRecipe = {
  id?: number;
  name: string;
  output_item_id: number;
  output_item_count: number;
  ingredients: { id: number; count: number; type: string }[];
  disciplines: string[];
};
/**
 * @returns A List of custom recipes provided by GW2Efficiency.
 * Contains Mystic Forge recipes and merchant trades.
 */
export async function getCustomRecipes(): Promise<CustomRecipe[]> {
  const url =
    "https://raw.githubusercontent.com/gw2efficiency/custom-recipes/schema-update/recipes.json";

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch custom recipes: ${response.statusText}`);
  }
  const data: CustomRecipe[] = await response.json();
  //Assign unique IDs (negative numbers) to each custom recipe
  data.forEach((recipe, index) => {
    recipe.id = -index - 1;
  });
  return data as CustomRecipe[];
}

export type GW2Recipe = {
  id: number;
  type: string;
  output_item_id: number;
  output_item_count: number;
  flags: string[];
  ingredients: { item_id: number; count: number }[];
  disciplines: string[];
};
export async function getAllCraftingRecipes(): Promise<GW2Recipe[]> {
  const url = "https://api.datawars2.ie/gw2/v2/recipes";

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch all GW2 recipes: ${response.statusText}`);
  }
  const data: GW2Recipe[] = await response.json();
  return data;
}

export type GW2Currency = {
  id: number;
  name: string;
  description: string;
  icon: string;
  order: number;
};
export async function getAllCurrencies(): Promise<Record<number, GW2Currency>> {
  const url = `${BASE_URL}/currencies`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch currencies: ${response.statusText}`);
  }
  const currencyIds: number[] = await response.json();

  const urlDetails = `${BASE_URL}/currencies?ids=${currencyIds.join(",")}`;
  const responseDetails = await fetch(urlDetails);
  if (!responseDetails.ok) {
    throw new Error(
      `Failed to fetch currency details: ${responseDetails.statusText}`
    );
  }
  const currencies = await responseDetails.json();
  const currencyMap: Record<number, GW2Currency> = Object.fromEntries(
    currencies.map((currency: GW2Currency) => [currency.id, currency])
  );
  return currencyMap;
}

type GW2MaterialGroup = {
  id: number;
  name: string;
  order: number;
  items: number[];
};
export async function getAllMaterials(): Promise<Record<number, GW2Item>> {
  const materialIdsUrl = `${BASE_URL}/materials`;
  const response = await fetch(materialIdsUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch material IDs: ${response.statusText}`);
  }
  const materialIds: number[] = await response.json();

  const materialItemIdsResponse = await fetch(
    `${BASE_URL}/materials?ids=${materialIds.join(",")}`
  );
  if (!materialItemIdsResponse.ok) {
    throw new Error(
      `Failed to fetch material item IDs: ${materialItemIdsResponse.statusText}`
    );
  }
  const materialGroups: GW2MaterialGroup[] =
    await materialItemIdsResponse.json();

  return fetchGW2Items(materialGroups.flatMap((group) => group.items));
}
