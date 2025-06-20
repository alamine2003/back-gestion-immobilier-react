import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showPageNumbers?: boolean;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showPageNumbers = true,
  className = ''
}) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <nav
      className={`flex items-center justify-between border-t border-gray-200 px-4 sm:px-0 ${className}`}
      aria-label="Pagination"
    >
      <div className="-mt-px flex w-0 flex-1">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className={`
            inline-flex items-center border-t-2 border-transparent pt-4 pr-1 text-sm font-medium
            ${currentPage === 1
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }
          `}
        >
          <ChevronLeftIcon className="mr-3 h-5 w-5" aria-hidden="true" />
          Précédent
        </button>
      </div>

      {showPageNumbers && (
        <div className="hidden md:flex">
          {getPageNumbers().map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`
                inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium
                ${page === currentPage
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }
              `}
            >
              {page}
            </button>
          ))}
        </div>
      )}

      <div className="-mt-px flex w-0 flex-1 justify-end">
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`
            inline-flex items-center border-t-2 border-transparent pt-4 pl-1 text-sm font-medium
            ${currentPage === totalPages
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }
          `}
        >
          Suivant
          <ChevronRightIcon className="ml-3 h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
};

export default Pagination; 