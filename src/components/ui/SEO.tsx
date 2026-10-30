'use client';

import { useEffect } from 'react';
import { useI18n } from '@/context/I18nContext';

interface SEOProps {
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  twitterCard?: 'summary' | 'summary_large_image';
  canonicalUrl?: string;
  structuredData?: Record<string, unknown>;
  noIndex?: boolean;
  noFollow?: boolean;
}

export function SEO({
  title,
  description,
  ogTitle,
  ogDescription,
  ogImage,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  canonicalUrl,
  structuredData,
  noIndex = false,
  noFollow = false,
}: SEOProps) {
  const { locale } = useI18n();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const url = canonicalUrl || `${baseUrl}/${locale}${window.location.pathname}`;
  const image = ogImage || `${baseUrl}/og-image.jpg`;

  useEffect(() => {
    const updateMeta = () => {
      if (title) document.title = title;
      
      const metas = [
        { name: 'description', content: description },
        { property: 'og:title', content: ogTitle || title },
        { property: 'og:description', content: ogDescription || description },
        { property: 'og:image', content: image },
        { property: 'og:type', content: ogType },
        { property: 'og:url', content: url },
        { property: 'og:locale', content: locale === 'ar' ? 'ar_SA' : 'en_US' },
        { name: 'twitter:card', content: twitterCard },
        { name: 'twitter:title', content: ogTitle || title },
        { name: 'twitter:description', content: ogDescription || description },
        { name: 'twitter:image', content: image },
      ];

      if (noIndex) metas.push({ name: 'robots', content: 'noindex' });
      if (noFollow) metas.push({ name: 'robots', content: 'nofollow' });

      metas.forEach(({ name, property, content }) => {
        if (!content) return;
        const selector = name ? `meta[name="${name}"]` : `meta[property="${property}"]`;
        let meta = document.querySelector(selector) as HTMLMetaElement;
        if (!meta) {
          meta = document.createElement('meta');
          if (name) meta.name = name;
          if (property) meta.setAttribute('property', property);
          document.head.appendChild(meta);
        }
        meta.content = content;
      });

      if (canonicalUrl) {
        let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
        if (!canonical) {
          canonical = document.createElement('link');
          canonical.rel = 'canonical';
          document.head.appendChild(canonical);
        }
        canonical.href = canonicalUrl;
      }

      if (structuredData) {
        let script = document.querySelector('script[type="application/ld+json"]#structured-data') as HTMLScriptElement;
        if (!script) {
          script = document.createElement('script');
          script.type = 'application/ld+json';
          script.id = 'structured-data';
          document.head.appendChild(script);
        }
        script.textContent = JSON.stringify(structuredData);
      }
    };

    updateMeta();
  }, [title, description, ogTitle, ogDescription, ogImage, ogType, twitterCard, canonicalUrl, structuredData, noIndex, noFollow, locale]);

  return null;
}

export function generateOrganizationSchema(locale: 'ar' | 'en') {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: locale === 'ar' ? 'شركة الرفاعي المتحدة' : 'ALREFAI UNITED COMPANY',
    url: process.env.NEXT_PUBLIC_APP_URL,
    logo: `${process.env.NEXT_PUBLIC_APP_URL}/logo.png`,
    sameAs: [
      'https://linkedin.com/company/alrefai-united',
      'https://twitter.com/alrefaiunited',
      'https://facebook.com/alrefaiunited',
      'https://instagram.com/alrefaiunited',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+966-11-234-5678',
      contactType: 'customer service',
      availableLanguage: ['Arabic', 'English'],
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Riyadh',
      addressCountry: 'SA',
    },
  };
}

export function generateWebSiteSchema(locale: 'ar' | 'en') {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: locale === 'ar' ? 'شركة الرفاعي المتحدة' : 'ALREFAI UNITED COMPANY',
    url: process.env.NEXT_PUBLIC_APP_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${process.env.NEXT_PUBLIC_APP_URL}/${locale}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateArticleSchema(article: {
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified: string;
  authorName: string;
  publisherName: string;
  publisherLogo: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.headline,
    description: article.description,
    image: article.image,
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    author: {
      '@type': 'Person',
      name: article.authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: article.publisherName,
      logo: {
        '@type': 'ImageObject',
        url: article.publisherLogo,
      },
    },
  };
}

export function generateProjectSchema(project: {
  name: string;
  description: string;
  image: string;
  location: string;
  category: string;
  dateCompleted: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Project',
    name: project.name,
    description: project.description,
    image: project.image,
    location: {
      '@type': 'Place',
      name: project.location,
    },
    category: project.category,
    dateCompleted: project.dateCompleted,
  };
}