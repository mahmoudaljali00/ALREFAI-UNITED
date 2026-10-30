'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '@/context/I18nContext';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, AlertCircle } from 'lucide-react';

interface CompanyContact {
  addressAr?: string;
  addressEn?: string;
  phone?: string;
  email?: string;
  whatsapp?: string;
  workingHoursAr?: string;
  workingHoursEn?: string;
  mapEmbedUrl?: string;
}

export function ContactPageContent({ company }: { company: CompanyContact | null }) {
  const { t, dir } = useI18n();
  const rtl = dir === 'rtl';

  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formState.name.trim()) newErrors.name = t('contact.form.name');
    if (!formState.email.trim()) newErrors.email = t('contact.form.email');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) newErrors.email = t('admin.invalidEmail');
    if (!formState.phone.trim()) newErrors.phone = t('contact.form.phone');
    if (!formState.subject.trim()) newErrors.subject = t('contact.form.subject');
    if (!formState.message.trim()) newErrors.message = t('contact.form.message');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitStatus('submitting');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState),
      });
      if (!res.ok) throw new Error('Request failed');
      setSubmitStatus('success');
      setFormState({ name: '', email: '', phone: '', company: '', subject: '', message: '' });
    } catch {
      setSubmitStatus('error');
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
    if (submitStatus === 'success' || submitStatus === 'error') setSubmitStatus('idle');
  };

  const contactInfo = [
    {
      icon: MapPin,
      label: t('contact.address'),
      value: rtl ? company?.addressAr || 'الرياض، المملكة العربية السعودية' : company?.addressEn || 'Riyadh, Kingdom of Saudi Arabia',
      href: null as string | null,
    },
    {
      icon: Phone,
      label: t('contact.phone'),
      value: company?.phone || '+966 11 234 5678',
      href: `tel:${(company?.phone || '+966 11 234 5678').replace(/[^+0-9]/g, '')}`,
    },
    {
      icon: Mail,
      label: t('contact.email'),
      value: company?.email || 'info@alrefaiunited.com',
      href: `mailto:${company?.email || 'info@alrefaiunited.com'}`,
    },
    {
      icon: Clock,
      label: t('contact.workingHours'),
      value: rtl ? company?.workingHoursAr || 'الأحد - الخميس: 8:00 صباحاً - 5:00 مساءً' : company?.workingHoursEn || 'Sun-Thu: 8:00 AM - 5:00 PM',
      href: null as string | null,
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative bg-primary-950 overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-28" dir={dir}>
        <div className="absolute inset-0" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1920&q=80" alt="" className="w-full h-full object-cover opacity-25" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-primary-950/85 via-primary-950/80 to-primary-950/95" aria-hidden="true" />
        <div className="absolute inset-0 bg-[url('/patterns/hero-pattern.svg')] opacity-5" aria-hidden="true" />
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-gold-500/10 rounded-full blur-3xl" aria-hidden="true" />
        <div className="container-custom relative">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gold-400 text-caption font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-gold-400" aria-hidden="true" />
              {t('contact.title')}
            </span>
            <h1 className="heading-display text-display-lg text-white mb-6">{t('contact.subtitle')}</h1>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding-lg bg-white" dir={dir}>
        <div className="container-custom grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: rtl ? 40 : -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="heading-card text-heading-lg text-primary-950">
                  {rtl ? 'معلومات التواصل' : 'Contact Information'}
                </h2>
                <p className="text-body text-neutral-600">
                  {rtl
                    ? 'يسعدنا تواصلكم معنا. فريقنا مستعد للإجابة على استفساراتكم وتقديم الاستشارات اللازمة لمشاريعكم.'
                    : 'We would love to hear from you. Our team is ready to answer your inquiries and provide consultations for your projects.'}
                </p>
              </div>

              <div className="space-y-4">
                {contactInfo.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: rtl ? 20 : -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                    className="flex items-start gap-4 p-5 rounded-xl bg-neutral-50 hover:bg-white hover:shadow-lg transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-6 w-6 text-primary-700" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-caption text-neutral-500">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} className="text-body text-primary-700 hover:text-gold-600 transition-colors">
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-body text-neutral-700">{item.value}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {company?.whatsapp && (
                <a
                  href={`https://wa.me/${company.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-6 py-4 rounded-xl bg-green-50 border border-green-200 text-green-800 hover:bg-green-100 transition-colors"
                >
                  <Phone className="h-5 w-5" aria-hidden="true" />
                  <span className="font-medium">{t('contact.whatsapp')}: {company.whatsapp}</span>
                </a>
              )}
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: rtl ? -40 : 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white rounded-2xl shadow-lg shadow-neutral-900/5 border border-neutral-100 p-6 sm:p-8 lg:p-10">
              <h2 className="heading-card text-heading-lg text-primary-950 mb-6">
                {rtl ? 'أرسل لنا رسالة' : 'Send us a Message'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div className="grid md:grid-cols-2 gap-5">
                  <Input
                    label={t('contact.form.name')}
                    value={formState.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    error={errors.name}
                    placeholder={t('contact.form.name')}
                    required
                  />
                  <Input
                    label={t('contact.form.email')}
                    type="email"
                    value={formState.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    error={errors.email}
                    placeholder={t('contact.form.email')}
                    required
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-5">
                  <Input
                    label={t('contact.form.phone')}
                    type="tel"
                    value={formState.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    error={errors.phone}
                    placeholder={t('contact.form.phone')}
                    required
                  />
                  <Input
                    label={t('contact.form.company')}
                    value={formState.company}
                    onChange={(e) => handleChange('company', e.target.value)}
                    placeholder={t('contact.form.company')}
                  />
                </div>
                <Input
                  label={t('contact.form.subject')}
                  value={formState.subject}
                  onChange={(e) => handleChange('subject', e.target.value)}
                  error={errors.subject}
                  placeholder={t('contact.form.subject')}
                  required
                />
                <Textarea
                  label={t('contact.form.message')}
                  value={formState.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  error={errors.message}
                  placeholder={t('contact.form.message')}
                  rows={5}
                  required
                />

                <Button type="submit" variant="gold" size="lg" className="w-full" loading={submitStatus === 'submitting'}>
                  {submitStatus === 'submitting' ? t('contact.form.submitting') : t('contact.form.submit')}
                  <Send className="h-5 w-5" aria-hidden="true" />
                </Button>

                <AnimatePresence>
                  {submitStatus === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-3 p-4 rounded-lg bg-green-50 border border-green-200 text-green-800"
                    >
                      <CheckCircle className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                      <p className="text-body-sm">{t('contact.form.success')}</p>
                    </motion.div>
                  )}
                  {submitStatus === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-3 p-4 rounded-lg bg-red-50 border border-red-200 text-red-800"
                    >
                      <AlertCircle className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                      <p className="text-body-sm">{t('contact.form.error')}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Map */}
      {company?.mapEmbedUrl && (
        <section className="pb-16 lg:pb-24 bg-white" dir={dir}>
          <div className="container-custom">
            <div className="rounded-2xl overflow-hidden border border-neutral-200 aspect-[16/8]">
              <iframe
                src={company.mapEmbedUrl}
                title={rtl ? 'موقعنا على الخريطة' : 'Our location on the map'}
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </section>
      )}
    </>
  );
}
