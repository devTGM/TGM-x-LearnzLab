"use client";

import React from 'react';

export interface CardProps {
  variant?: 'default' | 'glass' | 'premium';
  hover?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const Card = ({ variant = 'default', hover = false, className = '', children }: CardProps) => {
  const variants = {
    default: 'bg-[var(--card-bg)] border border-[var(--border-color)] shadow-sm rounded-[var(--border-radius)]',
    glass: 'glass rounded-[var(--border-radius)]',
    premium: 'premium-card',
  };

  const hoverEffect = hover && variant !== 'premium' ? 'transition-all duration-300 hover:-translate-y-1 hover:shadow-md' : '';

  return (
    <div className={`${variants[variant]} ${hoverEffect} ${className}`}>
      {children}
    </div>
  );
};
