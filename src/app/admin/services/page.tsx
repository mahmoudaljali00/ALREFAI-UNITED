'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useI18n } from '@/context/I18nContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Plus, Search, Edit, Trash2, Eye, Filter, Loader2 } from 'lucide-react';

interface Service {
  id: string;
  titleAr: string;
  titleEn: string;
  slug: string;
  icon?: string;
  image?: string;
  featured: boolean;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
}

export default function AdminServicesPage() {
  const { t, dir } = useI18n();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        search,
        isActive: statusFilter === 'all' ? '' : statusFilter === 'active' ? 'true' : 'false',
      });
      const res = await fetch(`/api/services?${params}`);
      const data = await res.json();
      if (data.data) {
        setServices(data.data);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error('Fetch services error:', error);
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('admin.confirmDelete') || 'Are you sure you want to delete this item?')) return;
    
    setDeletingId(id);
    try {
      const res = await fetch(`/api/services/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchServices();
      } else {
        alert(t('admin.errorOccurred') || 'Error occurred');
      }
    } catch (error) {
      console.error('Delete service error:', error);
      alert(t('admin.errorOccurred') || 'Error occurred');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="heading-display text-display-sm text-primary-950">{t('admin.services')}</h1>
          <p className="text-body text-neutral-600 mt-1">{t('admin.manageServices') || 'Manage your services'}</p>
        </div>
        <Link href="/admin/services/new">
          <Button variant="gold">
            <Plus className="h-5 w-5" aria-hidden="true" />
            {t('admin.addNew')}
          </Button>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card-hover bg-white rounded-2xl border border-neutral-200"
      >
        <div className="p-6 border-b border-neutral-200 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" aria-hidden="true" />
            <Input
              placeholder={t('common.search') || 'Search...'}
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-3">
            <Filter className="h-5 w-5 text-neutral-400" aria-hidden="true" />
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="px-4 py-2.5 rounded-lg border border-neutral-300 bg-white text-neutral-900 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              <option value="all">{t('common.all') || 'All'}</option>
              <option value="active">{t('common.active') || 'Active'}</option>
              <option value="inactive">{t('common.inactive') || 'Inactive'}</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full" role="table">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="px-6 py-4 text-right font-medium text-neutral-500">{t('common.id') || '#'}</th>
                <th className="px-6 py-4 text-right font-medium text-neutral-500">{t('common.title')}</th>
                <th className="px-6 py-4 text-right font-medium text-neutral-500">{t('common.slug')}</th>
                <th className="px-6 py-4 text-right font-medium text-neutral-500">{t('common.status')}</th>
                <th className="px-6 py-4 text-right font-medium text-neutral-500">{t('common.featured')}</th>
                <th className="px-6 py-4 text-right font-medium text-neutral-500">{t('common.order')}</th>
                <th className="px-6 py-4 text-right font-medium text-neutral-500">{t('common.createdAt')}</th>
                <th className="px-6 py-4 text-right font-medium text-neutral-500">{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary-500" aria-hidden="true" />
                    <p className="mt-2 text-body text-neutral-500">{t('common.loading')}</p>
                  </td>
                </tr>
              ) : services.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <p className="text-body text-neutral-500">{t('admin.noServicesFound') || 'No services found'}</p>
                  </td>
                </tr>
              ) : (
                services.map((service) => (
                  <tr key={service.id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4 text-body-sm text-neutral-500 font-mono">{service.id.slice(0, 8)}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-neutral-900">{dir === 'rtl' ? service.titleAr : service.titleEn}</div>
                      <div className="text-body-sm text-neutral-500">{dir === 'rtl' ? service.titleEn : service.titleAr}</div>
                    </td>
                    <td className="px-6 py-4 text-body-sm text-neutral-500 font-mono">{service.slug}</td>
                    <td className="px-6 py-4">
                      <Badge variant={service.isActive ? 'success' : 'outline'} size="sm">
                        {service.isActive ? (t('common.active') || 'Active') : (t('common.inactive') || 'Inactive')}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={service.featured ? 'gold' : 'outline'} size="sm" dot>
                        {service.featured ? (t('common.featured') || 'Featured') : (t('common.normal') || 'Normal')}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-body-sm text-neutral-500">{service.displayOrder}</td>
                    <td className="px-6 py-4 text-body-sm text-neutral-500">
                      {new Date(service.createdAt).toLocaleDateString(dir === 'rtl' ? 'ar-SA' : 'en-US')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/services/${service.slug}`} target="_blank">
                          <Button variant="ghost" size="sm" aria-label={t('common.view')}>
                            <Eye className="h-4 w-4" aria-hidden="true" />
                          </Button>
                        </Link>
                        <Link href={`/admin/services/${service.id}/edit`}>
                          <Button variant="ghost" size="sm" aria-label={t('common.edit')}>
                            <Edit className="h-4 w-4" aria-hidden="true" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(service.id)}
                          disabled={deletingId === service.id}
                          aria-label={t('common.delete')}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          {deletingId === service.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                          ) : (
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="p-6 border-t border-neutral-200 flex items-center justify-between">
            <p className="text-body-sm text-neutral-500">
              {t('admin.showing')} {((page - 1) * 10) + 1} - {Math.min(page * 10, total)} {t('admin.of')} {total} {t('admin.results')}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                {t('common.previous')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                {t('common.next')}
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
