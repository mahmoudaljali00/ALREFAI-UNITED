import type { Metadata } from 'next';
import { getProjects, getCompany } from '@/lib/data';
import { ProjectsPageContent } from '@/components/pages/ProjectsPageContent';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const company = await getCompany();
  return {
    title: 'Our Projects',
    description: company?.descriptionEn || 'A portfolio of landmark projects across the Kingdom.',
  };
}

export default async function ProjectsPage() {
  const projects = await getProjects();
  return (
    <ProjectsPageContent
      projects={projects.map((p) => ({
        id: p.id,
        titleAr: p.titleAr,
        titleEn: p.titleEn,
        slug: p.slug,
        category: p.category,
        locationAr: p.locationAr || undefined,
        locationEn: p.locationEn || undefined,
        shortDescriptionAr: p.shortDescriptionAr || undefined,
        shortDescriptionEn: p.shortDescriptionEn || undefined,
        mainImage: p.mainImage || undefined,
        completionDate: p.completionDate ? String(new Date(p.completionDate).getFullYear()) : undefined,
        featured: p.featured,
      }))}
    />
  );
}
