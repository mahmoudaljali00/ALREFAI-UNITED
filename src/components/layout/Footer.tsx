'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useI18n } from '@/context/I18nContext';
import { LogoFull } from './Logo';
import type { CompanyInfo, SocialLinkItem } from './SiteChrome';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Facebook, Twitter, Linkedin, Instagram, Youtube, Mail, MapPin, Phone, Clock, Send } from 'lucide-react';

const footerLinks = {
  quickLinks: [
    { key: 'home', href: '/' },
    { key: 'about', href: '/about' },
    { key: 'services', href: '/services' },
    { key: 'projects', href: '/projects' },
    { key: 'industries', href: '/industries' },
    { key: 'sustainability', href: '/sustainability' },
    { key: 'news', href: '/news' },
    { key: 'contact', href: '/contact' },
  ],
  services: [
    { key: 'engineering', href: '/services/engineering' },
    { key: 'construction', href: '/services/construction' },
    { key: 'trading', href: '/services/trading' },
    { key: 'consulting', href: '/services/consulting' },
    { key: 'projectManagement', href: '/services/project-management' },
    { key: 'logistics', href: '/services/logistics' },
  ],
};

const socialLinks = [
  { href: '#', icon: Linkedin, label: 'LinkedIn' },
  { href: '#', icon: Twitter, label: 'Twitter' },
  { href: '#', icon: Facebook, label: 'Facebook' },
  { href: '#', icon: Instagram, label: 'Instagram' },
  { href: '#', icon: Youtube, label: 'YouTube' },
];

const socialIcons: Record<string, typeof Linkedin> = {
  linkedin: Linkedin,
  twitter: Twitter,
  facebook: Facebook,
  instagram: Instagram,
  youtube: Youtube,
};

export function Footer({
  companyInfo,
  socialLinks,
}: {
  companyInfo?: CompanyInfo;
  socialLinks: SocialLinkItem[];
} = { socialLinks: [] }) {
  const { t, locale, dir } = useI18n();

  const address = dir === 'rtl' ? companyInfo?.addressAr || 'الرياض، المملكة العربية السعودية' : companyInfo?.addressEn || 'Riyadh, Kingdom of Saudi Arabia';
  const phone = companyInfo?.phone || '+966 11 234 5678';
  const email = companyInfo?.email || 'info@alrefaiunited.com';
  const workingHours = dir === 'rtl'
    ? companyInfo?.workingHoursAr || 'الأحد - الخميس 8:00 - 17:00'
    : companyInfo?.workingHoursEn || 'Sun-Thu 8:00-17:00';
  const socials: SocialLinkItem[] = socialLinks.length
    ? socialLinks
    : [
        { platform: 'linkedin', label: 'LinkedIn', url: '#' },
        { platform: 'twitter', label: 'Twitter', url: '#' },
        { platform: 'facebook', label: 'Facebook', url: '#' },
        { platform: 'instagram', label: 'Instagram', url: '#' },
        { platform: 'youtube', label: 'YouTube', url: '#' },
      ];

  return (
    <footer className="bg-primary-950 text-white relative overflow-hidden" role="contentinfo">
      <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-5" aria-hidden="true" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-r from-gold-500/10 to-transparent rounded-full blur-3xl" aria-hidden="true" />
      
      <div className="container-custom relative py-16 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-16 mb-16">
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-3" aria-label={t('nav.home')}>
              <LogoFull size="xl" variant="white" />
            </Link>
            <p className="text-body text-white/60 max-w-xs leading-relaxed">
              {t('footer.description')}
            </p>
            <div className="flex flex-wrap gap-3">
              {socials.map((social) => {
                const Icon = socialIcons[social.platform] || Linkedin;
                return (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:bg-gold-500/20 hover:border-gold-500/50 hover:text-gold-400 transition-all duration-300"
                  aria-label={social.label}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </a>
                );
              })}
            </div>
          </div>

          <div className="space-y-5">
            <h3 className="heading-card text-white">{t('footer.quickLinks')}</h3>
            <nav aria-label={t('footer.quickLinks')}>
              <ul className="space-y-3" role="list">
                {footerLinks.quickLinks.map((link) => (
                  <li key={link.key}>
                    <Link
                      href={link.href}
                      className="text-body text-white/60 hover:text-gold-400 transition-colors relative inline-flex items-center gap-2"
                    >
                      {t(`nav.${link.key}`)}
                      <span className="h-0.5 w-0 bg-gold-400 transition-all duration-300 group-hover:w-full" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="space-y-5">
            <h3 className="heading-card text-white">{t('footer.services')}</h3>
            <nav aria-label={t('footer.services')}>
              <ul className="space-y-3" role="list">
                {footerLinks.services.map((link) => (
                  <li key={link.key}>
                    <Link
                      href={link.href}
                      className="text-body text-white/60 hover:text-gold-400 transition-colors relative inline-flex items-center gap-2"
                    >
                      {t(`services.${link.key}`)}
                      <span className="h-0.5 w-0 bg-gold-400 transition-all duration-300 group-hover:w-full" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="space-y-5">
            <h3 className="heading-card text-white">{t('footer.contactInfo')}</h3>
            <address className="not-italic space-y-4 text-body text-white/60">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gold-400 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-medium text-white">{t('contact.address')}</p>
                  <p>{address}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gold-400 shrink-0" aria-hidden="true" />
                <a href={`tel:${phone.replace(/[^+0-9]/g, '')}`} className="hover:text-gold-400 transition-colors" dir="ltr">{phone}</a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gold-400 shrink-0" aria-hidden="true" />
                <a href={`mailto:${email}`} className="hover:text-gold-400 transition-colors">{email}</a>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-gold-400 shrink-0" aria-hidden="true" />
                <span>{t('footer.workingHours')}: {workingHours}</span>
              </div>
            </address>
          </div>
        </div>

        <div className="border-t border-primary-800 pt-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
            <div>
              <h3 className="heading-card text-white mb-4">{t('footer.newsletter')}</h3>
              <p className="text-body text-white/60 mb-4">{t('footer.newsletterDesc')}</p>
              <form className="flex flex-col sm:flex-row gap-3 max-w-md" action="#" onSubmit={(e) => e.preventDefault()}>
                <Input
                  type="email"
                  placeholder={t('footer.emailPlaceholder')}
                  className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-white/400 focus:border-gold-400 focus:ring-gold-400/20"
                  aria-label={t('footer.emailPlaceholder')}
                />
                <Button variant="gold" type="submit" className="whitespace-nowrap">
                  <Send className="h-4 w-4" aria-hidden="true" />
                  {t('footer.subscribe')}
                </Button>
              </form>
            </div>

            <div className="lg:col-span-1">
              <h3 className="heading-card text-white mb-4">{t('footer.followUs')}</h3>
              <div className="flex flex-wrap gap-3">
                {socials.map((social) => {
                  const Icon = socialIcons[social.platform] || Linkedin;
                  return (
                  <a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:bg-gold-500/20 hover:border-gold-500/50 hover:text-gold-400 transition-all duration-300"
                    aria-label={social.label}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                    <span className="text-sm font-medium">{social.label}</span>
                  </a>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pt-8 border-t border-primary-800">
            <p className="text-body-sm text-white/40 text-center lg:text-left">
              {t('footer.copyright')}
            </p>
            <div className="flex items-center gap-6 text-body-sm text-white/40">
              <Link href="/privacy" className="hover:text-gold-400 transition-colors">
                {t('footer.privacy')}
              </Link>
              <Link href="/terms" className="hover:text-gold-400 transition-colors">
                {t('footer.terms')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}