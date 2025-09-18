import { useState } from "react";
import { useGlobalContext } from "./components/GlobalContext";
import GW2ItemDisplay from "./components/GW2ItemDisplay";
import GW2PriceDisplay from "./components/GW2PriceDisplay";
import { Materials, PhilosopherStone } from "./constants/materials";
import { AllRecipes, type MaterialRecipe } from "./constants/recipes";
import { getPriceByType, type PriceType } from "./util/marketUtil";

function GW2DinnerBox() {
  const {
    updateItemPrices,
    ingredientPriceType,
    resultPriceType,
    setIngredientPriceType,
    setResultPriceType,
    prices,
  } = useGlobalContext();

  const [marketDepth, setMarketDepth] = useState(100);

  const handleDepthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setMarketDepth(value);
      updateItemPrices(value);
    }
  };

  console.log(
    "Sell price for T6 Dust:",
    prices?.[Materials.Dust.T6.id].sellPrice
  );

  console.log(
    "Buy price for T6 Dust:",
    prices?.[Materials.Dust.T6.id].buyPrice
  );

  return (
    <div className='p-8'>
      <div>
        <label>Market Depth: </label>
        <input
          className='bg-gray-200 rounded p-1 w-20'
          type='number'
          value={marketDepth}
          onChange={handleDepthChange}
        />
      </div>
      <div className='flex flex-col gap-4 mb-4'>
        <PriceTypeSelector
          label='Ingredient Price Type: '
          selected={ingredientPriceType}
          onSelect={setIngredientPriceType}
        />
        <PriceTypeSelector
          label='Profit Price Type: '
          selected={resultPriceType}
          onSelect={setResultPriceType}
        />
      </div>

      <RecipeDisplay />
    </div>
  );
}
export default GW2DinnerBox;

function PriceTypeSelector({
  label,
  selected,
  onSelect,
}: {
  label: string;
  selected: PriceType;
  onSelect: (type: PriceType) => void;
}) {
  return (
    <>
      {label}
      <label>
        <input
          type='radio'
          name={label}
          value='instant'
          checked={selected === "sells"}
          onChange={() => onSelect("sells")}
        />
        sells
      </label>
      <label>
        <input
          type='radio'
          name={label}
          value='listing'
          checked={selected === "buys"}
          onChange={() => onSelect("buys")}
        />
        buys
      </label>
    </>
  );
}

function RecipeDisplay() {
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
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Output
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Total Ingredient Cost
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Resulting Sale Price
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Profit (After Tax)
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Profit per shard (After tax)
            </th>
          </tr>
        </thead>
        <tbody className='bg-white divide-y divide-gray-200'>
          {AllRecipes.map((recipe, index) => (
            <RecipeRow key={index} recipe={recipe} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface RecipeRowProps {
  recipe: MaterialRecipe;
}

function RecipeRow({ recipe }: RecipeRowProps) {
  const { items, prices, ingredientPriceType, resultPriceType } =
    useGlobalContext();

  if (!items || !prices) return null;

  //get the total price for buy listing of all ingredients
  const totalPrice = recipe.ingredients.reduce((sum, ing) => {
    if (!prices[ing.materialId]) return sum;

    const price = getPriceByType(prices, ing.materialId, ingredientPriceType);
    return sum + price * ing.quantity;
  }, 0);

  const philosophersUsed = recipe.ingredients.find(
    (ing) => ing.materialId === PhilosopherStone.id
  )?.quantity;

  const totalRevenue =
    getPriceByType(prices, recipe.output.materialId, resultPriceType) *
    recipe.output.quantity;

  const totalProfit = totalRevenue * 0.85 - totalPrice;

  //1 spirit shard = 10 philosophers stones
  const profitPerShard =
    totalProfit / (philosophersUsed ? philosophersUsed / 10 : 1);

  return (
    <tr>
      <td className='px-6 py-4 whitespace-nowrap'>{recipe.name}</td>
      <td className='px-6 py-4 whitespace-nowrap flex flex-row'>
        {recipe.ingredients.map((ing) => {
          const item = items[ing.materialId];
          return (
            <GW2ItemDisplay key={item.id} item={item} amount={ing.quantity} />
          );
        })}
      </td>
      <td className='px-6 py-4 whitespace-nowrap'>
        <GW2ItemDisplay
          item={items[recipe.output.materialId]}
          amount={recipe.output.quantity}
        />
      </td>
      <td className='px-6 py-4 whitespace-nowrap'>
        <GW2PriceDisplay price={totalPrice} />
      </td>
      <td className='px-6 py-4 whitespace-nowrap'>
        <GW2PriceDisplay price={totalRevenue} />
      </td>
      <td className='px-6 py-4 whitespace-nowrap'>
        <GW2PriceDisplay price={totalProfit} />
      </td>
      <td className='px-6 py-4 whitespace-nowrap'>
        <GW2PriceDisplay price={profitPerShard} />
      </td>
    </tr>
  );
}
