"use client";

import React from 'react';
import Image from 'next/image';

export interface AvatarProps {
  src?: string | null;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Avatar = ({ src, name, size = 'md', className = '' }: AvatarProps) => {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  return (
    <div className={`relative flex items-center justify-center overflow-hidden rounded-full shrink-0 ${sizes[size]} ${className}`}>
      {src ? (
        <Image src={src} alt={name} fill className="object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-[var(--primary)] text-white font-semibold">
          {initials}
        </div>
      )}
    </div>
  );
};
