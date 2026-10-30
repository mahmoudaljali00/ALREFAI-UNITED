import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const locales = ['ar', 'en'];

  const staticRoutes = [
    '',
    '/about',
    '/services',
    '/projects',
    '/industries',
    '/sustainability',
    '/news',
    '/contact',
  ];

  let dynamicRoutes: MetadataRoute.Sitemap = [];

  try {
    const [services, projects, industries, posts] = await Promise.all([
      prisma.service.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true },
      }),
      prisma.project.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true },
      }),
      prisma.industry.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true },
      }),
      prisma.post.findMany({
        where: { status: 'PUBLISHED' },
        select: { slug: true, updatedAt: true },
      }),
    ]);

    dynamicRoutes = [
      ...services.map((service) => ({
        url: `${baseUrl}/services/${service.slug}`,
        lastModified: service.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      })),
      ...projects.map((project) => ({
        url: `${baseUrl}/projects/${project.slug}`,
        lastModified: project.updatedAt,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      })),
      ...industries.map((industry) => ({
        url: `${baseUrl}/industries/${industry.slug}`,
        lastModified: industry.updatedAt,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      })),
      ...posts.map((post) => ({
        url: `${baseUrl}/news/${post.slug}`,
        lastModified: post.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      })),
    ];
  } catch (error) {
    console.error('Error generating dynamic sitemap routes:', error);
  }

  const allRoutes: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const route of staticRoutes) {
      allRoutes.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' : 'weekly',
        priority: route === '' ? 1.0 : 0.8,
        alternates: {
          languages: {
            ar: `${baseUrl}/ar${route}`,
            en: `${baseUrl}/en${route}`,
          },
        },
      });
    }

    for (const route of dynamicRoutes) {
      allRoutes.push({
        ...route,
        alternates: {
          languages: {
            ar: route.url.replace(`/${locale}/`, '/ar/'),
            en: route.url.replace(`/${locale}/`, '/en/'),
          },
        },
      });
    }
  }

  return allRoutes;
}