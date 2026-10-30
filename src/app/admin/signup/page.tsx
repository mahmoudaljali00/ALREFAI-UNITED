'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useI18n } from '@/context/I18nContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LogoMark, LogoText } from '@/components/layout/Logo';
import { AlertCircle, CheckCircle, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function AdminSignupPage() {
  const router = useRouter();
  const { t, dir } = useI18n();
  const [checked, setChecked] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Gate: the setup page exists only while no account does.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/auth/has-users', { cache: 'no-store' });
        const data = await res.json().catch(() => null);
        if (!cancelled && data?.hasUsers) {
          router.replace('/admin/login');
          return;
        }
      } catch {
        if (!cancelled) {
          router.replace('/admin/login');
          return;
        }
      }
      if (!cancelled) setChecked(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError(t('admin.passwordsDoNotMatch'));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        if (data?.error === 'ACCOUNT_EXISTS') {
          router.replace('/admin/login');
          return;
        }
        if (data?.error === 'VALID_EMAIL') {
          setError(t('admin.invalidEmail'));
          return;
        }
        if (data?.error === 'WEAK_PASSWORD') {
          setError(t('admin.weakPassword'));
          return;
        }
        setError(t('admin.errorOccurred'));
        return;
      }

      setSuccess(t('admin.accountCreated'));
      setTimeout(() => router.push('/admin'), 1000);
    } catch {
      setError(t('admin.errorOccurred'));
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'bg-white/5 border-white/10 text-white placeholder:text-white/400 focus:border-gold-400 focus:ring-gold-400/20';

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-950 px-4 py-12 relative overflow-hidden" dir={dir}>
      <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-5" aria-hidden="true" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-500/10 rounded-full blur-3xl" aria-hidden="true" />

      {!checked ? (
        <div className="relative flex items-center justify-center" aria-live="polite" aria-busy="true">
          <Loader2 className="h-8 w-8 animate-spin text-gold-400" aria-hidden="true" />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative w-full max-w-md"
        >
          <div className="text-center mb-10">
            <Link href="/" className="inline-flex items-center gap-3 mb-6">
              <LogoMark size="xl" variant="white" />
              <LogoText variant="white" size="lg" />
            </Link>
            <h1 className="heading-display text-display-lg text-white mb-2">{t('admin.createAccount')}</h1>
            <p className="text-body text-white/60">{t('admin.createAccountSubtitle')}</p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <Input
                label={t('admin.yourName')}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('admin.yourName')}
                autoComplete="name"
                className={inputClass}
              />

              <Input
                label={t('common.email')}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('common.email')}
                required
                autoComplete="email"
                className={inputClass}
              />

              <div className="relative">
                <Input
                  label={t('common.password')}
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('common.password')}
                  required
                  autoComplete="new-password"
                  className={cn(inputClass, 'pr-12')}
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

              <Input
                label={t('admin.confirmPassword')}
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t('admin.confirmPassword')}
                required
                autoComplete="new-password"
                className={inputClass}
              />

              <p className="text-caption text-white/50 -mt-3">{t('admin.passwordHint')}</p>

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

              <Button type="submit" variant="gold" size="lg" className="w-full" loading={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                    {t('common.loading')}
                  </>
                ) : (
                  t('admin.createAccount')
                )}
              </Button>
            </form>

            <p className="mt-6 text-center text-body-sm text-white/50">
              <Link href="/admin/login" className="text-gold-400 hover:text-gold-300 underline">
                {t('admin.alreadyHaveAccount')}
              </Link>
            </p>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}