import type { GW2Item } from "../api/gw2";

interface GW2ItemDisplayProps {
  item: GW2Item;
  amount?: number;
}

function GW2ItemDisplay({ item, amount = 1 }: GW2ItemDisplayProps) {
  if (!item) return null;

  return (
    <div>
      <div className='relative inline-block group'>
        <img src={item.icon} alt={item.name} width={32} height={32} />
        <span className='absolute bottom-0 right-0 bg-black/70 text-white text-xs px-1 rounded'>
          {amount}
        </span>
        <div className='absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10 shadow-lg'>
          {item.name} ({item.id})
          <br />
        </div>
      </div>
    </div>
  );
}

export default GW2ItemDisplay;
