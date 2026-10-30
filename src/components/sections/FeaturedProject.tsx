'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useI18n } from '@/context/I18nContext';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Award, Calendar, MapPin, Building } from 'lucide-react';
import Link from 'next/link';

interface FeaturedProjectProps {
  locale: string;
  project?: {
    titleAr: string;
    titleEn: string;
    subtitleAr?: string;
    subtitleEn?: string;
    descriptionAr?: string;
    descriptionEn?: string;
    backgroundImage?: string;
    locationAr?: string;
    locationEn?: string;
    completionDate?: string;
    category?: string;
    stats?: Array<{ labelAr: string; labelEn: string; value: string }>;
    ctaTextAr?: string;
    ctaTextEn?: string;
    ctaLink?: string;
  };
}

const defaultProject = {
  titleAr: 'برج الرفاعي التجاري',
  titleEn: 'Alrefai Commercial Tower',
  subtitleAr: 'معلم معماري جديد في قلب الرياض',
  subtitleEn: 'A New Architectural Landmark in the Heart of Riyadh',
  descriptionAr: 'برج تجاري متعدد الاستخدامات بارتفاع 40 طابق، يضم مكاتب فاخرة، مساحات تجارية، ومرافق عالمية المستوى. المشروع يجسد رؤيتنا في خلق بيئات عمل ملهمة ومستدامة.',
  descriptionEn: 'A 40-story mixed-use commercial tower featuring premium offices, retail spaces, and world-class amenities. The project embodies our vision of creating inspiring and sustainable work environments.',
  backgroundImage: '/images/projects/featured-tower.jpg',
  locationAr: 'الرياض، المملكة العربية السعودية',
  locationEn: 'Riyadh, Kingdom of Saudi Arabia',
  completionDate: '2024',
  category: 'commercial',
  stats: [
    { labelAr: 'الارتفاع', labelEn: 'Height', value: '180م' },
    { labelAr: 'الطوابق', labelEn: 'Floors', value: '40' },
    { labelAr: 'المساحة', labelEn: 'Area', value: '85,000 م²' },
    { labelAr: 'الاستثمار', labelEn: 'Investment', value: '500م ريال' },
  ],
  ctaTextAr: 'استكشف المشروع',
  ctaTextEn: 'Explore Project',
  ctaLink: '/projects/alrefai-commercial-tower',
};

export function FeaturedProject({ locale, project }: FeaturedProjectProps) {
  const { t, dir } = useI18n();
  const data = project || defaultProject;

  return (
    <section id="featured-project" className="relative overflow-hidden" aria-labelledby="featured-project-title">
      <div className="absolute inset-0">
        {data.backgroundImage ? (
          <img
            src={data.backgroundImage}
            alt=""
            className="w-full h-full object-cover"
            aria-hidden="true"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-950 via-primary-900 to-primary-950" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-950/95 via-primary-900/90 to-primary-950/95" />
        <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-5" aria-hidden="true" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-950 to-transparent" />
      </div>
      
      <div className="relative container-custom py-24 lg:py-32">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-400/20 text-gold-400 text-caption font-medium mb-4">
              <Award className="h-3 w-3" aria-hidden="true" />
              {t('projects.featuredProject')}
            </span>
            <h2 id="featured-project-title" className="heading-display text-display-lg text-white mb-4">
              {dir === 'rtl' ? data.titleAr : data.titleEn}
            </h2>
            {data.subtitleAr && data.subtitleEn && (
              <p className="text-body-lg text-gold-400 font-medium">
                {dir === 'rtl' ? data.subtitleAr : data.subtitleEn}
              </p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/80 text-body-lg leading-relaxed mb-10 max-w-2xl"
          >
            <p>{dir === 'rtl' ? data.descriptionAr : data.descriptionEn}</p>
          </motion.div>

          {data.stats && data.stats.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-2 gap-6 mb-10"
            >
              {data.stats.map((stat, index) => (
                <div key={index} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <div className="w-12 h-12 rounded-xl bg-gold-400/10 flex items-center justify-center flex-shrink-0">
                    <Building className="h-6 w-6 text-gold-400" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="heading-card text-heading-lg text-white font-medium">{stat.value}</p>
                    <p className="text-caption text-white/60">{dir === 'rtl' ? stat.labelAr : stat.labelEn}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center gap-4"
          >
            <div className="flex items-center gap-6 text-white/60 text-body-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gold-400" aria-hidden="true" />
                <span>{dir === 'rtl' ? data.locationAr : data.locationEn}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gold-400" aria-hidden="true" />
                <span>{data.completionDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-gold-400" aria-hidden="true" />
                <span className="text-gold-400 font-medium">{dir === 'rtl' ? t(`projects.${data.category}`) : t(`projects.${data.category}`)}</span>
              </div>
            </div>
            <Link href={data.ctaLink || '/projects'}>
              <Button variant="gold" size="lg" className="w-full sm:w-auto sm:min-w-[13.5rem]">
                {dir === 'rtl' ? (data.ctaTextAr || t('projects.viewProject')) : (data.ctaTextEn || t('projects.viewProject'))}
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Button>
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="absolute bottom-0 right-0 w-1/2 h-full hidden lg:block"
          style={{ pointerEvents: 'none' }}
        >
          <div className="absolute bottom-8 right-8 w-[300px] h-[300px] bg-gold-400/10 rounded-full blur-3xl animate-float" aria-hidden="true" />
          <div className="absolute bottom-20 right-20 w-[100px] h-[100px] border-2 border-gold-400/20 rounded-full animate-pulse-slow" aria-hidden="true" />
        </motion.div>
      </div>
    </section>
  );
}