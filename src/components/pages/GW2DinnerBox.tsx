import { useState } from "react";
import {
  T1toT2Recipes,
  T2toT3Recipes,
  T3toT4Recipes,
  T4toT5Recipes,
  T5toT6Recipes,
} from "../../constants/recipes";
import type { PriceType } from "../../util/marketUtil";
import { CollapseGroup } from "../CollapseGroup";
import { useGlobalContext } from "../GlobalContext";
import { RecipeTable } from "../RecipeTable";

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
    <div className='flex flex-row items-start'>
      <div id='control-bar' className='mb-8 gap-4 min-w-64 sticky top-0'>
        <div className='flex flex-col gap-4 p-4'>
          <div id='market-depth' className='inline-block mr-4'>
            <div className='p-1 rounded-t bg-gray-400 w-full'>
              Market Depth:{" "}
            </div>
            <input
              className='bg-gray-200 rounded-b p-1 w-full'
              type='number'
              value={marketDepth}
              onChange={handleDepthChange}
            />
          </div>
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

      <div className='w-full m-8'>
        <CollapseGroup children={collapsibleChildren} onlyOneOpen={true} />
      </div>
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
      <div className='bg-gray-400 w-full p-1 rounded-t'>{label}</div>
      <div className='flex flex-col gap-2 bg-gray-200 p-2 rounded-b'>
        <label>
          <input
            type='radio'
            name={label}
            value='instant'
            checked={selected === "sells"}
            onChange={() => onSelect("sells")}
            className='mr-1'
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
            className='mr-1'
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
    content: <RecipeTable recipes={T1toT2Recipes} />,
  },
  {
    title: "Tier 2 to Tier 3 Recipes",
    content: <RecipeTable recipes={T2toT3Recipes} />,
  },
  {
    title: "Tier 3 to Tier 4 Recipes",
    content: <RecipeTable recipes={T3toT4Recipes} />,
  },
  {
    title: "Tier 4 to Tier 5 Recipes",
    content: <RecipeTable recipes={T4toT5Recipes} />,
  },
  {
    title: "Tier 5 to Tier 6 Recipes",
    content: <RecipeTable recipes={T5toT6Recipes} />,
  },
];
