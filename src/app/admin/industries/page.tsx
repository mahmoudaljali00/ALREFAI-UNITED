'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '@/context/I18nContext';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { CloudinaryUploader } from '@/components/admin/CloudinaryUploader';
import { Plus, Trash2, Loader2, X, Pencil, Save } from 'lucide-react';

interface Industry {
  id: string;
  nameAr: string;
  nameEn: string;
  slug: string;
  descriptionAr?: string;
  descriptionEn?: string;
  icon?: string;
  image?: string;
  featured: boolean;
  isActive: boolean;
  displayOrder: number;
}

const emptyForm = {
  nameAr: '', nameEn: '', descriptionAr: '', descriptionEn: '',
  icon: '', image: '', featured: false, isActive: true, displayOrder: 0,
};

export default function AdminIndustriesPage() {
  const { t, dir } = useI18n();
  const rtl = dir === 'rtl';
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const fetchIndustries = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/industries?limit=100');
      const data = await res.json();
      if (data.data) setIndustries(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIndustries();
  }, [fetchIndustries]);

  const startEdit = (industry: Industry) => {
    setEditingId(industry.id);
    setShowForm(true);
    setForm({
      nameAr: industry.nameAr, nameEn: industry.nameEn,
      descriptionAr: industry.descriptionAr || '', descriptionEn: industry.descriptionEn || '',
      icon: industry.icon || '', image: industry.image || '',
      featured: industry.featured, isActive: industry.isActive, displayOrder: industry.displayOrder,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.nameAr || !form.nameEn) {
      setError(rtl ? 'الاسم باللغتين مطلوب' : 'Name in both languages is required');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(editingId ? `/api/industries/${editingId}` : '/api/industries', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        resetForm();
        fetchIndustries();
      } else {
        const data = await res.json();
        setError(data.error || t('admin.errorOccurred'));
      }
    } catch {
      setError(t('admin.errorOccurred'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('admin.deleteConfirmation'))) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/industries/${id}`, { method: 'DELETE' });
      if (res.ok) fetchIndustries();
      else alert(t('admin.errorOccurred'));
    } catch {
      alert(t('admin.errorOccurred'));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="heading-display text-display-sm text-primary-950">{rtl ? 'القطاعات' : 'Industries'}</h1>
          <p className="text-body text-neutral-600 mt-1">{rtl ? 'إدارة القطاعات التي نخدمها' : 'Manage the industries you serve'}</p>
        </div>
        <Button variant="gold" onClick={() => (showForm ? resetForm() : setShowForm(true))}>
          {showForm ? <X className="h-5 w-5" aria-hidden="true" /> : <Plus className="h-5 w-5" aria-hidden="true" />}
          {showForm ? t('common.cancel') : t('admin.addNew')}
        </Button>
      </motion.div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card variant="elevated" padding="lg">
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Input label={rtl ? 'الاسم (عربي) *' : 'Name (Arabic) *'} value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} required dir="rtl" />
                  <Input label={rtl ? 'الاسم (إنجليزي) *' : 'Name (English) *'} value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} required />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <Textarea label={rtl ? 'الوصف (عربي)' : 'Description (Arabic)'} value={form.descriptionAr} onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })} rows={3} dir="rtl" />
                  <Textarea label={rtl ? 'الوصف (إنجليزي)' : 'Description (English)'} value={form.descriptionEn} onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })} rows={3} />
                </div>
                <div className="grid md:grid-cols-3 gap-6 items-start">
                  <Input label={rtl ? 'أيقونة (Lucide)' : 'Icon (Lucide)'} value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="Building2" />
                  <Input label={rtl ? 'ترتيب العرض' : 'Display Order'} type="number" value={form.displayOrder} onChange={(e) => setForm({ ...form, displayOrder: parseInt(e.target.value) || 0 })} min={0} />
                  <div className="space-y-3 pt-1">
                    <label className="flex items-center gap-2 text-sm text-neutral-700 cursor-pointer">
                      <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500" />
                      {rtl ? 'قطاع رئيسي' : 'Featured'}
                    </label>
                    <label className="flex items-center gap-2 text-sm text-neutral-700 cursor-pointer">
                      <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500" />
                      {rtl ? 'نشط' : 'Active'}
                    </label>
                  </div>
                </div>
                <CloudinaryUploader label={rtl ? 'صورة القطاع' : 'Industry Image'} folder="alrefai-united/industries" value={form.image || undefined} onChange={(media) => setForm({ ...form, image: media?.url || '' })} />
                {error && <p className="text-sm text-red-600">{error}</p>}
                <div className="flex justify-end gap-3">
                  <Button type="button" variant="secondary" onClick={resetForm}>{t('common.cancel')}</Button>
                  <Button type="submit" variant="gold" loading={saving}>
                    {editingId ? <><Save className="h-5 w-5" aria-hidden="true" />{rtl ? 'حفظ التعديلات' : 'Save Changes'}</> : <><Plus className="h-5 w-5" aria-hidden="true" />{rtl ? 'إضافة القطاع' : 'Add Industry'}</>}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary-500" aria-hidden="true" /></div>
        ) : industries.length === 0 ? (
          <div className="col-span-full text-center py-16">
            <p className="text-body text-neutral-500">{rtl ? 'لا توجد قطاعات بعد' : 'No industries yet'}</p>
          </div>
        ) : (
          industries.map((industry) => (
            <motion.div key={industry.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card variant="elevated" padding="lg" className="h-full">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="heading-card text-heading-sm text-primary-950">{rtl ? industry.nameAr : industry.nameEn}</h3>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button variant="ghost" size="sm" onClick={() => startEdit(industry)} aria-label={t('admin.editItem')} className="text-primary-700 hover:bg-primary-50">
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(industry.id)} disabled={deletingId === industry.id} className="text-red-600 hover:bg-red-50" aria-label={t('admin.deleteItem')}>
                      {deletingId === industry.id ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Trash2 className="h-4 w-4" aria-hidden="true" />}
                    </Button>
                  </div>
                </div>
                <p className="text-body-sm text-neutral-600 line-clamp-2 mb-4">
                  {rtl ? industry.descriptionAr : industry.descriptionEn}
                </p>
                <div className="flex items-center gap-2 mt-auto">
                  <Badge variant={industry.isActive ? 'success' : 'outline'} size="sm">{industry.isActive ? (rtl ? 'نشط' : 'Active') : rtl ? 'غير نشط' : 'Inactive'}</Badge>
                  {industry.featured && <Badge variant="gold" size="sm">{rtl ? 'رئيسي' : 'Featured'}</Badge>}
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
