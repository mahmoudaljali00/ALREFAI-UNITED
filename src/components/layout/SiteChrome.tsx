'use client';

/**
 * Client-side header/footer wrappers that receive DB-driven company
 * info from the server layout. Reuses the existing premium Navigation
 * and Footer components but overrides static contact details and
 * social links with live data (falling back to sensible defaults).
 */

import { Navigation } from './Navigation';
import { Footer } from './Footer';

export interface CompanyInfo {
  nameAr?: string;
  nameEn?: string;
  taglineAr?: string;
  taglineEn?: string;
  addressAr?: string;
  addressEn?: string;
  phone?: string;
  email?: string;
  whatsapp?: string;
  workingHoursAr?: string;
  workingHoursEn?: string;
}

export interface SocialLinkItem {
  platform: string;
  label: string;
  url: string;
}

export function SiteHeader({ companyInfo }: { companyInfo?: CompanyInfo }) {
  return <Navigation companyInfo={companyInfo} />;
}

export function SiteFooter({
  companyInfo,
  socialLinks,
}: {
  companyInfo?: CompanyInfo;
  socialLinks: SocialLinkItem[];
}) {
  return <Footer companyInfo={companyInfo} socialLinks={socialLinks} />;
}
