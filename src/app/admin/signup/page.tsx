'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useI18n } from '@/context/I18nContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LogoMark, LogoText } from '@/components/layout/Logo';
import {
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  LayoutDashboard,
  Loader2,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export default function AdminSignupPage() {
  const router = useRouter();
  const { t, dir } = useI18n();
  const rtl = dir === 'rtl';
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

  return (
    <div className="min-h-screen bg-[#f5f6f4] lg:grid lg:grid-cols-[1.05fr_1fr]" dir={dir}>
      {/* Brand panel */}
      <aside className="relative hidden overflow-hidden bg-primary-950 p-12 text-white lg:flex lg:flex-col">
        <div className="grid-pattern absolute inset-0 opacity-40" aria-hidden="true" />
        <div
          className="absolute -top-32 -end-24 h-80 w-80 rounded-full bg-gold-500/15 blur-3xl"
          aria-hidden="true"
        />
        <span
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-500/70 to-transparent"
          aria-hidden="true"
        />

        <Link href="/" className="relative flex items-center gap-3">
          <LogoMark size="lg" variant="white" />
          <LogoText variant="white" size="lg" />
        </Link>

        <div className="relative mt-auto max-w-sm pt-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold-400">
            {rtl ? 'البداية' : 'Get started'}
          </p>
          <h2 className="mt-4 font-display text-[32px] font-semibold leading-[1.25] tracking-tight">
            {rtl ? 'أنشئ حساب المسؤول الأول وابدأ الإدارة.' : 'Create the first admin account and start managing.'}
          </h2>
          <ul className="mt-10 space-y-4 text-[13.5px] text-white/60">
            <li className="flex items-center gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/[0.06] text-gold-400">
                <LayoutDashboard className="h-[18px] w-[18px]" aria-hidden="true" />
              </span>
              {rtl ? 'لوحة تحكم واحدة لكل المحتوى' : 'One dashboard for all your content'}
            </li>
            <li className="flex items-center gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/[0.06] text-gold-400">
                <ShieldCheck className="h-[18px] w-[18px]" aria-hidden="true" />
              </span>
              {rtl ? 'الحساب الأول يحصل على صلاحيات الإدارة' : 'The first account gets admin access'}
            </li>
            <li className="flex items-center gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/[0.06] text-gold-400">
                <Sparkles className="h-[18px] w-[18px]" aria-hidden="true" />
              </span>
              {rtl ? 'واجهة عربية وإنجليزية بالكامل' : 'Fully bilingual Arabic and English'}
            </li>
          </ul>
        </div>

        <Link
          href="/"
          className="relative mt-12 inline-flex items-center gap-2 text-[13px] text-white/45 transition-colors hover:text-gold-300"
        >
          ← {t('common.backToSite') || (rtl ? 'العودة إلى الموقع' : 'Back to website')}
        </Link>
      </aside>

      {/* Form panel */}
      <main className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-8">
        {!checked ? (
          <div className="flex items-center justify-center" aria-live="polite" aria-busy="true">
            <Loader2 className="h-7 w-7 animate-spin text-gold-500" aria-hidden="true" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-[420px]"
          >
            <Link href="/" className="mb-10 flex items-center gap-3 lg:hidden">
              <LogoMark size="md" />
              <LogoText size="md" />
            </Link>

            <p className="admin-eyebrow">{rtl ? 'إنشاء حساب' : 'Setup'}</p>
            <h1 className="mt-2 font-display text-[30px] font-semibold leading-tight tracking-tight text-primary-950">
              {t('admin.createAccount')}
            </h1>
            <p className="mt-2 text-sm text-neutral-500">
              {t('admin.createAccountSubtitle') ||
                (rtl ? 'أنشئ حساب المسؤول الأول للوصول إلى لوحة التحكم' : 'Create the first admin account to access the dashboard')}
            </p>

            <div className="mt-8 rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-[0_1px_2px_rgba(13,45,26,0.04),0_18px_40px_-30px_rgba(13,45,26,0.35)] sm:p-7">
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <Input
                  label={t('admin.yourName')}
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('admin.yourName')}
                  autoComplete="name"
                />

                <Input
                  label={t('common.email')}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('common.email')}
                  required
                  autoComplete="email"
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
                    className="pe-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute end-3 top-[45px] text-neutral-400 transition-colors hover:text-neutral-700"
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
                  helperText={t('admin.passwordHint')}
                />

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5 text-red-700"
                  >
                    <AlertCircle className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                    <p className="text-[13px]">{error}</p>
                  </motion.div>
                )}

                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-emerald-700"
                  >
                    <CheckCircle className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                    <p className="text-[13px]">{success}</p>
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

              <p className="mt-6 text-center text-[13px] text-neutral-500">
                <Link href="/admin/login" className="font-medium text-primary-800 transition-colors hover:text-gold-600">
                  {t('admin.alreadyHaveAccount')}
                </Link>
              </p>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
