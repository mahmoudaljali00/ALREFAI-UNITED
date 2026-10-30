'use client';

import { motion } from 'framer-motion';
import { useI18n } from '@/context/I18nContext';
import { Card } from '@/components/ui/Card';
import { Shield, Award, Users, Lightbulb, HardHat, Handshake } from 'lucide-react';

interface WhyUsProps {
  locale: string;
}

const features = [
  {
    icon: Award,
    titleAr: 'الجودة المتميزة',
    titleEn: 'Exceptional Quality',
    descAr: 'نطبق أعلى معايير الجودة العالمية في كل مراحل المشروع، من التخطيط إلى التسليم.',
    descEn: 'We apply the highest international quality standards at every project stage, from planning to delivery.',
  },
  {
    icon: Shield,
    titleAr: 'الموثوقية المطلقة',
    titleEn: 'Absolute Reliability',
    descAr: 'سجل حافل بالإنجازات والتسليم في المواعيد المحددة دون المساس بالجودة.',
    descEn: 'A proven track record of achievements and on-time delivery without compromising quality.',
  },
  {
    icon: Users,
    titleAr: 'الاحترافية العالية',
    titleEn: 'High Professionalism',
    descAr: 'فريق عمل مؤهل بخبرات متنوعة وشهادات مهنية معتمدة دولياً.',
    descEn: 'A qualified team with diverse experiences and internationally accredited professional certifications.',
  },
  {
    icon: Lightbulb,
    titleAr: 'الابتكار المستمر',
    titleEn: 'Continuous Innovation',
    descAr: 'نتبنى أحدث التقنيات والمنهجيات لتحسين الكفاءة وتقليل التكاليف.',
    descEn: 'We adopt the latest technologies and methodologies to improve efficiency and reduce costs.',
  },
  {
    icon: HardHat,
    titleAr: 'السلامة أولاً',
    titleEn: 'Safety First',
    descAr: 'الالتزام الصارم بمعايير السلامة والصحة المهنية في جميع مواقع العمل.',
    descEn: 'Strict adherence to occupational health and safety standards at all work sites.',
  },
  {
    icon: Handshake,
    titleAr: 'شراكة طويلة المدى',
    titleEn: 'Long-Term Partnership',
    descAr: 'نؤمن بالعلاقات المستدامة المبنية على الثقة والشفافية والنمو المشترك.',
    descEn: 'We believe in sustainable relationships built on trust, transparency, and mutual growth.',
  },
];

export function WhyUs({ locale }: WhyUsProps) {
  const { t, dir } = useI18n();

  return (
    <section id="why-us" className="section-padding-lg bg-neutral-50 relative overflow-hidden" aria-labelledby="why-us-title">
      <div className="absolute inset-0 bg-[url('/patterns/dot-pattern.svg')] opacity-5" aria-hidden="true" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gold-500/5 rounded-full blur-3xl" aria-hidden="true" />
      
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
            {t('whyUs.title')}
          </span>
          <h2 id="why-us-title" className="heading-display text-display-md text-primary-950 mb-4">
            {t('whyUs.subtitle')}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 items-stretch">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className="h-full"
            >
              <Card variant="elevated" padding="lg" hover className="group relative overflow-hidden card-equal">
                <div className="card-band" aria-hidden="true" />
                
                <div className="relative z-10 flex flex-col h-full pt-1">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 group-hover:bg-primary-900 transition-all duration-500 flex items-center justify-center mb-5">
                    <feature.icon className="h-6 w-6 text-primary-700 group-hover:text-white transition-colors duration-500" aria-hidden="true" />
                  </div>
                  <h3 className="heading-card text-heading-md text-primary-950 mb-3">
                    {dir === 'rtl' ? feature.titleAr : feature.titleEn}
                  </h3>
                  <p className="text-body text-neutral-600 leading-relaxed flex-1">
                    {dir === 'rtl' ? feature.descAr : feature.descEn}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}