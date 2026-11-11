'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import {
  Briefcase,
  Building2,
  ChevronLeft,
  ExternalLink,
  Factory,
  FolderOpen,
  Handshake,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Newspaper,
  Star,
  Users,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useI18n } from '@/context/I18nContext';
import { LogoMark } from '@/components/layout/Logo';

interface NavItem {
  href: string;
  labelAr: string;
  labelEn: string;
  icon: LucideIcon;
}

interface NavGroup {
  labelAr: string;
  labelEn: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    labelAr: 'الرئيسية',
    labelEn: 'Main',
    items: [
      { href: '/admin', labelAr: 'نظرة عامة', labelEn: 'Overview', icon: LayoutDashboard },
      { href: '/admin/settings', labelAr: 'معلومات الشركة', labelEn: 'Company', icon: Building2 },
    ],
  },
  {
    labelAr: 'المحتوى',
    labelEn: 'Content',
    items: [
      { href: '/admin/services', labelAr: 'الخدمات', labelEn: 'Services', icon: Briefcase },
      { href: '/admin/projects', labelAr: 'المشاريع', labelEn: 'Projects', icon: FolderOpen },
      { href: '/admin/industries', labelAr: 'القطاعات', labelEn: 'Industries', icon: Factory },
      { href: '/admin/news', labelAr: 'الأخبار', labelEn: 'News', icon: Newspaper },
      { href: '/admin/media', labelAr: 'الوسائط', labelEn: 'Media', icon: ImageIcon },
    ],
  },
  {
    labelAr: 'العلاقات',
    labelEn: 'Relations',
    items: [
      { href: '/admin/team', labelAr: 'الفريق', labelEn: 'Team', icon: Users },
      { href: '/admin/clients', labelAr: 'العملاء', labelEn: 'Clients', icon: Handshake },
      { href: '/admin/testimonials', labelAr: 'الشهادات', labelEn: 'Testimonials', icon: Star },
      { href: '/admin/messages', labelAr: 'الرسائل', labelEn: 'Messages', icon: MessageSquare },
    ],
  },
];

const allNavItems = navGroups.flatMap((group) => group.items);
const authPages = ['/admin/login', '/admin/signup'];

function isItemActive(pathname: string, href: string) {
  if (href === '/admin') return pathname === '/admin';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { locale, dir, setLocale } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<{ name?: string | null; email?: string } | null>(null);
  const rtl = dir === 'rtl';

  const currentItem = allNavItems
    .filter((item) => isItemActive(pathname, item.href))
    .sort((a, b) => b.href.length - a.href.length)[0];

  useEffect(() => {
    setMounted(true);
    const signedIn = document.cookie.split('; ').some((row) => row.startsWith('auth-status='));
    if (!signedIn && !authPages.includes(pathname)) {
      router.push('/admin/login');
    }
  }, [router, pathname]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (authPages.includes(pathname) || user) return;
    let cancelled = false;
    fetch('/api/auth/me', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data?.user) setUser(data.user);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [pathname, user]);

  if (!mounted) {
    return (
      <div className="flex min-h-screen bg-[#f5f6f4]">
        <aside className="fixed inset-y-0 z-40 w-64 bg-primary-950" aria-hidden="true" />
        <div className="min-h-screen flex-1 lg:ps-64" />
      </div>
    );
  }

  // On auth pages (login / first-run signup), render children directly without admin chrome
  if (authPages.includes(pathname)) {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#f5f6f4] text-neutral-800" dir={dir}>
      <aside
        className={cn(
          'fixed inset-y-0 z-40 flex w-64 flex-col bg-primary-950 text-white transition-transform duration-300 ease-out-expo',
          'lg:translate-x-0 lg:start-0',
          sidebarOpen ? 'translate-x-0' : rtl ? 'translate-x-full lg:translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
        aria-label="Admin sidebar"
      >
        <span
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-500/70 to-transparent"
          aria-hidden="true"
        />

        <div className="flex h-20 shrink-0 items-center justify-between gap-2 px-5">
          <Link href="/admin" className="flex items-center gap-3" aria-label="Admin dashboard">
            <LogoMark size="md" variant="white" />
            <span className="leading-tight">
              <span className="block font-display text-[15px] font-semibold tracking-tight text-white">ALREFAI</span>
              <span className="block text-[10px] font-medium uppercase tracking-[0.28em] text-gold-400/90">Admin</span>
            </span>
          </Link>
          <button
            className="grid h-9 w-9 place-items-center rounded-lg text-white/50 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-3 pb-6 pt-2" aria-label="Admin navigation">
          {navGroups.map((group) => (
            <div key={group.labelEn}>
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">
                {rtl ? group.labelAr : group.labelEn}
              </p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const active = isItemActive(pathname, item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-medium transition-colors duration-200',
                        active ? 'bg-white/[0.08] text-white' : 'text-white/55 hover:bg-white/[0.04] hover:text-white/90'
                      )}
                    >
                      <span
                        className={cn(
                          'absolute inset-y-2 start-0 w-[3px] rounded-full bg-gold-400 transition-opacity duration-200',
                          active ? 'opacity-100' : 'opacity-0'
                        )}
                        aria-hidden="true"
                      />
                      <Icon
                        className={cn(
                          'h-[18px] w-[18px] shrink-0 transition-colors',
                          active ? 'text-gold-400' : 'text-white/45 group-hover:text-white/70'
                        )}
                        aria-hidden="true"
                      />
                      <span className="truncate">{rtl ? item.labelAr : item.labelEn}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="shrink-0 border-t border-white/10 p-3">
          <div className="mb-2 flex items-center gap-3 rounded-xl bg-white/[0.04] px-3 py-2.5">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold-400/15 font-display text-sm font-semibold text-gold-300">
              {(user?.name || user?.email || 'A').charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium text-white">{user?.name || 'Admin'}</p>
              <p className="truncate text-[11px] text-white/45">{user?.email || ''}</p>
            </div>
          </div>
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-[13px] text-white/55 transition-colors hover:bg-white/[0.04] hover:text-white"
          >
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            {rtl ? 'عرض الموقع' : 'View website'}
          </Link>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-[13px] text-white/55 transition-colors hover:bg-red-500/10 hover:text-red-300"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            {rtl ? 'تسجيل الخروج' : 'Sign out'}
          </button>
        </div>
      </aside>

      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-primary-950/50 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <div className="flex min-h-screen flex-col lg:ps-64">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-neutral-200/80 bg-white/85 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <button
            className="grid h-9 w-9 place-items-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>

          <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-[13px]">
            <Link href="/admin" className="text-neutral-400 transition-colors hover:text-primary-800">
              {rtl ? 'لوحة التحكم' : 'Dashboard'}
            </Link>
            {currentItem && currentItem.href !== '/admin' && (
              <>
                <ChevronLeft
                  className={cn('h-3.5 w-3.5 shrink-0 text-neutral-300', !rtl && 'rotate-180')}
                  aria-hidden="true"
                />
                <span className="truncate font-medium text-primary-950">
                  {rtl ? currentItem.labelAr : currentItem.labelEn}
                </span>
              </>
            )}
          </nav>

          <div className="ms-auto flex items-center gap-2">
            <button
              onClick={() => setLocale(locale === 'ar' ? 'en' : 'ar')}
              className="rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-[12px] font-semibold text-primary-900 transition-colors hover:border-neutral-300 hover:bg-neutral-50"
              aria-label={rtl ? 'Switch to English' : 'التبديل إلى العربية'}
            >
              {locale === 'ar' ? 'EN' : 'ع'}
            </button>
            <Link
              href="/"
              target="_blank"
              className="hidden items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12px] font-medium text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-primary-900 sm:flex"
            >
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              {rtl ? 'الموقع' : 'Site'}
            </Link>
            <span className="grid h-8 w-8 place-items-center rounded-full bg-primary-950 font-display text-[12px] font-semibold text-gold-300">
              {(user?.name || user?.email || 'A').charAt(0).toUpperCase()}
            </span>
          </div>
        </header>

        <main className="admin-surface flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
          <div className="mx-auto w-full max-w-[1360px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
