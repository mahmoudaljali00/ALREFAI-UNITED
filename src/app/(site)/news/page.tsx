import type { Metadata } from 'next';
import { getPosts, getCategories } from '@/lib/data';
import { NewsPageContent } from '@/components/pages/NewsPageContent';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'News & Updates',
  description: 'Stay updated with the latest news, projects and partnerships of ALREFAI UNITED COMPANY.',
};

export default async function NewsPage() {
  const [posts, categories] = await Promise.all([getPosts(), getCategories()]);
  return (
    <NewsPageContent
      posts={posts.map((p) => ({
        id: p.id,
        titleAr: p.titleAr,
        titleEn: p.titleEn,
        slug: p.slug,
        excerptAr: p.excerptAr || undefined,
        excerptEn: p.excerptEn || undefined,
        featuredImage: p.featuredImage || undefined,
        category: p.category
          ? { nameAr: p.category.nameAr, nameEn: p.category.nameEn, color: p.category.color || undefined, slug: p.category.slug }
          : undefined,
        publishedAt: (p.publishedAt || p.createdAt).toISOString(),
      }))}
      categories={categories.map((c) => ({
        slug: c.slug,
        nameAr: c.nameAr,
        nameEn: c.nameEn,
        color: c.color || undefined,
      }))}
    />
  );
}
