import type { Metadata } from 'next';
import { getServices, getCompany } from '@/lib/data';
import { ServicesPageContent } from '@/components/pages/ServicesPageContent';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const company = await getCompany();
  return {
    title: 'Our Services',
    description: company?.descriptionEn || 'Integrated engineering, construction, trading and logistics solutions.',
  };
}

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <ServicesPageContent
      services={services.map((s) => ({
        id: s.id,
        titleAr: s.titleAr,
        titleEn: s.titleEn,
        slug: s.slug,
        shortDescriptionAr: s.shortDescriptionAr || undefined,
        shortDescriptionEn: s.shortDescriptionEn || undefined,
        icon: s.icon || undefined,
        image: s.image || undefined,
        featured: s.featured,
      }))}
    />
  );
}
