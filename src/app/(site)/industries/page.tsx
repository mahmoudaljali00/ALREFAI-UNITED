import type { Metadata } from 'next';
import { getIndustries } from '@/lib/data';
import { IndustriesPageContent } from '@/components/pages/IndustriesPageContent';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Industries We Serve',
  description: 'Serving vital sectors across the Kingdom with distinguished expertise.',
};

export default async function IndustriesPage() {
  const industries = await getIndustries();
  return (
    <IndustriesPageContent
      industries={industries.map((i) => ({
        id: i.id,
        nameAr: i.nameAr,
        nameEn: i.nameEn,
        slug: i.slug,
        descriptionAr: i.descriptionAr || undefined,
        descriptionEn: i.descriptionEn || undefined,
        icon: i.icon || undefined,
        image: i.image || undefined,
        featured: i.featured,
      }))}
    />
  );
}
