import React from 'react';

export interface FormFieldProps {
  label: string;
  id?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  id,
  error,
  helperText,
  required = false,
  children,
  className = '',
}) => {
  return (
    <div className={`space-y-1.5 text-left ${className}`}>
      <label
        htmlFor={id}
        className="block text-xs font-semibold text-stone-700 tracking-wide"
      >
        {label}
        {required && <span className="text-rose-500 ml-1">*</span>}
      </label>

      {children}

      {error ? (
        <p className="text-xs text-rose-600 font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-[11px] text-stone-500">{helperText}</p>
      ) : null}
    </div>
  );
};
