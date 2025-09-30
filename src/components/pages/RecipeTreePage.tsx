import { useState } from "react";
import { LoadingSpinner } from "../LoadingSpinner";
import { buildItemTree } from "../../util/itemTreeUtil";
import type { ItemTree } from "../../util/itemTreeUtil";
import { useGlobalContext } from "../contexts/GlobalContext";
import PriceTypeSelector from "../PriceTypeSelector";
import { useRecipeTreeContext } from "../contexts/RecipeTreeContext";
import GW2ItemSearch from "../GW2ItemSearch";
import ItemTreeDisplay from "../ItemTree";

export function RecipeTreePage() {
  const { allItemsWithListings } = useGlobalContext();
  const { usedInRecipes } = useRecipeTreeContext();

  const {
    ingredientPriceType,
    setIngredientPriceType,
    resultPriceType,
    setResultPriceType,
  } = useGlobalContext();

  const [searching, setSearching] = useState(false);
  const [itemWithRecipes, setItemWithRecipes] = useState<ItemTree | undefined>(
    undefined
  );

  const searchItem = async (itemId: number) => {
    setSearching(true);

    const recipesWithDepth = await buildItemTree(
      allItemsWithListings ?? {},
      usedInRecipes ?? {},
      itemId
    );
    setItemWithRecipes(recipesWithDepth);
    setSearching(false);
  };

  return (
    <div className='flex flex-row items-start'>
      <div id='control-bar' className='mb-8 gap-4 min-w-64 sticky top-0'>
        <div className='flex flex-col gap-4 p-4'>
          <PriceTypeSelector
            label='Ingredient Price Type: '
            selected={ingredientPriceType}
            isIngredient={true}
            onSelect={setIngredientPriceType}
          />
          <PriceTypeSelector
            label='Profit Price Type: '
            selected={resultPriceType}
            isIngredient={false}
            onSelect={setResultPriceType}
          />
          <p>TODO: Add something here to show/hide untradeable options</p>
          <p>
            TODO: Item search does not have EVERY item. need better source for
            all item/names.
          </p>
        </div>
      </div>
      <div className='p-4 w-full'>
        <h1 className='text-2xl font-bold mb-4'>Recipe Tree</h1>
        <GW2ItemSearch onItemSelect={searchItem} />
        {searching ? (
          <LoadingSpinner />
        ) : (
          <div className='m-8'>
            {itemWithRecipes && <ItemTreeDisplay item={itemWithRecipes} />}
          </div>
        )}
      </div>
    </div>
  );
}
