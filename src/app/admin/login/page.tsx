'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, dir } = useI18n();
  const rtl = dir === 'rtl';
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
            {rtl ? 'مساحة العمل' : 'Admin workspace'}
          </p>
          <h2 className="mt-4 font-display text-[32px] font-semibold leading-[1.25] tracking-tight">
            {rtl ? 'كل ما تحتاجه لإدارة موقعك في مكان واحد.' : 'Everything you run your website with, in one place.'}
          </h2>
          <ul className="mt-10 space-y-4 text-[13.5px] text-white/60">
            <li className="flex items-center gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/[0.06] text-gold-400">
                <LayoutDashboard className="h-[18px] w-[18px]" aria-hidden="true" />
              </span>
              {rtl ? 'تحكم كامل بالخدمات والمشاريع والأخبار' : 'Full control of services, projects and news'}
            </li>
            <li className="flex items-center gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/[0.06] text-gold-400">
                <ShieldCheck className="h-[18px] w-[18px]" aria-hidden="true" />
              </span>
              {rtl ? 'وصول آمن محمي بجلسة تسجيل' : 'Secure access protected by a session'}
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
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[420px]"
        >
          <Link href="/admin" className="mb-10 flex items-center gap-3 lg:hidden">
            <LogoMark size="md" />
            <LogoText size="md" />
          </Link>

          <p className="admin-eyebrow">{rtl ? 'تسجيل الدخول' : 'Sign in'}</p>
          <h1 className="mt-2 font-display text-[30px] font-semibold leading-tight tracking-tight text-primary-950">
            {t('admin.login')}
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            {t('admin.loginSubtitle') || (rtl ? 'سجّل الدخول للوصول إلى لوحة التحكم' : 'Sign in to access the dashboard')}
          </p>

          <div className="mt-8 rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-[0_1px_2px_rgba(13,45,26,0.04),0_18px_40px_-30px_rgba(13,45,26,0.35)] sm:p-7">
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <Input
                label={t('common.email') || 'Email'}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('common.email') || 'Email'}
                required
                autoComplete="email"
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
                  t('admin.login')
                )}
              </Button>
            </form>

            <div className="mt-6 space-y-2 text-center text-[13px] text-neutral-500">
              {hasUsers === false && (
                <Link href="/admin/signup" className="block font-medium text-primary-800 hover:text-gold-600">
                  {t('admin.noAccountYet')}
                </Link>
              )}
              <Link href="/" className="inline-block text-neutral-400 transition-colors hover:text-primary-800">
                ← {t('common.backToSite') || (rtl ? 'العودة إلى الموقع' : 'Back to website')}
              </Link>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
