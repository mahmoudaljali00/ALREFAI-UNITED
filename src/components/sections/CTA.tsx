'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useI18n } from '@/context/I18nContext';
import { Button } from '@/components/ui/Button';
import { LogoMark } from '@/components/layout/Logo';
import Link from 'next/link';
import { ArrowRight, Target, Handshake, TrendingUp } from 'lucide-react';

interface CTAProps {
  locale: string;
}

export function CTA({ locale }: CTAProps) {
  const { t, dir } = useI18n();

  const benefits = [
    { icon: Target, titleAr: 'استشارة مجانية', titleEn: 'Free Consultation', descAr: 'جلسة تقييم أولية بدون التزام', descEn: 'Initial assessment session with no obligation' },
    { icon: Handshake, titleAr: 'شراكة موثوقة', titleEn: 'Trusted Partnership', descAr: 'علاقة طويلة المدى مبنية على الثقة', descEn: 'Long-term relationship built on trust' },
    { icon: TrendingUp, titleAr: 'نتائج مضمونة', titleEn: 'Guaranteed Results', descAr: 'تسليم المشاريع بالجودة والوقت المحدد', descEn: 'Project delivery with specified quality and time' },
  ];

  return (
    <section id="cta" className="section-padding-lg relative overflow-hidden" aria-labelledby="cta-title">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-950" />
      <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-10" aria-hidden="true" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold-500/10 rounded-full blur-3xl" aria-hidden="true" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-gold-400/30 to-transparent" aria-hidden="true" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-gold-400/30 to-transparent" aria-hidden="true" />
      
      <div className="container-custom relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto mb-16"
        >
          <LogoMark size="xl" variant="white" className="mx-auto mb-6 opacity-50 animate-float" />
          <h2 id="cta-title" className="heading-display text-display-xl text-white mb-6">
            {t('cta.title')}
          </h2>
          <p className="text-body-lg text-white/70 max-w-2xl mx-auto">
            {t('cta.subtitle')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6 mb-16 max-w-4xl mx-auto"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              className="text-center p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-gold-400/30 transition-all duration-500"
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gold-400/10 flex items-center justify-center">
                <benefit.icon className="h-7 w-7 text-gold-400" aria-hidden="true" />
              </div>
              <h3 className="heading-card text-heading-md text-white mb-2">
                {dir === 'rtl' ? benefit.titleAr : benefit.titleEn}
              </h3>
              <p className="text-body-sm text-white/60">
                {dir === 'rtl' ? benefit.descAr : benefit.descEn}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <Link href="/contact" className="inline-flex">
            <Button variant="gold" size="lg" className="w-full sm:w-auto sm:min-w-[13.5rem]">
              {t('cta.button')}
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}