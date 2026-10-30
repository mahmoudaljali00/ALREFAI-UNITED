'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useI18n } from '@/context/I18nContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { TrendingUp, FolderOpen, Handshake, MessageSquare, Newspaper, Award, Briefcase } from 'lucide-react';
import Link from 'next/link';

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
      .then(res => res.json())
      .then(data => {
        if (data.data) setStats(data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { key: 'totalProjects', label: t('admin.totalProjects'), icon: FolderOpen, color: 'text-primary-600 bg-primary-100', href: '/admin/projects' },
    { key: 'totalServices', label: t('admin.totalServices'), icon: Briefcase, color: 'text-green-600 bg-green-100', href: '/admin/services' },
    { key: 'totalClients', label: t('admin.totalClients'), icon: Handshake, color: 'text-blue-600 bg-blue-100', href: '/admin/clients' },
    { key: 'unreadMessages', label: t('admin.unreadMessages'), icon: MessageSquare, color: 'text-orange-600 bg-orange-100', href: '/admin/messages' },
    { key: 'publishedArticles', label: t('admin.publishedArticles'), icon: Newspaper, color: 'text-purple-600 bg-purple-100', href: '/admin/news' },
    { key: 'activeTeamMembers', label: rtl ? 'أعضاء الفريق' : 'Team Members', icon: TrendingUp, color: 'text-gold-600 bg-gold-100', href: '/admin/team' },
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="heading-display text-display-sm text-primary-950">{t('admin.dashboard')}</h1>
          <p className="text-body text-neutral-600 mt-1">{t('admin.dashboardSubtitle') || 'Overview of your website content and performance'}</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/services">
            <Button variant="secondary">+ {t('admin.addNew')}</Button>
          </Link>
          <Link href="/admin/projects">
            <Button variant="gold">+ {t('admin.addNew')}</Button>
          </Link>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6"
      >
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
          >
            <Card variant="elevated" padding="lg" hover className="group">
              <Link href={stat.href} className="block">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-caption text-neutral-500 mb-1">{stat.label}</p>
                    <p className="heading-display text-display-sm text-primary-950 font-medium tabular-nums">
                      {loading ? (
                        <span className="animate-pulse bg-neutral-200 h-8 w-24 rounded inline-block" aria-hidden="true" />
                      ) : (
                        stats ? (stats[stat.key as keyof DashboardStats] ?? 0).toLocaleString() : '—'
                      )}
                    </p>
                  </div>
                  <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0', stat.color)}>
                    <stat.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center justify-between group-hover:opacity-100 transition-opacity">
                  <span className="text-body-sm text-neutral-500">{t('common.viewAll')}</span>
                  <Award className={cn('h-4 w-4 text-neutral-400 group-hover:text-gold-400 transition-colors', 'transform group-hover:translate-x-1')} aria-hidden="true" />
                </div>
              </Link>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid lg:grid-cols-2 gap-6"
      >
        <Card variant="elevated" padding="lg">
          <h2 className="heading-card text-heading-lg text-primary-950 mb-6">{t('admin.quickActions')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/admin/services/new">
              <Button variant="secondary" size="lg" className="h-20 justify-start gap-3">
                <Briefcase className="h-6 w-6" aria-hidden="true" />
                <span>{t('admin.addService')}</span>
              </Button>
            </Link>
            <Link href="/admin/projects/new">
              <Button variant="secondary" size="lg" className="h-20 justify-start gap-3">
                <FolderOpen className="h-6 w-6" aria-hidden="true" />
                <span>{rtl ? 'إضافة مشروع' : 'Add Project'}</span>
              </Button>
            </Link>
            <Link href="/admin/news">
              <Button variant="secondary" size="lg" className="h-20 justify-start gap-3">
                <Newspaper className="h-6 w-6" aria-hidden="true" />
                <span>{rtl ? 'إضافة مقال' : 'Add Article'}</span>
              </Button>
            </Link>
            <Link href="/admin/clients">
              <Button variant="secondary" size="lg" className="h-20 justify-start gap-3">
                <Handshake className="h-6 w-6" aria-hidden="true" />
                <span>{rtl ? 'إضافة عميل' : 'Add Client'}</span>
              </Button>
            </Link>
          </div>
        </Card>

        <Card variant="elevated" padding="lg">
          <h2 className="heading-card text-heading-lg text-primary-950 mb-6">{t('admin.recentActivity')}</h2>
          <div className="space-y-4">
            {[
              { action: t('admin.newProjectCreated'), item: 'Alrefai Commercial Tower', time: '2 hours ago', icon: FolderOpen, color: 'text-primary-600 bg-primary-100' },
              { action: t('admin.newMessageReceived'), item: 'Ahmed Al-Saeed', time: '4 hours ago', icon: MessageSquare, color: 'text-orange-600 bg-orange-100' },
              { action: t('admin.articlePublished'), item: 'Strategic Partnership with Aramco', time: '1 day ago', icon: Newspaper, color: 'text-green-600 bg-green-100' },
              { action: t('admin.newClientAdded'), item: 'Saudi Electricity Company', time: '2 days ago', icon: Handshake, color: 'text-blue-600 bg-blue-100' },
            ].map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-neutral-50 hover:bg-white transition-colors"
              >
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', activity.color)}>
                  <activity.icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-body text-neutral-900">{activity.action}</p>
                  <p className="text-body-sm text-neutral-500 truncate">{activity.item}</p>
                </div>
                <span className="text-caption text-neutral-400 whitespace-nowrap">{activity.time}</span>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
