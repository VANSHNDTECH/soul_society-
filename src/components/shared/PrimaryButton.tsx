import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  variant?: 'teal' | 'dark' | 'purple';
}

export const PrimaryButton: React.FC<ButtonProps> = ({
  children,
  icon,
  iconRight,
  size = 'md',
  fullWidth = false,
  variant = 'teal',
  className = '',
  disabled,
  ...props
}) => {
  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 rounded-lg gap-1.5',
    md: 'text-xs sm:text-sm px-4 py-2 rounded-xl gap-2',
    lg: 'text-sm sm:text-base px-5 py-2.5 rounded-xl gap-2.5',
  };

  const variantStyles = {
    teal: 'bg-teal-700 hover:bg-teal-800 text-white shadow-xs focus:ring-teal-500/50',
    dark: 'bg-stone-900 hover:bg-stone-800 text-white shadow-xs focus:ring-stone-500/50',
    purple: 'bg-purple-800 hover:bg-purple-900 text-white shadow-xs focus:ring-purple-500/50',
  };

  return (
    <button
      className={`inline-flex items-center justify-center font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed ${
        sizeStyles[size]
      } ${variantStyles[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {iconRight && <span className="shrink-0">{iconRight}</span>}
    </button>
  );
};
