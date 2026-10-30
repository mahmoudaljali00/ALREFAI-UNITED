'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '@/context/I18nContext';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { CloudinaryUploader } from '@/components/admin/CloudinaryUploader';
import { Plus, Trash2, Loader2, Star, X } from 'lucide-react';

interface Testimonial {
  id: string;
  clientNameAr: string;
  clientNameEn: string;
  positionAr: string;
  positionEn: string;
  companyAr?: string;
  companyEn?: string;
  contentAr: string;
  contentEn: string;
  rating: number;
  isActive: boolean;
  displayOrder: number;
}

export default function AdminTestimonialsPage() {
  const { t, dir } = useI18n();
  const rtl = dir === 'rtl';
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    clientNameAr: '', clientNameEn: '', positionAr: '', positionEn: '',
    companyAr: '', companyEn: '', contentAr: '', contentEn: '',
    image: '', rating: 5, displayOrder: 0,
  });

  const fetchTestimonials = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/testimonials?limit=100');
      const data = await res.json();
      if (data.data) setTestimonials(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.clientNameAr || !form.clientNameEn || !form.contentAr || !form.contentEn) {
      setError(rtl ? 'الاسم والنص باللغتين مطلوبة' : 'Names and content in both languages are required');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setShowForm(false);
        setForm({ clientNameAr: '', clientNameEn: '', positionAr: '', positionEn: '', companyAr: '', companyEn: '', contentAr: '', contentEn: '', image: '', rating: 5, displayOrder: 0 });
        fetchTestimonials();
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
      const res = await fetch(`/api/testimonials/${id}`, { method: 'DELETE' });
      if (res.ok) fetchTestimonials();
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
          <h1 className="heading-display text-display-sm text-primary-950">{t('admin.testimonials')}</h1>
          <p className="text-body text-neutral-600 mt-1">{rtl ? 'إدارة شهادات العملاء' : 'Manage client testimonials'}</p>
        </div>
        <Button variant="gold" onClick={() => setShowForm(!showForm)}>
          {showForm ? <X className="h-5 w-5" aria-hidden="true" /> : <Plus className="h-5 w-5" aria-hidden="true" />}
          {showForm ? t('common.cancel') : t('admin.addNew')}
        </Button>
      </motion.div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card variant="elevated" padding="lg">
            <CardContent>
              <form onSubmit={handleCreate} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Input label={rtl ? 'اسم العميل (عربي) *' : 'Client Name (Arabic) *'} value={form.clientNameAr} onChange={(e) => setForm({ ...form, clientNameAr: e.target.value })} required dir="rtl" />
                  <Input label={rtl ? 'اسم العميل (إنجليزي) *' : 'Client Name (English) *'} value={form.clientNameEn} onChange={(e) => setForm({ ...form, clientNameEn: e.target.value })} required />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <Input label={rtl ? 'المنصب (عربي)' : 'Position (Arabic)'} value={form.positionAr} onChange={(e) => setForm({ ...form, positionAr: e.target.value })} dir="rtl" />
                  <Input label={rtl ? 'المنصب (إنجليزي)' : 'Position (English)'} value={form.positionEn} onChange={(e) => setForm({ ...form, positionEn: e.target.value })} />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <Input label={rtl ? 'الشركة (عربي)' : 'Company (Arabic)'} value={form.companyAr} onChange={(e) => setForm({ ...form, companyAr: e.target.value })} dir="rtl" />
                  <Input label={rtl ? 'الشركة (إنجليزي)' : 'Company (English)'} value={form.companyEn} onChange={(e) => setForm({ ...form, companyEn: e.target.value })} />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <Textarea label={rtl ? 'نص الشهادة (عربي) *' : 'Testimonial (Arabic) *'} value={form.contentAr} onChange={(e) => setForm({ ...form, contentAr: e.target.value })} rows={4} required dir="rtl" />
                  <Textarea label={rtl ? 'نص الشهادة (إنجليزي) *' : 'Testimonial (English) *'} value={form.contentEn} onChange={(e) => setForm({ ...form, contentEn: e.target.value })} rows={4} required />
                </div>
                <div className="grid md:grid-cols-3 gap-6 items-start">
                  <div>
                    <label className="label">{rtl ? 'التقييم' : 'Rating'}</label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} type="button" onClick={() => setForm({ ...form, rating: star })} aria-label={`${star} stars`}>
                          <Star className={`h-6 w-6 ${star <= form.rating ? 'fill-gold-400 text-gold-400' : 'text-neutral-300'}`} aria-hidden="true" />
                        </button>
                      ))}
                    </div>
                  </div>
                  <Input label={rtl ? 'ترتيب العرض' : 'Display Order'} type="number" value={form.displayOrder} onChange={(e) => setForm({ ...form, displayOrder: parseInt(e.target.value) || 0 })} min={0} />
                </div>
                <CloudinaryUploader label={rtl ? 'صورة العميل' : 'Client Photo'} folder="alrefai-united/testimonials" value={form.image || undefined} onChange={(media) => setForm({ ...form, image: media?.url || '' })} />
                {error && <p className="text-sm text-red-600">{error}</p>}
                <div className="flex justify-end gap-3">
                  <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>{t('common.cancel')}</Button>
                  <Button type="submit" variant="gold" loading={saving}>{rtl ? 'إضافة الشهادة' : 'Add Testimonial'}</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary-500" aria-hidden="true" /></div>
        ) : testimonials.length === 0 ? (
          <div className="col-span-full text-center py-16">
            <Star className="h-10 w-10 mx-auto text-neutral-300 mb-3" aria-hidden="true" />
            <p className="text-body text-neutral-500">{rtl ? 'لا توجد شهادات بعد' : 'No testimonials yet'}</p>
          </div>
        ) : (
          testimonials.map((testimonial) => (
            <motion.div key={testimonial.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card variant="elevated" padding="lg" className="h-full">
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < testimonial.rating ? 'fill-gold-400 text-gold-400' : 'text-neutral-300'}`} aria-hidden="true" />
                  ))}
                </div>
                <p className="text-body-sm text-neutral-600 line-clamp-4 mb-4">
                  {rtl ? testimonial.contentAr : testimonial.contentEn}
                </p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-neutral-100">
                  <div>
                    <p className="font-medium text-sm text-neutral-900">{rtl ? testimonial.clientNameAr : testimonial.clientNameEn}</p>
                    <p className="text-caption text-neutral-500">{rtl ? testimonial.positionAr : testimonial.positionEn}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(testimonial.id)}
                    disabled={deletingId === testimonial.id}
                    className="text-red-600 hover:bg-red-50"
                    aria-label={t('admin.deleteItem')}
                  >
                    {deletingId === testimonial.id ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Trash2 className="h-4 w-4" aria-hidden="true" />}
                  </Button>
                </div>
                <div className="mt-3">
                  <Badge variant={testimonial.isActive ? 'success' : 'outline'} size="sm">{testimonial.isActive ? (rtl ? 'نشط' : 'Active') : rtl ? 'غير نشط' : 'Inactive'}</Badge>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
