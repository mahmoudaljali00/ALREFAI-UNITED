'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useI18n } from '@/context/I18nContext';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

interface TestimonialItem {
  id: string;
  clientNameAr: string;
  clientNameEn: string;
  positionAr: string;
  positionEn: string;
  companyAr?: string;
  companyEn?: string;
  contentAr: string;
  contentEn: string;
  image?: string;
  rating: number;
}

interface TestimonialsProps {
  locale: string;
  testimonials?: TestimonialItem[];
}

const defaultTestimonials: TestimonialItem[] = [
  {
    id: '1',
    clientNameAr: 'أحمد محمد السعيد',
    clientNameEn: 'Ahmed Al-Saeed',
    positionAr: 'مدير المشاريع',
    positionEn: 'Project Director',
    companyAr: 'شركة أرامكو السعودية',
    companyEn: 'Saudi Aramco',
    contentAr: 'عملنا مع شركة الرفاعي المتحدة في عدة مشاريع كبرى، وهم يتميزون بالاحترافية العالية والالتزام بالمواعيد والجودة الاستثنائية. فريقهم التقني على مستوى عالمي.',
    contentEn: 'We have worked with Alrefai United on several major projects. They are distinguished by high professionalism, on-time delivery, and exceptional quality. Their technical team is world-class.',
    rating: 5,
  },
  {
    id: '2',
    clientNameAr: 'سارة عبدالله العتيبي',
    clientNameEn: 'Sara Al-Otaibi',
    positionAr: 'نائب الرئيس للعمليات',
    positionEn: 'VP of Operations',
    companyAr: 'سابك',
    companyEn: 'SABIC',
    contentAr: 'شراكة استراتيجية ناجحة بكل المقاييس. شركة الرفاعي المتحدة تفهم متطلباتنا المعقدة وتقدم حلولاً مبتكرة تتجاوز التوقعات. نوصي بهم بشدة.',
    contentEn: 'A successful strategic partnership by all measures. Alrefai United understands our complex requirements and delivers innovative solutions that exceed expectations. Highly recommended.',
    rating: 5,
  },
  {
    id: '3',
    clientNameAr: 'مهند خالد الفوزان',
    clientNameEn: 'Mohannad Al-Fawzan',
    positionAr: 'المدير التنفيذي',
    positionEn: 'CEO',
    companyAr: 'مجموعة الفوزان القابضة',
    companyEn: 'Al-Fawzan Holding Group',
    contentAr: 'الالتزام والجودة والأمانة هي القيم التي تميز شركة الرفاعي المتحدة. مشاريعهم تتحدث عنهم، وفريقهم يتعامل بأعلى درجات المهنية.',
    contentEn: 'Commitment, quality, and integrity are the values that distinguish Alrefai United. Their projects speak for themselves, and their team operates with the highest professionalism.',
    rating: 5,
  },
];

export function Testimonials({ locale, testimonials }: TestimonialsProps) {
  const { t, dir } = useI18n();
  const [currentIndex, setCurrentIndex] = useState(0);
  const displayTestimonials = testimonials || defaultTestimonials;

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % displayTestimonials.length);
  }, [displayTestimonials.length]);

  const prev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + displayTestimonials.length) % displayTestimonials.length);
  }, [displayTestimonials.length]);

  return (
    <section id="testimonials" className="section-padding-lg bg-white relative overflow-hidden" aria-labelledby="testimonials-title">
      <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-5" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gold-500/5 rounded-full blur-3xl" aria-hidden="true" />
      
      <div className="container-custom relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-800 text-caption font-medium mb-4">
            <span className="w-2 h-2 rounded-full bg-gold-400" aria-hidden="true" />
            {t('testimonials.title')}
          </span>
          <h2 id="testimonials-title" className="heading-display text-display-md text-primary-950 mb-4">
            {t('testimonials.subtitle')}
          </h2>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="relative"
              >
                <Card variant="elevated" padding="xl" className="relative">
                  <Quote className="h-12 w-12 text-gold-400/30 absolute top-6 left-6" aria-hidden="true" />
                  
                  <div className="relative z-10 flex flex-wrap items-center gap-2 mb-6">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          'h-5 w-5',
                          i < displayTestimonials[currentIndex].rating
                            ? 'fill-gold-400 text-gold-400'
                            : 'text-neutral-300'
                        )}
                        aria-hidden="true"
                      />
                    ))}
                  </div>

                  <blockquote className="text-body-lg text-neutral-700 leading-relaxed mb-8 relative z-10 pr-4">
                    &ldquo;{dir === 'rtl' ? displayTestimonials[currentIndex].contentAr : displayTestimonials[currentIndex].contentEn}&rdquo;
                  </blockquote>

                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {displayTestimonials[currentIndex].image ? (
                        <img src={displayTestimonials[currentIndex].image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-primary-700 font-medium text-lg">
                          {dir === 'rtl' 
                            ? displayTestimonials[currentIndex].clientNameAr.charAt(0)
                            : displayTestimonials[currentIndex].clientNameEn.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="heading-card text-heading-sm text-primary-950">
                        {dir === 'rtl' ? displayTestimonials[currentIndex].clientNameAr : displayTestimonials[currentIndex].clientNameEn}
                      </p>
                      <p className="text-body-sm text-neutral-500">
                        {dir === 'rtl' ? displayTestimonials[currentIndex].positionAr : displayTestimonials[currentIndex].positionEn}
                        {displayTestimonials[currentIndex].companyAr && (
                          <span className="text-gold-600 font-medium">، {dir === 'rtl' ? displayTestimonials[currentIndex].companyAr : displayTestimonials[currentIndex].companyEn}</span>
                        )}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-center gap-4 mt-8">
              <Button
                variant="ghost"
                size="sm"
                onClick={prev}
                aria-label="Previous testimonial"
                className="w-12 h-12 p-0"
              >
                <ChevronLeft className="h-6 w-6" aria-hidden="true" />
              </Button>
              <div className="flex items-center gap-2" role="tablist" aria-label="Testimonial navigation">
                {displayTestimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={cn(
                      'w-2.5 h-2.5 rounded-full transition-all duration-300',
                      index === currentIndex
                        ? 'bg-gold-400 w-8'
                        : 'bg-neutral-300 hover:bg-neutral-400'
                    )}
                    role="tab"
                    aria-selected={index === currentIndex}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={next}
                aria-label="Next testimonial"
                className="w-12 h-12 p-0"
              >
                <ChevronRight className="h-6 w-6" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}