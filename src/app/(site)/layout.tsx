import type { Metadata } from 'next';
import { getCompany, getSocialLinks } from '@/lib/data';
import { SiteHeader, SiteFooter } from '@/components/layout/SiteChrome';
import { I18nProvider } from '@/context/I18nContext';

export async function generateMetadata(): Promise<Metadata> {
  const company = await getCompany();
  const nameEn = company?.nameEn || 'ALREFAI UNITED COMPANY';
  const taglineEn = company?.taglineEn || 'Building Trust. Shaping the Future.';
  return {
    title: {
      default: `${nameEn} | ${taglineEn}`,
      template: `%s | ${nameEn}`,
    },
    description: company?.descriptionEn || 'Your trusted partner for growth, excellence and sustainable development.',
  };
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [company, socialLinks] = await Promise.all([getCompany(), getSocialLinks()]);

  const companyInfo = company
    ? {
        nameAr: company.nameAr,
        nameEn: company.nameEn,
        taglineAr: company.taglineAr || undefined,
        taglineEn: company.taglineEn || undefined,
        addressAr: company.addressAr || undefined,
        addressEn: company.addressEn || undefined,
        phone: company.phone || undefined,
        email: company.email || undefined,
        whatsapp: company.whatsapp || undefined,
        workingHoursAr: company.workingHoursAr || undefined,
        workingHoursEn: company.workingHoursEn || undefined,
      }
    : undefined;

  const socials = socialLinks.map((s) => ({
    platform: s.platform,
    label: s.nameEn,
    url: s.url,
  }));

  return (
    <I18nProvider initialLocale="ar">
      <SiteHeader companyInfo={companyInfo} />
      <main id="main-content" className="flex-1 min-h-screen">
        {children}
      </main>
      <SiteFooter companyInfo={companyInfo} socialLinks={socials} />
    </I18nProvider>
  );
}
