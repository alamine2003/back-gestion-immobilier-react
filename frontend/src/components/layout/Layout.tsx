import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

interface LayoutProps {
  userRole: string;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ userRole, onLogout }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar userRole={userRole} onLogout={onLogout} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <h1 className="text-2xl font-semibold text-gray-900">
                Tableau de bord
              </h1>
              <div className="flex items-center">
                {/* User profile dropdown can be added here */}
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout; 