'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'gold' | 'outline' | 'ghost' | 'on-dark';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses = 'inline-flex items-center justify-center gap-2 rounded-lg font-medium whitespace-nowrap transition-all duration-300 ease-out-expo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
    
    const variantClasses = {
      primary: 'bg-primary-900 text-white hover:bg-primary-800 hover:shadow-lg hover:shadow-primary-900/30 focus-visible:ring-primary-500',
      secondary: 'bg-white text-primary-900 border border-primary-900 hover:bg-primary-50 focus-visible:ring-primary-500',
      gold: 'bg-gradient-to-r from-gold-600 to-gold-700 text-primary-950 hover:from-gold-500 hover:to-gold-600 hover:shadow-lg hover:shadow-gold focus-visible:ring-gold-400',
      outline: 'border-2 border-neutral-300 text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50 focus-visible:ring-neutral-400',
      ghost: 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 focus-visible:ring-neutral-400',
      'on-dark': 'bg-transparent text-white border border-white/40 hover:bg-white hover:text-primary-950 focus-visible:ring-white/50',
    };

    const sizeClasses = {
      sm: 'h-10 min-h-10 px-4 text-sm',
      md: 'h-11 min-h-11 px-5 text-sm sm:text-base',
      lg: 'h-12 min-h-12 px-6 sm:px-8 text-base',
    };

    return (
      <button
        ref={ref}
        className={cn(baseClasses, variantClasses[variant], sizeClasses[size], fullWidth && 'w-full', className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        ) : icon && iconPosition === 'left' ? (
          <span className="flex-shrink-0">{icon}</span>
        ) : null}
        {children}
        {icon && iconPosition === 'right' && !loading && (
          <span className="flex-shrink-0">{icon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };