import { useState, type ReactElement } from "react";

interface CollapsibleGroupProps {
  children: CollapsibleChild | CollapsibleChild[];
}

export type CollapsibleChild = {
  title: string;
  content: ReactElement;
};

export function CollapseGroup({
  children: collapsibles,
}: CollapsibleGroupProps) {
  const childrenArray = Array.isArray(collapsibles)
    ? collapsibles
    : [collapsibles];
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggle = (index: number) => {
    setOpenItems(
      (prev) =>
        prev.includes(index)
          ? prev.filter((i) => i !== index) // close it
          : [...prev, index] // open it
    );
  };

  return (
    <div className='space-y-4'>
      {childrenArray.map((child, i) => (
        <div key={i}>
          <button
            onClick={() => toggle(i)}
            className='rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 active:bg-slate-700'
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
