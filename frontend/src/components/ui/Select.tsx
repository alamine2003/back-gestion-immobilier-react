import React from 'react';

interface Option {
    value: string | number;
    label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
    label?: string;
    error?: string;
    helperText?: string;
    fullWidth?: boolean;
    size?: 'sm' | 'md' | 'lg';
    options: Option[];
    leftIcon?: React.ReactNode;
}

const Select: React.FC<SelectProps> = ({
    label,
    error,
    helperText,
    fullWidth = false,
    size = 'md',
    options,
    leftIcon,
    className = '',
    id,
    ...props
}) => {
    const selectId = id || Math.random().toString(36).substr(2, 9);

    const sizes = {
        sm: 'py-1.5 text-sm',
        md: 'py-2 text-sm',
        lg: 'py-3 text-base'
    };

    return (
        <div className={`${fullWidth ? 'w-full' : ''}`}>
            {label && (
                <label
                    htmlFor={selectId}
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    {label}
                </label>
            )}
            <div className="relative">
                {leftIcon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        {leftIcon}
                    </div>
                )}
                <select
                    id={selectId}
                    className={`
                        block w-full rounded-md shadow-sm
                        ${error
                            ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                        }
                        ${leftIcon ? 'pl-10' : ''}
                        ${sizes[size]}
                        ${className}
                    `}
                    aria-invalid={error ? 'true' : 'false'}
                    aria-describedby={error ? `${selectId}-error` : helperText ? `${selectId}-description` : undefined}
                    {...props}
                >
                    {options.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                        >
                            {option.label}
                        </option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <svg
                        className="h-5 w-5 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>
            </div>
            {error && (
                <p
                    className="mt-1 text-sm text-red-600"
                    id={`${selectId}-error`}
                >
                    {error}
                </p>
            )}
            {helperText && !error && (
                <p
                    className="mt-1 text-sm text-gray-500"
                    id={`${selectId}-description`}
                >
                    {helperText}
                </p>
            )}
        </div>
    );
};

export default Select; 