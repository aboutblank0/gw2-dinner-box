import {
  fetchGW2Items,
  fetchGW2ItemsListings,
  type GW2Item,
  type GW2ItemListing,
  type GW2Recipe,
} from "../api/gw2";

export type ItemTree = {
  itemId: number;
  crafts: ItemTree[];
  fromRecipe: GW2Recipe;

  item?: GW2Item;
  itemListing?: GW2ItemListing;
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

export async function fetchRecipesDepth(
  usedInRecipes: Record<number, GW2Recipe[]>,
  itemId: number,
  depth: number
): Promise<ItemTree> {
  const initialItem = {
    itemId: itemId,
    crafts: [] as ItemTree[],
    fromRecipe: {} as GW2Recipe,
  };
  const allItemIds = new Set<number>();
  allItemIds.add(itemId);

  async function fetchDepth(item: ItemTree, currentDepth: number) {
    if (allItemIds.has(item.itemId) && currentDepth > 0) {
      return; // Prevent cycles
    }

    allItemIds.add(item.itemId);
    const recipes = usedInRecipes[item.itemId];

    if (recipes && recipes.length > 0 && currentDepth < depth) {
      for (const recipe of recipes) {
        if (RECIPE_TYPES.has(recipe.type)) {
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
  }

  await fetchDepth(initialItem, 0);

  const itemsData = await fetchGW2Items(Array.from(allItemIds));
  const itemsListings = await fetchGW2ItemsListings(Array.from(allItemIds));

  //recurse through the initialItem and assign the item data
  function assignItemData(item: ItemTree) {
    item.item = itemsData[item.itemId] || undefined;
    item.itemListing = itemsListings[item.itemId] || undefined;
    for (const craft of item.crafts) {
      assignItemData(craft);
    }
  }
  assignItemData(initialItem);
  return initialItem;
}
