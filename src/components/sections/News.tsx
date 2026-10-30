'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useI18n } from '@/context/I18nContext';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ArrowRight, Calendar, Tag } from 'lucide-react';
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
  author?: { nameAr: string; nameEn: string };
}

interface NewsProps {
  locale: string;
  posts?: PostItem[];
}

const defaultPosts: PostItem[] = [
  {
    id: '1',
    titleAr: 'إطلاق مشروع برج الرفاعي التجاري',
    titleEn: 'Launch of Alrefai Commercial Tower Project',
    slug: 'alrefai-commercial-tower-launch',
    excerptAr: 'نعلن عن بدء أعمال الإنشاء في برج الرفاعي التجاري بارتفاع 40 طابق في قلب الرياض.',
    excerptEn: 'We announce the start of construction of the 40-story Alrefai Commercial Tower in the heart of Riyadh.',
    featuredImage: '/images/news/tower-launch.jpg',
    category: { nameAr: 'مشاريع', nameEn: 'Projects', color: '#0d2d1a', slug: 'projects' },
    publishedAt: '2024-01-15',
  },
  {
    id: '2',
    titleAr: 'شراكة استراتيجية مع أرامكو السعودية',
    titleEn: 'Strategic Partnership with Saudi Aramco',
    slug: 'strategic-partnership-aramco',
    excerptAr: 'توقيع اتفاقية شراكة استراتيجية طويلة المدى مع شركة أرامكو السعودية.',
    excerptEn: 'Signing a long-term strategic partnership agreement with Saudi Aramco.',
    featuredImage: '/images/news/aramco-partnership.jpg',
    category: { nameAr: 'شراكات', nameEn: 'Partnerships', color: '#c9a227', slug: 'partnerships' },
    publishedAt: '2024-01-10',
  },
  {
    id: '3',
    titleAr: 'جائزة التميز في السلامة المهنية',
    titleEn: 'Occupational Safety Excellence Award',
    slug: 'safety-excellence-award',
    excerptAr: 'حصول شركة الرفاعي المتحدة على جائزة التميز في السلامة المهنية للعام 2024.',
    excerptEn: 'Alrefai United Company wins the Occupational Safety Excellence Award for 2024.',
    featuredImage: '/images/news/safety-award.jpg',
    category: { nameAr: 'جوائز', nameEn: 'Awards', color: '#166534', slug: 'awards' },
    publishedAt: '2024-01-05',
  },
];

export function News({ locale, posts }: NewsProps) {
  const { t, dir } = useI18n();
  const displayPosts = posts || defaultPosts;

  return (
    <section id="news" className="section-padding-lg bg-neutral-50 relative overflow-hidden" aria-labelledby="news-title">
      <div className="absolute inset-0 bg-[url('/patterns/dot-pattern.svg')] opacity-5" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gold-500/5 rounded-full blur-3xl" aria-hidden="true" />
      
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
              {t('news.title')}
            </span>
            <h2 id="news-title" className="heading-display text-display-md text-primary-950">
              {t('news.subtitle')}
            </h2>
          </div>
          <Link href="/news">
            <Button variant="ghost" size="md">
              {t('news.latestNews')}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 items-stretch">
          {displayPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className="h-full"
            >
              <Card variant="elevated" padding="none" hover className="group overflow-hidden h-full flex flex-col">
                <div className="relative aspect-video overflow-hidden">
                  {post.featuredImage ? (
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
                    <Badge variant="primary" className="absolute top-4 left-4" style={{ backgroundColor: post.category.color + '20', color: post.category.color }}>
                      {dir === 'rtl' ? post.category.nameAr : post.category.nameEn}
                    </Badge>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-4 text-caption text-neutral-500 mb-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" aria-hidden="true" />
                      {new Date(post.publishedAt).toLocaleDateString(dir === 'rtl' ? 'ar-SA' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                    {post.author && (
                      <span className="flex items-center gap-1">
                        {dir === 'rtl' ? post.author.nameAr : post.author.nameEn}
                      </span>
                    )}
                  </div>
                  <Link href={`/news/${post.slug}`} className="group">
                    <h3 className="heading-card text-heading-lg text-primary-950 mb-3 group-hover:text-gold-600 transition-colors line-clamp-2">
                      {dir === 'rtl' ? post.titleAr : post.titleEn}
                    </h3>
                  </Link>
                  <p className="text-body text-neutral-600 leading-relaxed mb-4 flex-1 line-clamp-3">
                    {dir === 'rtl' ? post.excerptAr : post.excerptEn}
                  </p>
                  <Link href={`/news/${post.slug}`} className="block">
                      <Button variant="ghost" size="sm" className="w-full justify-between gap-2 text-primary-700 hover:bg-primary-50 px-3">
                        {t('news.readMore')}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                      </Button>
                    </Link>
                </div>
              </Card>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-10 sm:mt-12"
        >
          <Link href="/news" className="inline-flex">
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