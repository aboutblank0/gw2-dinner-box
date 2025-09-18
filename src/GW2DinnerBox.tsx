import { useState } from "react";
import { useGlobalContext } from "./components/GlobalContext";
import { type PriceType } from "./util/marketUtil";
import { RecipeTable } from "./components/RecipeTable";
import {
  T1toT2Recipes,
  T2toT3Recipes,
  T3toT4Recipes,
  T4toT5Recipes,
  T5toT6Recipes,
} from "./constants/recipes";
import { CollapseGroup } from "./components/CollapseGroup";

function GW2DinnerBox() {
  const {
    updateItemPrices,
    ingredientPriceType,
    resultPriceType,
    setIngredientPriceType,
    setResultPriceType,
  } = useGlobalContext();

  const [marketDepth, setMarketDepth] = useState(100);

  const handleDepthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setMarketDepth(value);
      updateItemPrices(value);
    }
  };

  return (
    <div className='p-8'>
      <div className='mb-8 flex flex-row gap-4'>
        <div>
          <label>Market Depth: </label>
          <input
            className='bg-gray-200 rounded p-1 w-20'
            type='number'
            value={marketDepth}
            onChange={handleDepthChange}
          />
        </div>
        <div>
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
      </div>

      <CollapseGroup children={collapsibleChildren} />
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
    <div className='inline-block mr-4'>
      {label}
      <div className='flex flex-col gap-2'>
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
      </div>
    </div>
  );
}

const collapsibleChildren = [
  {
    title: "Tier 1 to Tier 2 Recipes",
    content: (
      <RecipeTable
        tableName='Tier 1 to Tier 2 Recipes'
        recipes={T1toT2Recipes}
      />
    ),
  },
  {
    title: "Tier 2 to Tier 3 Recipes",
    content: (
      <RecipeTable
        tableName='Tier 2 to Tier 3 Recipes'
        recipes={T2toT3Recipes}
      />
    ),
  },
  {
    title: "Tier 3 to Tier 4 Recipes",
    content: (
      <RecipeTable
        tableName='Tier 3 to Tier 4 Recipes'
        recipes={T3toT4Recipes}
      />
    ),
  },
  {
    title: "Tier 4 to Tier 5 Recipes",
    content: (
      <RecipeTable
        tableName='Tier 4 to Tier 5 Recipes'
        recipes={T4toT5Recipes}
      />
    ),
  },
  {
    title: "Tier 5 to Tier 6 Recipes",
    content: (
      <RecipeTable
        tableName='Tier 5 to Tier 6 Recipes'
        recipes={T5toT6Recipes}
      />
    ),
  },
];
