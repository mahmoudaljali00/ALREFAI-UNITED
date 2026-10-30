'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useI18n } from '@/context/I18nContext';

interface StatisticItem {
  labelAr: string;
  labelEn: string;
  value: string;
  suffix?: string;
  prefix?: string;
  icon?: string;
}

interface StatisticsProps {
  locale: string;
  statistics?: StatisticItem[];
}

const defaultStatistics: StatisticItem[] = [
  { labelAr: 'سنوات الخبرة', labelEn: 'Years Experience', value: '15', suffix: '+' },
  { labelAr: 'المشاريع المنجزة', labelEn: 'Completed Projects', value: '120', suffix: '+' },
  { labelAr: 'العملاء المميزون', labelEn: 'Distinguished Clients', value: '85', suffix: '+' },
  { labelAr: 'الشركاء الاستراتيجيون', labelEn: 'Strategic Partners', value: '25', suffix: '+' },
];

export function Statistics({ locale, statistics }: StatisticsProps) {
  const { t, dir } = useI18n();
  const displayStats = statistics || defaultStatistics;

  return (
    <section id="statistics" className="section-padding-lg bg-primary-950 relative overflow-hidden" aria-labelledby="statistics-title">
      <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-10" aria-hidden="true" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-500/10 rounded-full blur-3xl" aria-hidden="true" />
      
      <div className="container-custom relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-400/20 text-gold-400 text-caption font-medium mb-4">
            <span className="w-2 h-2 rounded-full bg-gold-400" aria-hidden="true" />
            {t('statistics.title')}
          </span>
          <h2 id="statistics-title" className="heading-display text-display-md text-white mb-4">
            {t('statistics.subtitle')}
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {displayStats.map((stat, index) => (
            <StatCounter
              key={index}
              label={dir === 'rtl' ? stat.labelAr : stat.labelEn}
              value={stat.value}
              suffix={stat.suffix}
              prefix={stat.prefix}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatCounter({ label, value, suffix, prefix, index }: { label: string; value: string; suffix?: string; prefix?: string; index: number }) {
  const countRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);
  const targetValue = parseInt(value.replace(/[^0-9]/g, ''), 10) || 0;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            animateCounter();
          }
        });
      },
      { threshold: 0.5 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const animateCounter = () => {
    const duration = 2000;
    const startTime = performance.now();
    const startValue = 0;

    const updateCounter = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(startValue + (targetValue - startValue) * easedProgress);
      
      if (countRef.current) {
        countRef.current.textContent = currentValue.toLocaleString();
      }

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else if (countRef.current) {
        countRef.current.textContent = targetValue.toLocaleString();
      }
    };

    requestAnimationFrame(updateCounter);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
      className="text-center relative"
    >
      <div className="relative">
        <div className="text-gold-400 text-caption tracking-wider mb-3">
          {String(index + 1).padStart(2, '0')}
        </div>
        <div className="heading-display text-display-xl lg:text-display-lg text-white font-medium mb-2 flex items-center justify-center gap-1">
          {prefix && <span className="text-gold-400">{prefix}</span>}
          <span ref={countRef} className="tabular-nums">0</span>
          {suffix && <span className="text-gold-400">{suffix}</span>}
        </div>
        <p className="text-body text-white/60">{label}</p>
      </div>
      {index < 3 && (
        <div className="absolute top-1/2 right-0 w-px h-1/2 bg-gradient-to-b from-transparent via-gold-400/30 to-transparent -translate-y-1/2 lg:block hidden" aria-hidden="true" />
      )}
    </motion.div>
  );
}