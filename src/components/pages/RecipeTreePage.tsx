import { useState } from "react";
import { fetchRecipesDepth, type ItemWithRecipe } from "../../api/gw2";
import { LoadingSpinner } from "../LoadingSpinner";
import GW2ItemDisplay from "../GW2ItemDisplay";
import GW2PriceDisplay from "../GW2PriceDisplay";
import { useGlobalContext } from "../GlobalContext";

export function RecipeTreePage() {
  const { usedInRecipes } = useGlobalContext();

  const [searchTerm, setSearchTerm] = useState("");
  const [searching, setSearching] = useState(false);
  const [itemWithRecipes, setItemWithRecipes] = useState<
    ItemWithRecipe | undefined
  >(undefined);

  const handleSearch = async () => {
    setSearching(true);

    // const itemBeingSearched = await fetchGW2Items([parseInt(searchTerm)]);

    const recipesWithDepth = await fetchRecipesDepth(
      usedInRecipes ?? {},
      parseInt(searchTerm),
      Infinity
    );
    setItemWithRecipes(recipesWithDepth);
    setSearching(false);
  };

  if (searching) {
    return (
      <div className='p-4'>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Recipe Tree</h1>
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
        <ItemTree item={itemWithRecipes ?? { itemId: 0, crafts: [] }} />
      </div>
    </div>
  );
}

type ItemProps = {
  item: ItemWithRecipe;
  depth?: number;
};

function ItemTree({ item, depth = 0 }: ItemProps) {
  const [expanded, setExpanded] = useState(true);

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
        {item.itemListing && (
          <GW2PriceDisplay
            price={item.itemListing.buys?.[0]?.unit_price ?? -Infinity}
          />
        )}
      </div>

      {expanded && item.crafts.length > 0 && (
        <div className='pl-4 border-l border-gray-300'>
          {item.crafts.map((craft) => (
            <ItemTree key={craft.itemId} item={craft} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
