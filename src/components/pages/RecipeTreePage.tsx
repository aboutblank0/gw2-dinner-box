import { useState } from "react";
import { LoadingSpinner } from "../LoadingSpinner";
import GW2ItemDisplay from "../GW2ItemDisplay";
import GW2PriceDisplay from "../GW2PriceDisplay";
import { buildItemTree } from "../../util/itemTreeUtil";
import type { ItemTree } from "../../util/itemTreeUtil";
import { useGlobalContext } from "../contexts/GlobalContext";
import PriceTypeSelector from "../PriceTypeSelector";
import { useRecipeTreeContext } from "../contexts/RecipeTreeContext";

export function RecipeTreePage() {
  const { allItemsWithListings } = useGlobalContext();
  const { usedInRecipes } = useRecipeTreeContext();

  const {
    ingredientPriceType,
    setIngredientPriceType,
    resultPriceType,
    setResultPriceType,
  } = useGlobalContext();

  const [searchTerm, setSearchTerm] = useState("");
  const [searching, setSearching] = useState(false);
  const [itemWithRecipes, setItemWithRecipes] = useState<ItemTree | undefined>(
    undefined
  );

  const handleSearch = async () => {
    setSearching(true);

    const recipesWithDepth = await buildItemTree(
      allItemsWithListings ?? {},
      usedInRecipes ?? {},
      parseInt(searchTerm)
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
        </div>
      </div>
      <div>
        <h1 className='text-2xl font-bold mb-4'>Recipe Tree</h1>
        {searching ? (
          <LoadingSpinner />
        ) : (
          <>
            <input
              type='text'
              placeholder='Search for an item by id...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='border p-2 w-full mb-4'
            />
            <button
              className='bg-blue-500 text-white px-4 py-2 rounded'
              onClick={handleSearch}
            >
              Search
            </button>

            <div className='m-8'>
              {itemWithRecipes && <ItemTree item={itemWithRecipes} />}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

type ItemTreeProps = {
  item: ItemTree;
  depth?: number;
};

function ItemTree({ item, depth = 0 }: ItemTreeProps) {
  const [expanded, setExpanded] = useState(true);

  const printInformation = (item: ItemTree) => () => {
    console.log("Item ID:", item.itemId);
    console.log("Item type:", item.item?.type ?? "Unknown");
    console.log("From Recipe:", item.fromRecipe);
    console.log("Full item data:", item.item);
  };

  return (
    <div className='ml-4'>
      <div
        onClick={() => item.crafts.length > 0 && setExpanded((prev) => !prev)}
        className={`flex items-center space-x-2 ${
          item.crafts.length > 0 ? "cursor-pointer" : ""
        }`}
      >
        {item.item && <GW2ItemDisplay item={item.item} showAmount={false} />}
        {item.item && <span>{item.item.name}</span>}
        {item.buy_price && <GW2PriceDisplay price={item.buy_price} />}

        <button
          className='rounded border-2 border-black text-sm'
          onClick={printInformation(item)}
        >
          Print information
        </button>
      </div>

      {expanded && item.crafts.length > 0 && (
        <div className='pl-4 border-l border-gray-300'>
          {item.crafts.map((craft) => (
            <ItemTree
              key={craft.fromRecipe.id + "-" + craft.itemId}
              item={craft}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
