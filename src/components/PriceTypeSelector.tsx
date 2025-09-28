import type { PriceType } from "../util/marketUtil";

export default function PriceTypeSelector({
  label,
  selected,
  isIngredient,
  onSelect,
}: {
  label: string;
  selected: PriceType;
  isIngredient: boolean;
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
            checked={selected === "sells"}
            onChange={() => onSelect("sells")}
            className='mr-1'
          />
          {isIngredient ? "sells (instant buy)" : "sells (listing)"}
        </label>
        <label>
          <input
            type='radio'
            name={label}
            checked={selected === "buys"}
            onChange={() => onSelect("buys")}
            className='mr-1'
          />
          {isIngredient ? "buys (listing)" : "buys (instant sell)"}
        </label>
      </div>
    </div>
  );
}
