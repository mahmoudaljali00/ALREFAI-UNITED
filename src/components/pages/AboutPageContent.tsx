'use client';

import { motion } from 'framer-motion';
import { useI18n } from '@/context/I18nContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Values } from '@/components/sections/Values';
import { Statistics } from '@/components/sections/Statistics';
import { Target, Eye, CalendarDays, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface CompanyProfile {
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  visionAr: string;
  visionEn: string;
  missionAr: string;
  missionEn: string;
  foundedYear?: number;
}

interface TeamMemberItem {
  id: string;
  nameAr: string;
  nameEn: string;
  positionAr: string;
  positionEn: string;
  image?: string;
}

export function AboutPageContent({
  company,
  team = [],
}: {
  company: CompanyProfile | null;
  team?: TeamMemberItem[];
}) {
  const { t, dir } = useI18n();
  const rtl = dir === 'rtl';

  const description = company ? (dir === 'rtl' ? company.descriptionAr : company.descriptionEn) : t('about.description1');
  const vision = company ? (dir === 'rtl' ? company.visionAr : company.visionEn) : '';
  const mission = company ? (dir === 'rtl' ? company.missionAr : company.missionEn) : '';

  return (
    <>
      {/* Hero */}
      <section className="relative bg-primary-950 overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-28" dir={dir}>
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1920&q=80"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-primary-950/90 via-primary-950/85 to-primary-950/95" aria-hidden="true" />
        <div className="absolute inset-0 bg-[url('/patterns/hero-pattern.svg')] opacity-5" aria-hidden="true" />
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-gold-500/10 rounded-full blur-3xl" aria-hidden="true" />
        <div className="container-custom relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gold-400 text-caption font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-gold-400" aria-hidden="true" />
              {t('about.title')}
            </span>
            <h1 className="heading-display text-display-lg text-white mb-6">
              {company ? (dir === 'rtl' ? company.nameAr : company.nameEn) : t('about.subtitle')}
            </h1>
            <p className="text-body-lg text-white/70 leading-relaxed">{description}</p>
            {company?.foundedYear && (
              <div className="mt-8 inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-white/5 border border-white/10">
                <CalendarDays className="h-5 w-5 text-gold-400" aria-hidden="true" />
                <span className="text-body text-white/80">
                  {dir === 'rtl' ? `تأسست عام` : 'Founded in'} <span className="text-gold-400 font-medium">{company.foundedYear}</span>
                </span>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="section-padding-lg bg-white" dir={dir}>
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {[
              { icon: Eye, title: t('about.vision'), text: vision },
              { icon: Target, title: t('about.mission'), text: mission },
            ].map(
              (item, index) =>
                item.text && (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.5, delay: index * 0.15 }}
                  >
                    <Card variant="elevated" padding="lg" hover className="relative overflow-hidden h-full">
                      <div className="card-band" aria-hidden="true" />
                      <div className="w-14 h-14 rounded-xl bg-primary-100 flex items-center justify-center mb-6">
                        <item.icon className="h-7 w-7 text-primary-700" aria-hidden="true" />
                      </div>
                      <h2 className="heading-card text-heading-lg text-primary-950 mb-4">{item.title}</h2>
                      <p className="text-body text-neutral-600 leading-relaxed">{item.text}</p>
                    </Card>
                  </motion.div>
                )
            )}
          </div>
        </div>
      </section>

      {/* Values (DB-driven) */}
      <Values />

      {/* Statistics (DB-driven) */}
      <Statistics locale="ar" />

      {/* Team (DB-driven) */}
      {team.length > 0 && (
        <section className="section-padding-lg bg-neutral-50" dir={dir}>
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 lg:mb-16"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-800 text-caption font-medium mb-4">
                <span className="w-2 h-2 rounded-full bg-gold-400" aria-hidden="true" />
                {t('nav.team') !== 'nav.team' ? t('nav.team') : rtl ? 'فريق العمل' : 'Our Team'}
              </span>
              <h2 className="heading-display text-display-md text-primary-950 mb-4">
                {rtl ? 'قيادات نفتخر بها' : 'Leadership We Are Proud Of'}
              </h2>
              <p className="text-body-lg text-neutral-600 max-w-2xl mx-auto">
                {rtl
                  ? 'نخبة من الخبرات الهندسية والإدارية تقود مشاريعنا نحو التميز.'
                  : 'A select group of engineering and management expertise leading our projects to excellence.'}
              </p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 items-stretch">
              {team.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: (index % 4) * 0.08 }}
                  className="h-full"
                >
                  <div className="group h-full rounded-2xl overflow-hidden bg-white border border-neutral-100 hover:shadow-xl hover:shadow-primary-900/10 transition-all duration-500">
                    <div className="relative aspect-[4/5] overflow-hidden bg-primary-100">
                      {member.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={member.image}
                          alt={rtl ? member.nameAr : member.nameEn}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-display-lg text-primary-300 font-display">{(rtl ? member.nameAr : member.nameEn).charAt(0)}</span>
                        </div>
                      )}
                    </div>
                    <div className="p-5 text-center">
                      <h3 className="heading-card text-heading-sm text-primary-950 mb-1">{rtl ? member.nameAr : member.nameEn}</h3>
                      <p className="text-body-sm text-gold-600">{rtl ? member.positionAr : member.positionEn}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="section-padding bg-white" dir={dir}>
        <div className="container-custom text-center">
          <Link href="/contact" className="inline-flex">
            <Button variant="gold" size="lg" className="min-w-[13.5rem]">
              {t('cta.button')}
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
