'use client';

import { motion } from 'framer-motion';
import { useI18n } from '@/context/I18nContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Leaf, Recycle, Sun, Droplets, Users, Building2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function SustainabilityPageContent() {
  const { t, dir } = useI18n();
  const rtl = dir === 'rtl';

  const pillars = [
    {
      icon: Leaf,
      titleAr: 'التصميم المستدام',
      titleEn: 'Sustainable Design',
      descAr: 'ندمج معايير الاستدامة في التصاميم منذ المرحلة الأولى، بهدف الحصول على شهادات LEED لمشاريعنا الكبرى.',
      descEn: 'We embed sustainability standards from the first design phase, targeting LEED certification for our major projects.',
    },
    {
      icon: Recycle,
      titleAr: 'إدارة النفايات',
      titleEn: 'Waste Management',
      descAr: 'برامج إعادة تدوير شاملة في مواقع العمل تقلل النفايات وتعيد استخدام المواد.',
      descEn: 'Comprehensive recycling programs on work sites that reduce waste and reuse materials.',
    },
    {
      icon: Sun,
      titleAr: 'كفاءة الطاقة',
      titleEn: 'Energy Efficiency',
      descAr: 'أنظمة طاقة شمسية وحلول توفير الطاقة في المشاريع لتقليل البصمة الكربونية.',
      descEn: 'Solar systems and energy-saving solutions in our projects to reduce the carbon footprint.',
    },
    {
      icon: Droplets,
      titleAr: 'ترشيد المياه',
      titleEn: 'Water Conservation',
      descAr: 'أنظمة ري حديثة وتجميع مياه الأمطار في جميع مشاريعنا.',
      descEn: 'Modern irrigation systems and rainwater harvesting across all our projects.',
    },
    {
      icon: Users,
      titleAr: 'المسؤولية الاجتماعية',
      titleEn: 'Social Responsibility',
      descAr: 'تدريب وتوظيف الكفاءات المحلية ودعم المجتمعات المحيطة بمشاريعنا.',
      descEn: 'Training and hiring local talent and supporting communities surrounding our projects.',
    },
    {
      icon: Building2,
      titleAr: 'السلامة والبيئة',
      titleEn: 'Safety & Environment',
      descAr: 'معايير HSE صارمة تحمي العاملين والبيئة في كل موقع عمل.',
      descEn: 'Strict HSE standards protecting workers and the environment on every site.',
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative bg-primary-950 overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-28" dir={dir}>
        <div className="absolute inset-0" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1920&q=80" alt="" className="w-full h-full object-cover opacity-25" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-primary-950/85 via-primary-950/80 to-primary-950/95" aria-hidden="true" />
        <div className="absolute inset-0 bg-[url('/patterns/hero-pattern.svg')] opacity-5" aria-hidden="true" />
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-gold-500/10 rounded-full blur-3xl" aria-hidden="true" />
        <div className="container-custom relative">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gold-400 text-caption font-medium mb-6">
              <Leaf className="h-3 w-3" aria-hidden="true" />
              {t('values.sustainability')}
            </span>
            <h1 className="heading-display text-display-lg text-white mb-6">
              {rtl ? 'الاستدامة مسؤوليتنا' : 'Sustainability Is Our Responsibility'}
            </h1>
            <p className="text-body-lg text-white/70 leading-relaxed">
              {rtl
                ? 'نلتزم ببناء مستقبل أكثر استدامة من خلال ممارسات صديقة للبيئة في كل مشاريعنا وعملياتنا.'
                : 'We are committed to building a more sustainable future through environmentally friendly practices across all our projects and operations.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pillars */}
      <section className="section-padding-lg bg-white" dir={dir}>
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 items-stretch">
            {pillars.map((pillar, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
                className="h-full"
              >
                <Card variant="elevated" padding="lg" hover className="relative overflow-hidden group card-equal h-full">
                  <div className="card-band" aria-hidden="true" />
                  <div className="relative z-10 pt-1">
                    <div className="w-12 h-12 rounded-xl bg-primary-100 group-hover:bg-primary-900 transition-all duration-500 flex items-center justify-center mb-5">
                      <pillar.icon className="h-6 w-6 text-primary-700 group-hover:text-white transition-colors duration-500" aria-hidden="true" />
                    </div>
                    <h2 className="heading-card text-heading-md text-primary-950 mb-3">
                      {rtl ? pillar.titleAr : pillar.titleEn}
                    </h2>
                    <p className="text-body text-neutral-600 leading-relaxed">
                      {rtl ? pillar.descAr : pillar.descEn}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-14">
            <Link href="/contact" className="inline-flex">
              <Button variant="gold" size="lg" className="min-w-[13.5rem]">
                {t('cta.button')}
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
