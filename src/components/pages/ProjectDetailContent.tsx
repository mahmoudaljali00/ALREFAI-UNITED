'use client';

import { motion } from 'framer-motion';
import { useI18n } from '@/context/I18nContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { MapPin, Calendar, Building, Ruler, Wallet, User, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface ProjectDetail {
  titleAr: string;
  titleEn: string;
  category: string;
  locationAr?: string;
  locationEn?: string;
  shortDescriptionAr?: string;
  shortDescriptionEn?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  mainImage?: string;
  completionDate?: string;
  area?: string;
  budget?: string;
  clientAr?: string;
  clientEn?: string;
  status: string;
}

interface GalleryImage {
  url: string;
  altAr?: string;
  altEn?: string;
}

const statusColors: Record<string, 'success' | 'gold' | 'outline'> = {
  COMPLETED: 'success',
  IN_PROGRESS: 'gold',
  PLANNING: 'outline',
  ON_HOLD: 'outline',
};

export function ProjectDetailContent({
  project,
  gallery,
}: {
  project: ProjectDetail;
  gallery: GalleryImage[];
}) {
  const { t, dir } = useI18n();
  const rtl = dir === 'rtl';

  const paragraphs = (rtl ? project.descriptionAr : project.descriptionEn)?.split('\n').filter((p) => p.trim());

  const facts = [
    { icon: MapPin, label: rtl ? 'الموقع' : 'Location', value: rtl ? project.locationAr : project.locationEn },
    { icon: Calendar, label: rtl ? 'سنة الإنجاز' : 'Completion', value: project.completionDate },
    { icon: Ruler, label: rtl ? 'المساحة' : 'Area', value: project.area },
    { icon: Wallet, label: rtl ? 'قيمة المشروع' : 'Budget', value: project.budget },
    { icon: User, label: rtl ? 'العميل' : 'Client', value: rtl ? project.clientAr : project.clientEn },
    { icon: Building, label: rtl ? 'التصنيف' : 'Category', value: t(`projects.${project.category}`) !== `projects.${project.category}` ? t(`projects.${project.category}`) : project.category },
  ].filter((f) => f.value);

  const images = [project.mainImage, ...gallery.map((g) => g.url)].filter(Boolean) as string[];

  return (
    <>
      {/* Hero */}
      <section className="relative bg-primary-950 overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-24" dir={dir}>
        {project.mainImage && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={project.mainImage} alt="" className="absolute inset-0 w-full h-full object-cover opacity-35" aria-hidden="true" />
            <div className="absolute inset-0 bg-gradient-to-b from-primary-950/85 via-primary-950/80 to-primary-950/95" aria-hidden="true" />
          </>
        )}
        <div className="absolute inset-0 bg-[url('/patterns/hero-pattern.svg')] opacity-5" aria-hidden="true" />
        <div className="container-custom relative">
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-wrap items-center gap-2 text-caption text-white/50 mb-6"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="hover:text-gold-400 transition-colors">{t('nav.home')}</Link>
            <span>/</span>
            <Link href="/projects" className="hover:text-gold-400 transition-colors">{t('projects.title')}</Link>
            <span>/</span>
            <span className="text-gold-400">{rtl ? project.titleAr : project.titleEn}</span>
          </motion.nav>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <Badge variant="gold" size="md">
                {t(`projects.${project.category}`) !== `projects.${project.category}` ? t(`projects.${project.category}`) : project.category}
              </Badge>
              <Badge variant={statusColors[project.status] || 'outline'} size="md" dot>
                {project.status.replace('_', ' ')}
              </Badge>
            </div>
            <h1 className="heading-display text-display-lg text-white mb-6">{rtl ? project.titleAr : project.titleEn}</h1>
            {(rtl ? project.shortDescriptionAr : project.shortDescriptionEn) && (
              <p className="text-body-lg text-white/70 max-w-2xl leading-relaxed">
                {rtl ? project.shortDescriptionAr : project.shortDescriptionEn}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Facts + description */}
      <section className="section-padding-lg bg-white" dir={dir}>
        <div className="container-custom grid lg:grid-cols-3 gap-10 lg:gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 space-y-6"
          >
            {paragraphs?.length ? (
              paragraphs.map((p, i) => (
                <p key={i} className="text-body text-neutral-600 leading-loose">{p}</p>
              ))
            ) : (
              <p className="text-body text-neutral-600 leading-loose">
                {rtl ? project.shortDescriptionAr : project.shortDescriptionEn}
              </p>
            )}
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:sticky lg:top-28"
          >
            <Card variant="elevated" padding="lg">
              <h2 className="heading-card text-heading-md text-primary-950 mb-6">{rtl ? 'بيانات المشروع' : 'Project Facts'}</h2>
              <ul className="space-y-4" role="list">
                {facts.map((fact) => (
                  <li key={fact.label} className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                      <fact.icon className="h-5 w-5 text-primary-700" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-caption text-neutral-500">{fact.label}</p>
                      <p className="text-body-sm text-neutral-800 font-medium">{fact.value}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          </motion.aside>
        </div>
      </section>

      {/* Gallery */}
      {images.length > 0 && (
        <section className="section-padding bg-neutral-50" dir={dir}>
          <div className="container-custom">
            <h2 className="heading-display text-display-sm text-primary-950 mb-8">{rtl ? 'معرض المشروع' : 'Project Gallery'}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {images.map((url, i) => (
                <motion.div
                  key={url + i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
                  className="relative aspect-[4/3] rounded-2xl overflow-hidden group"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={rtl ? gallery[i]?.altAr || project.titleAr : gallery[i]?.altEn || project.titleEn}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="section-padding bg-white text-center" dir={dir}>
        <div className="container-custom">
          <Link href="/contact" className="inline-flex">
            <Button variant="gold" size="lg" className="min-w-[13.5rem]">
              {t('cta.button')}
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
