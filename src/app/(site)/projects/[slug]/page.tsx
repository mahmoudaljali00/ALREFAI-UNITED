import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProjectBySlug } from '@/lib/data';
import { ProjectDetailContent } from '@/components/pages/ProjectDetailContent';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: 'Project Not Found' };
  return {
    title: project.metaTitleEn || project.titleEn,
    description: project.metaDescriptionEn || project.shortDescriptionEn || undefined,
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project || !project.isActive) notFound();

  return (
    <ProjectDetailContent
      project={{
        titleAr: project.titleAr,
        titleEn: project.titleEn,
        category: project.category,
        locationAr: project.locationAr || undefined,
        locationEn: project.locationEn || undefined,
        shortDescriptionAr: project.shortDescriptionAr || undefined,
        shortDescriptionEn: project.shortDescriptionEn || undefined,
        descriptionAr: project.descriptionAr || undefined,
        descriptionEn: project.descriptionEn || undefined,
        mainImage: project.mainImage || undefined,
        completionDate: project.completionDate ? String(new Date(project.completionDate).getFullYear()) : undefined,
        area: project.area || undefined,
        budget: project.budget || undefined,
        clientAr: project.clientAr || undefined,
        clientEn: project.clientEn || undefined,
        status: project.status,
      }}
      gallery={project.gallery.map((g) => ({
        url: g.url,
        altAr: g.altAr || undefined,
        altEn: g.altEn || undefined,
      }))}
    />
  );
}
