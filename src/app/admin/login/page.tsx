'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useI18n } from '@/context/I18nContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LogoMark, LogoText } from '@/components/layout/Logo';
import { AlertCircle, CheckCircle, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, dir } = useI18n();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hasUsers, setHasUsers] = useState<boolean | null>(null);

  const callbackUrl = searchParams.get('callbackUrl') || '/admin';

  // Show the "Create account" link only while no account exists yet.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/auth/has-users', { cache: 'no-store' });
        const data = await res.json().catch(() => null);
        if (!cancelled) setHasUsers(Boolean(data?.hasUsers));
      } catch {
        if (!cancelled) setHasUsers(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t('admin.errorOccurred'));
        return;
      }

      setSuccess(t('admin.loginSuccess') || 'Login successful');
      setTimeout(() => router.push(callbackUrl), 1000);
    } catch {
      setError(t('admin.errorOccurred'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-950 px-4 py-12 relative overflow-hidden" dir={dir}>
      <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-5" aria-hidden="true" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-500/10 rounded-full blur-3xl" aria-hidden="true" />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        <div className="text-center mb-10">
          <Link href="/admin" className="inline-flex items-center gap-3 mb-6">
            <LogoMark size="xl" variant="white" />
            <LogoText variant="white" size="lg" />
          </Link>
          <h1 className="heading-display text-display-lg text-white mb-2">{t('admin.login')}</h1>
          <p className="text-body text-white/60">{t('admin.loginSubtitle') || 'Sign in to access the dashboard'}</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <Input
              label={t('common.email') || 'Email'}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('common.email') || 'Email'}
              required
              autoComplete="email"
              className="bg-white/5 border-white/10 text-white placeholder:text-white/400 focus:border-gold-400 focus:ring-gold-400/20"
            />

            <div className="relative">
              <Input
                label={t('common.password') || 'Password'}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('common.password') || 'Password'}
                required
                autoComplete="current-password"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/400 focus:border-gold-400 focus:ring-gold-400/20 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-white/40 hover:text-white transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-4 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400"
              >
                <AlertCircle className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                <p className="text-body-sm">{error}</p>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-4 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400"
              >
                <CheckCircle className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                <p className="text-body-sm">{success}</p>
              </motion.div>
            )}

            <Button
              type="submit"
              variant="gold"
              size="lg"
              className="w-full"
              loading={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                  {t('common.loading')}
                </>
              ) : (
                t('admin.login')
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-body-sm text-white/50">
            {hasUsers === false && (
              <Link href="/admin/signup" className="block mb-2 text-gold-400 hover:text-gold-300 underline">
                {t('admin.noAccountYet')}
              </Link>
            )}
            <Link href="/" className="text-gold-400 hover:text-gold-300 underline">
              ← {t('common.backToSite') || 'Back to website'}
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
