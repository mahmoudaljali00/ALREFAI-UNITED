'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useI18n } from '@/context/I18nContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ArrowRight, Building2, Hammer, Truck, Briefcase, Cog, HardHat } from 'lucide-react';
import Link from 'next/link';

interface ServiceItem {
  id: string;
  titleAr: string;
  titleEn: string;
  shortDescriptionAr?: string;
  shortDescriptionEn?: string;
  icon?: string;
  image?: string;
  featured?: boolean;
  slug: string;
}

interface ServicesProps {
  locale?: string;
  services?: ServiceItem[];
}

const defaultServices: ServiceItem[] = [
  {
    id: '1',
    titleAr: 'الخدمات الهندسية',
    titleEn: 'Engineering Services',
    shortDescriptionAr: 'تصميم وإشراف هندسي متكامل للمشاريع الكبرى',
    shortDescriptionEn: 'Integrated engineering design and supervision for major projects',
    icon: 'cog',
    slug: 'engineering',
    featured: true,
  },
  {
    id: '2',
    titleAr: 'المقاولات والإنشاءات',
    titleEn: 'Contracting & Construction',
    shortDescriptionAr: 'تنفيذ مشاريع إنشائية بمواصفات عالمية',
    shortDescriptionEn: 'Execution of construction projects with international specifications',
    icon: 'hammer',
    slug: 'construction',
    featured: true,
  },
  {
    id: '3',
    titleAr: 'التجارة والتوريد',
    titleEn: 'Trading & Supply',
    shortDescriptionAr: 'توريد مواد ومعدات عالية الجودة للمشاريع',
    shortDescriptionEn: 'Supply of high-quality materials and equipment for projects',
    icon: 'truck',
    slug: 'trading',
    featured: true,
  },
  {
    id: '4',
    titleAr: 'الاستشارات',
    titleEn: 'Consulting',
    shortDescriptionAr: 'استشارات إدارية وفنية متخصصة',
    shortDescriptionEn: 'Specialized management and technical consulting',
    icon: 'briefcase',
    slug: 'consulting',
    featured: false,
  },
  {
    id: '5',
    titleAr: 'إدارة المشاريع',
    titleEn: 'Project Management',
    shortDescriptionAr: 'إدارة متكاملة لدورة حياة المشروع',
    shortDescriptionEn: 'Integrated project lifecycle management',
    icon: 'building2',
    slug: 'project-management',
    featured: false,
  },
  {
    id: '6',
    titleAr: 'الخدمات اللوجستية',
    titleEn: 'Logistics Services',
    shortDescriptionAr: 'حلول لوجستية شاملة للنقل والتخزين',
    shortDescriptionEn: 'Comprehensive logistics solutions for transport and storage',
    icon: 'truck',
    slug: 'logistics',
    featured: false,
  },
];

const icons = {
  cog: Cog,
  hammer: Hammer,
  truck: Truck,
  briefcase: Briefcase,
  building2: Building2,
  hardhat: HardHat,
};

export function Services({ locale, services }: ServicesProps = {}) {
  const { t, dir } = useI18n();
  const displayServices = services || defaultServices;

  return (
    <section id="services" className="section-padding-lg bg-neutral-50 relative overflow-hidden" aria-labelledby="services-title">
      <div className="absolute inset-0 bg-[url('/patterns/dot-pattern.svg')] opacity-5" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gold-500/5 rounded-full blur-3xl" aria-hidden="true" />
      
      <div className="container-custom relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mb-10 sm:mb-12 lg:mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-800 text-caption font-medium mb-4">
            <span className="w-2 h-2 rounded-full bg-gold-400" aria-hidden="true" />
            {t('services.title')}
          </span>
          <h2 id="services-title" className="heading-display text-display-md text-primary-950 mb-4">
            {t('services.subtitle')}
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 items-stretch">
            {displayServices.map((service, index) => (
              <ServiceCard
                key={service.id}
                service={service}
                index={index}
                locale={locale}
                dir={dir}
                isFeatured={service.featured ?? false}
              />
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-10 sm:mt-12 lg:mt-16"
        >
          <Link href="/services" className="inline-flex">
            <Button variant="secondary" size="lg" className="min-w-[13.5rem]">
              {t('services.viewAll')}
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function ServiceCard({ 
  service, 
  index, 
  locale, 
  dir, 
  isFeatured 
}: { 
  service: ServiceItem; 
  index: number; 
  locale?: string; 
  dir: 'rtl' | 'ltr'; 
  isFeatured: boolean;
}) {
  const { t } = useI18n();
  const IconComponent = icons[service.icon as keyof typeof icons] || Cog;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
      className="h-full"
    >
      <Card 
        variant="elevated" 
        padding="lg" 
        hover 
        className={cn(
          'relative overflow-hidden group card-equal',
          isFeatured && 'border border-gold-400/40'
        )}
      >
        <div className={cn('card-band', !isFeatured && 'opacity-70')} aria-hidden="true" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-gold-400/5 rounded-full blur-xl translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true" />
        
        <div className="relative z-10 flex flex-col h-full pt-1">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div className="w-12 h-12 rounded-xl bg-primary-100 group-hover:bg-primary-900 transition-all duration-500 flex items-center justify-center flex-shrink-0">
              <IconComponent className="h-6 w-6 text-primary-700 group-hover:text-white transition-colors duration-500" aria-hidden="true" />
            </div>
            {isFeatured && (
              <Badge variant="gold" size="sm" dot>
                {dir === 'rtl' ? 'متميز' : 'Featured'}
              </Badge>
            )}
          </div>

          <div className="mb-4 flex-1">
            <span className="text-caption text-gold-600 font-medium tracking-wider">
              {String(index + 1).padStart(2, '0')}
            </span>
            <h3 className="heading-card text-heading-md text-primary-950 mt-2 mb-3 min-h-[2.7rem]">
              {dir === 'rtl' ? service.titleAr : service.titleEn}
            </h3>
            <p className="text-body text-neutral-600 leading-relaxed line-clamp-3">
              {dir === 'rtl' ? service.shortDescriptionAr : service.shortDescriptionEn}
            </p>
          </div>

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
}