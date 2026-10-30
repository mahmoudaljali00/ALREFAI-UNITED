'use client';

import { motion } from 'framer-motion';
import { useI18n } from '@/context/I18nContext';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Award, Users, Building2, Target } from 'lucide-react';
import Link from 'next/link';

interface AboutProps {
  locale?: string;
  stats?: Array<{ labelAr: string; labelEn: string; value: string; suffix?: string; icon?: string }>;
}

export function About({ locale, stats }: AboutProps = {}) {
  const { t, dir } = useI18n();

  const defaultStats = [
    { labelAr: 'سنوات الخبرة', labelEn: 'Years Experience', value: '15', suffix: '+' },
    { labelAr: 'المشاريع المنجزة', labelEn: 'Completed Projects', value: '120', suffix: '+' },
    { labelAr: 'العملاء المميزون', labelEn: 'Distinguished Clients', value: '85', suffix: '+' },
    { labelAr: 'الشركاء الاستراتيجيون', labelEn: 'Strategic Partners', value: '25', suffix: '+' },
  ];

  const displayStats = stats || defaultStats;

  const features = [
    {
      icon: Award,
      titleAr: 'الجودة المتميزة',
      titleEn: 'Exceptional Quality',
      descAr: 'نلتزم بأعلى معايير الجودة في كل مشروع ننفذه',
      descEn: 'We commit to the highest quality standards in every project we execute',
    },
    {
      icon: Users,
      titleAr: 'فريق محترف',
      titleEn: 'Professional Team',
      descAr: 'كفاءات بشرية مؤهلة وذات خبرة واسعة',
      descEn: 'Qualified human competencies with extensive experience',
    },
    {
      icon: Building2,
      titleAr: 'بنية تحتية قوية',
      titleEn: 'Strong Infrastructure',
      descAr: 'معدات وتقنيات حديثة تدعم عملياتنا',
      descEn: 'Modern equipment and technologies supporting our operations',
    },
    {
      icon: Target,
      titleAr: 'الالتزام بالمواعيد',
      titleEn: 'On-Time Delivery',
      descAr: 'نسلم مشاريعنا في الوقت المحدد دون تأخير',
      descEn: 'We deliver our projects on time without delays',
    },
  ];

  return (
    <section id="about" className="section-padding-lg bg-white relative overflow-hidden" aria-labelledby="about-title">
      <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-5" aria-hidden="true" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gold-500/5 rounded-full blur-3xl" aria-hidden="true" />
      
      <div className="container-custom relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 lg:mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-800 text-caption font-medium mb-4">
            <span className="w-2 h-2 rounded-full bg-gold-400" aria-hidden="true" />
            {t('about.title')}
          </span>
          <h2 id="about-title" className="heading-display text-display-md text-primary-950 mb-4">
            {t('about.subtitle')}
          </h2>
          <p className="text-body-lg text-neutral-600 max-w-2xl mx-auto">
            {t('about.vision')} و {t('about.mission')} نرتقي بمعايير التميز في كل ما نقدمه.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start mb-12 lg:mb-16">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="relative">
              <span className="text-caption text-gold-600 font-medium tracking-wider">01</span>
              <h3 className="heading-display text-display-sm sm:text-display-md text-primary-950 mt-2 mb-5 font-medium">
                {t('about.subtitle')}
              </h3>
              <div className="space-y-4 text-body text-neutral-600 leading-relaxed">
                <p>
                  {t('about.description1')}
                </p>
                <p>
                  {t('about.description2')}
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 items-stretch">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="group relative h-full p-5 rounded-xl bg-neutral-50 hover:bg-white hover:shadow-lg transition-all duration-300 border border-neutral-100 overflow-hidden"
                >
                  <div className="card-band" aria-hidden="true" />
                  <div className="w-11 h-11 rounded-xl bg-primary-100 group-hover:bg-primary-900 transition-colors duration-300 flex items-center justify-center mb-4">
                    <feature.icon className="h-5 w-5 text-primary-700 group-hover:text-white transition-colors duration-300" aria-hidden="true" />
                  </div>
                  <h4 className="heading-card text-heading-sm text-primary-950 mb-2">
                    {dir === 'rtl' ? feature.titleAr : feature.titleEn}
                  </h4>
                  <p className="text-body-sm text-neutral-600 leading-relaxed">
                    {dir === 'rtl' ? feature.descAr : feature.descEn}
                  </p>
                </motion.div>
              ))}
            </div>

            <Link href="/about" className="inline-flex w-full sm:w-auto">
              <Button variant="gold" size="lg" className="w-full sm:min-w-[13.5rem]">
                {t('common.learnMore')}
                <ArrowRight className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative w-full"
          >
            <div className="group relative rounded-2xl overflow-hidden bg-primary-950">
              <img
                src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1200&q=80"
                alt={dir === 'rtl' ? 'مشاريع شركة الرفاعي المتحدة' : 'Alrefai United Company projects'}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-950/80 via-primary-950/20 to-transparent" aria-hidden="true" />
              <div className="absolute bottom-5 inset-x-5 flex items-end justify-between gap-4">
                <p className="text-body text-white/90 font-medium">
                  {dir === 'rtl' ? 'أكثر من 120 مشروعاً منجزاً عبر المملكة' : '120+ completed projects across the Kingdom'}
                </p>
                <Link href="/projects" className="hidden sm:inline-flex">
                  <Button variant="on-dark" size="sm" className="shrink-0">{t('common.viewAll')}</Button>
                </Link>
              </div>
            </div>
            <div className="mt-3 lg:relative  bg-white rounded-2xl p-3 sm:p-5 hover:shadow-lg transition-all duration-300 w-full border border-neutral-100 overflow-hidden">
              <div className="card-band" aria-hidden="true" />
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-gold-100 flex items-center justify-center shrink-0">
                  <Award className="h-6 w-6 text-gold-600" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-caption text-neutral-500">{t('about.experience')}</p>
                  <p className="heading-display text-display-sm text-primary-950 font-medium">15+</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-neutral-50">
                  <p className="heading-card text-heading-md text-primary-950 font-medium">120+</p>
                  <p className="text-caption text-neutral-500">{t('about.projects')}</p>
                </div>
                <div className="p-3 rounded-lg bg-neutral-50">
                  <p className="heading-card text-heading-md text-primary-950 font-medium">85+</p>
                  <p className="text-caption text-neutral-500">{t('about.clients')}</p>
                </div>
                <div className="p-3 rounded-lg bg-neutral-50">
                  <p className="heading-card text-heading-md text-primary-950 font-medium">25+</p>
                  <p className="text-caption text-neutral-500">{t('about.partners')}</p>
                </div>
                <div className="p-3 rounded-lg bg-neutral-50">
                  <p className="heading-card text-heading-md text-primary-950 font-medium">500+</p>
                  <p className="text-caption text-neutral-500">{t('about.team')}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {displayStats.map((stat, index) => (
              <StatCard
                key={index}
                label={dir === 'rtl' ? stat.labelAr : stat.labelEn}
                value={stat.value}
                suffix={stat.suffix}
                index={index}
              />
            ))}
          </div>
        </motion.div> */}
      </div>
    </section>
  );
}

function StatCard({ label, value, suffix, index }: { label: string; value: string; suffix?: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
      className="relative p-4 sm:p-6 lg:p-8 text-center overflow-hidden"
    >
      <div className="relative z-10">
        <div className="text-gold-400 text-caption tracking-wider mb-2">{index + 1}.</div>
        <div className="heading-display text-display-md sm:text-display-lg text-primary-950 font-medium mb-1">
          <span className="counter" data-target={value}>{value}</span>
          <span className="text-gold-400">{suffix || ''}</span>
        </div>
        <p className="text-body-sm sm:text-body text-neutral-600">{label}</p>
      </div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-gold-400/30 to-transparent" aria-hidden="true" />
    </motion.div>
  );
}