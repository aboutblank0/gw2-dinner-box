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
  item: GW2Item;
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

  if (!item) return null;

  const openInWiki = () => {
    const wikiUrl = `https://wiki.guildwars2.com/wiki/${encodeURIComponent(
      item.name
    )}`;
    window.open(wikiUrl, "_blank");
  };

  return (
    <button
      ref={refs.setReference}
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
          className='z-10 shadow-lg flex flex-col opacity-90 min-w-64'
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
        </div>
      )}
    </button>
  );
}

export default GW2ItemDisplay;
