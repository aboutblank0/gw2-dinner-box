//TODO: Refactor this entire file to be honest. too bulky and does a lot of logic it shouldn't
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

//TODO: Fix so that when the list of ids exceeds the URL length limit, it splits into multiple requests.
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

export async function fetchRecipesDepth(
  usedInRecipes: Record<number, GW2Recipe[]>,
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
    const recipes = usedInRecipes[item.itemId];

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

export async function fetchAllRecipes(): Promise<Record<number, GW2Recipe>> {
  const url = "https://api.datawars2.ie/gw2/v2/recipes";

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch all GW2 recipes: ${response.statusText}`);
  }
  const data: GW2Recipe[] = await response.json();

  const recipesMap: Record<number, GW2Recipe> = {};
  data.forEach((recipe) => {
    recipesMap[recipe.id] = recipe;
  });
  return recipesMap;
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
