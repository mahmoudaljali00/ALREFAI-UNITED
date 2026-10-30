import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPostBySlug, getPosts } from '@/lib/data';
import { PostDetailContent } from '@/components/pages/PostDetailContent';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: 'Article Not Found' };
  return {
    title: post.metaTitleEn || post.titleEn,
    description: post.metaDescriptionEn || post.excerptEn || undefined,
  };
}

export default async function PostDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [post, recent] = await Promise.all([getPostBySlug(slug), getPosts({ limit: 4 })]);
  if (!post || post.status !== 'PUBLISHED') notFound();

  return (
    <PostDetailContent
      post={{
        titleAr: post.titleAr,
        titleEn: post.titleEn,
        excerptAr: post.excerptAr || undefined,
        excerptEn: post.excerptEn || undefined,
        contentAr: post.contentAr,
        contentEn: post.contentEn,
        featuredImage: post.featuredImage || undefined,
        publishedAt: (post.publishedAt || post.createdAt).toISOString(),
        authorName: post.author?.name || undefined,
        category: post.category
          ? { nameAr: post.category.nameAr, nameEn: post.category.nameEn, color: post.category.color || undefined }
          : undefined,
      }}
      related={recent
        .filter((p) => p.slug !== slug)
        .slice(0, 3)
        .map((p) => ({
          titleAr: p.titleAr,
          titleEn: p.titleEn,
          slug: p.slug,
          publishedAt: (p.publishedAt || p.createdAt).toISOString(),
        }))}
    />
  );
}
