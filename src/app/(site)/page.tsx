import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Services } from '@/components/sections/Services';
import { Projects } from '@/components/sections/Projects';
import { WhyUs } from '@/components/sections/WhyUs';
import { Values } from '@/components/sections/Values';
import { Statistics } from '@/components/sections/Statistics';
import { Partners } from '@/components/sections/Partners';
import { Testimonials } from '@/components/sections/Testimonials';
import { News } from '@/components/sections/News';
import { FeaturedProject } from '@/components/sections/FeaturedProject';
import { CTA } from '@/components/sections/CTA';
import {
  getServices,
  getProjects,
  getStatistics,
  getTestimonials,
  getClients,
  getValues,
  getPosts,
  getFeaturedProject,
  getCompany,
} from '@/lib/data';

export const revalidate = 60;

export default async function HomePage() {
  const [services, projects, statistics, testimonials, clients, values, posts, featuredProject, company] =
    await Promise.all([
      getServices(6),
      getProjects({ limit: 6 }),
      getStatistics(),
      getTestimonials(),
      getClients(),
      getValues(),
      getPosts({ limit: 3 }),
      getFeaturedProject(),
      getCompany(),
    ]);

  return (
    <>
      <Hero />
      <About
        stats={statistics.map((s) => ({
          labelAr: s.labelAr,
          labelEn: s.labelEn,
          value: s.value,
          suffix: s.suffix || undefined,
          icon: s.icon || undefined,
        }))}
      />
      <Services
        services={services.map((s) => ({
          id: s.id,
          titleAr: s.titleAr,
          titleEn: s.titleEn,
          slug: s.slug,
          shortDescriptionAr: s.shortDescriptionAr || undefined,
          shortDescriptionEn: s.shortDescriptionEn || undefined,
          icon: s.icon || undefined,
          image: s.image || undefined,
          featured: s.featured,
        }))}
      />
      <Projects
        projects={projects.map((p) => ({
          id: p.id,
          titleAr: p.titleAr,
          titleEn: p.titleEn,
          slug: p.slug,
          category: p.category,
          locationAr: p.locationAr || undefined,
          locationEn: p.locationEn || undefined,
          shortDescriptionAr: p.shortDescriptionAr || undefined,
          shortDescriptionEn: p.shortDescriptionEn || undefined,
          mainImage: p.mainImage || undefined,
          completionDate: p.completionDate ? String(new Date(p.completionDate).getFullYear()) : undefined,
          featured: p.featured,
        }))}
      />
      <WhyUs locale="ar" />
      <Values values={values.length ? values : undefined} />
      <Statistics
        locale="ar"
        statistics={statistics.map((s) => ({
          labelAr: s.labelAr,
          labelEn: s.labelEn,
          value: s.value,
          suffix: s.suffix || undefined,
          prefix: s.prefix || undefined,
          icon: s.icon || undefined,
        }))}
      />
      <Partners
        locale="ar"
        clients={clients.map((c) => ({
          id: c.id,
          nameAr: c.nameAr,
          nameEn: c.nameEn,
          logo: c.logo,
          website: c.website || undefined,
          featured: c.featured,
        }))}
      />
      <Testimonials
        locale="ar"
        testimonials={testimonials.map((t) => ({
          id: t.id,
          clientNameAr: t.clientNameAr,
          clientNameEn: t.clientNameEn,
          positionAr: t.positionAr,
          positionEn: t.positionEn,
          companyAr: t.companyAr || undefined,
          companyEn: t.companyEn || undefined,
          contentAr: t.contentAr,
          contentEn: t.contentEn,
          image: t.image || undefined,
          rating: t.rating,
        }))}
      />
      <News
        locale="ar"
        posts={posts.map((p) => ({
          id: p.id,
          titleAr: p.titleAr,
          titleEn: p.titleEn,
          slug: p.slug,
          excerptAr: p.excerptAr || undefined,
          excerptEn: p.excerptEn || undefined,
          featuredImage: p.featuredImage || undefined,
          category: p.category
            ? { nameAr: p.category.nameAr, nameEn: p.category.nameEn, color: p.category.color || undefined, slug: p.category.slug }
            : undefined,
          publishedAt: (p.publishedAt || p.createdAt).toISOString(),
          author: p.author?.name ? { nameAr: p.author.name, nameEn: p.author.name } : undefined,
        }))}
      />
      {featuredProject && (
        <FeaturedProject
          locale="ar"
          project={{
            titleAr: featuredProject.titleAr,
            titleEn: featuredProject.titleEn,
            subtitleAr: featuredProject.locationAr || undefined,
            subtitleEn: featuredProject.locationEn || undefined,
            descriptionAr: featuredProject.descriptionAr || undefined,
            descriptionEn: featuredProject.descriptionEn || undefined,
            backgroundImage: featuredProject.mainImage || undefined,
            locationAr: featuredProject.locationAr || undefined,
            locationEn: featuredProject.locationEn || undefined,
            completionDate: featuredProject.completionDate
              ? String(new Date(featuredProject.completionDate).getFullYear())
              : undefined,
            category: featuredProject.category,
            stats: [
              featuredProject.area ? { labelAr: 'المساحة', labelEn: 'Area', value: featuredProject.area } : null,
              featuredProject.budget ? { labelAr: 'قيمة المشروع', labelEn: 'Budget', value: featuredProject.budget } : null,
              featuredProject.status ? { labelAr: 'حالة المشروع', labelEn: 'Status', value: featuredProject.status } : null,
            ].filter(Boolean) as Array<{ labelAr: string; labelEn: string; value: string }>,
            ctaTextAr: 'استكشف المشروع',
            ctaTextEn: 'Explore Project',
            ctaLink: `/projects/${featuredProject.slug}`,
          }}
        />
      )}
      <CTA locale="ar" />
    </>
  );
}
