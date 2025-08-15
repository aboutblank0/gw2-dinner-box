import { useEffect, useState } from "react";
import { Material, PhilosopherStone } from "./constants/materials";
import { fetchGW2Items, fetchGW2ItemsListings, type GW2Item } from "./api/gw2";
import { FangRecipe, type MaterialRecipe } from "./constants/recipes";
import GW2ItemDisplay from "./components/GW2ItemDisplay";

function App() {
  const [items, setItems] = useState<Record<number, GW2Item>>({});
  const [prices, setPrices] = useState<Record<number, number>>({});

  const allMaterialIds = Object.values(Material)
    .flatMap((tiers) => Object.values(tiers))
    .map((item) => item.id);
  allMaterialIds.push(PhilosopherStone.id);

  useEffect(() => {
    async function fetchItems() {
      try {
        const items = await fetchGW2Items(allMaterialIds);
        const itemsMap: Record<number, GW2Item> = Object.fromEntries(
          items.map((item) => [item.id, item])
        );

        setItems(itemsMap);
      } catch (error) {
        console.error("Error fetching GW2 items:", error);
      }
    }

    async function fetchPrices() {
      try {
        const prices = await fetchGW2ItemsListings(allMaterialIds);
        setPrices(prices);
      } catch (error) {
        console.error("Error fetching GW2 item prices:", error);
      }
    }

    fetchItems();
    fetchPrices();
  }, []);

  return (
    <div className='p-8'>
      <RecipeDisplay items={items} />
      <MaterialDisplay items={items} />
    </div>
  );
}

function MaterialDisplay({ items }: { items: Record<number, GW2Item> }) {
  return (
    <div className='flex flex-col flex-wrap gap-8'>
      {Object.entries(Material).map(([type, tiers]) => (
        <div key={type} className='flex flex-col'>
          <h3 className='text-lg font-semibold'>{type}</h3>
          {Object.entries(tiers).map(([tier, item]) => (
            <div key={tier} className='flex items-center gap-2 mt-1'>
              <GW2ItemDisplay item={items[item.id]} />
              <span>
                <strong>{tier}</strong>: {item.name} (ID: {item.id})
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function RecipeDisplay({ items }: { items: Record<number, GW2Item> }) {
  const recipes = [];
  recipes.push(FangRecipe);

  return (
    <div className='overflow-x-auto'>
      <table className='min-w-full divide-y divide-gray-200'>
        <thead className='bg-gray-50'>
          <tr>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Recipe Name
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Ingredients
            </th>
          </tr>
        </thead>
        <tbody className='bg-white divide-y divide-gray-200'>
          {recipes.map((recipe, index) => (
            <RecipeRow key={index} recipe={recipe} items={items} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface RecipeRowProps {
  items: Record<number, GW2Item>;
  recipe: MaterialRecipe;
}

function RecipeRow({ recipe, items }: RecipeRowProps) {
  return (
    <tr>
      <td className='px-6 py-4 whitespace-nowrap'>{recipe.name}</td>
      <td className='px-6 py-4 whitespace-nowrap'>
        {recipe.ingredients.map((ing) => {
          const item = items[ing.materialId];
          return <GW2ItemDisplay item={item} amount={ing.quantity} />;
        })}
      </td>
      <td className='px-6 py-4 whitespace-nowrap'>
        <span>Output:</span>
        <GW2ItemDisplay
          item={items[recipe.output.materialId]}
          amount={recipe.output.quantity}
        />
      </td>
    </tr>
  );
}

export default App;
