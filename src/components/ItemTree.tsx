import { useState } from "react";
import type { ItemTree } from "../util/itemTreeUtil";
import GW2ItemDisplay from "./GW2ItemDisplay";
import GW2PriceDisplay from "./GW2PriceDisplay";
import RecipeDisplay from "./RecipeDisplay";

type ItemTreeProps = {
  item: ItemTree;
  depth?: number;
};

export default function ItemTreeDisplay({ item, depth = 0 }: ItemTreeProps) {
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
        // onClick={() => item.crafts.length > 0 && setExpanded((prev) => !prev)}
        className={`flex items-center gap-2 ${
          item.crafts.length > 0 ? "cursor-pointer" : ""
        }`}
      >
        {item.item && <GW2ItemDisplay item={item.item} showAmount={false} />}
        {item.item && <span>{item.item.name}</span>}
        {item.buy_price && <GW2PriceDisplay price={item.buy_price} />}

        <RecipeDisplay recipe={item.fromRecipe} />

        <div
          className='rounded border-2 border-black text-sm'
          onClick={printInformation(item)}
        >
          Info
        </div>
      </div>

      {expanded && item.crafts.length > 0 && (
        <div className='pl-4 border-l border-gray-300'>
          {item.crafts.map((craft) => (
            <ItemTreeDisplay
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
