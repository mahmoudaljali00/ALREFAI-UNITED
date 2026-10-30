import type { Metadata } from 'next';
import { getCompany } from '@/lib/data';
import { LegalPageContent } from '@/components/pages/LegalPageContent';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy of ALREFAI UNITED COMPANY.',
};

export default async function PrivacyPage() {
  const company = await getCompany();
  return (
    <LegalPageContent
      type="privacy"
      companyName={company?.nameEn || 'ALREFAI UNITED COMPANY'}
      companyNameAr={company?.nameAr || 'شركة الرفاعي المتحدة'}
      email={company?.email || 'info@alrefaiunited.com'}
    />
  );
}
