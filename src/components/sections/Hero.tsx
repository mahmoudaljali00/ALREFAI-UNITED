'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '@/context/I18nContext';
import { Button } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface HeroProps {
  locale?: string;
}

export function Hero({ locale }: HeroProps = {}) {
  const { t, dir } = useI18n();
  const [logoAnimationDone, setLogoAnimationDone] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLogoAnimationDone(true);
      setTimeout(() => setShowContent(true), 300);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  const scrollToNext = () => {
    const nextSection = document.getElementById('about');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-labelledby="hero-title"
      dir={dir}
    >
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-950 via-primary-900/80 to-primary-950" />
        <div className="absolute inset-0 bg-[url('/patterns/hero-pattern.svg')] opacity-5" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gold-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-primary-700/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 container-custom py-24 sm:py-28 lg:py-32 pb-28 sm:pb-32">
        <AnimatePresence mode="wait">
          {!logoAnimationDone && (
            <motion.div
              key="logo-animation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 flex items-center justify-center bg-primary-950 z-50"
              transition={{ duration: 0.5 }}
            >
              <LogoAnimation onComplete={() => setLogoAnimationDone(true)} />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={false}
          animate={showContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
          className="w-full max-w-5xl mx-auto text-center relative"
        >
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-6 animate-in-up delay-200" style={{ animationDelay: '0.6s' }}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-400" />
            </span>
            <span className="text-caption text-gold-400 font-medium tracking-wider">{t('hero.headline').split(' ')[0]} {t('hero.headline').split(' ')[1]}</span>
          </div>

          <h1
            id="hero-title"
            className="heading-display text-display-xl sm:text-display-lg lg:text-display-lg text-white mb-5 animate-in-up delay-300"
            style={{ animationDelay: '0.7s' }}
          >
            {t('hero.headline').split('. ').map((part, i) => (
              <span key={i} className="block">
                {part}{i < t('hero.headline').split('. ').length - 1 ? '.' : ''}
              </span>
            ))}
          </h1>

          <p className="text-body-lg sm:text-body-lg lg:text-body-sm !text-gold-200 max-w-2xl mx-auto mb-6 animate-in-up delay-400" style={{ animationDelay: '0.8s' }}>
            {t('hero.subheadline')}
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2 sm:gap-4 w-full max-w-md sm:max-w-none mx-auto animate-in-up delay-500" style={{ animationDelay: '0.9s' }}>
            <Link href="/services" className="w-full sm:w-auto">
              <Button variant="gold" size="md" className="w-full sm:min-w-[13.5rem]">
                {t('hero.ctaPrimary')}
                <ArrowRight className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Button>
            </Link>
            <Link href="/contact" className="w-full sm:w-auto">
              <Button variant="on-dark" size="md" className="w-full sm:min-w-[13.5rem]">{t('hero.ctaSecondary')}</Button>
            </Link>
          </div>
        </motion.div>

        <GeometricElements />
      </div>

      <motion.button
        onClick={scrollToNext}
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        aria-label={t('hero.scrollIndicator')}
        whileHover={{ y: 3 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="text-caption tracking-wider hidden sm:block text-gold-100 hover:text-gold-400 transition-colors">{t('hero.scrollIndicator')}</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-white/30 rounded-full flex justify-center pt-2"
        >
          <motion.div
            animate={{ y: [0, 5, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1.5 h-1.5 bg-white/50 rounded-full"
          />
        </motion.div>
      </motion.button>
    </section>
  );
}

function LogoAnimation({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <motion.div
        initial={{ scale: 0.5, opacity: 0, rotate: -180 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1] }}
        className="relative"
      >
        <Image
          src="/logo.png"
          alt="شركة الرفاعي المتحدة Logo"
          width={148}
          height={148}
          className="animate-pulse-gold"
          priority
          quality={90}
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="text-center"
      >
        <p className="text-display-md text-white font-display font-light tracking-tight">ALREFAI <span className="text-gold-400 font-light">UNITED</span></p>
        <p className="text-caption text-gold-400 mt-2 tracking-widest">COMPANY</p>
      </motion.div>
    </div>
  );
}

function GeometricElements() {
  return (
    <>
      {[1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className="absolute border border-gold-400/20"
          style={{
            width: `${60 + i * 40}px`,
            height: `${60 + i * 40}px`,
            top: `${10 + i * 5}%`,
            left: `${5 + i * 3}%`,
            borderRadius: '50%',
          }}
          animate={{
            rotate: [0, 360],
            scale: [1, 1.02, 1],
            borderColor: ['rgba(201, 162, 39, 0.1)', 'rgba(201, 162, 39, 0.3)', 'rgba(201, 162, 39, 0.1)'],
          }}
          transition={{ duration: 20 + i * 5, repeat: Infinity, ease: 'linear' }}
          aria-hidden="true"
        />
      ))}
      {[1, 2, 3].map((i) => (
        <motion.div
          key={`line-${i}`}
          className="absolute h-px bg-gradient-to-r from-transparent via-gold-400/30 to-transparent"
          style={{
            width: `${100 + i * 80}px`,
            top: `${20 + i * 15}%`,
            right: `${10 + i * 5}%`,
            transformOrigin: 'center',
          }}
          animate={{
            scaleX: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.5, ease: 'easeInOut' }}
          aria-hidden="true"
        />
      ))}
      {[1, 2].map((i) => (
        <motion.div
          key={`hex-${i}`}
          className="absolute border border-gold-400/10"
          style={{
            width: `${40 + i * 30}px`,
            height: `${40 + i * 30}px`,
            bottom: `${15 + i * 10}%`,
            left: `${15 + i * 8}%`,
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          }}
          animate={{
            rotate: [0, -360],
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 15 + i * 3, repeat: Infinity, ease: 'linear' }}
          aria-hidden="true"
        />
      ))}
    </>
  );
}

import Image from 'next/image';