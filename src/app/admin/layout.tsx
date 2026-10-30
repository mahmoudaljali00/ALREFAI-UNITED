'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useI18n } from '@/context/I18nContext';
import { Button } from '@/components/ui/Button';
import { LogoMark } from '@/components/layout/Logo';
import { LayoutDashboard, Settings, Users, FileText, FolderOpen, Image, MessageSquare, BarChart2, Shield, LogOut, Menu, X, ChevronRight, Building2, Hammer, Truck, Briefcase, Award, Star, Globe, Newspaper, Target, Factory, Handshake } from 'lucide-react';

const adminNavItems = [
  { href: '/admin', labelAr: 'نظرة عامة', labelEn: 'Overview', icon: LayoutDashboard },
  { href: '/admin/settings', labelAr: 'معلومات الشركة', labelEn: 'Company Info', icon: Building2 },
  { href: '/admin/services', labelAr: 'الخدمات', labelEn: 'Services', icon: Briefcase },
  { href: '/admin/projects', labelAr: 'المشاريع', labelEn: 'Projects', icon: FolderOpen },
  { href: '/admin/industries', labelAr: 'القطاعات', labelEn: 'Industries', icon: Factory },
  { href: '/admin/team', labelAr: 'الفريق', labelEn: 'Team', icon: Users },
  { href: '/admin/clients', labelAr: 'العملاء', labelEn: 'Clients', icon: Handshake },
  { href: '/admin/testimonials', labelAr: 'الشهادات', labelEn: 'Testimonials', icon: Star },
  { href: '/admin/news', labelAr: 'الأخبار', labelEn: 'News', icon: Newspaper },
  { href: '/admin/messages', labelAr: 'الرسائل', labelEn: 'Messages', icon: MessageSquare },
  { href: '/admin/media', labelAr: 'الوسائط', labelEn: 'Media', icon: Image },
];

const authPages = ['/admin/login', '/admin/signup'];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { locale, dir, setLocale } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const signedIn = document.cookie.split('; ').some(row => row.startsWith('auth-status='));
    if (!signedIn && !authPages.includes(pathname)) {
      router.push('/admin/login');
    }
  }, [router, pathname]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-neutral-50 flex">
        <aside className="fixed inset-y-0 z-40 w-64 bg-primary-950 transform transition-transform duration-300 ease-in-out lg:translate-x-0" aria-hidden="true" />
        <div className="flex-1 lg:ps-64 min-h-screen" />
      </div>
    );
  }

  // On auth pages (login / first-run signup), render children directly without admin sidebar
  if (authPages.includes(pathname)) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex" dir={dir}>
      <aside
        className={cn(
          'fixed inset-y-0 z-40 w-64 bg-primary-950 transform transition-transform duration-300 ease-in-out',
          'lg:translate-x-0 lg:start-0',
          sidebarOpen ? 'translate-x-0' : dir === 'rtl' ? 'translate-x-full lg:translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
        aria-label="Admin sidebar"
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-4 border-b border-primary-800">
            <Link href="/admin" className="flex items-center gap-3" aria-label="Dashboard">
              <LogoMark size="lg" variant="white" />
              <span className="font-display font-medium text-xl text-white">ALREFAI <span className="text-gold-400 font-light">ADMIN</span></span>
            </Link>
            <button
              className="lg:hidden p-2 text-white/60 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto" aria-label="Admin navigation">
            {adminNavItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-gold-400/10 text-gold-400'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                  <span>{locale === 'ar' ? item.labelAr : item.labelEn}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-primary-800">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-white/70 hover:text-white"
              onClick={async () => {
                await fetch('/api/auth/logout', { method: 'POST' });
                router.push('/admin/login');
                router.refresh();
              }}
            >
              <LogOut className="h-5 w-5" aria-hidden="true" />
              <span>{locale === 'ar' ? 'تسجيل الخروج' : 'Logout'}</span>
            </Button>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="flex-1 lg:ps-64 min-h-screen flex flex-col">
        <header className="sticky top-0 z-20 bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between gap-4">
          <button
            className="lg:hidden p-2 text-neutral-600 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLocale(locale === 'ar' ? 'en' : 'ar')}
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-primary-900 bg-primary-50 hover:bg-primary-100 transition-colors"
              aria-label={locale === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
            >
              {locale === 'ar' ? 'EN' : 'ع'}
            </button>
            <span className="text-body-sm text-neutral-500 hidden sm:block">{locale === 'ar' ? 'العربية' : 'English'}</span>
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-primary-700 font-medium text-sm">A</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
