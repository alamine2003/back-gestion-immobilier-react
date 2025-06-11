import React from 'react';
import Card from '../ui/Card';
import { 
  UserGroupIcon, 
  BuildingOfficeIcon, 
  DocumentTextIcon,
  ChartBarIcon 
} from '@heroicons/react/24/outline';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  change?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, change }) => {
  return (
    <Card className="p-6">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <Icon className="h-8 w-8 text-primary-600" aria-hidden="true" />
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd>
              <div className="text-lg font-medium text-gray-900">{value}</div>
            </dd>
          </dl>
        </div>
      </div>
      {change && (
        <div className="mt-4">
          <span className={`text-sm font-medium ${
            change.isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            {change.isPositive ? '↑' : '↓'} {Math.abs(change.value)}%
          </span>
          <span className="text-sm text-gray-500 ml-2">vs mois dernier</span>
        </div>
      )}
    </Card>
  );
};

interface DashboardStatsProps {
  stats: {
    totalUsers: number;
    totalCompanies: number;
    totalDocuments: number;
    totalReports: number;
    changes?: {
      users?: number;
      companies?: number;
      documents?: number;
      reports?: number;
    };
  };
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Utilisateurs"
        value={stats.totalUsers}
        icon={UserGroupIcon}
        change={stats.changes?.users ? {
          value: stats.changes.users,
          isPositive: stats.changes.users > 0
        } : undefined}
      />
      <StatCard
        title="Entreprises"
        value={stats.totalCompanies}
        icon={BuildingOfficeIcon}
        change={stats.changes?.companies ? {
          value: stats.changes.companies,
          isPositive: stats.changes.companies > 0
        } : undefined}
      />
      <StatCard
        title="Documents"
        value={stats.totalDocuments}
        icon={DocumentTextIcon}
        change={stats.changes?.documents ? {
          value: stats.changes.documents,
          isPositive: stats.changes.documents > 0
        } : undefined}
      />
      <StatCard
        title="Rapports"
        value={stats.totalReports}
        icon={ChartBarIcon}
        change={stats.changes?.reports ? {
          value: stats.changes.reports,
          isPositive: stats.changes.reports > 0
        } : undefined}
      />
    </div>
  );
};

export default DashboardStats; 