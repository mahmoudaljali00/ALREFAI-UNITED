'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useI18n } from '@/context/I18nContext';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { CloudinaryUploader } from '@/components/admin/CloudinaryUploader';
import { AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { t, dir } = useI18n();
  const rtl = dir === 'rtl';
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    titleAr: '', titleEn: '', slug: '', category: 'commercial',
    locationAr: '', locationEn: '',
    shortDescriptionAr: '', shortDescriptionEn: '',
    descriptionAr: '', descriptionEn: '',
    mainImage: '', area: '', budget: '', clientAr: '', clientEn: '',
    status: 'COMPLETED', featured: false, displayOrder: 0, isActive: true,
  });

  useEffect(() => {
    fetch(`/api/projects/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          const p = data.data;
          setFormData({
            titleAr: p.titleAr, titleEn: p.titleEn, slug: p.slug, category: p.category,
            locationAr: p.locationAr || '', locationEn: p.locationEn || '',
            shortDescriptionAr: p.shortDescriptionAr || '', shortDescriptionEn: p.shortDescriptionEn || '',
            descriptionAr: p.descriptionAr || '', descriptionEn: p.descriptionEn || '',
            mainImage: p.mainImage || '', area: p.area || '', budget: p.budget || '',
            clientAr: p.clientAr || '', clientEn: p.clientEn || '',
            status: p.status, featured: p.featured, displayOrder: p.displayOrder, isActive: p.isActive,
          });
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [params.id]);

  const handleChange = (field: string, value: string | boolean | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const res = await fetch(`/api/projects/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || t('admin.errorOccurred'));
        return;
      }
      router.push('/admin/projects');
    } catch {
      setError(t('admin.errorOccurred'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
        <Link href="/admin/projects">
          <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4" aria-hidden="true" />{t('common.back')}</Button>
        </Link>
        <h1 className="heading-display text-display-lg text-primary-950">{rtl ? 'تعديل المشروع' : 'Edit Project'}</h1>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit}
        className="space-y-6"
        noValidate
      >
        {error && (
          <div className="flex items-center gap-3 p-4 rounded-lg bg-red-50 border border-red-200 text-red-800">
            <AlertCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
            <p className="text-body-sm">{error}</p>
          </div>
        )}

        <Card variant="elevated" padding="lg">
          <CardHeader><CardTitle size="lg">{rtl ? 'المعلومات الأساسية' : 'Basic Information'}</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Input label={rtl ? 'العنوان (عربي) *' : 'Title (Arabic) *'} value={formData.titleAr} onChange={(e) => handleChange('titleAr', e.target.value)} required dir="rtl" />
              <Input label={rtl ? 'العنوان (إنجليزي) *' : 'Title (English) *'} value={formData.titleEn} onChange={(e) => handleChange('titleEn', e.target.value)} required />
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <Input label="Slug" value={formData.slug} onChange={(e) => handleChange('slug', e.target.value)} />
              <div>
                <label className="label">{rtl ? 'التصنيف' : 'Category'}</label>
                <select value={formData.category} onChange={(e) => handleChange('category', e.target.value)} className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3.5 text-base focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20">
                  {['commercial', 'construction', 'engineering', 'infrastructure', 'industrial', 'other'].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">{rtl ? 'الحالة' : 'Status'}</label>
                <select value={formData.status} onChange={(e) => handleChange('status', e.target.value)} className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3.5 text-base focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20">
                  {['PLANNING', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD'].map((s) => (
                    <option key={s} value={s}>{s.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Input label={rtl ? 'الموقع (عربي)' : 'Location (Arabic)'} value={formData.locationAr} onChange={(e) => handleChange('locationAr', e.target.value)} dir="rtl" />
              <Input label={rtl ? 'الموقع (إنجليزي)' : 'Location (English)'} value={formData.locationEn} onChange={(e) => handleChange('locationEn', e.target.value)} />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Textarea label={rtl ? 'وصف مختصر (عربي)' : 'Short Description (Arabic)'} value={formData.shortDescriptionAr} onChange={(e) => handleChange('shortDescriptionAr', e.target.value)} rows={3} dir="rtl" />
              <Textarea label={rtl ? 'وصف مختصر (إنجليزي)' : 'Short Description (English)'} value={formData.shortDescriptionEn} onChange={(e) => handleChange('shortDescriptionEn', e.target.value)} rows={3} />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Textarea label={rtl ? 'الوصف الكامل (عربي)' : 'Full Description (Arabic)'} value={formData.descriptionAr} onChange={(e) => handleChange('descriptionAr', e.target.value)} rows={5} dir="rtl" />
              <Textarea label={rtl ? 'الوصف الكامل (إنجليزي)' : 'Full Description (English)'} value={formData.descriptionEn} onChange={(e) => handleChange('descriptionEn', e.target.value)} rows={5} />
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated" padding="lg">
          <CardHeader><CardTitle size="lg">{t('admin.media')}</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <CloudinaryUploader
              label={rtl ? 'الصورة الرئيسية' : 'Main Image'}
              folder="alrefai-united/projects"
              value={formData.mainImage || undefined}
              onChange={(media) => handleChange('mainImage', media?.url || '')}
            />
            <div className="grid md:grid-cols-3 gap-6">
              <Input label={rtl ? 'المساحة' : 'Area'} value={formData.area} onChange={(e) => handleChange('area', e.target.value)} />
              <Input label={rtl ? 'الميزانية' : 'Budget'} value={formData.budget} onChange={(e) => handleChange('budget', e.target.value)} />
              <Input label={rtl ? 'العميل (إنجليزي)' : 'Client (English)'} value={formData.clientEn} onChange={(e) => handleChange('clientEn', e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated" padding="lg">
          <CardHeader><CardTitle size="lg">{t('admin.settings')}</CardTitle></CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={formData.featured} onChange={(e) => handleChange('featured', e.target.checked)} className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500" />
                <span className="text-body">{t('common.featured')}</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={formData.isActive} onChange={(e) => handleChange('isActive', e.target.checked)} className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500" />
                <span className="text-body">{rtl ? 'نشط' : 'Active'}</span>
              </label>
              <Input label={rtl ? 'ترتيب العرض' : 'Display Order'} type="number" value={formData.displayOrder} onChange={(e) => handleChange('displayOrder', parseInt(e.target.value) || 0)} min={0} />
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          <Link href="/admin/projects">
            <Button type="button" variant="secondary" size="lg">{t('common.cancel')}</Button>
          </Link>
          <Button type="submit" variant="gold" size="lg" loading={saving}>
            {rtl ? 'حفظ التغييرات' : 'Save Changes'}
          </Button>
        </div>
      </motion.form>
    </div>
  );
}
