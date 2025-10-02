import { PhilosopherStone } from "../constants/materials";
import { type MaterialRecipe } from "../constants/recipes";
import { getPriceByType } from "../util/marketUtil";
import { useGlobalContext } from "./contexts/GlobalContext";
import { useMaterialPromotionContext } from "./contexts/MaterialPromotionPageContext";
import GW2ItemDisplay from "./GW2ItemDisplay";
import GW2PriceDisplay from "./GW2PriceDisplay";

interface RecipeTableProps {
  recipes: MaterialRecipe[];
}

export function RecipeTable({ recipes }: RecipeTableProps) {
  const headers = [
    "Ingredients",
    "Output",
    "Total Ingredient Cost",
    "Resulting Sale Price",
    "Profit (After Tax)",
    "Profit per shard (After tax)",
  ];

  return (
    <div className='overflow-x-auto'>
      <table className='min-w-full divide-y divide-gray-200'>
        <thead className='bg-gray-50'>
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                className='px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className='bg-white divide-y divide-gray-200'>
          {recipes.map((recipe, index) => (
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
  const { itemMap, ingredientPriceType, resultPriceType } = useGlobalContext();
  const { prices } = useMaterialPromotionContext();

  if (!itemMap || !prices) return null;

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

  let totalRevenueAfterTax = totalRevenue;
  if (resultPriceType === "sells") {
    // 15% tax (10% listing fee + 5% TP tax)
    totalRevenueAfterTax = totalRevenue * 0.85;
  } else {
    // 5% TP tax
    totalRevenueAfterTax = totalRevenue * 0.95;
  }

  const totalProfit = totalRevenueAfterTax - totalPrice;

  //1 spirit shard = 10 philosophers stones
  const profitPerShard = philosophersUsed
    ? totalProfit / (philosophersUsed / 10)
    : totalProfit;

  return (
    <tr>
      <td className='px-6 py-4 whitespace-nowrap flex flex-row'>
        {recipe.ingredients.map((ing) => {
          const item = itemMap[ing.materialId];
          if (!item) return null;
          return (
            <GW2ItemDisplay key={item.id} item={item} amount={ing.quantity} />
          );
        })}
      </td>
      <td className='px-6 py-4 whitespace-nowrap'>
        <GW2ItemDisplay
          item={itemMap[recipe.output.materialId]}
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
