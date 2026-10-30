'use client';

import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface SeparatorProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'gold' | 'gradient';
  length?: 'full' | 'short' | 'medium';
}

const Separator = forwardRef<HTMLDivElement, SeparatorProps>(
  ({ orientation = 'horizontal', variant = 'default', length = 'full', className, ...props }, ref) => {
    const orientationClasses = {
      horizontal: 'w-full h-px',
      vertical: 'h-full w-px',
    };

    const variantClasses = {
      default: 'bg-neutral-200',
      gold: 'bg-gradient-to-r from-transparent via-gold-400 to-transparent',
      gradient: 'bg-gradient-to-r from-transparent via-primary-400 to-transparent',
    };

    const lengthClasses = {
      full: '',
      short: orientation === 'horizontal' ? 'max-w-[60px] mx-auto' : 'max-h-[60px] mx-auto',
      medium: orientation === 'horizontal' ? 'max-w-[120px] mx-auto' : 'max-h-[120px] mx-auto',
    };

    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation={orientation}
        className={cn(
          orientationClasses[orientation],
          variantClasses[variant],
          lengthClasses[length],
          className
        )}
        {...props}
      />
    );
  }
);

Separator.displayName = 'Separator';

export { Separator };