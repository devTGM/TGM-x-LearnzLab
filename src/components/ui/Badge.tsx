"use client";

import React from 'react';

export interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'purple';
  size?: 'sm' | 'md';
  className?: string;
  children: React.ReactNode;
}

export const Badge = ({ variant = 'default', size = 'sm', className = '', children }: BadgeProps) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-[#00d08420] text-[#00d084]',
    warning: 'bg-[#fcb90020] text-[#fcb900]',
    error: 'bg-[#cf2e2e20] text-[#cf2e2e]',
    info: 'bg-[#0693e320] text-[#0693e3]',
    purple: 'bg-[var(--primary)] text-white',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span className={`inline-flex items-center justify-center rounded-full font-medium ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
};
