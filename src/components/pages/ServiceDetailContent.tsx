'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useI18n } from '@/context/I18nContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

interface ServiceDetail {
  titleAr: string;
  titleEn: string;
  shortDescriptionAr?: string;
  shortDescriptionEn?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  image?: string;
}

interface RelatedService {
  titleAr: string;
  titleEn: string;
  slug: string;
  shortDescriptionAr?: string;
  shortDescriptionEn?: string;
}

export function ServiceDetailContent({
  service,
  related,
}: {
  service: ServiceDetail;
  related: RelatedService[];
}) {
  const { t, dir } = useI18n();
  const rtl = dir === 'rtl';

  const paragraphs = (rtl ? service.descriptionAr : service.descriptionEn)
    ?.split('\n')
    .filter((p) => p.trim());

  return (
    <>
      {/* Hero */}
      <section className="relative bg-primary-950 overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-24" dir={dir}>
        {service.image && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={service.image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-35" aria-hidden="true" />
            <div className="absolute inset-0 bg-gradient-to-b from-primary-950/85 via-primary-950/80 to-primary-950/95" aria-hidden="true" />
          </>
        )}
        <div className="absolute inset-0 bg-[url('/patterns/hero-pattern.svg')] opacity-5" aria-hidden="true" />
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-gold-500/10 rounded-full blur-3xl" aria-hidden="true" />
        <div className="container-custom relative">
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-caption text-white/50 mb-6"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="hover:text-gold-400 transition-colors">{t('nav.home')}</Link>
            <span>/</span>
            <Link href="/services" className="hover:text-gold-400 transition-colors">{t('services.title')}</Link>
            <span>/</span>
            <span className="text-gold-400">{rtl ? service.titleAr : service.titleEn}</span>
          </motion.nav>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="heading-display text-display-lg text-white mb-6">{rtl ? service.titleAr : service.titleEn}</h1>
            {(rtl ? service.shortDescriptionAr : service.shortDescriptionEn) && (
              <p className="text-body-lg text-white/70 max-w-2xl leading-relaxed">
                {rtl ? service.shortDescriptionAr : service.shortDescriptionEn}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Body */}
      <section className="section-padding-lg bg-white" dir={dir}>
        <div className="container-custom grid lg:grid-cols-5 gap-10 lg:gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3 space-y-6"
          >
            {paragraphs?.length ? (
              paragraphs.map((p, i) => (
                <p key={i} className="text-body text-neutral-600 leading-loose">{p}</p>
              ))
            ) : (
              <p className="text-body text-neutral-600 leading-loose">
                {rtl ? service.shortDescriptionAr : service.shortDescriptionEn}
              </p>
            )}

            <div className="grid sm:grid-cols-2 gap-4 pt-4">
              {[
                rtl ? 'فرق هندسية معتمدة دولياً' : 'Internationally certified engineering teams',
                rtl ? 'التزام صارم بالجداول الزمنية' : 'Strict adherence to schedules',
                rtl ? 'معايير جودة عالمية' : 'Global quality standards',
                rtl ? 'دعم ما بعد التسليم' : 'Post-handover support',
              ].map((point) => (
                <div key={point} className="flex items-center gap-3 p-4 rounded-xl bg-neutral-50">
                  <CheckCircle2 className="h-5 w-5 text-gold-600 shrink-0" aria-hidden="true" />
                  <span className="text-body-sm text-neutral-700">{point}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-2 space-y-8 lg:sticky lg:top-28"
          >
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-primary-100">
              {service.image ? (
                <Image src={service.image} alt={rtl ? service.titleAr : service.titleEn} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 33vw" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary-900 to-primary-950 flex items-center justify-center">
                  <span className="text-display-sm text-gold-400 font-display font-light">{t('services.title')}</span>
                </div>
              )}
            </div>

            <Card variant="elevated" padding="lg">
              <h3 className="heading-card text-heading-md text-primary-950 mb-4">{t('cta.title')}</h3>
              <p className="text-body-sm text-neutral-600 mb-6">{t('cta.subtitle')}</p>
              <Link href="/contact" className="block">
                <Button variant="gold" className="w-full">
                  {t('cta.button')}
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </Button>
              </Link>
            </Card>
          </motion.aside>
        </div>
      </section>

      {/* Related services */}
      {related.length > 0 && (
        <section className="section-padding bg-neutral-50" dir={dir}>
          <div className="container-custom">
            <h2 className="heading-display text-display-sm text-primary-950 mb-8">
              {rtl ? 'خدمات أخرى' : 'Other Services'}
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {related.map((s) => (
                <Link key={s.slug} href={`/services/${s.slug}`} className="group">
                  <Card variant="bordered" padding="lg" hover className="h-full">
                    <h3 className="heading-card text-heading-sm text-primary-950 mb-2 group-hover:text-gold-600 transition-colors">
                      {rtl ? s.titleAr : s.titleEn}
                    </h3>
                    <p className="text-body-sm text-neutral-600 line-clamp-2">
                      {rtl ? s.shortDescriptionAr : s.shortDescriptionEn}
                    </p>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
