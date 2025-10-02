import { useRef, useState } from "react";
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
    fetchItems,
    ingredientPriceType,
    setIngredientPriceType,
    resultPriceType,
    setResultPriceType,
  } = useGlobalContext();

  const [searching, setSearching] = useState(false);
  const [showUntradeable, setShowUntradeable] = useState(false);
  const [itemTree, setItemTree] = useState<ItemTree | undefined>(undefined);

  const searchItem = async (itemId: number) => {
    if (searching) return;
    setSearching(true);

    const itemTree = await buildItemTree(
      allItemsWithListings ?? {},
      usedInRecipes ?? {},
      itemId,
      fetchItems,
      !showUntradeable
    );

    setItemTree(itemTree);
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
          <div className='inline-block mr-4'>
            <div className='bg-gray-400 w-full p-1 rounded-t'>
              Show Untradeable ?
            </div>
            <div className='flex flex-col gap-2 bg-gray-200 p-2 rounded-b'>
              <label>
                <input
                  className='bg-red-200 rounded-r p-1 ml-1 mr-1'
                  type='checkbox'
                  checked={showUntradeable}
                  onChange={() => setShowUntradeable(!showUntradeable)}
                />
                (may be much slower)
              </label>
            </div>
          </div>
          <p>TODO: Add a feature to estimate price of account bound item</p>
        </div>
      </div>
      <div className='p-4 w-full'>
        <h1 className='text-2xl font-bold mb-4'>Recipe Tree</h1>
        <GW2ItemSearch onItemSelect={searchItem} />
        {searching ? (
          <LoadingSpinner />
        ) : (
          <div className='m-8'>
            {itemTree && <ItemTreeDisplay item={itemTree} />}
          </div>
        )}
      </div>
    </div>
  );
}
