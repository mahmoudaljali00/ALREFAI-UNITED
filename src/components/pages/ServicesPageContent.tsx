'use client';

import { motion } from 'framer-motion';
import { useI18n } from '@/context/I18nContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Building2, Hammer, Truck, Briefcase, Cog, HardHat, Wrench } from 'lucide-react';
import Link from 'next/link';

interface ServiceItem {
  id: string;
  titleAr: string;
  titleEn: string;
  slug: string;
  shortDescriptionAr?: string;
  shortDescriptionEn?: string;
  icon?: string;
  image?: string;
  featured?: boolean;
}

const icons: Record<string, typeof Cog> = {
  cog: Cog,
  hammer: Hammer,
  truck: Truck,
  briefcase: Briefcase,
  building2: Building2,
  hardhat: HardHat,
  wrench: Wrench,
};

export function ServicesPageContent({ services }: { services: ServiceItem[] }) {
  const { t, dir } = useI18n();

  return (
    <>
      {/* Hero */}
      <section className="relative bg-primary-950 overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-28" dir={dir}>
        <div className="absolute inset-0" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1920&q=80" alt="" className="w-full h-full object-cover opacity-25" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-primary-950/85 via-primary-950/80 to-primary-950/95" aria-hidden="true" />
        <div className="absolute inset-0 bg-[url('/patterns/hero-pattern.svg')] opacity-5" aria-hidden="true" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gold-500/10 rounded-full blur-3xl" aria-hidden="true" />
        <div className="container-custom relative">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gold-400 text-caption font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-gold-400" aria-hidden="true" />
              {t('services.title')}
            </span>
            <h1 className="heading-display text-display-lg text-white mb-6">{t('services.subtitle')}</h1>
            <p className="text-body-lg text-white/70 leading-relaxed">
              {dir === 'rtl'
                ? 'محفظة خدمات متكاملة تغطي كل مرحلة من مراحل المشروع — من الفكرة حتى التسليم والتشغيل.'
                : 'A comprehensive portfolio covering every project phase — from concept to handover and operation.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services grid */}
      <section className="section-padding-lg bg-neutral-50" dir={dir}>
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 items-stretch">
            {services.map((service, index) => {
              const IconComponent = (service.icon && icons[service.icon]) || Cog;
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
                  className="h-full"
                >
                  <Card variant="elevated" padding="lg" hover className="relative overflow-hidden group card-equal">
                    <div className="card-band" aria-hidden="true" />
                    <div className="relative z-10 flex flex-col h-full pt-1">
                      <div className="flex items-start justify-between gap-4 mb-5">
                        <div className="w-12 h-12 rounded-xl bg-primary-100 group-hover:bg-primary-900 transition-all duration-500 flex items-center justify-center flex-shrink-0">
                          <IconComponent className="h-6 w-6 text-primary-700 group-hover:text-white transition-colors duration-500" aria-hidden="true" />
                        </div>
                        {service.featured && (
                          <Badge variant="gold" size="sm" dot>
                            {dir === 'rtl' ? 'متميز' : 'Featured'}
                          </Badge>
                        )}
                      </div>
                      <h2 className="heading-card text-heading-md text-primary-950 mt-2 mb-3">
                        {dir === 'rtl' ? service.titleAr : service.titleEn}
                      </h2>
                      <p className="text-body text-neutral-600 leading-relaxed line-clamp-3 flex-1">
                        {dir === 'rtl' ? service.shortDescriptionAr : service.shortDescriptionEn}
                      </p>
                      <div className="mt-auto pt-4 border-t border-neutral-100">
                        <Link href={`/services/${service.slug}`} className="block">
                          <Button variant="ghost" size="sm" className="w-full justify-between gap-2 text-primary-700 hover:bg-primary-50 px-3">
                            {t('services.learnMore')}
                            <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
