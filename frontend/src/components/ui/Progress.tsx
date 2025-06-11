import React from 'react';

interface ProgressProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'success' | 'warning' | 'danger';
  showLabel?: boolean;
  labelPosition?: 'top' | 'bottom';
  className?: string;
}

const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  size = 'md',
  variant = 'primary',
  showLabel = false,
  labelPosition = 'top',
  className = ''
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-4'
  };

  const variantClasses = {
    primary: 'bg-primary-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    danger: 'bg-red-600'
  };

  const label = (
    <div className="flex justify-between text-sm text-gray-600 mb-1">
      <span>Progression</span>
      <span>{Math.round(percentage)}%</span>
    </div>
  );

  return (
    <div className={className}>
      {showLabel && labelPosition === 'top' && label}
      <div className="w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`
            ${sizeClasses[size]}
            ${variantClasses[variant]}
            rounded-full transition-all duration-300 ease-in-out
          `}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
      {showLabel && labelPosition === 'bottom' && label}
    </div>
  );
};

export default Progress; 