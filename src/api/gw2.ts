export type GW2Item = {
  id: number;
  name: string;
  icon: string;
  description?: string;
  type?: string;
  rarity?: string;
};

export type GW2Recipe = {
  id: number;
  type: string;
  output_item_id: number;
  output_item_count: number;
  flags: string[];
  ingredients: { item_id: number; count: number }[];
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

export type ItemWithRecipe = {
  itemId: number;
  crafts: ItemWithRecipe[];

  item?: GW2Item;
  itemListing?: GW2ItemListing;
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

export async function fetchRecipesForItem(
  itemId: number
): Promise<GW2Recipe[] | null> {
  const url = `${BASE_URL}/recipes/search?input=${itemId}`;
  const recipeIds = await fetch(url).then((res) => res.json());

  if (!Array.isArray(recipeIds) || recipeIds.length === 0) {
    return null;
  }

  const recipes = await fetch(
    `${BASE_URL}/recipes?ids=${recipeIds.join(",")}`
  ).then((res) => res.json());

  return recipes as GW2Recipe[];
}

export async function fetchRecipesDepth(
  itemId: number,
  depth: number
): Promise<ItemWithRecipe> {
  const initialItem = { itemId: itemId, crafts: [] as ItemWithRecipe[] };
  const allItemIds = new Set<number>();
  allItemIds.add(itemId);

  async function fetchDepth(item: ItemWithRecipe, currentDepth: number) {
    if (allItemIds.has(item.itemId) && currentDepth > 0) {
      return; // Prevent cycles
    }

    allItemIds.add(item.itemId);
    const recipes = await fetchRecipesForItem(item.itemId);
    if (recipes && recipes.length > 0 && currentDepth < depth) {
      for (const recipe of recipes) {
        if (RECIPE_TYPES.has(recipe.type)) {
          const subItem: ItemWithRecipe = {
            itemId: recipe.output_item_id,
            crafts: [],
          };
          item.crafts.push(subItem);
          await fetchDepth(subItem, currentDepth + 1);
        }
      }
    }
  }

  await fetchDepth(initialItem, 0);

  const itemsData = await fetchGW2Items(Array.from(allItemIds));
  const itemsListings = await fetchGW2ItemsListings(Array.from(allItemIds));

  //recurse through the initialItem and assign the item data
  function assignItemData(item: ItemWithRecipe) {
    item.item = itemsData.find((i) => i.id === item.itemId) || undefined;
    item.itemListing = itemsListings[item.itemId] || undefined;
    for (const craft of item.crafts) {
      assignItemData(craft);
    }
  }
  assignItemData(initialItem);
  return initialItem;
}

const RECIPE_TYPES = new Set([
  "Dessert",
  "Feast",
  "IngredientCooking",
  "Meal",
  "Seasoning",
  "Snack",
  "Soup",
  "Food",
  "Component",
  "Inscription",
  "Insignia",
  "LegendaryComponent",
  "Refinement",
  "RefinementEctoplasm",
  "RefinementObsidian",
]);
