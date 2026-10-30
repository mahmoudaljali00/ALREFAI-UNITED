'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { LogoMark } from '@/components/layout/Logo';
import { Home, Newspaper, Briefcase } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-primary-950 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/patterns/hero-pattern.svg')] opacity-5" aria-hidden="true" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gold-500/10 rounded-full blur-3xl" aria-hidden="true" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative text-center max-w-lg"
      >
        <LogoMark size="xl" variant="white" className="mx-auto mb-8 opacity-70" />
        <p className="heading-display text-[clamp(5rem,15vw,9rem)] leading-none text-gold-400 font-light mb-4">404</p>
        <h1 className="heading-display text-display-md text-white mb-4">
          الصفحة غير موجودة — Page Not Found
        </h1>
        <p className="text-body text-white/60 mb-10">
          عذراً، الصفحة التي تبحث عنها غير متوفرة أو تم نقلها.
          <br />
          Sorry, the page you are looking for does not exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/">
            <Button variant="gold" size="lg" className="w-full sm:w-auto">
              <Home className="h-5 w-5" aria-hidden="true" />
              الرئيسية — Home
            </Button>
          </Link>
          <Link href="/services">
            <Button variant="on-dark" size="lg" className="w-full sm:w-auto">
              <Briefcase className="h-5 w-5" aria-hidden="true" />
              الخدمات — Services
            </Button>
          </Link>
          <Link href="/news">
            <Button variant="on-dark" size="lg" className="w-full sm:w-auto">
              <Newspaper className="h-5 w-5" aria-hidden="true" />
              الأخبار — News
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
