'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useI18n } from '@/context/I18nContext';
import { Card } from '@/components/ui/Card';

interface ClientItem {
  id: string;
  nameAr: string;
  nameEn: string;
  logo: string;
  website?: string;
  featured?: boolean;
}

interface PartnersProps {
  locale: string;
  clients?: ClientItem[];
}

const defaultClients: ClientItem[] = [
  { id: '1', nameAr: 'أرامكو السعودية', nameEn: 'Saudi Aramco', logo: '/images/clients/aramco.svg', featured: true },
  { id: '2', nameAr: 'سابك', nameEn: 'SABIC', logo: '/images/clients/sabic.svg', featured: true },
  { id: '3', nameAr: 'هيئة الملكية العقارية', nameEn: 'Real Estate General Authority', logo: '/images/clients/rega.svg', featured: false },
  { id: '4', nameAr: 'وزارة الإسكان', nameEn: 'Ministry of Housing', logo: '/images/clients/housing.svg', featured: true },
  { id: '5', nameAr: 'شركة الكهرباء', nameEn: 'Saudi Electricity Company', logo: '/images/clients/sec.svg', featured: false },
  { id: '6', nameAr: 'مؤسسة النقد العربي', nameEn: 'SAMA', logo: '/images/clients/sama.svg', featured: true },
  { id: '7', nameAr: 'الخطوط السعودية', nameEn: 'Saudia Airlines', logo: '/images/clients/saudia.svg', featured: false },
  { id: '8', nameAr: 'جامعة الملك سعود', nameEn: 'King Saud University', logo: '/images/clients/ksu.svg', featured: false },
];

export function Partners({ locale, clients }: PartnersProps) {
  const { t, dir } = useI18n();
  const displayClients = clients || defaultClients;

  return (
    <section id="partners" className="section-padding-lg bg-neutral-50 relative overflow-hidden" aria-labelledby="partners-title">
      <div className="absolute inset-0 bg-[url('/patterns/dot-pattern.svg')] opacity-5" aria-hidden="true" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gold-500/5 rounded-full blur-3xl" aria-hidden="true" />
      
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
            {t('partners.title')}
          </span>
          <h2 id="partners-title" className="heading-display text-display-md text-primary-950 mb-4">
            {t('partners.subtitle')}
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6 lg:gap-8">
          {displayClients.map((client, index) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <Card 
                variant="bordered" 
                padding="md" 
                className="group flex items-center justify-center min-h-[100px] bg-white/80 hover:bg-white hover:shadow-lg transition-all duration-500"
              >
                {client.logo ? (
                  <img
                    src={client.logo}
                    alt={dir === 'rtl' ? client.nameAr : client.nameEn}
                    className="max-w-full max-h-12 object-contain grayscale opacity-60 transition-all duration-500 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="text-center">
                    <p className="text-caption text-primary-700 font-medium tracking-wider">
                      {dir === 'rtl' ? client.nameAr : client.nameEn}
                    </p>
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}