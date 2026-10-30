'use client';

import { motion } from 'framer-motion';
import { useI18n } from '@/context/I18nContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Building2, Factory, Truck, HeartPulse, GraduationCap, Store, Hotel, Wheat, Landmark,
  type LucideIcon,
} from 'lucide-react';
import Link from 'next/link';

interface IndustryItem {
  id: string;
  nameAr: string;
  nameEn: string;
  slug: string;
  descriptionAr?: string;
  descriptionEn?: string;
  icon?: string;
  image?: string;
  featured?: boolean;
}

const iconMap: Record<string, LucideIcon> = {
  Building2, Factory, Truck, HeartPulse, GraduationCap, Store, Hotel, Wheat, Landmark,
  building2: Building2,
  factory: Factory,
  truck: Truck,
  heartpulse: HeartPulse,
  graduationcap: GraduationCap,
  store: Store,
  hotel: Hotel,
  wheat: Wheat,
};

export function IndustriesPageContent({ industries }: { industries: IndustryItem[] }) {
  const { t, dir } = useI18n();
  const rtl = dir === 'rtl';

  return (
    <>
      {/* Hero */}
      <section className="relative bg-primary-950 overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-28" dir={dir}>
        <div className="absolute inset-0" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1920&q=80" alt="" className="w-full h-full object-cover opacity-25" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-primary-950/85 via-primary-950/80 to-primary-950/95" aria-hidden="true" />
        <div className="absolute inset-0 bg-[url('/patterns/hero-pattern.svg')] opacity-5" aria-hidden="true" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gold-500/10 rounded-full blur-3xl" aria-hidden="true" />
        <div className="container-custom relative">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gold-400 text-caption font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-gold-400" aria-hidden="true" />
              {t('industries.title')}
            </span>
            <h1 className="heading-display text-display-lg text-white mb-6">{t('industries.subtitle')}</h1>
          </motion.div>
        </div>
      </section>

      {/* Grid */}
      <section className="section-padding-lg bg-white" dir={dir}>
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 items-stretch">
            {industries.map((industry, index) => {
              const IconComponent = (industry.icon && iconMap[industry.icon]) || iconMap[industry.icon?.toLowerCase() || ''] || Building2;
              return (
                <motion.div
                  key={industry.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: (index % 4) * 0.08 }}
                  className="h-full"
                >
                  <Card variant="elevated" padding="lg" hover className="relative overflow-hidden group card-equal h-full">
                    <div className="card-band" aria-hidden="true" />
                    <div className="relative z-10 pt-1">
                      <div className="flex items-start justify-between gap-3 mb-5">
                        <div className="w-12 h-12 rounded-xl bg-primary-100 group-hover:bg-primary-900 transition-all duration-500 flex items-center justify-center">
                          <IconComponent className="h-6 w-6 text-primary-700 group-hover:text-white transition-colors duration-500" aria-hidden="true" />
                        </div>
                        {industry.featured && (
                          <Badge variant="gold" size="sm" dot>
                            {rtl ? 'قطاع رئيسي' : 'Key Sector'}
                          </Badge>
                        )}
                      </div>
                      <h2 className="heading-card text-heading-md text-primary-950 mb-3">
                        {rtl ? industry.nameAr : industry.nameEn}
                      </h2>
                      <p className="text-body-sm text-neutral-600 leading-relaxed">
                        {rtl ? industry.descriptionAr : industry.descriptionEn}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <div className="text-center mt-14">
            <Link href="/contact" className="inline-flex">
              <Button variant="gold" size="lg" className="min-w-[13.5rem]">
                {t('cta.button')}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
