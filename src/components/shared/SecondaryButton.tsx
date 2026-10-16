import React from 'react';
import { ButtonProps } from './PrimaryButton';

export const SecondaryButton: React.FC<ButtonProps> = ({
  children,
  icon,
  iconRight,
  size = 'md',
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 rounded-lg gap-1.5',
    md: 'text-xs sm:text-sm px-4 py-2 rounded-xl gap-2',
    lg: 'text-sm sm:text-base px-5 py-2.5 rounded-xl gap-2.5',
  };

  return (
    <button
      className={`inline-flex items-center justify-center font-semibold bg-white hover:bg-stone-50 text-stone-700 border border-stone-200/90 shadow-2xs transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-stone-400/50 disabled:opacity-50 disabled:cursor-not-allowed ${
        sizeStyles[size]
      } ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {iconRight && <span className="shrink-0">{iconRight}</span>}
    </button>
  );
};
