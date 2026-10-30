import type { Metadata, Viewport } from 'next';
import { Inter, IBM_Plex_Sans_Arabic, Plus_Jakarta_Sans } from 'next/font/google';
import '@/styles/globals.css';
import { I18nProvider } from '@/context/I18nContext';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700'],
});

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  display: 'swap',
  variable: '--font-arabic',
  weight: ['300', '400', '500', '600', '700'],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
  weight: ['300', '400', '500', '600', '700', '800'],
});

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#052e16' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: 'ALREFAI UNITED COMPANY | Building Trust. Shaping the Future.',
    template: '%s | ALREFAI UNITED COMPANY',
  },
  description: 'ALREFAI UNITED COMPANY - Your trusted partner for growth, excellence and sustainable development. Engineering, Construction, Trading & Logistics solutions.',
  keywords: ['ALREFAI UNITED', 'construction', 'engineering', 'trading', 'logistics', 'Saudi Arabia', 'projects'],
  authors: [{ name: 'ALREFAI UNITED COMPANY' }],
  creator: 'ALREFAI UNITED COMPANY',
  publisher: 'ALREFAI UNITED COMPANY',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ar_SA',
    alternateLocale: ['en_US'],
    url: '/',
    siteName: 'ALREFAI UNITED COMPANY',
    title: 'ALREFAI UNITED COMPANY | Building Trust. Shaping the Future.',
    description: 'Your trusted partner for growth, excellence and sustainable development.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ALREFAI UNITED COMPANY',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ALREFAI UNITED COMPANY',
    description: 'Building Trust. Shaping the Future.',
    images: ['/og-image.jpg'],
    creator: '@alrefaiunited',
  },
  verification: {
    google: 'google-site-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning className={`${inter.variable} ${ibmPlexSansArabic.variable} ${plusJakartaSans.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('locale') || (document.cookie.match(/(?:^|;\\s*)locale=([^;]+)/) || [])[1];
                  if (saved === 'en') {
                    document.documentElement.lang = 'en';
                    document.documentElement.dir = 'ltr';
                  } else {
                    document.documentElement.lang = 'ar';
                    document.documentElement.dir = 'rtl';
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-white font-sans antialiased">
        <I18nProvider initialLocale="ar">
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}