import { useState } from "react";
import GW2ItemDisplay from "../GW2ItemDisplay";
import {
  fetchGW2Items,
  fetchRecipesForItem,
  type GW2Item,
} from "../../api/gw2";
import { LoadingSpinner } from "../LoadingSpinner";

export function RecipeTreePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searching, setSearching] = useState(false);
  const [item, setItem] = useState<GW2Item | undefined>(undefined);
  const [outputs, setOutputs] = useState<GW2Item[]>([]);

  const handleSearch = async () => {
    setSearching(true);

    const items = await fetchGW2Items([parseInt(searchTerm)]);
    setItem(items[0]);

    const recipes = await fetchRecipesForItem(parseInt(searchTerm));
    const outputItemIds =
      recipes?.flatMap((recipe) => recipe.output_item_id) || [];

    const outputItems = await fetchGW2Items(outputItemIds);
    setOutputs(outputItems);

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

      <div className='mt-4'>
        {item && <GW2ItemDisplay item={item} showAmount={false} />}
      </div>

      <div className='mt-4'>
        {outputs.length > 0 && (
          <>
            <h2 className='text-xl font-semibold mb-2'>Output Items:</h2>
            <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4'>
              {outputs.map((output) => (
                <GW2ItemDisplay key={output.id} item={output} amount={1} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
