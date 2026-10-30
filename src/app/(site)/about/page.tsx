import type { Metadata } from 'next';
import { getCompany, getTeamMembers } from '@/lib/data';
import { AboutPageContent } from '@/components/pages/AboutPageContent';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const company = await getCompany();
  return {
    title: company?.taglineEn || 'About Us',
    description: company?.descriptionEn || 'Learn about ALREFAI UNITED COMPANY, our vision, mission and values.',
  };
}

export default async function AboutPage() {
  const [company, teamMembers] = await Promise.all([getCompany(), getTeamMembers()]);
  return (
    <AboutPageContent
      company={
        company
          ? {
              nameAr: company.nameAr,
              nameEn: company.nameEn,
              descriptionAr: company.descriptionAr || '',
              descriptionEn: company.descriptionEn || '',
              visionAr: company.visionAr || '',
              visionEn: company.visionEn || '',
              missionAr: company.missionAr || '',
              missionEn: company.missionEn || '',
              foundedYear: company.foundedYear || undefined,
            }
          : null
      }
      team={teamMembers.map((m) => ({
        id: m.id,
        nameAr: m.nameAr,
        nameEn: m.nameEn,
        positionAr: m.positionAr,
        positionEn: m.positionEn,
        image: m.image || undefined,
      }))}
    />
  );
}
