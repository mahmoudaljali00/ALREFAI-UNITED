import type { Metadata } from 'next';
import { getCompany } from '@/lib/data';
import { ContactPageContent } from '@/components/pages/ContactPageContent';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with ALREFAI UNITED COMPANY. We are here to serve you.',
};

export default async function ContactPage() {
  const company = await getCompany();
  return (
    <ContactPageContent
      company={
        company
          ? {
              addressAr: company.addressAr || undefined,
              addressEn: company.addressEn || undefined,
              phone: company.phone || undefined,
              email: company.email || undefined,
              whatsapp: company.whatsapp || undefined,
              workingHoursAr: company.workingHoursAr || undefined,
              workingHoursEn: company.workingHoursEn || undefined,
              mapEmbedUrl: company.mapEmbedUrl || undefined,
            }
          : null
      }
    />
  );
}
