import {
  fetchGW2Items,
  type GW2Item,
  type ItemWithListing,
  type Recipe,
} from "../api/gw2";

export type ItemTree = {
  itemId: number;
  crafts: ItemTree[];
  fromRecipe: Recipe;

  item?: GW2Item;
  buy_price?: number;
  sell_price?: number;
};

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
  "MysticForge",
]);

export async function buildItemTree(
  allItemsWithListings: Record<number, ItemWithListing>,
  usedInRecipes: Record<number, Recipe[]>,
  itemId: number
): Promise<ItemTree> {
  const initialItem = {
    itemId: itemId,
    crafts: [] as ItemTree[],
    fromRecipe: {} as Recipe,
  };
  const allItemIds = new Set<number>();
  allItemIds.add(itemId);

  async function fetchDepth(item: ItemTree, currentDepth: number) {
    if (allItemIds.has(item.itemId) && currentDepth > 0) {
      return; // Prevent cycles
    }

    allItemIds.add(item.itemId);
    const recipes = usedInRecipes[item.itemId];

    if (recipes && recipes.length > 0) {
      for (const recipe of recipes) {
        const subItem: ItemTree = {
          itemId: recipe.output_item_id,
          fromRecipe: recipe,
          crafts: [],
        };
        item.crafts.push(subItem);
        await fetchDepth(subItem, currentDepth + 1);
      }
    }
  }

  await fetchDepth(initialItem, 0);

  const itemsData = await fetchGW2Items(Array.from(allItemIds));

  //recurse through the initialItem and assign the item data
  function assignItemData(item: ItemTree) {
    if (!itemsData[item.itemId]) {
      console.warn(`Item data not found for item ID: ${item.itemId}`);
    }

    item.item = itemsData[item.itemId] || undefined;
    item.buy_price = allItemsWithListings[item.itemId]?.buy_price;
    item.sell_price = allItemsWithListings[item.itemId]?.sell_price;
    for (const craft of item.crafts) {
      assignItemData(craft);
    }
  }
  assignItemData(initialItem);
  return initialItem;
}
