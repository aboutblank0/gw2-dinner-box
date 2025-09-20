import { useState, type ReactElement } from "react";

export type CollapsibleChild = {
  title: string;
  content: ReactElement;
};

interface CollapseGroupProps {
  children: CollapsibleChild | CollapsibleChild[];
  onlyOneOpen?: boolean;
}

export function CollapseGroup({
  children: collapsibles,
  onlyOneOpen,
}: CollapseGroupProps) {
  const childrenArray = Array.isArray(collapsibles)
    ? collapsibles
    : [collapsibles];
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggle = (index: number) => {
    if (onlyOneOpen) {
      setOpenItems((prev) => (prev.includes(index) ? [] : [index]));
    } else {
      setOpenItems((prev) =>
        prev.includes(index)
          ? prev.filter((i) => i !== index)
          : [...prev, index]
      );
    }
  };

  return (
    <div className='space-y-4'>
      {childrenArray.map((child, i) => (
        <div key={i}>
          <button
            onClick={() => toggle(i)}
            className='py-2 px-4 text-center w-full bg-gray-400 rounded'
            type='button'
          >
            {child.title}
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              openItems.includes(i) ? "max-h-screen" : "max-h-0"
            }`}
          >
            <div className='mt-2'>{child.content}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
