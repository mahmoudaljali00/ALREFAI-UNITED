'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useI18n } from '@/context/I18nContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Plus, Search, Edit, Trash2, Filter, Loader2, FolderOpen } from 'lucide-react';

interface Project {
  id: string;
  titleAr: string;
  titleEn: string;
  slug: string;
  category: string;
  status: string;
  featured: boolean;
  displayOrder: number;
  isActive: boolean;
  mainImage?: string;
  createdAt: string;
}

const statusVariants: Record<string, 'success' | 'gold' | 'outline'> = {
  COMPLETED: 'success',
  IN_PROGRESS: 'gold',
  PLANNING: 'outline',
  ON_HOLD: 'outline',
};

export default function AdminProjectsPage() {
  const { t, dir } = useI18n();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: page.toString(), limit: '10' });
      if (search) params.set('search', search);
      if (statusFilter === 'active') params.set('isActive', 'true');
      if (statusFilter === 'inactive') params.set('isActive', 'false');
      const res = await fetch(`/api/projects?${params}`);
      const data = await res.json();
      if (data.data) {
        setProjects(data.data);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error('Fetch projects error:', error);
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('admin.deleteConfirmation'))) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (res.ok) fetchProjects();
      else alert(t('admin.errorOccurred'));
    } catch {
      alert(t('admin.errorOccurred'));
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
          <h1 className="heading-display text-display-sm text-primary-950">{t('admin.projects')}</h1>
          <p className="text-body text-neutral-600 mt-1">{dir === 'rtl' ? 'إدارة مشاريع الشركة' : 'Manage company projects'}</p>
        </div>
        <Link href="/admin/projects/new">
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
        className="bg-white rounded-2xl border border-neutral-200 overflow-hidden"
      >
        <div className="p-6 border-b border-neutral-200 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" aria-hidden="true" />
            <Input placeholder={t('common.search')} value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-10" />
          </div>
          <div className="flex items-center gap-3">
            <Filter className="h-5 w-5 text-neutral-400" aria-hidden="true" />
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="px-4 py-2.5 rounded-lg border border-neutral-300 bg-white text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              <option value="all">{t('common.viewAll')}</option>
              <option value="active">{dir === 'rtl' ? 'نشط' : 'Active'}</option>
              <option value="inactive">{dir === 'rtl' ? 'غير نشط' : 'Inactive'}</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full" role="table">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-6 py-4 text-start font-medium text-neutral-500 text-sm">{dir === 'rtl' ? 'المشروع' : 'Project'}</th>
                <th className="px-6 py-4 text-start font-medium text-neutral-500 text-sm">{dir === 'rtl' ? 'التصنيف' : 'Category'}</th>
                <th className="px-6 py-4 text-start font-medium text-neutral-500 text-sm">{dir === 'rtl' ? 'الحالة' : 'Status'}</th>
                <th className="px-6 py-4 text-start font-medium text-neutral-500 text-sm">{dir === 'rtl' ? 'مميز' : 'Featured'}</th>
                <th className="px-6 py-4 text-start font-medium text-neutral-500 text-sm">{dir === 'rtl' ? 'الإجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary-500" aria-hidden="true" /></td></tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <FolderOpen className="h-10 w-10 mx-auto text-neutral-300 mb-3" aria-hidden="true" />
                    <p className="text-body text-neutral-500">{dir === 'rtl' ? 'لا توجد مشاريع بعد' : 'No projects yet'}</p>
                  </td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr key={project.id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {project.mainImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={project.mainImage} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                            <FolderOpen className="h-5 w-5 text-primary-500" aria-hidden="true" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-neutral-900">{dir === 'rtl' ? project.titleAr : project.titleEn}</div>
                          <div className="text-body-sm text-neutral-500 font-mono text-xs">{project.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-body-sm text-neutral-600">{project.category}</td>
                    <td className="px-6 py-4">
                      <Badge variant={statusVariants[project.status] || 'outline'} size="sm">{project.status.replace('_', ' ')}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      {project.featured ? <Badge variant="gold" size="sm" dot>{dir === 'rtl' ? 'نعم' : 'Yes'}</Badge> : <span className="text-neutral-400 text-sm">—</span>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/projects/${project.slug}`} target="_blank">
                          <Button variant="ghost" size="sm" aria-label={t('common.viewAll')}><Edit className="h-4 w-4 opacity-0" aria-hidden="true" /></Button>
                        </Link>
                        <Link href={`/admin/projects/${project.id}/edit`}>
                          <Button variant="ghost" size="sm" aria-label={t('admin.editItem')}><Edit className="h-4 w-4" aria-hidden="true" /></Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(project.id)}
                          disabled={deletingId === project.id}
                          aria-label={t('admin.deleteItem')}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          {deletingId === project.id ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Trash2 className="h-4 w-4" aria-hidden="true" />}
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
            <p className="text-body-sm text-neutral-500">{total} {dir === 'rtl' ? 'نتيجة' : 'results'}</p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                {dir === 'rtl' ? 'السابق' : 'Previous'}
              </Button>
              <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                {dir === 'rtl' ? 'التالي' : 'Next'}
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
