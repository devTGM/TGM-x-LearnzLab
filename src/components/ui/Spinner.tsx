"use client";

import React from 'react';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

export const Spinner = ({ size = 'md', color = 'var(--primary)', className = '' }: SpinnerProps) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div 
      className={`inline-block animate-spin rounded-full border-solid border-r-transparent align-[-0.125em] ${sizes[size]} ${className}`}
      style={{ borderLeftColor: color, borderTopColor: color, borderBottomColor: color }}
      role="status"
    >
      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
        Loading...
      </span>
    </div>
  );
};

export const PageLoader = ({ text = 'Loading...' }: { text?: string }) => (
  <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
    <Spinner size="lg" />
    <p className="mt-4 text-gray-600 font-medium">{text}</p>
  </div>
);
