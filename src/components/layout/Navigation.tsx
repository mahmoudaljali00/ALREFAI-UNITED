'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useI18n } from '@/context/I18nContext';
import { Button } from '@/components/ui/Button';
import { Logo, LogoMark, LogoFull } from './Logo';
import type { CompanyInfo } from './SiteChrome';
import { Menu, X, ChevronDown, Globe } from 'lucide-react';

const navigationItems = [
  { href: '/', key: 'home' },
  { href: '/about', key: 'about' },
  { href: '/services', key: 'services' },
  { href: '/projects', key: 'projects' },
  { href: '/industries', key: 'industries' },
  { href: '/sustainability', key: 'sustainability' },
  { href: '/news', key: 'news' },
  { href: '/contact', key: 'contact' },
];

export function Navigation({ companyInfo }: { companyInfo?: CompanyInfo } = {}) {
  const { t, locale, setLocale, dir } = useI18n();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out-expo',
        scrolled
          ? 'glass-dark bg-primary-950/90 shadow-xl shadow-primary-900/20'
          : 'bg-transparent'
      )}
      style={{ backdropFilter: 'blur(20px)' }}
      dir={dir}
    >
      <nav className="container-custom" aria-label="Main navigation">
        <div className="flex items-center justify-between h-16 gap-6">
          <Link
            href="/"
            className="flex items-center gap-3 shrink-0"
            aria-label={t('nav.home')}
          >
            <LogoFull size="md" variant={scrolled ? 'light' : 'white'} />
          </Link>

          <div className="hidden lg:flex lg:items-center lg:gap-1 flex-1 justify-center">
            {navigationItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={cn(
                  'relative px-4 py-2.5 text-[12px] font-medium transition-all duration-300 rounded-lg',
                  isActive(item.href)
                    ? 'text-gold-400 bg-gold-400/10'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                )}
                aria-current={isActive(item.href) ? 'page' : undefined}
              >
                {t(`nav.${item.key}`)}
                <AnimatePresence mode="wait">
                  {isActive(item.href) && (
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: '100%', opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      className="absolute bottom-0 left-0 h-0.5 bg-gold-400 rounded-full"
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                    />
                  )}
                </AnimatePresence>
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex lg:items-center lg:gap-4">
            <LanguageSwitcher />
            <Link href={companyInfo?.whatsapp ? `https://wa.me/${companyInfo.whatsapp.replace(/[^0-9]/g, '')}` : '/contact'}>
              <Button variant="gold" size="sm">{t('nav.contact')}</Button>
            </Link>
          </div>

          <button
            className="lg:hidden flex items-center justify-center p-2 text-white rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={mobileMenuOpen ? (dir === 'rtl' ? 'إغلاق القائمة' : 'Close menu') : (dir === 'rtl' ? 'فتح القائمة' : 'Open menu')}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden overflow-hidden bg-primary-950 border-t border-primary-800"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <div className="py-6 space-y-1 px-4">
                {navigationItems.map((item) => (
                  <Link
                    key={item.key}
                    href={item.href}
                    className={cn(
                      'block px-4 py-3 rounded-lg text-base font-medium transition-colors',
                      isActive(item.href)
                        ? 'bg-gold-400/10 text-gold-400'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t(`nav.${item.key}`)}
                  </Link>
                ))}
                <div className="pt-4 border-t border-primary-800 flex items-center justify-between">
                  <LanguageSwitcher />
                  <Link href="/contact">
                    <Button variant="gold" size="md" className="w-full">{t('nav.contact')}</Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}

function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={t('common.language')}
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">{locale === 'ar' ? 'العربية' : 'English'}</span>
        <ChevronDown className={cn('h-4 w-4 transition-transform', open && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-36 bg-primary-950 border border-primary-800 rounded-lg shadow-xl shadow-primary-900/30 py-1 z-50"
            transition={{ duration: 0.2 }}
          >
            <ul role="listbox" aria-label={t('common.language')}>
              {(['ar', 'en'] as const).map((lang) => (
                <li key={lang}>
                  <button
                    role="option"
                    aria-selected={locale === lang}
                    onClick={() => {
                      setLocale(lang);
                      setOpen(false);
                    }}
                    className={cn(
                      'w-full px-4 py-2.5 text-sm font-medium text-left transition-colors',
                      locale === lang
                        ? 'bg-gold-400/10 text-gold-400'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    )}
                  >
                    {lang === 'ar' ? 'العربية' : 'English'}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}