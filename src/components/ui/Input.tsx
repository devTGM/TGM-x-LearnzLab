"use client";

import React, { InputHTMLAttributes, forwardRef } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, helperText, icon, ...props }, ref) => {
    return (
      <div className="flex flex-col w-full">
        {label && (
          <label className="mb-1 text-sm font-medium text-[var(--heading-color)]">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`w-full px-4 py-2 border rounded-lg bg-white text-[var(--text-main)] outline-none transition-all duration-200
              ${icon ? 'pl-10' : ''}
              ${error ? 'border-[var(--error)] focus:ring-1 focus:ring-[var(--error)]' : 'border-[var(--border-color)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]'}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-sm text-[var(--error)]">{error}</p>}
        {!error && helperText && <p className="mt-1 text-sm text-[var(--text-muted)]">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
