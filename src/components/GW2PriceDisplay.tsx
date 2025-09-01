import GoldCurrency from "./../assets/images/Gold_coin.png";
import SilverCurrency from "./../assets/images/Silver_coin.png";
import CopperCurrency from "./../assets/images/Copper_coin.png";

function GW2PriceDisplay({ price }: { price: number }) {
  const gold = Math.floor(price / 10000);
  const silver = Math.floor((price % 10000) / 100);
  const copper = parseFloat((price % 100).toFixed(0));

  return (
    <div className='flex items-center'>
      {gold > 0 && (
        <>
          <img src={GoldCurrency} alt='Gold' className='w-4 h-4 mr-1' />
          <span>{gold}g</span>
        </>
      )}
      {silver > 0 && (
        <>
          <img src={SilverCurrency} alt='Silver' className='w-4 h-4 mx-1' />
          <span>{silver}s</span>
        </>
      )}
      {(copper > 0 || (gold === 0 && silver === 0)) && (
        <>
          <img src={CopperCurrency} alt='Copper' className='w-4 h-4 mx-1' />
          <span>{copper}c</span>
        </>
      )}
    </div>
  );
}

export default GW2PriceDisplay;
