import {
  autoUpdate,
  flip,
  offset,
  shift,
  useClick,
  useFloating,
  useFocus,
  useInteractions,
} from "@floating-ui/react";
import type { GW2Item } from "../api/gw2";
import { useState } from "react";

interface GW2ItemDisplayProps {
  item?: GW2Item;
  amount?: number;
  showAmount?: boolean;
}

function GW2ItemDisplay({
  item,
  amount = 1,
  showAmount = true,
}: GW2ItemDisplayProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(10), flip(), shift()], //Adjustsments to keep it in viewport/never obstructed
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const focus = useFocus(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    focus,
  ]);

  if (!item) return <img src='' alt='Missing item' />;

  const openInWiki = () => {
    const wikiUrl = `https://wiki.guildwars2.com/wiki/${encodeURIComponent(
      item.name
    )}`;
    window.open(wikiUrl, "_blank");
  };

  const openInGW2Efficiency = () => {
    const gweUrl = `https://gw2efficiency.com/crafting/calculator/a~0!b~1!c~0!d~1-${encodeURIComponent(
      item.id
    )}!e~0`;
    window.open(gweUrl, "_blank");
  };

  const openInGW2BLTC = () => {
    const bltcUrl = `https://www.gw2bltc.com/item/${encodeURIComponent(
      item.id
    )}`;
    window.open(bltcUrl, "_blank");
  };

  return (
    <div
      ref={refs.setReference}
      onClick={(e) => e.preventDefault()}
      className='relative inline-block group'
      {...getReferenceProps()}
    >
      <img src={item.icon} alt={item.name} width={32} height={32} />
      {showAmount && (
        <span className='absolute bottom-0 right-0 bg-black/70 text-white text-xs px-1 rounded'>
          {amount}
        </span>
      )}
      {isOpen && (
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps()}
          className='z-10 shadow-lg flex flex-col min-w-64 drop-shadow-2xl border-1 p2 rounded'
        >
          <span className='px-2 font-bold bg-gray-400 rounded-t'>
            {item.name} ({item.id})
          </span>

          <button
            onClick={openInWiki}
            className='bg-white rounded-b hover:bg-gray-200 transition-all'
          >
            Open in Wiki
          </button>
          <button
            onClick={openInGW2Efficiency}
            className='bg-white rounded-b hover:bg-gray-200 transition-all'
          >
            Open in GW2Efficiency
          </button>
          <button
            onClick={openInGW2BLTC}
            className='bg-white rounded-b hover:bg-gray-200 transition-all'
          >
            Open in GW2BLTC
          </button>
        </div>
      )}
    </div>
  );
}

export default GW2ItemDisplay;
