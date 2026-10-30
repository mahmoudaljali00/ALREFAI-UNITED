import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getServiceBySlug, getServices } from '@/lib/data';
import { ServiceDetailContent } from '@/components/pages/ServiceDetailContent';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return { title: 'Service Not Found' };
  return {
    title: service.metaTitleEn || service.titleEn,
    description: service.metaDescriptionEn || service.shortDescriptionEn || undefined,
  };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [service, allServices] = await Promise.all([getServiceBySlug(slug), getServices()]);

  if (!service || !service.isActive) notFound();

  return (
    <ServiceDetailContent
      service={{
        titleAr: service.titleAr,
        titleEn: service.titleEn,
        shortDescriptionAr: service.shortDescriptionAr || undefined,
        shortDescriptionEn: service.shortDescriptionEn || undefined,
        descriptionAr: service.descriptionAr || undefined,
        descriptionEn: service.descriptionEn || undefined,
        image: service.image || undefined,
      }}
      related={allServices
        .filter((s) => s.slug !== slug && s.isActive)
        .slice(0, 3)
        .map((s) => ({
          titleAr: s.titleAr,
          titleEn: s.titleEn,
          slug: s.slug,
          shortDescriptionAr: s.shortDescriptionAr || undefined,
          shortDescriptionEn: s.shortDescriptionEn || undefined,
        }))}
    />
  );
}
