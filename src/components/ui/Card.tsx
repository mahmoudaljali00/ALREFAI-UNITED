'use client';

import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'elevated' | 'glass' | 'glass-dark';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, variant = 'default', padding = 'md', hover = false, className, ...props }, ref) => {
    const variantClasses = {
      default: 'bg-white border border-neutral-200',
      bordered: 'bg-white border-2 border-neutral-200',
      elevated: 'bg-white shadow-lg shadow-neutral-900/5',
      glass: 'glass',
      'glass-dark': 'glass-dark',
    };

    const paddingClasses = {
      none: '',
      sm: 'p-4',
      md: 'p-5 sm:p-6',
      lg: 'p-5 sm:p-6 lg:p-8',
      xl: 'p-6 sm:p-8 lg:p-10',
    };

    const hoverClasses = hover
      ? 'transition-all duration-500 ease-out-expo hover:-translate-y-1 hover:shadow-xl hover:shadow-primary-900/10'
      : '';

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl',
          variantClasses[variant],
          paddingClasses[padding],
          hoverClasses,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ children, className, ...props }, ref) => (
    <div ref={ref} className={cn('mb-4', className)} {...props}>
      {children}
    </div>
  )
);

CardHeader.displayName = 'CardHeader';

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ children, size = 'md', className, ...props }, ref) => {
    const sizeClasses = {
      sm: 'text-heading-sm',
      md: 'text-heading-md',
      lg: 'text-heading-lg',
      xl: 'text-heading-xl',
    };
    return (
      <h3 ref={ref} className={cn('heading-card', sizeClasses[size], className)} {...props}>
        {children}
      </h3>
    );
  }
);

CardTitle.displayName = 'CardTitle';

export interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {}

const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ children, className, ...props }, ref) => (
    <p ref={ref} className={cn('text-body text-neutral-600 mt-1', className)} {...props}>
      {children}
    </p>
  )
);

CardDescription.displayName = 'CardDescription';

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ children, className, ...props }, ref) => (
    <div ref={ref} className={cn('', className)} {...props}>
      {children}
    </div>
  )
);

CardContent.displayName = 'CardContent';

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ children, className, ...props }, ref) => (
    <div ref={ref} className={cn('mt-4 pt-4 border-t border-neutral-200 flex items-center gap-3', className)} {...props}>
      {children}
    </div>
  )
);

CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };