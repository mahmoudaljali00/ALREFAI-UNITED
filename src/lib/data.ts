import { prisma } from '@/lib/prisma';

/**
 * Server-side data access layer.
 * All public pages fetch their content through these helpers so the
 * entire site is database-driven. Every function is resilient: if the
 * DB is unreachable it returns null/[] so pages still render.
 */

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    console.error('[data] query failed:', error);
    return fallback;
  }
}

export const getCompany = () =>
  safe(
    () => prisma.company.findFirst(),
    null
  );

export const getServices = (limit?: number) =>
  safe(
    () =>
      prisma.service.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: 'asc' },
        ...(limit ? { take: limit } : {}),
      }),
    []
  );

export const getServiceBySlug = (slug: string) =>
  safe(
    () => prisma.service.findUnique({ where: { slug } }),
    null
  );

export const getProjects = (options?: { limit?: number; category?: string }) =>
  safe(
    () =>
      prisma.project.findMany({
        where: { isActive: true, ...(options?.category ? { category: options.category } : {}) },
        orderBy: { displayOrder: 'asc' },
        ...(options?.limit ? { take: options.limit } : {}),
        include: { gallery: { orderBy: { displayOrder: 'asc' } } },
      }),
    []
  );

export const getProjectBySlug = (slug: string) =>
  safe(
    () =>
      prisma.project.findUnique({
        where: { slug },
        include: { gallery: { orderBy: { displayOrder: 'asc' } } },
      }),
    null
  );

export const getIndustries = () =>
  safe(
    () =>
      prisma.industry.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: 'asc' },
      }),
    []
  );

export const getIndustryBySlug = (slug: string) =>
  safe(() => prisma.industry.findUnique({ where: { slug } }), null);

export const getStatistics = () =>
  safe(
    () =>
      prisma.statistic.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: 'asc' },
      }),
    []
  );

export const getTestimonials = () =>
  safe(
    () =>
      prisma.testimonial.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: 'asc' },
      }),
    []
  );

export const getClients = () =>
  safe(
    () =>
      prisma.client.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: 'asc' },
      }),
    []
  );

export const getValues = () =>
  safe(
    () =>
      prisma.value.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: 'asc' },
      }),
    []
  );

export const getTeamMembers = () =>
  safe(
    () =>
      prisma.teamMember.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: 'asc' },
      }),
    []
  );

export const getSocialLinks = () =>
  safe(
    () =>
      prisma.socialLink.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: 'asc' },
      }),
    []
  );

export const getPosts = (options?: { limit?: number; categorySlug?: string }) =>
  safe(
    () =>
      prisma.post.findMany({
        where: {
          status: 'PUBLISHED',
          ...(options?.categorySlug ? { category: { slug: options.categorySlug } } : {}),
        },
        orderBy: { publishedAt: 'desc' },
        ...(options?.limit ? { take: options.limit } : {}),
        include: {
          category: { select: { id: true, nameAr: true, nameEn: true, slug: true, color: true } },
          author: { select: { id: true, name: true } },
        },
      }),
    []
  );

export const getPostBySlug = (slug: string) =>
  safe(
    () =>
      prisma.post.findUnique({
        where: { slug },
        include: {
          category: { select: { id: true, nameAr: true, nameEn: true, slug: true, color: true } },
          author: { select: { id: true, name: true } },
        },
      }),
    null
  );

export const getCategories = () =>
  safe(() => prisma.category.findMany({ where: { isActive: true }, orderBy: { displayOrder: 'asc' } }), []);

export const getFeaturedProject = () =>
  safe(
    () =>
      prisma.project.findFirst({
        where: { isActive: true, featured: true },
        orderBy: { displayOrder: 'asc' },
        include: { gallery: { orderBy: { displayOrder: 'asc' } } },
      }),
    null
  );
