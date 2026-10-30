import type { Metadata } from 'next';
import { getCompany } from '@/lib/data';
import { LegalPageContent } from '@/components/pages/LegalPageContent';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Terms and conditions of use for the ALREFAI UNITED COMPANY website.',
};

export default async function TermsPage() {
  const company = await getCompany();
  return (
    <LegalPageContent
      type="terms"
      companyName={company?.nameEn || 'ALREFAI UNITED COMPANY'}
      companyNameAr={company?.nameAr || 'شركة الرفاعي المتحدة'}
      email={company?.email || 'info@alrefaiunited.com'}
    />
  );
}
