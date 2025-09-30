import type { GW2Currency } from "../api/gw2";

interface GW2CurrencyDisplayProps {
  currency?: GW2Currency;
  amount?: number;
  showAmount?: boolean;
}
export default function GW2CurrencyDisplay({
  currency,
  amount,
  showAmount,
}: GW2CurrencyDisplayProps) {
  if (!currency) return null;

  return (
    <div className='relative inline-block group'>
      <img src={currency.icon} alt={currency.name} width={32} height={32} />
      {showAmount && (
        <span className='absolute bottom-0 right-0 bg-black/70 text-white text-xs px-1 rounded'>
          {amount}
        </span>
      )}
    </div>
  );
}
