"use client";

import React from 'react';
import { Card } from './Card';

export interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: string;
  className?: string;
}

export const StatsCard = ({ title, value, icon, trend, color = 'var(--primary)', className = '' }: StatsCardProps) => {
  return (
    <Card variant="premium" className={`relative overflow-hidden ${className}`}>
      <div 
        className="absolute top-0 right-0 w-32 h-32 opacity-10 rounded-bl-full pointer-events-none"
        style={{ backgroundColor: color }}
      />
      
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-sm font-medium text-[var(--text-muted)] mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-[var(--heading-color)]">{value}</h3>
          
          {trend && (
            <div className={`flex items-center mt-2 text-sm font-medium ${trend.isPositive ? 'text-[var(--success)]' : 'text-[var(--error)]'}`}>
              <svg 
                className={`w-4 h-4 mr-1 ${!trend.isPositive ? 'transform rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              {trend.value}%
              <span className="text-[var(--text-muted)] ml-1 font-normal">vs last month</span>
            </div>
          )}
        </div>
        
        {icon && (
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center bg-opacity-10"
            style={{ backgroundColor: `${color}20`, color: color }}
          >
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};
