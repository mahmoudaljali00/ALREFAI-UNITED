'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useI18n } from '@/context/I18nContext';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Loader2, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';

export default function EditServicePage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { t } = useI18n();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    titleAr: '',
    titleEn: '',
    slug: '',
    shortDescriptionAr: '',
    shortDescriptionEn: '',
    descriptionAr: '',
    descriptionEn: '',
    icon: '',
    image: '',
    featured: false,
    displayOrder: 0,
    isActive: true,
    metaTitleAr: '',
    metaTitleEn: '',
    metaDescriptionAr: '',
    metaDescriptionEn: '',
  });

  const fetchService = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/services/${id}`);
      const data = await res.json();
      if (data.data) {
        const service = data.data;
        setFormData({
          titleAr: service.titleAr || '',
          titleEn: service.titleEn || '',
          slug: service.slug || '',
          shortDescriptionAr: service.shortDescriptionAr || '',
          shortDescriptionEn: service.shortDescriptionEn || '',
          descriptionAr: service.descriptionAr || '',
          descriptionEn: service.descriptionEn || '',
          icon: service.icon || '',
          image: service.image || '',
          featured: service.featured || false,
          displayOrder: service.displayOrder || 0,
          isActive: service.isActive !== false,
          metaTitleAr: service.metaTitleAr || '',
          metaTitleEn: service.metaTitleEn || '',
          metaDescriptionAr: service.metaDescriptionAr || '',
          metaDescriptionEn: service.metaDescriptionEn || '',
        });
      }
    } catch (err) {
      console.error('Fetch service error:', err);
      setError(t('admin.errorOccurred'));
    } finally {
      setLoading(false);
    }
  }, [id, t]);

  useEffect(() => {
    fetchService();
  }, [fetchService]);

  const handleChange = (field: string, value: string | boolean | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    if (!formData.titleAr || !formData.titleEn) {
      setError(t('admin.titleRequired') || 'Title in both languages is required');
      setSaving(false);
      return;
    }

    try {
      const res = await fetch(`/api/services/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t('admin.errorOccurred'));
        return;
      }

      setSuccess(t('admin.updatedSuccessfully') || 'Updated successfully');
      setTimeout(() => router.push('/admin/services'), 1500);
    } catch {
      setError(t('admin.errorOccurred'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <Link href="/admin/services">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-1" aria-hidden="true" />
            {t('common.back')}
          </Button>
        </Link>
        <div>
          <h1 className="heading-display text-display-lg text-primary-950">{t('admin.editService')}</h1>
          <p className="text-body text-neutral-600 mt-1">{t('admin.editServiceDesc') || 'Update service details'}</p>
        </div>
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
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 p-4 rounded-lg bg-red-50 border border-red-200 text-red-800"
          >
            <AlertCircle className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
            <p className="text-body-sm">{error}</p>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 p-4 rounded-lg bg-green-50 border border-green-200 text-green-800"
          >
            <CheckCircle className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
            <p className="text-body-sm">{success}</p>
          </motion.div>
        )}

        <Card variant="elevated" padding="lg">
          <CardHeader>
            <CardTitle className="text-heading-lg">{t('admin.basicInfo')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label={t('admin.titleAr') || 'Title (Arabic) *'}
                value={formData.titleAr}
                onChange={(e) => handleChange('titleAr', e.target.value)}
                placeholder={t('admin.titleAr')}
                required
                dir="rtl"
              />
              <Input
                label={t('admin.titleEn') || 'Title (English) *'}
                value={formData.titleEn}
                onChange={(e) => handleChange('titleEn', e.target.value)}
                placeholder={t('admin.titleEn')}
                required
              />
            </div>

            <Input
              label={t('common.slug') || 'Slug *'}
              value={formData.slug}
              onChange={(e) => handleChange('slug', e.target.value)}
              placeholder={t('common.slug')}
              helperText={t('admin.slugHelper') || 'URL-friendly identifier'}
            />

            <div className="grid md:grid-cols-2 gap-6">
              <Textarea
                label={t('admin.shortDescAr') || 'Short Description (Arabic)'}
                value={formData.shortDescriptionAr}
                onChange={(e) => handleChange('shortDescriptionAr', e.target.value)}
                placeholder={t('admin.shortDescAr')}
                rows={3}
                dir="rtl"
              />
              <Textarea
                label={t('admin.shortDescEn') || 'Short Description (English)'}
                value={formData.shortDescriptionEn}
                onChange={(e) => handleChange('shortDescriptionEn', e.target.value)}
                placeholder={t('admin.shortDescEn')}
                rows={3}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Textarea
                label={t('admin.descAr') || 'Full Description (Arabic)'}
                value={formData.descriptionAr}
                onChange={(e) => handleChange('descriptionAr', e.target.value)}
                placeholder={t('admin.descAr')}
                rows={5}
                dir="rtl"
              />
              <Textarea
                label={t('admin.descEn') || 'Full Description (English)'}
                value={formData.descriptionEn}
                onChange={(e) => handleChange('descriptionEn', e.target.value)}
                placeholder={t('admin.descEn')}
                rows={5}
              />
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated" padding="lg">
          <CardHeader>
            <CardTitle className="text-heading-lg">{t('admin.media')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label={t('admin.icon') || 'Icon'}
                value={formData.icon}
                onChange={(e) => handleChange('icon', e.target.value)}
                placeholder={t('admin.iconPlaceholder') || 'e.g., cog, hammer, truck, building2'}
                helperText={t('admin.iconHelper') || 'Lucide icon name'}
              />
              <Input
                label={t('admin.image') || 'Image URL'}
                value={formData.image}
                onChange={(e) => handleChange('image', e.target.value)}
                placeholder={t('admin.imagePlaceholder') || 'https://example.com/image.jpg'}
              />
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated" padding="lg">
          <CardHeader>
            <CardTitle className="text-heading-lg">{t('admin.settings')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => handleChange('featured', e.target.checked)}
                  className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-body">{t('admin.featured')}</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => handleChange('isActive', e.target.checked)}
                  className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-body">{t('admin.active')}</span>
              </label>
              <Input
                label={t('admin.displayOrder') || 'Display Order'}
                type="number"
                value={formData.displayOrder}
                onChange={(e) => handleChange('displayOrder', parseInt(e.target.value) || 0)}
                min={0}
              />
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated" padding="lg">
          <CardHeader>
            <CardTitle className="text-heading-lg">{t('admin.seo')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label={t('admin.metaTitleAr') || 'Meta Title (Arabic)'}
                value={formData.metaTitleAr}
                onChange={(e) => handleChange('metaTitleAr', e.target.value)}
                placeholder={t('admin.metaTitleAr')}
                dir="rtl"
              />
              <Input
                label={t('admin.metaTitleEn') || 'Meta Title (English)'}
                value={formData.metaTitleEn}
                onChange={(e) => handleChange('metaTitleEn', e.target.value)}
                placeholder={t('admin.metaTitleEn')}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Textarea
                label={t('admin.metaDescAr') || 'Meta Description (Arabic)'}
                value={formData.metaDescriptionAr}
                onChange={(e) => handleChange('metaDescriptionAr', e.target.value)}
                placeholder={t('admin.metaDescAr')}
                rows={3}
                dir="rtl"
              />
              <Textarea
                label={t('admin.metaDescEn') || 'Meta Description (English)'}
                value={formData.metaDescriptionEn}
                onChange={(e) => handleChange('metaDescriptionEn', e.target.value)}
                placeholder={t('admin.metaDescEn')}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-end"
        >
          <Link href="/admin/services">
            <Button variant="secondary" size="lg">
              <ArrowLeft className="h-5 w-5 mr-2" aria-hidden="true" />
              {t('common.cancel')}
            </Button>
          </Link>
          <Button type="submit" variant="gold" size="lg" loading={saving}>
            {saving ? t('common.saving') : t('admin.updateService')}
            <Loader2 className={cn('h-5 w-5', saving ? 'animate-spin' : 'hidden')} aria-hidden="true" />
          </Button>
        </motion.div>
      </motion.form>
    </div>
  );
}
