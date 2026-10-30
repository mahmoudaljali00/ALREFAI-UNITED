'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '@/context/I18nContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Calendar } from 'lucide-react';
import Link from 'next/link';

interface PostItem {
  id: string;
  titleAr: string;
  titleEn: string;
  slug: string;
  excerptAr?: string;
  excerptEn?: string;
  featuredImage?: string;
  category?: { nameAr: string; nameEn: string; color?: string; slug: string };
  publishedAt: string;
}

interface CategoryItem {
  slug: string;
  nameAr: string;
  nameEn: string;
  color?: string;
}

export function NewsPageContent({ posts, categories }: { posts: PostItem[]; categories: CategoryItem[] }) {
  const { t, dir } = useI18n();
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filtered = activeCategory === 'all' ? posts : posts.filter((p) => p.category?.slug === activeCategory);

  return (
    <>
      {/* Hero */}
      <section className="relative bg-primary-950 overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-28" dir={dir}>
        <div className="absolute inset-0" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1920&q=80" alt="" className="w-full h-full object-cover opacity-25" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-primary-950/85 via-primary-950/80 to-primary-950/95" aria-hidden="true" />
        <div className="absolute inset-0 bg-[url('/patterns/hero-pattern.svg')] opacity-5" aria-hidden="true" />
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-gold-500/10 rounded-full blur-3xl" aria-hidden="true" />
        <div className="container-custom relative">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gold-400 text-caption font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-gold-400" aria-hidden="true" />
              {t('news.title')}
            </span>
            <h1 className="heading-display text-display-lg text-white mb-6">{t('news.subtitle')}</h1>
          </motion.div>
        </div>
      </section>

      {/* Posts */}
      <section className="section-padding-lg bg-neutral-50" dir={dir}>
        <div className="container-custom">
          <div className="flex flex-wrap items-center gap-2 mb-10" role="group" aria-label={t('news.categories')}>
            <button
              onClick={() => setActiveCategory('all')}
              className={
                activeCategory === 'all'
                  ? 'px-5 py-2.5 rounded-lg bg-primary-950 text-gold-400 text-sm font-medium transition-all'
                  : 'px-5 py-2.5 rounded-lg bg-white text-neutral-600 hover:bg-neutral-200 text-sm font-medium transition-all border border-neutral-200'
              }
              aria-pressed={activeCategory === 'all'}
            >
              {t('projects.all')}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setActiveCategory(cat.slug)}
                className={
                  activeCategory === cat.slug
                    ? 'px-5 py-2.5 rounded-lg bg-primary-950 text-gold-400 text-sm font-medium transition-all'
                    : 'px-5 py-2.5 rounded-lg bg-white text-neutral-600 hover:bg-neutral-200 text-sm font-medium transition-all border border-neutral-200'
                }
                aria-pressed={activeCategory === cat.slug}
              >
                {dir === 'rtl' ? cat.nameAr : cat.nameEn}
              </button>
            ))}
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
              {filtered.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: (index % 3) * 0.08 }}
                  className="h-full"
                >
                  <Card variant="elevated" padding="none" hover className="group overflow-hidden h-full flex flex-col">
                    <div className="relative aspect-video overflow-hidden">
                      {post.featuredImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={post.featuredImage}
                          alt={dir === 'rtl' ? post.titleAr : post.titleEn}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary-100">
                          <svg className="w-16 h-16 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                          </svg>
                        </div>
                      )}
                      {post.category && (
                        <Badge
                          variant="primary"
                          className="absolute top-4 left-4"
                          style={post.category.color ? { backgroundColor: post.category.color + '22', color: post.category.color } : undefined}
                        >
                          {dir === 'rtl' ? post.category.nameAr : post.category.nameEn}
                        </Badge>
                      )}
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-2 text-caption text-neutral-500 mb-4">
                        <Calendar className="h-4 w-4" aria-hidden="true" />
                        {new Date(post.publishedAt).toLocaleDateString(dir === 'rtl' ? 'ar-SA' : 'en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </div>
                      <Link href={`/news/${post.slug}`} className="group">
                        <h2 className="heading-card text-heading-lg text-primary-950 mb-3 group-hover:text-gold-600 transition-colors line-clamp-2">
                          {dir === 'rtl' ? post.titleAr : post.titleEn}
                        </h2>
                      </Link>
                      <p className="text-body text-neutral-600 leading-relaxed mb-4 flex-1 line-clamp-3">
                        {dir === 'rtl' ? post.excerptAr : post.excerptEn}
                      </p>
                      <Link href={`/news/${post.slug}`} className="block mt-auto">
                        <Button variant="ghost" size="sm" className="w-full justify-between gap-2 text-primary-700 hover:bg-primary-50 px-3">
                          {t('news.readMore')}
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                        </Button>
                      </Link>
                    </div>
                  </Card>
                </motion.article>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </>
  );
}
