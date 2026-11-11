'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useI18n } from '@/context/I18nContext';
import { Button } from '@/components/ui/Button';
import {
  ArrowUpRight,
  Briefcase,
  FolderOpen,
  Handshake,
  MessageSquare,
  Newspaper,
  Plus,
  Users,
} from 'lucide-react';

interface DashboardStats {
  totalProjects: number;
  totalServices: number;
  totalClients: number;
  unreadMessages: number;
  publishedArticles: number;
  activeTeamMembers?: number;
}

export default function AdminDashboardPage() {
  const { t, dir } = useI18n();
  const rtl = dir === 'rtl';
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data.data) setStats(data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    {
      key: 'totalProjects',
      label: t('admin.totalProjects') || 'Projects',
      icon: FolderOpen,
      tone: 'bg-emerald-50 text-emerald-700',
      href: '/admin/projects',
    },
    {
      key: 'totalServices',
      label: t('admin.totalServices') || 'Services',
      icon: Briefcase,
      tone: 'bg-sky-50 text-sky-700',
      href: '/admin/services',
    },
    {
      key: 'totalClients',
      label: t('admin.totalClients') || 'Clients',
      icon: Handshake,
      tone: 'bg-indigo-50 text-indigo-700',
      href: '/admin/clients',
    },
    {
      key: 'unreadMessages',
      label: t('admin.unreadMessages') || 'Unread messages',
      icon: MessageSquare,
      tone: 'bg-amber-50 text-amber-700',
      href: '/admin/messages',
    },
    {
      key: 'publishedArticles',
      label: t('admin.publishedArticles') || 'Published articles',
      icon: Newspaper,
      tone: 'bg-violet-50 text-violet-700',
      href: '/admin/news',
    },
    {
      key: 'activeTeamMembers',
      label: rtl ? 'أعضاء الفريق' : 'Team members',
      icon: Users,
      tone: 'bg-gold-50 text-gold-700',
      href: '/admin/team',
    },
  ];

  const quickActions = [
    {
      href: '/admin/services/new',
      icon: Briefcase,
      title: rtl ? 'إضافة خدمة' : 'Add a service',
      description: rtl ? 'أنشئ صفحة خدمة جديدة' : 'Create a new service page',
    },
    {
      href: '/admin/projects/new',
      icon: FolderOpen,
      title: rtl ? 'إضافة مشروع' : 'Add a project',
      description: rtl ? 'أضف مشروعاً إلى معرض الأعمال' : 'Publish a project to the portfolio',
    },
    {
      href: '/admin/news',
      icon: Newspaper,
      title: rtl ? 'كتابة مقال' : 'Write an article',
      description: rtl ? 'شارك آخر أخبار الشركة' : 'Share the latest company news',
    },
    {
      href: '/admin/clients',
      icon: Handshake,
      title: rtl ? 'إضافة عميل' : 'Add a client',
      description: rtl ? 'وسّع قائمة عملائك' : 'Grow your client showcase',
    },
  ];

  const recentActivity = [
    {
      action: t('admin.newProjectCreated') || (rtl ? 'تم إنشاء مشروع جديد' : 'New project created'),
      item: 'Alrefai Commercial Tower',
      time: rtl ? 'قبل ساعتين' : '2 hours ago',
      icon: FolderOpen,
      tone: 'bg-emerald-50 text-emerald-700',
    },
    {
      action: t('admin.newMessageReceived') || (rtl ? 'رسالة جديدة' : 'New message received'),
      item: 'Ahmed Al-Saeed',
      time: rtl ? 'قبل 4 ساعات' : '4 hours ago',
      icon: MessageSquare,
      tone: 'bg-amber-50 text-amber-700',
    },
    {
      action: t('admin.articlePublished') || (rtl ? 'تم نشر مقال' : 'Article published'),
      item: 'Strategic Partnership with Aramco',
      time: rtl ? 'أمس' : '1 day ago',
      icon: Newspaper,
      tone: 'bg-violet-50 text-violet-700',
    },
    {
      action: t('admin.newClientAdded') || (rtl ? 'تمت إضافة عميل' : 'New client added'),
      item: 'Saudi Electricity Company',
      time: rtl ? 'قبل يومين' : '2 days ago',
      icon: Handshake,
      tone: 'bg-indigo-50 text-indigo-700',
    },
  ];

  return (
    <div className="space-y-6 lg:space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <p className="admin-eyebrow">{rtl ? 'لوحة التحكم' : 'Control center'}</p>
          <h1 className="mt-2">{t('admin.dashboard')}</h1>
          <p className="mt-1.5 text-sm text-neutral-500">
            {t('admin.dashboardSubtitle') || (rtl ? 'نظرة عامة على محتوى موقعك' : 'Overview of your website content')}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/services/new">
            <Button variant="secondary">{rtl ? 'إضافة خدمة' : 'Add service'}</Button>
          </Link>
          <Link href="/admin/projects/new">
            <Button variant="gold">
              <Plus className="h-[18px] w-[18px]" aria-hidden="true" />
              {rtl ? 'إضافة مشروع' : 'Add project'}
            </Button>
          </Link>
        </div>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 + index * 0.04 }}
          >
            <Link
              href={stat.href}
              className="group flex h-full flex-col justify-between gap-5 rounded-2xl border border-neutral-200/80 bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-[0_20px_44px_-28px_rgba(13,45,26,0.4)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-400">
                    {stat.label}
                  </p>
                  <p className="mt-3 font-display text-[28px] font-semibold leading-none tracking-tight text-primary-950 tabular-nums">
                    {loading ? (
                      <span className="inline-block h-7 w-16 animate-pulse rounded bg-neutral-100 align-middle" aria-hidden="true" />
                    ) : stats ? (
                      (stats[stat.key as keyof DashboardStats] ?? 0).toLocaleString('en-US')
                    ) : (
                      '—'
                    )}
                  </p>
                </div>
                <span className={cn('grid h-10 w-10 shrink-0 place-items-center rounded-xl', stat.tone)}>
                  <stat.icon className="h-[18px] w-[18px]" aria-hidden="true" />
                </span>
              </div>
              <span className="flex items-center gap-1.5 text-[12px] font-medium text-neutral-400 transition-colors group-hover:text-primary-700">
                {t('common.viewAll') || (rtl ? 'عرض الكل' : 'View all')}
                <ArrowUpRight
                  className={cn('h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5', rtl && '-scale-x-100')}
                  aria-hidden="true"
                />
              </span>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-5 lg:gap-6">
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          className="admin-panel lg:col-span-3"
        >
          <div className="flex items-center justify-between gap-3 border-b border-neutral-100 px-5 py-4 sm:px-6">
            <h2 className="text-[15px]">{t('admin.quickActions') || (rtl ? 'إجراءات سريعة' : 'Quick actions')}</h2>
            <span className="text-[12px] text-neutral-400">{rtl ? 'ابدأ من هنا' : 'Start here'}</span>
          </div>
          <div className="grid gap-1 p-3 sm:grid-cols-2">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="group flex items-start gap-3 rounded-xl border border-transparent px-3 py-3 transition-colors hover:border-neutral-200 hover:bg-neutral-50/80"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary-50 text-primary-700 transition-colors group-hover:bg-primary-900 group-hover:text-gold-300">
                  <action.icon className="h-[18px] w-[18px]" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[13.5px] font-medium text-primary-950">{action.title}</span>
                  <span className="mt-0.5 block truncate text-[12px] text-neutral-500">{action.description}</span>
                </span>
              </Link>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.34 }}
          className="admin-panel lg:col-span-2"
        >
          <div className="flex items-center justify-between gap-3 border-b border-neutral-100 px-5 py-4 sm:px-6">
            <h2 className="text-[15px]">{t('admin.recentActivity') || (rtl ? 'النشاط الأخير' : 'Recent activity')}</h2>
          </div>
          <ol className="divide-y divide-neutral-100">
            {recentActivity.map((activity) => (
              <li key={activity.item} className="flex items-center gap-3 px-5 py-3.5 sm:px-6">
                <span className={cn('grid h-9 w-9 shrink-0 place-items-center rounded-lg', activity.tone)}>
                  <activity.icon className="h-[16px] w-[16px]" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium text-primary-950">{activity.action}</p>
                  <p className="truncate text-[12px] text-neutral-500">{activity.item}</p>
                </div>
                <span className="shrink-0 text-[11px] text-neutral-400">{activity.time}</span>
              </li>
            ))}
          </ol>
        </motion.section>
      </div>
    </div>
  );
}
