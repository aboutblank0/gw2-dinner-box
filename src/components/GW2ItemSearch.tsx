import { useMemo, useState, useRef, useEffect } from "react";
import { useGlobalContext } from "./contexts/GlobalContext";
import {
  autoUpdate,
  flip,
  shift,
  useFloating,
  useFocus,
  useInteractions,
} from "@floating-ui/react";

type Option = {
  name: string;
  item_id: number;
};

interface GW2ItemSearchProps {
  onItemSelect?: (itemId: number) => void;
  debounceTime?: number;
}

export default function GW2ItemSearch({
  onItemSelect,
  debounceTime = 300,
}: GW2ItemSearchProps) {
  const { itemMap, fetchItems, allItemsWithListings } = useGlobalContext();
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [matchedOptions, setMatchedOptions] = useState<Option[]>([]);
  const [icons, setIcons] = useState<Record<number, string>>({});
  const debounceTimeout = useRef<number | null>(null);

  const { refs, floatingStyles, context } = useFloating({
    open: showDropdown,
    onOpenChange: setShowDropdown,
    middleware: [flip(), shift()], //Adjustsments to keep it in viewport/never obstructed
    whileElementsMounted: autoUpdate,
  });

  const focus = useFocus(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([focus]);

  const options: Option[] = useMemo(() => {
    if (!allItemsWithListings) return [];
    const allOptions: Option[] = [];

    // create options from item map
    for (const [id, item] of Object.entries(allItemsWithListings)) {
      allOptions.push({ name: item.name, item_id: Number(id) });
    }
    // create options from itemMap for items not in allItemsWithListings
    for (const [id, item] of Object.entries(itemMap)) {
      if (!allItemsWithListings[Number(id)]) {
        allOptions.push({ name: item.name, item_id: Number(id) });
      }
    }
    return allOptions;
  }, [allItemsWithListings, itemMap]);

  // Fetch items whenever matchedOptions changes
  useEffect(() => {
    if (matchedOptions.length === 0) return;

    const itemIds = matchedOptions.map((option) => option.item_id);
    fetchItems(itemIds);
  }, [matchedOptions]);

  //Assign icons whenever itemMap updates from the above call
  useEffect(() => {
    const newIcons = {} as Record<number, string>;
    for (const [id, item] of Object.entries(itemMap)) {
      const iconUrl = item.icon;
      newIcons[Number(id)] = iconUrl;
    }
    setIcons(newIcons);
  }, [itemMap]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    if (e.target.value.trim() === "") {
      setMatchedOptions([]);
      setShowDropdown(false);
      return;
    }

    debounceTimeout.current = window.setTimeout(() => {
      const lowerQuery = e.target.value.toLowerCase();
      const matchingOptions = options.filter((option) =>
        option.name.toLowerCase().includes(lowerQuery)
      );
      const filteredOptions = matchingOptions.slice(0, 10);

      setMatchedOptions(filteredOptions);
      setShowDropdown(filteredOptions.length > 0);
    }, debounceTime);
  };

  const onSelect = (option: Option) => {
    if (onItemSelect) onItemSelect(option.item_id);
    setShowDropdown(false);
    setQuery(option.name);
  };

  return (
    <div>
      <input
        ref={refs.setReference}
        value={query}
        onChange={onChange}
        className='border p-2 w-128 mb-4'
        placeholder='Item name...'
        {...getReferenceProps()}
      />
      {showDropdown && matchedOptions.length > 0 && (
        <ul
          ref={refs.setFloating}
          className='bg-white z-10 shadow-lg flex w-128 flex-col border-1 p2 rounded'
          style={floatingStyles}
          {...getFloatingProps()}
        >
          {matchedOptions.map((option) => (
            <li
              key={option.item_id}
              className='hover:bg-gray-100 cursor-pointer'
              onClick={() => onSelect(option)}
            >
              {icons[option.item_id] ? (
                <img
                  src={icons[option.item_id]}
                  alt={option.name}
                  width={32}
                  height={32}
                  className='inline-block mr-2'
                />
              ) : null}
              {option.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
