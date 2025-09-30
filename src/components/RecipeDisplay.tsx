import type { Recipe } from "../api/gw2";
import { useGlobalContext } from "./contexts/GlobalContext";
import GW2CurrencyDisplay from "./GW2CurrencyDisplay";
import GW2ItemDisplay from "./GW2ItemDisplay";

interface RecipeDisplayProps {
  recipe: Recipe;
}
export default function RecipeDisplay({ recipe }: RecipeDisplayProps) {
  const { allCurrencies } = useGlobalContext();

  //Likely the source item
  if (Object.keys(recipe).length === 0) return null;

  if (recipe.disciplines.includes("Achievement"))
    return <span>Achievement</span>;

  if (!recipe.ingredients) {
    console.warn("Recipe has no ingredients", recipe);
    return null;
  }

  return (
    <div className='flex flex-row gap-2'>
      {recipe.disciplines && recipe.disciplines.length > 0 && (
        <span className='italic text-sm'>
          [{recipe.disciplines.join(", ")}]
        </span>
      )}
      {recipe.ingredients.map((ing, index) => {
        return (
          <>
            {ing.type === "Currency" ? (
              <GW2CurrencyDisplay
                currency={allCurrencies[ing.id]}
                amount={ing.count}
                showAmount={true}
              />
            ) : (
              <GW2ItemDisplay
                key={recipe.id}
                item={ing.item}
                amount={ing.count}
              />
            )}
            {index < recipe.ingredients.length - 1 && "+"}
          </>
        );
      })}
    </div>
  );
}
