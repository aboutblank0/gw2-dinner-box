import { useMemo, useState, useRef, useEffect } from "react";
import { useGlobalContext } from "./contexts/GlobalContext";
import { fetchGW2Items } from "../api/gw2";
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
  icon?: string;
};

interface GW2ItemSearchProps {
  onItemSelect?: (itemId: number) => void;
  debounceTime?: number;
}

export default function GW2ItemSearch({
  onItemSelect,
  debounceTime = 300,
}: GW2ItemSearchProps) {
  const { allItemsWithListings } = useGlobalContext();
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [matchedOptions, setMatchedOptions] = useState<Option[]>([]);
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
    return Object.values(allItemsWithListings).map((item) => ({
      name: item.name,
      item_id: item.id,
    }));
  }, [allItemsWithListings]);

  // ✅ Fetch item icons whenever matchedOptions changes
  useEffect(() => {
    if (matchedOptions.length === 0) return;

    let isCancelled = false;

    async function fetchIcons() {
      const itemIds = matchedOptions.map((option) => option.item_id);
      const itemData = await fetchGW2Items(itemIds);

      if (isCancelled) return;

      setMatchedOptions((prevOptions) =>
        prevOptions.map((option) => {
          const item = itemData[option.item_id];
          return item ? { ...option, icon: item.icon } : option;
        })
      );
    }

    fetchIcons();

    return () => {
      isCancelled = true;
    };
  }, [matchedOptions]);

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
    console.log("setting query to", option.name);
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
          className='z-10 shadow-lg flex w-128 flex-col border-1 p2 rounded'
          style={floatingStyles}
          {...getFloatingProps()}
        >
          {matchedOptions.map((option) => (
            <li
              key={option.item_id}
              className='hover:bg-gray-100 cursor-pointer'
              onClick={() => onSelect(option)}
            >
              {option.icon ? (
                <img
                  src={option.icon}
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
