'use client';

import { motion } from 'framer-motion';
import { useI18n } from '@/context/I18nContext';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Calendar, User, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface PostDetail {
  titleAr: string;
  titleEn: string;
  excerptAr?: string;
  excerptEn?: string;
  contentAr: string;
  contentEn: string;
  featuredImage?: string;
  publishedAt: string;
  authorName?: string;
  category?: { nameAr: string; nameEn: string; color?: string };
}

interface RelatedPost {
  titleAr: string;
  titleEn: string;
  slug: string;
  publishedAt: string;
}

export function PostDetailContent({ post, related }: { post: PostDetail; related: RelatedPost[] }) {
  const { t, dir } = useI18n();
  const rtl = dir === 'rtl';

  const paragraphs = (rtl ? post.contentAr : post.contentEn).split('\n').filter((p) => p.trim());

  return (
    <>
      {/* Hero */}
      <section className="relative bg-primary-950 overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-24" dir={dir}>
        {post.featuredImage && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.featuredImage} alt="" className="absolute inset-0 w-full h-full object-cover opacity-35" aria-hidden="true" />
            <div className="absolute inset-0 bg-gradient-to-b from-primary-950/85 via-primary-950/80 to-primary-950/95" aria-hidden="true" />
          </>
        )}
        <div className="absolute inset-0 bg-[url('/patterns/hero-pattern.svg')] opacity-5" aria-hidden="true" />
        <div className="container-custom relative max-w-4xl">
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-caption text-white/50 mb-6"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="hover:text-gold-400 transition-colors">{t('nav.home')}</Link>
            <span>/</span>
            <Link href="/news" className="hover:text-gold-400 transition-colors">{t('news.title')}</Link>
          </motion.nav>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            {post.category && (
              <Badge
                variant="gold"
                size="md"
                className="mb-5"
                style={post.category.color ? { backgroundColor: post.category.color + '22', color: post.category.color } : undefined}
              >
                {rtl ? post.category.nameAr : post.category.nameEn}
              </Badge>
            )}
            <h1 className="heading-display text-display-md lg:text-display-lg text-white mb-6">
              {rtl ? post.titleAr : post.titleEn}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-body-sm text-white/60">
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gold-400" aria-hidden="true" />
                {new Date(post.publishedAt).toLocaleDateString(rtl ? 'ar-SA' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
              {post.authorName && (
                <span className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gold-400" aria-hidden="true" />
                  {post.authorName}
                </span>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Article body */}
      <article className="section-padding-lg bg-white" dir={dir}>
        <div className="container-custom max-w-4xl">
          {(rtl ? post.excerptAr : post.excerptEn) && (
            <p className="text-body-lg text-neutral-700 leading-relaxed border-s-4 border-gold-400 ps-6 mb-10">
              {rtl ? post.excerptAr : post.excerptEn}
            </p>
          )}
          <div className="space-y-6">
            {paragraphs.map((p, i) => (
              <p key={i} className="text-body text-neutral-700 leading-loose">{p}</p>
            ))}
          </div>
        </div>
      </article>

      {/* Related */}
      {related.length > 0 && (
        <section className="section-padding bg-neutral-50" dir={dir}>
          <div className="container-custom">
            <h2 className="heading-display text-display-sm text-primary-950 mb-8">{t('news.latestNews')}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {related.map((p) => (
                <Link key={p.slug} href={`/news/${p.slug}`} className="group">
                  <article className="h-full p-6 rounded-2xl bg-white border border-neutral-200 hover:border-gold-400/40 hover:shadow-lg transition-all duration-300">
                    <p className="text-caption text-neutral-500 mb-2">
                      {new Date(p.publishedAt).toLocaleDateString(rtl ? 'ar-SA' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    <h3 className="heading-card text-heading-sm text-primary-950 group-hover:text-gold-600 transition-colors line-clamp-2">
                      {rtl ? p.titleAr : p.titleEn}
                    </h3>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section-padding bg-white text-center" dir={dir}>
        <div className="container-custom">
          <Link href="/news" className="inline-flex">
            <Button variant="secondary" size="lg">
              <ArrowRight className="h-5 w-5 rotate-180 rtl:rotate-0" aria-hidden="true" />
              {t('news.title')}
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
