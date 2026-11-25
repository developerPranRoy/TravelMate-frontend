import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export default function Input({ label, error, helperText, id, className = '', ...rest }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-text-main">
          {label}
        </label>
      )}
      <input
        id={inputId}
        {...rest}
        className={`border rounded-sm px-3 py-2 text-sm outline-none transition-colors
          focus:ring-2 focus:ring-primary/30 focus:border-primary
          ${error ? 'border-danger bg-red-50' : 'border-border bg-white'}
          disabled:bg-gray-50 disabled:text-muted
          ${className}`}
      />
      {error && <p className="text-xs text-danger">{error}</p>}
      {helperText && !error && <p className="text-xs text-muted">{helperText}</p>}
    </div>
  );
}
