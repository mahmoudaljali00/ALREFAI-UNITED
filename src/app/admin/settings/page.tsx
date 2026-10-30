'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '@/context/I18nContext';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { CloudinaryUploader } from '@/components/admin/CloudinaryUploader';
import { AlertCircle, Loader2, Save, CheckCircle } from 'lucide-react';

interface CompanySettings {
  nameAr: string; nameEn: string;
  taglineAr: string; taglineEn: string;
  descriptionAr: string; descriptionEn: string;
  visionAr: string; visionEn: string;
  missionAr: string; missionEn: string;
  foundedYear: string;
  addressAr: string; addressEn: string;
  phone: string; email: string; whatsapp: string;
  workingHoursAr: string; workingHoursEn: string;
  mapEmbedUrl: string;
  logoLight: string;
}

export default function AdminSettingsPage() {
  const { t, dir } = useI18n();
  const rtl = dir === 'rtl';
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [form, setForm] = useState<CompanySettings>({
    nameAr: '', nameEn: '', taglineAr: '', taglineEn: '',
    descriptionAr: '', descriptionEn: '', visionAr: '', visionEn: '', missionAr: '', missionEn: '',
    foundedYear: '', addressAr: '', addressEn: '', phone: '', email: '', whatsapp: '',
    workingHoursAr: '', workingHoursEn: '', mapEmbedUrl: '', logoLight: '',
  });

  useEffect(() => {
    fetch('/api/public/company')
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          const c = data.data;
          setForm({
            nameAr: c.nameAr || '', nameEn: c.nameEn || '',
            taglineAr: c.taglineAr || '', taglineEn: c.taglineEn || '',
            descriptionAr: c.descriptionAr || '', descriptionEn: c.descriptionEn || '',
            visionAr: c.visionAr || '', visionEn: c.visionEn || '',
            missionAr: c.missionAr || '', missionEn: c.missionEn || '',
            foundedYear: c.foundedYear?.toString() || '',
            addressAr: c.addressAr || '', addressEn: c.addressEn || '',
            phone: c.phone || '', email: c.email || '', whatsapp: c.whatsapp || '',
            workingHoursAr: c.workingHoursAr || '', workingHoursEn: c.workingHoursEn || '',
            mapEmbedUrl: c.mapEmbedUrl || '', logoLight: c.logoLight || '',
          });
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setSaving(true);
    try {
      const res = await fetch('/api/settings/company', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, foundedYear: form.foundedYear ? parseInt(form.foundedYear) : null }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || t('admin.errorOccurred') });
        return;
      }
      setMessage({ type: 'success', text: t('admin.updatedSuccessfully') });
    } catch {
      setMessage({ type: 'error', text: t('admin.errorOccurred') });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-primary-500" aria-hidden="true" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="heading-display text-display-sm text-primary-950">{t('admin.companyInfo')}</h1>
        <p className="text-body text-neutral-600 mt-1">{rtl ? 'تُحدَّث صفحات الموقع تلقائياً من هذه البيانات' : 'Site pages update automatically from this data'}</p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {message && (
          <div className={`flex items-center gap-3 p-4 rounded-lg border ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
            {message.type === 'success' ? <CheckCircle className="h-5 w-5 shrink-0" aria-hidden="true" /> : <AlertCircle className="h-5 w-5 shrink-0" aria-hidden="true" />}
            <p className="text-body-sm">{message.text}</p>
          </div>
        )}

        <Card variant="elevated" padding="lg">
          <CardHeader><CardTitle size="lg">{rtl ? 'الهوية' : 'Identity'}</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Input label={rtl ? 'الاسم (عربي)' : 'Name (Arabic)'} value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} dir="rtl" />
              <Input label={rtl ? 'الاسم (إنجليزي)' : 'Name (English)'} value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Input label={rtl ? 'الشعار النصي (عربي)' : 'Tagline (Arabic)'} value={form.taglineAr} onChange={(e) => setForm({ ...form, taglineAr: e.target.value })} dir="rtl" />
              <Input label={rtl ? 'الشعار النصي (إنجليزي)' : 'Tagline (English)'} value={form.taglineEn} onChange={(e) => setForm({ ...form, taglineEn: e.target.value })} />
            </div>
            <div className="grid md:grid-cols-3 gap-6 items-start">
              <CloudinaryUploader label={rtl ? 'الشعار' : 'Logo'} folder="alrefai-united/company" value={form.logoLight || undefined} onChange={(media) => setForm({ ...form, logoLight: media?.url || '' })} />
              <Input label={rtl ? 'سنة التأسيس' : 'Founded Year'} type="number" value={form.foundedYear} onChange={(e) => setForm({ ...form, foundedYear: e.target.value })} />
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated" padding="lg">
          <CardHeader><CardTitle size="lg">{rtl ? 'الرؤية والرسالة' : 'Vision & Mission'}</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Textarea label={rtl ? 'الوصف (عربي)' : 'Description (Arabic)'} value={form.descriptionAr} onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })} rows={4} dir="rtl" />
              <Textarea label={rtl ? 'الوصف (إنجليزي)' : 'Description (English)'} value={form.descriptionEn} onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })} rows={4} />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Textarea label={rtl ? 'الرؤية (عربي)' : 'Vision (Arabic)'} value={form.visionAr} onChange={(e) => setForm({ ...form, visionAr: e.target.value })} rows={3} dir="rtl" />
              <Textarea label={rtl ? 'الرؤية (إنجليزي)' : 'Vision (English)'} value={form.visionEn} onChange={(e) => setForm({ ...form, visionEn: e.target.value })} rows={3} />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Textarea label={rtl ? 'الرسالة (عربي)' : 'Mission (Arabic)'} value={form.missionAr} onChange={(e) => setForm({ ...form, missionAr: e.target.value })} rows={3} dir="rtl" />
              <Textarea label={rtl ? 'الرسالة (إنجليزي)' : 'Mission (English)'} value={form.missionEn} onChange={(e) => setForm({ ...form, missionEn: e.target.value })} rows={3} />
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated" padding="lg">
          <CardHeader><CardTitle size="lg">{rtl ? 'معلومات التواصل' : 'Contact Information'}</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Input label={rtl ? 'العنوان (عربي)' : 'Address (Arabic)'} value={form.addressAr} onChange={(e) => setForm({ ...form, addressAr: e.target.value })} dir="rtl" />
              <Input label={rtl ? 'العنوان (إنجليزي)' : 'Address (English)'} value={form.addressEn} onChange={(e) => setForm({ ...form, addressEn: e.target.value })} />
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <Input label={rtl ? 'الهاتف' : 'Phone'} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} dir="ltr" />
              <Input label={rtl ? 'البريد الإلكتروني' : 'Email'} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} dir="ltr" />
              <Input label={rtl ? 'واتساب' : 'WhatsApp'} value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} dir="ltr" />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Input label={rtl ? 'ساعات العمل (عربي)' : 'Working Hours (Arabic)'} value={form.workingHoursAr} onChange={(e) => setForm({ ...form, workingHoursAr: e.target.value })} dir="rtl" />
              <Input label={rtl ? 'ساعات العمل (إنجليزي)' : 'Working Hours (English)'} value={form.workingHoursEn} onChange={(e) => setForm({ ...form, workingHoursEn: e.target.value })} />
            </div>
            <Input label={rtl ? 'رابط خريطة Google (Embed)' : 'Google Maps Embed URL'} value={form.mapEmbedUrl} onChange={(e) => setForm({ ...form, mapEmbedUrl: e.target.value })} placeholder="https://www.google.com/maps/embed?..." helperText={rtl ? 'يظهر على صفحة التواصل' : 'Shown on the contact page'} />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" variant="gold" size="lg" loading={saving}>
            <Save className="h-5 w-5" aria-hidden="true" />
            {t('common.save')}
          </Button>
        </div>
      </form>
    </div>
  );
}
