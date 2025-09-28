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
        // Some items have weirdly large IDs (not sure why), ignore them
        if (recipe.output_item_id > 1000000) continue;

        //Add material IDs to the set so we can also get their image, etc
        for (const ing of recipe.ingredients) {
          allItemIds.add(ing.id);
        }

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

  function assignItemPrices(item: ItemTree) {
    item.buy_price = allItemsWithListings[item.itemId]?.buy_price ?? undefined;
    item.sell_price =
      allItemsWithListings[item.itemId]?.sell_price ?? undefined;
    for (const craft of item.crafts) {
      assignItemPrices(craft);
    }
  }
  assignItemPrices(initialItem);

  // Filter out non-tradable paths from the tree
  function filterNonTradablePaths(item: ItemTree): boolean {
    if (item.crafts.length === 0) {
      // Leaf node: check if it's tradable (has buy/sell price)
      return item.buy_price !== undefined || item.sell_price !== undefined;
    }

    // Recursively filter crafts
    item.crafts = item.crafts.filter((craft) => filterNonTradablePaths(craft));

    // Keep this node if it has any tradable crafts left
    return (
      item.crafts.length > 0 ||
      item.buy_price !== undefined ||
      item.sell_price !== undefined
    );
  }
  filterNonTradablePaths(initialItem);

  const filteredItemIds = new Set<number>();
  function collectFilteredItemIds(item: ItemTree) {
    filteredItemIds.add(item.itemId);

    //TODO: Currently this would just be ignored
    // Need to somehow extract all of the items out so they can be displayed later in a recipe

    // //Also add ingredient IDs from the recipe, since we want to display them at one point.
    // for (const ing of item.fromRecipe.ingredients) {
    //   filteredItemIds.add(ing.id);
    // }

    for (const craft of item.crafts) {
      collectFilteredItemIds(craft);
    }
  }
  collectFilteredItemIds(initialItem);

  //fetch the item data for all items in the filtered tree
  const itemsData = await fetchGW2Items(Array.from(filteredItemIds));

  //recurse through the initialItem and assign the item data
  function assignItemData(item: ItemTree) {
    item.item = itemsData[item.itemId] || undefined;
    for (const craft of item.crafts) {
      assignItemData(craft);
    }
  }

  assignItemData(initialItem);
  return initialItem;
}
