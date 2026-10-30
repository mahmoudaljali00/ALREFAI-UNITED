'use client';

import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'gold' | 'success' | 'outline' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ children, variant = 'default', size = 'md', dot = false, className, ...props }, ref) => {
    const variantClasses = {
      default: 'bg-neutral-100 text-neutral-700',
      primary: 'bg-primary-100 text-primary-800',
      gold: 'bg-gold-100 text-gold-800',
      success: 'bg-green-100 text-green-800',
      outline: 'border border-neutral-300 text-neutral-600 hover:bg-neutral-50',
      destructive: 'bg-red-100 text-red-800',
    };

    const sizeClasses = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-3 py-1 text-xs',
      lg: 'px-4 py-1.5 text-sm',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full font-medium transition-colors',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {dot && (
          <span
            className={cn(
              'w-1.5 h-1.5 rounded-full',
              variant === 'primary' && 'bg-primary-600',
              variant === 'gold' && 'bg-gold-600',
              variant === 'success' && 'bg-green-600',
              variant === 'destructive' && 'bg-red-600',
              variant === 'outline' && 'bg-neutral-500',
              variant === 'default' && 'bg-neutral-500'
            )}
          />
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };