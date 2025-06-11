import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

interface BreadcrumbItem {
  name: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  description?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  breadcrumbs = [],
  actions,
  description
}) => {
  return (
    <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-sm text-gray-500">
              {description}
            </p>
          )}
        </div>
      </div>

      {breadcrumbs.length > 0 && (
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-4">
            {breadcrumbs.map((item, index) => (
              <li key={item.name}>
                <div className="flex items-center">
                  {index > 0 && (
                    <ChevronRightIcon className="flex-shrink-0 h-5 w-5 text-gray-400" />
                  )}
                  {item.href ? (
                    <Link
                      to={item.href}
                      className={`${
                        index === 0 ? '' : 'ml-4'
                      } text-sm font-medium text-gray-500 hover:text-gray-700`}
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <span
                      className={`${
                        index === 0 ? '' : 'ml-4'
                      } text-sm font-medium text-gray-500`}
                    >
                      {item.name}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </nav>
      )}

      {actions && (
        <div className="mt-4 sm:mt-0 sm:ml-4">
          {actions}
        </div>
      )}
    </div>
  );
};

export default PageHeader; 