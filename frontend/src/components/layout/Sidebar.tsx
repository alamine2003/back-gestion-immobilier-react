import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  UserGroupIcon, 
  BuildingOfficeIcon,
  DocumentTextIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: string[];
}

const navigation: NavItem[] = [
  { 
    name: 'Tableau de bord', 
    path: '/dashboard', 
    icon: HomeIcon,
    roles: ['admin', 'agent']
  },
  { 
    name: 'Utilisateurs', 
    path: '/users', 
    icon: UserGroupIcon,
    roles: ['admin']
  },
  { 
    name: 'Entreprises', 
    path: '/companies', 
    icon: BuildingOfficeIcon,
    roles: ['admin', 'agent']
  },
  { 
    name: 'Documents', 
    path: '/documents', 
    icon: DocumentTextIcon,
    roles: ['admin', 'agent']
  },
  { 
    name: 'Rapports', 
    path: '/reports', 
    icon: ChartBarIcon,
    roles: ['admin']
  },
  { 
    name: 'Paramètres', 
    path: '/settings', 
    icon: Cog6ToothIcon,
    roles: ['admin', 'agent']
  },
];

interface SidebarProps {
  userRole: string;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ userRole, onLogout }) => {
  const location = useLocation();

  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(userRole)
  );

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b border-gray-200">
        <img
          src="/logo.png"
          alt="Logo"
          className="h-8 w-auto"
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-2 py-4">
        {filteredNavigation.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`
                group flex items-center px-2 py-2 text-sm font-medium rounded-md
                ${isActive 
                  ? 'bg-primary-50 text-primary-600' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <item.icon
                className={`
                  mr-3 h-5 w-5 flex-shrink-0
                  ${isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'}
                `}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="border-t border-gray-200 p-4">
        <button
          onClick={onLogout}
          className="group flex w-full items-center px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md"
        >
          <ArrowRightOnRectangleIcon
            className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
            aria-hidden="true"
          />
          Déconnexion
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 