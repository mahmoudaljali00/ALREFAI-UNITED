'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '@/context/I18nContext';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Search } from 'lucide-react';
import Link from 'next/link';

interface ProjectItem {
  id: string;
  titleAr: string;
  titleEn: string;
  slug: string;
  category: string;
  locationAr?: string;
  locationEn?: string;
  shortDescriptionAr?: string;
  shortDescriptionEn?: string;
  mainImage?: string;
  completionDate?: string;
  featured?: boolean;
}

const categoryKeys = ['all', 'commercial', 'construction', 'engineering', 'infrastructure', 'industrial', 'other'];

export function ProjectsPageContent({ projects }: { projects: ProjectItem[] }) {
  const { t, dir } = useI18n();
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered = activeCategory === 'all' ? projects : projects.filter((p) => p.category === activeCategory);

  return (
    <>
      {/* Hero */}
      <section className="relative bg-primary-950 overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-28" dir={dir}>
        <div className="absolute inset-0" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80" alt="" className="w-full h-full object-cover opacity-25" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-primary-950/85 via-primary-950/80 to-primary-950/95" aria-hidden="true" />
        <div className="absolute inset-0 bg-[url('/patterns/hero-pattern.svg')] opacity-5" aria-hidden="true" />
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-gold-500/10 rounded-full blur-3xl" aria-hidden="true" />
        <div className="container-custom relative">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gold-400 text-caption font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-gold-400" aria-hidden="true" />
              {t('projects.title')}
            </span>
            <h1 className="heading-display text-display-lg text-white mb-6">{t('projects.subtitle')}</h1>
          </motion.div>
        </div>
      </section>

      {/* Grid */}
      <section className="section-padding-lg bg-white" dir={dir}>
        <div className="container-custom">
          <div className="flex flex-wrap items-center gap-2 mb-10" role="group" aria-label={t('projects.title')}>
            {categoryKeys.map((cat) => {
              const count = cat === 'all' ? projects.length : projects.filter((p) => p.category === cat).length;
              if (cat !== 'all' && count === 0) return null;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={
                    activeCategory === cat
                      ? 'px-5 py-2.5 rounded-lg bg-primary-950 text-gold-400 text-sm font-medium transition-all'
                      : 'px-5 py-2.5 rounded-lg bg-neutral-100 text-neutral-600 hover:bg-neutral-200 text-sm font-medium transition-all'
                  }
                  aria-pressed={activeCategory === cat}
                >
                  {t(`projects.${cat}`)}
                  <span className="ms-2 text-xs opacity-60">{count}</span>
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="popLayout">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 items-stretch"
            >
              {filtered.map((project, index) => (
                <motion.article
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: (index % 3) * 0.08 }}
                  className="group relative rounded-2xl overflow-hidden bg-neutral-50 border border-neutral-100 hover:shadow-xl hover:border-gold-400/30 transition-all duration-500 h-full flex flex-col"
                >
                  <div className="card-band z-30" aria-hidden="true" />
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 to-primary-950/40 z-10" />
                    {project.mainImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
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
                        {t(`projects.${project.category}`) !== `projects.${project.category}`
                          ? t(`projects.${project.category}`)
                          : project.category}
                      </Badge>
                      {project.featured && (
                        <Badge variant="primary" size="sm" dot>
                          {dir === 'rtl' ? 'مميز' : 'Featured'}
                        </Badge>
                      )}
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 z-20">
                      <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4">
                        <p className="text-caption text-gold-600 font-medium tracking-wider mb-1">
                          {[project.completionDate, dir === 'rtl' ? project.locationAr : project.locationEn]
                            .filter(Boolean)
                            .join(' • ')}
                        </p>
                        <h2 className="heading-card text-heading-md text-primary-950">
                          {dir === 'rtl' ? project.titleAr : project.titleEn}
                        </h2>
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
                </motion.article>
              ))}
            </motion.div>
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <Search className="h-12 w-12 text-neutral-300 mx-auto mb-4" aria-hidden="true" />
              <p className="text-body text-neutral-600">
                {dir === 'rtl' ? 'لا توجد مشاريع في هذا التصنيف' : 'No projects in this category'}
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
