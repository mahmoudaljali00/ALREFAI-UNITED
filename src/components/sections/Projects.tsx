'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useI18n } from '@/context/I18nContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ArrowRight, Search, Filter } from 'lucide-react';
import Link from 'next/link';

interface ProjectItem {
  id: string;
  titleAr: string;
  titleEn: string;
  category: string;
  locationAr?: string;
  locationEn?: string;
  shortDescriptionAr?: string;
  shortDescriptionEn?: string;
  mainImage?: string;
  completionDate?: string;
  featured?: boolean;
  slug: string;
}

interface ProjectsProps {
  locale?: string;
  projects?: ProjectItem[];
}

const categories = [
  { id: 'all', key: 'all' },
  { id: 'construction', key: 'construction' },
  { id: 'engineering', key: 'engineering' },
  { id: 'infrastructure', key: 'infrastructure' },
  { id: 'commercial', key: 'commercial' },
  { id: 'industrial', key: 'industrial' },
  { id: 'other', key: 'other' },
];

const defaultProjects: ProjectItem[] = [
  {
    id: '1',
    titleAr: 'برج الرفاعي التجاري',
    titleEn: 'Alrefai Commercial Tower',
    category: 'commercial',
    locationAr: 'الرياض، المملكة العربية السعودية',
    locationEn: 'Riyadh, KSA',
    shortDescriptionAr: 'برج تجاري حديث بارتفاع 40 طابق',
    shortDescriptionEn: 'Modern 40-story commercial tower',
    mainImage: '/images/projects/tower.jpg',
    completionDate: '2023',
    featured: true,
    slug: 'alrefai-commercial-tower',
  },
  {
    id: '2',
    titleAr: 'مجمع الصناعات الخفيفة',
    titleEn: 'Light Industries Complex',
    category: 'industrial',
    locationAr: 'جدة، المملكة العربية السعودية',
    locationEn: 'Jeddah, KSA',
    shortDescriptionAr: 'مجمع صناعي متكامل على مساحة 500,000 م²',
    shortDescriptionEn: 'Integrated industrial complex on 500,000 sqm',
    mainImage: '/images/projects/industrial.jpg',
    completionDate: '2022',
    featured: true,
    slug: 'light-industries-complex',
  },
  {
    id: '3',
    titleAr: 'طريق الملك عبدالله',
    titleEn: 'King Abdullah Road',
    category: 'infrastructure',
    locationAr: 'الدمام، المملكة العربية السعودية',
    locationEn: 'Dammam, KSA',
    shortDescriptionAr: 'طريق سريع بطول 45 كم',
    shortDescriptionEn: '45km highway project',
    mainImage: '/images/projects/highway.jpg',
    completionDate: '2023',
    featured: false,
    slug: 'king-abdullah-road',
  },
  {
    id: '4',
    titleAr: 'مستشفى الرفاعي التخصصي',
    titleEn: 'Alrefai Specialized Hospital',
    category: 'construction',
    locationAr: 'مكة المكرمة، المملكة العربية السعودية',
    locationEn: 'Makkah, KSA',
    shortDescriptionAr: 'مستشفى بسعة 300 سرير',
    shortDescriptionEn: '300-bed specialized hospital',
    mainImage: '/images/projects/hospital.jpg',
    completionDate: '2021',
    featured: true,
    slug: 'alrefai-specialized-hospital',
  },
  {
    id: '5',
    titleAr: 'مركز المؤتمرات الدولي',
    titleEn: 'International Conference Center',
    category: 'commercial',
    locationAr: 'الرياض، المملكة العربية السعودية',
    locationEn: 'Riyadh, KSA',
    shortDescriptionAr: 'مركز مؤتمرات عالمي المستوى',
    shortDescriptionEn: 'World-class conference center',
    mainImage: '/images/projects/conference.jpg',
    completionDate: '2022',
    featured: false,
    slug: 'international-conference-center',
  },
  {
    id: '6',
    titleAr: 'محطة معالجة المياه',
    titleEn: 'Water Treatment Plant',
    category: 'engineering',
    locationAr: 'ينبع، المملكة العربية السعودية',
    locationEn: 'Yanbu, KSA',
    shortDescriptionAr: 'محطة بسعة 100,000 م³/يوم',
    shortDescriptionEn: '100,000 m³/day capacity plant',
    mainImage: '/images/projects/water.jpg',
    completionDate: '2023',
    featured: false,
    slug: 'water-treatment-plant',
  },
];

export function Projects({ locale, projects }: ProjectsProps = {}) {
  const { t, dir } = useI18n();
  const [activeCategory, setActiveCategory] = useState('all');
  const displayProjects = projects || defaultProjects;

  const filteredProjects = activeCategory === 'all'
    ? displayProjects
    : displayProjects.filter(p => p.category === activeCategory);

  return (
    <section id="projects" className="section-padding-lg bg-white relative overflow-hidden" aria-labelledby="projects-title">
      <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-5" aria-hidden="true" />
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-gold-500/5 rounded-full blur-3xl" aria-hidden="true" />
      
      <div className="container-custom relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12"
        >
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-800 text-caption font-medium mb-4">
              <span className="w-2 h-2 rounded-full bg-gold-400" aria-hidden="true" />
              {t('projects.title')}
            </span>
            <h2 id="projects-title" className="heading-display text-display-md text-primary-950">
              {t('projects.subtitle')}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-neutral-400" aria-hidden="true" />
            <div className="flex items-center gap-1 bg-neutral-100 rounded-lg p-1" role="group" aria-label={t('projects.categories')}>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    'px-4 py-2 rounded-md text-sm font-medium transition-all duration-300',
                    activeCategory === cat.id
                      ? 'bg-white text-primary-900 shadow-sm'
                      : 'text-neutral-600 hover:text-neutral-900'
                  )}
                  aria-pressed={activeCategory === cat.id}
                  role="tab"
                >
                  {t(`projects.${cat.key}`)}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        <AnimatePresence mode="popLayout">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 items-stretch">
              {filteredProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  locale={locale}
                  dir={dir}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <Search className="h-12 w-12 text-neutral-300 mx-auto mb-4" aria-hidden="true" />
            <p className="text-body text-neutral-600">{dir === 'rtl' ? 'لا توجد مشاريع في هذا التصنيف' : 'No projects in this category'}</p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-10 sm:mt-12 lg:mt-16"
        >
          <Link href="/projects" className="inline-flex">
            <Button variant="secondary" size="lg" className="min-w-[13.5rem]">
              {t('common.viewAll')}
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function ProjectCard({ project, index, locale, dir }: { project: ProjectItem; index: number; locale?: string; dir: 'rtl' | 'ltr' }) {
  const { t } = useI18n();
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
      className="h-full"
    >
      <article className="group relative rounded-2xl overflow-hidden bg-neutral-50 border border-neutral-100 hover:shadow-xl hover:border-gold-400/30 transition-all duration-500 h-full flex flex-col">
        <div className="card-band z-30" aria-hidden="true" />
        <div className="relative aspect-[16/10] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 to-primary-950/40 z-10" />
          {project.mainImage ? (
            <img
              src={project.mainImage}
              alt={dir === 'rtl' ? project.titleAr : project.titleEn}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary-100">
              <svg className="w-16 h-16 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          <div className="absolute top-4 left-4 right-4 z-20 flex items-start justify-between gap-2">
            <Badge variant="gold" size="sm">
              {t(`projects.${project.category}`)}
            </Badge>
            {project.featured && (
              <Badge variant="primary" size="sm" dot>
                {dir === 'rtl' ? 'مميز' : 'Featured'}
              </Badge>
            )}
          </div>
          <div className="absolute bottom-4 left-4 right-4 z-20">
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 transform transition-all duration-500 group-hover:translate-y-[-10px]">
              <p className="text-caption text-gold-600 font-medium tracking-wider mb-1">
                {project.completionDate} • {dir === 'rtl' ? project.locationAr : project.locationEn}
              </p>
              <h3 className="heading-card text-heading-md text-primary-950">
                {dir === 'rtl' ? project.titleAr : project.titleEn}
              </h3>
            </div>
          </div>
        </div>

        <div className="p-5 flex flex-col flex-1">
          <p className="text-body text-neutral-600 mb-4 line-clamp-2 flex-1">
            {dir === 'rtl' ? project.shortDescriptionAr : project.shortDescriptionEn}
          </p>
          <Link href={`/projects/${project.slug}`} className="block">
            <Button variant="ghost" size="sm" className="w-full justify-between gap-2 text-primary-700 hover:bg-primary-50 px-3">
              {t('projects.viewProject')}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Button>
          </Link>
        </div>
      </article>
    </motion.div>
  );
}