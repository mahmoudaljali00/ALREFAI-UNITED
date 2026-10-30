'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';

interface LogoProps {
  variant?: 'default' | 'light' | 'dark' | 'white';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  ariaLabel?: string;
}

export function Logo({ variant = 'default', size = 'md', className, ariaLabel = 'شركة الرفاعي المتحدة Logo' }: LogoProps) {
  const sizeClasses = {
    sm: 'h-8 w-auto',
    md: 'h-10 w-auto',
    lg: 'h-12 w-auto',
    xl: 'h-16 w-auto',
  };

  const variantClasses = {
    default: '',
    light: '',
    dark: '',
    white: '',
  };

  return (
    <Image
      src="/logo.png"
      alt={ariaLabel}
      width={120}
      height={120}
      className={cn(sizeClasses[size], variantClasses[variant], className)}
      priority
      quality={90}
      sizes="120px"
    />
  );
}

export function LogoText({ variant = 'default', size = 'md', className, showTagline = false }: LogoProps & { showTagline?: boolean }) {
  const sizeClasses = {
    sm: 'text-[11px]',
    md: 'text-[13px]',
    lg: 'text-[15px]',
    xl: 'text-[17px]',
  };

  const variantClasses = {
    default: 'text-primary-900',
    light: 'text-white',
    dark: 'text-primary-950',
    white: 'text-white',
  };

  return (
    <div className={cn('font-display font-medium tracking-tight', sizeClasses[size], variantClasses[variant], className)}>
      <span className="block">ALREFAI UNITED</span>
      <span className="block text-gold-600 font-light text-[12px] mt-0.5">COMPANY</span>
      {showTagline && (
        <span className="block text-caption text-neutral-500 mt-1 font-sans font-normal">Building Trust. Shaping the Future.</span>
      )}
    </div>
  );
}

export function LogoMark({ variant = 'default', size = 'md', className, animated = false }: LogoProps & { animated?: boolean }) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  return (
    <Image
      src="/logo.png"
      alt=""
      width={64}
      height={64}
      className={cn(sizeClasses[size], 'transition-transform duration-500', animated && 'animate-pulse-gold', className)}
      priority
      quality={90}
      sizes="64px"
      aria-hidden="true"
    />
  );
}

export function LogoFull({ variant = 'default', size = 'md', className }: LogoProps & { showText?: boolean }) {
  const sizeClasses = {
    sm: 'h-8 w-auto',
    md: 'h-10 w-auto',
    lg: 'h-12 w-auto',
    xl: 'h-16 w-auto',
  };

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <Image
        src="/logo.png"
        alt="شركة الرفاعي المتحدة"
        width={120}
        height={120}
        className={cn(sizeClasses[size], variant === 'white' || variant === 'light' ? 'brightness-0 invert' : '', 'drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]')}
        priority
        quality={90}
        sizes="120px"
      />
      <LogoText variant={variant} size={size} />
    </div>
  );
}