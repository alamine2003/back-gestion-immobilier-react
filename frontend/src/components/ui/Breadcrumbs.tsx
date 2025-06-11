import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';

interface BreadcrumbItem {
  name: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  showHomeIcon?: boolean;
  className?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  showHomeIcon = true,
  className = ''
}) => {
  return (
    <nav className={`flex ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-4">
        {showHomeIcon && (
          <li>
            <div>
              <Link
                to="/"
                className="text-gray-400 hover:text-gray-500"
              >
                <HomeIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                <span className="sr-only">Accueil</span>
              </Link>
            </div>
          </li>
        )}
        {items.map((item, index) => (
          <li key={item.name}>
            <div className="flex items-center">
              {index > 0 && (
                <ChevronRightIcon
                  className="h-5 w-5 flex-shrink-0 text-gray-400"
                  aria-hidden="true"
                />
              )}
              {item.href ? (
                <Link
                  to={item.href}
                  className={`
                    ml-4 text-sm font-medium
                    ${item.current
                      ? 'text-gray-500'
                      : 'text-gray-500 hover:text-gray-700'
                    }
                  `}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                </Link>
              ) : (
                <span
                  className={`
                    ml-4 text-sm font-medium
                    ${item.current
                      ? 'text-gray-500'
                      : 'text-gray-500'
                    }
                  `}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                </span>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs; 