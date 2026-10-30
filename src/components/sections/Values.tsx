'use client';

import { motion } from 'framer-motion';
import { useI18n } from '@/context/I18nContext';
import { Card } from '@/components/ui/Card';
import { Shield, Award, Flag, Lightbulb, HardHat, Leaf } from 'lucide-react';

interface ValueItem {
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  icon?: string | null;
}

interface ValuesProps {
  locale?: string;
  values?: ValueItem[];
}

const fallbackIcons = [Shield, Award, Flag, Lightbulb, HardHat, Leaf] as const;

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Shield, Award, Flag, Lightbulb, HardHat, Leaf,
  shield: Shield, award: Award, flag: Flag, lightbulb: Lightbulb, hardhat: HardHat, leaf: Leaf,
};

const defaultValues: ValueItem[] = [
  {
    icon: 'Shield',
    titleAr: 'النزاهة',
    titleEn: 'Integrity',
    descriptionAr: 'الالتزام بالأخلاقيات المهنية والشفافية في جميع تعاملاتنا.',
    descriptionEn: 'Commitment to professional ethics and transparency in all our dealings.',
  },
  {
    icon: 'Award',
    titleAr: 'الجودة',
    titleEn: 'Quality',
    descriptionAr: 'السعي الدائم للتميز وتجاوز توقعات العملاء.',
    descriptionEn: 'Continuous pursuit of excellence and exceeding client expectations.',
  },
  {
    icon: 'Flag',
    titleAr: 'الالتزام',
    titleEn: 'Commitment',
    descriptionAr: 'الوفاء بالوعود وتحقيق الأهداف في المواعيد المحددة.',
    descriptionEn: 'Fulfilling promises and achieving goals within set timelines.',
  },
  {
    icon: 'Lightbulb',
    titleAr: 'الابتكار',
    titleEn: 'Innovation',
    descriptionAr: 'تبني الأفكار الجديدة والتقنيات الحديثة لتحسين الأداء.',
    descriptionEn: 'Adopting new ideas and modern technologies to improve performance.',
  },
  {
    icon: 'HardHat',
    titleAr: 'السلامة',
    titleEn: 'Safety',
    descriptionAr: 'حماية الأرواح والممتلكات أولوية قصوى في كل عملياتنا.',
    descriptionEn: 'Protecting lives and assets is a top priority in all our operations.',
  },
  {
    icon: 'Leaf',
    titleAr: 'الاستدامة',
    titleEn: 'Sustainability',
    descriptionAr: 'مسؤولية بيئية واجتماعية لتحقيق أثر إيجابي مستدام.',
    descriptionEn: 'Environmental and social responsibility for lasting positive impact.',
  },
];

export function Values({ locale, values }: ValuesProps = {}) {
  const { t, dir } = useI18n();
  const displayValues = values && values.length > 0 ? values : defaultValues;

  return (
    <section id="values" className="section-padding-lg bg-white relative overflow-hidden" aria-labelledby="values-title">
      <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-5" aria-hidden="true" />
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-gold-500/5 rounded-full blur-3xl" aria-hidden="true" />
      
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
            {t('values.title')}
          </span>
          <h2 id="values-title" className="heading-display text-display-md text-primary-950 mb-4">
            {t('values.subtitle')}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 items-stretch">
          {displayValues.map((value, index) => {
            const IconComponent = (value.icon && iconMap[value.icon]) || fallbackIcons[index % fallbackIcons.length];
            return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className="h-full"
            >
              <Card variant="bordered" padding="lg" className="group relative overflow-hidden text-center card-equal">
                <div className="card-band" aria-hidden="true" />
                <div className="absolute inset-0 bg-gradient-to-br from-gold-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true" />
                
                <div className="relative z-10 flex flex-col h-full pt-1">
                  <div className="w-14 h-14 mx-auto mb-5 rounded-xl bg-primary-100 group-hover:bg-primary-900 transition-all duration-500 flex items-center justify-center">
                    <IconComponent className="h-7 w-7 text-primary-700 group-hover:text-white transition-colors duration-500" aria-hidden="true" />
                  </div>
                  <h3 className="heading-card text-heading-md text-primary-950 mb-3">
                    {dir === 'rtl' ? value.titleAr : value.titleEn}
                  </h3>
                  <p className="text-body text-neutral-600 leading-relaxed flex-1">
                    {dir === 'rtl' ? value.descriptionAr : value.descriptionEn}
                  </p>
                </div>
              </Card>
            </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}