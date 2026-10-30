/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const unsplash = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

const avatar = (name: string, bg = '0d2d1a', fg = 'c9a227') =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=256&background=${bg}&color=${fg}&bold=true&format=png`;

async function main() {
  console.log('🖼️  Seeding images...');

  // ---------- Projects (mainImage + gallery) ----------
  const projects: Record<
    string,
    { main: string; gallery: Array<{ id: string; altAr: string; altEn: string; capAr: string; capEn: string }> }
  > = {
    'alrefai-commercial-tower': {
      main: unsplash('1486406146926-c627a92ad1ab'),
      gallery: [
        { id: '1487958449943-2429e8be8625', altAr: 'واجهة البرج', altEn: 'Tower facade', capAr: 'الواجهة الزجاجية الحديثة', capEn: 'Modern glass facade' },
        { id: '1493397212122-2b85dda8106b', altAr: 'تصميم معماري', altEn: 'Architectural design', capAr: 'التصميم المعماري المتميز', capEn: 'Distinctive architectural design' },
        { id: '1449157291145-7efd050a4d0e', altAr: 'المدخل الرئيسي', altEn: 'Main entrance', capAr: 'مدخل البرج', capEn: 'Tower entrance' },
      ],
    },
    'light-industries-complex': {
      main: unsplash('1513828583688-c52646db42da'),
      gallery: [
        { id: '1516937941344-00b4e0337589', altAr: 'خط الإنتاج', altEn: 'Production line', capAr: 'الوحدات الصناعية', capEn: 'Industrial units' },
        { id: '1553413077-190dd305871c', altAr: 'المستودعات', altEn: 'Warehouses', capAr: 'مستودعات حديثة', capEn: 'Modern warehouses' },
        { id: '1581094794329-c8112a89af12', altAr: 'فريق الصيانة', altEn: 'Maintenance team', capAr: 'فرق التشغيل والصيانة', capEn: 'Operations and maintenance teams' },
      ],
    },
    'king-abdullah-road': {
      main: unsplash('1465447142348-e9952c393450'),
      gallery: [
        { id: '1449824913935-59a10b8d2000', altAr: 'مسارات الطريق', altEn: 'Road lanes', capAr: 'ستة مسارات للطريق السريع', capEn: 'Six-lane highway' },
        { id: '1477959858617-67f85cf4f1df', altAr: 'نفقرة على المدينة', altEn: 'City view', capAr: 'الطريق عند المدخل الحضري', capEn: 'Highway at the urban entrance' },
      ],
    },
    'alrefai-specialized-hospital': {
      main: unsplash('1586773860418-d37222d8fce3'),
      gallery: [
        { id: '1519494026892-80bbd2d6fd0d', altAr: 'ممر المستشفى', altEn: 'Hospital corridor', capAr: 'الأجنحة الداخلية', capEn: 'Inpatient wings' },
        { id: '1538108149393-fbbd81895907', altAr: 'المرافق الطبية', altEn: 'Medical facilities', capAr: 'أحدث الأنظمة الطبية', capEn: 'State-of-the-art medical systems' },
      ],
    },
    'international-conference-center': {
      main: unsplash('1540575467063-178a50c2df87'),
      gallery: [
        { id: '1505373877841-8d25f7d46678', altAr: 'القاعة الرئيسية', altEn: 'Main hall', capAr: 'قاعة تتسع لـ 5000 مقعد', capEn: '5,000-seat main hall' },
        { id: '1475721027785-f74eccf877e2', altAr: 'الفعاليات', altEn: 'Events', capAr: 'قاعات متعددة الاستخدامات', capEn: 'Multi-purpose halls' },
      ],
    },
    'water-treatment-plant': {
      main: unsplash('1581094794329-c8112a89af12'),
      gallery: [
        { id: '1513828583688-c52646db42da', altAr: 'أحواض المعالجة', altEn: 'Treatment basins', capAr: 'محطة معالجة متقدمة', capEn: 'Advanced treatment plant' },
        { id: '1554469384-e58fac16e23a', altAr: 'المعدات', altEn: 'Equipment', capAr: 'أنظمة الضخ والترشيح', capEn: 'Pumping and filtration systems' },
      ],
    },
  };

  for (const [slug, imgs] of Object.entries(projects)) {
    const project = await prisma.project.findUnique({ where: { slug } });
    if (!project) continue;
    await prisma.project.update({ where: { slug }, data: { mainImage: imgs.main } });
    const gCount = await prisma.projectImage.count({ where: { projectId: project.id } });
    if (gCount === 0) {
      await prisma.projectImage.createMany({
        data: imgs.gallery.map((g, i) => ({
          projectId: project.id,
          url: unsplash(g.id),
          altAr: g.altAr, altEn: g.altEn,
          captionAr: g.capAr, captionEn: g.capEn,
          displayOrder: i,
        })),
      });
    }
  }
  console.log('✓ Project images');

  // ---------- Services ----------
  const serviceImages: Record<string, string> = {
    engineering: unsplash('1503387762-592deb58ef4e'),
    construction: unsplash('1541888946425-d81bb19240f5'),
    trading: unsplash('1553413077-190dd305871c'),
    consulting: unsplash('1454165804606-c3d57bc86b40'),
    'project-management': unsplash('1552664730-d307ca884978'),
    logistics: unsplash('1586528116311-ad8dd3c8310d'),
  };
  for (const [slug, image] of Object.entries(serviceImages)) {
    const s = await prisma.service.findUnique({ where: { slug } });
    if (s) await prisma.service.update({ where: { slug }, data: { image } });
  }
  console.log('✓ Service images');

  // ---------- Industries ----------
  const industryImages: Record<string, string> = {
    'construction-building': unsplash('1487958449943-2429e8be8625'),
    'energy-petrochemicals': unsplash('1466611653911-95081537e5b7'),
    'infrastructure-transport': unsplash('1465447142348-e9952c393450'),
    healthcare: unsplash('1519494026892-80bbd2d6fd0d'),
    education: unsplash('1541339907198-e08756dedf3f'),
    'retail-commercial': unsplash('1441986300917-64674bd600d8'),
    'tourism-hospitality': unsplash('1566073771259-6a8506099945'),
    'agriculture-food': unsplash('1500937386664-56d1dfef3854'),
  };
  for (const [slug, image] of Object.entries(industryImages)) {
    const ind = await prisma.industry.findUnique({ where: { slug } });
    if (ind) await prisma.industry.update({ where: { slug }, data: { image } });
  }
  console.log('✓ Industry images');

  // ---------- Team members ----------
  const teamImages = [
    '1560250097-0b93528c311a', // Abdullah Alrefai — CEO
    '1472099645785-5658abf4ff4e', // Mohammed Al-Otaibi
    '1507003211169-0a1dd7228f2d', // Khalid Al-Shehri
    '1438761681033-6461ffad8d80', // Noura Al-Qahtani
  ];
  const teamMembers = await prisma.teamMember.findMany({ orderBy: { displayOrder: 'asc' } });
  for (let i = 0; i < teamMembers.length; i++) {
    await prisma.teamMember.update({
      where: { id: teamMembers[i].id },
      data: { image: unsplash(teamImages[i % teamImages.length], 600) },
    });
  }
  console.log('✓ Team photos');

  // ---------- Client logos (branded monograms) ----------
  const clients = await prisma.client.findMany({ orderBy: { displayOrder: 'asc' } });
  for (const c of clients) {
    if (!c.logo) {
      await prisma.client.update({
        where: { id: c.id },
        data: { logo: avatar(c.nameEn) },
      });
    }
  }
  console.log('✓ Client logos');

  // ---------- Testimonial avatars ----------
  const testiImages = ['1500648767791-00dcc994a43e', '1494790108377-be9c29b29330', '1560250097-0b93528c311a'];
  const testis = await prisma.testimonial.findMany({ orderBy: { displayOrder: 'asc' } });
  for (let i = 0; i < testis.length; i++) {
    await prisma.testimonial.update({
      where: { id: testis[i].id },
      data: { image: unsplash(testiImages[i % testiImages.length], 300) },
    });
  }
  console.log('✓ Testimonial avatars');

  // ---------- News featured images ----------
  const postImages: Record<string, string> = {
    'alrefai-commercial-tower-launch': unsplash('1486406146926-c627a92ad1ab'),
    'strategic-partnership-aramco': unsplash('1521791136064-7986c2920216'),
    'safety-excellence-award': unsplash('1504307651254-35680f356dfd'),
  };
  for (const [slug, image] of Object.entries(postImages)) {
    const p = await prisma.post.findUnique({ where: { slug } });
    if (p) await prisma.post.update({ where: { slug }, data: { featuredImage: image } });
  }
  console.log('✓ Post featured images');

  // ---------- Company ogImage ----------
  const company = await prisma.company.findFirst({ orderBy: { createdAt: 'asc' } });
  if (company && !company.ogImage) {
    await prisma.company.update({
      where: { id: company.id },
      data: { ogImage: unsplash('1486406146926-c627a92ad1ab'), logoLight: '/logo.png', logoDark: '/logo.png' },
    });
  }

  console.log('🎉 Image seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
