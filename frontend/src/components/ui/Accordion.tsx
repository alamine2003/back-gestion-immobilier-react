import React, { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  disabled?: boolean;
}

interface AccordionProps {
  items: AccordionItem[];
  defaultOpen?: string;
  className?: string;
}

const Accordion: React.FC<AccordionProps> = ({
  items,
  defaultOpen,
  className = ''
}) => {
  const [openItem, setOpenItem] = useState<string | undefined>(defaultOpen);

  const toggleItem = (id: string) => {
    setOpenItem(openItem === id ? undefined : id);
  };

  return (
    <div className={`divide-y divide-gray-200 ${className}`}>
      {items.map((item) => {
        const isOpen = openItem === item.id;
        return (
          <div key={item.id}>
            <button
              onClick={() => !item.disabled && toggleItem(item.id)}
              className={`
                flex w-full items-center justify-between py-4 text-left
                ${item.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
              `}
              disabled={item.disabled}
            >
              <span className="text-sm font-medium text-gray-900">
                {item.title}
              </span>
              <ChevronDownIcon
                className={`
                  h-5 w-5 text-gray-500 transform transition-transform duration-200
                  ${isOpen ? 'rotate-180' : ''}
                `}
              />
            </button>
            <div
              className={`
                overflow-hidden transition-all duration-200 ease-in-out
                ${isOpen ? 'max-h-96' : 'max-h-0'}
              `}
            >
              <div className="pb-4">
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Accordion; 