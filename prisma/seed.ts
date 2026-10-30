/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ---------- Admin user ----------
  const passwordHash = await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD || 'Admin@123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@alrefaiunited.com' },
    update: { passwordHash, role: 'SUPER_ADMIN', isActive: true },
    create: {
      email: 'admin@alrefaiunited.com',
      passwordHash,
      name: 'مدير الموقع',
      role: 'SUPER_ADMIN',
      isActive: true,
    },
  });
  console.log('✓ Admin user ready:', admin.email);

  // ---------- Company ----------
  await prisma.company.upsert({
    where: { id: 'company-main' },
    update: {},
    create: {
      id: 'company-main',
      nameAr: 'شركة الرفاعي المتحدة',
      nameEn: 'ALREFAI UNITED COMPANY',
      taglineAr: 'نبني الثقة... ونصنع المستقبل',
      taglineEn: 'Building Trust. Shaping the Future.',
      descriptionAr:
        'شركة رائدة في مجالات الهندسة والإنشاءات والتجارة والخدمات اللوجستية، تأسست عام 2014 برؤية واضحة لتكون الشريك المفضل للمشاريع الكبرى في المملكة.',
      descriptionEn:
        'A leading company in engineering, construction, trading, and logistics, founded in 2014 with a clear vision to be the preferred partner for major projects in the Kingdom.',
      visionAr: 'أن نكون الخيار الأول في حلول الهندسة والإنشاءات على مستوى المنطقة.',
      visionEn: 'To be the first choice for engineering and construction solutions in the region.',
      missionAr: 'تقديم حلول متكاملة بجودة عالمية والتزام تام بالمواعيد والسلامة.',
      missionEn: 'Deliver integrated solutions with world-class quality and full commitment to deadlines and safety.',
      foundedYear: 2014,
      addressAr: 'الرياض، المملكة العربية السعودية',
      addressEn: 'Riyadh, Kingdom of Saudi Arabia',
      phone: '+966 11 234 5678',
      email: 'info@alrefaiunited.com',
      whatsapp: '+966500000000',
      workingHoursAr: 'الأحد - الخميس: 8:00 صباحاً - 5:00 مساءً',
      workingHoursEn: 'Sunday - Thursday: 8:00 AM - 5:00 PM',
      latitude: 24.7136,
      longitude: 46.6753,
    },
  }).catch(() => null);
  // Fallback if custom id already used by another row
  if (!(await prisma.company.findFirst({ where: { nameEn: 'ALREFAI UNITED COMPANY' } }))) {
    await prisma.company.create({
      data: {
        nameAr: 'شركة الرفاعي المتحدة',
        nameEn: 'ALREFAI UNITED COMPANY',
        taglineAr: 'نبني الثقة... ونصنع المستقبل',
        taglineEn: 'Building Trust. Shaping the Future.',
        phone: '+966 11 234 5678',
        email: 'info@alrefaiunited.com',
      },
    });
  }
  console.log('✓ Company info ready');

  // ---------- Services ----------
  const services = [
    { titleAr: 'الخدمات الهندسية', titleEn: 'Engineering Services', slug: 'engineering', icon: 'cog', featured: true,
      shortDescriptionAr: 'تصميم وإشراف هندسي متكامل للمشاريع الكبرى وفق أحدث المعايير العالمية.',
      shortDescriptionEn: 'Integrated engineering design and supervision for major projects to the highest global standards.',
      descriptionAr: 'نقدم خدمات هندسية شاملة تشمل التصميم المعماري والإنشائي، دراسات الجدوى، الإشراف على التنفيذ، وإدارة الجودة للمشاريع من جميع الأحجام.',
      descriptionEn: 'We provide comprehensive engineering services including architectural and structural design, feasibility studies, construction supervision, and quality management for projects of all sizes.' },
    { titleAr: 'المقاولات والإنشاءات', titleEn: 'Contracting & Construction', slug: 'construction', icon: 'hammer', featured: true,
      shortDescriptionAr: 'تنفيذ مشاريع إنشائية بمواصفات عالمية وجودة استثنائية.',
      shortDescriptionEn: 'Executing construction projects with international specifications and exceptional quality.',
      descriptionAr: 'تنفيذ كافة أعمال المقاولات العامة والخاصة من الحفر والأساسات حتى التشطيب النهائي والتسليم، مع التزام صارم بالجداول الزمنية ومعايير السلامة.',
      descriptionEn: 'Executing all general and specialized contracting works from excavation and foundations to final finishing and handover, with strict adherence to schedules and safety standards.' },
    { titleAr: 'التجارة والتوريد', titleEn: 'Trading & Supply', slug: 'trading', icon: 'truck', featured: true,
      shortDescriptionAr: 'توريد مواد ومعدات عالية الجودة من أفضل المصانع العالمية.',
      shortDescriptionEn: 'Supplying high-quality materials and equipment from leading global manufacturers.',
      descriptionAr: 'توريد مواد البناء والتشطيبات والمعدات الثقيلة والأنظمة الكهروميكانيكية من موثوقين عالميين، مع ضمانات معتمدة وأسعار تنافسية.',
      descriptionEn: 'Supplying building materials, finishes, heavy equipment, and electromechanical systems from trusted global sources, with certified warranties and competitive pricing.' },
    { titleAr: 'الاستشارات الهندسية والإدارية', titleEn: 'Engineering & Management Consulting', slug: 'consulting', icon: 'briefcase', featured: false,
      shortDescriptionAr: 'استشارات فنية وإدارية متخصصة تدعم قراراتكم الاستثمارية.',
      shortDescriptionEn: 'Specialized technical and management consulting supporting your investment decisions.',
      descriptionAr: 'خدمات استشارية تشمل دراسات الجدوى، تقييم المشاريع، إدارة المخاطر، وتطوير استراتيجيات النمو للشركات.',
      descriptionEn: 'Consulting services covering feasibility studies, project evaluation, risk management, and corporate growth strategies.' },
    { titleAr: 'إدارة المشاريع', titleEn: 'Project Management', slug: 'project-management', icon: 'building2', featured: false,
      shortDescriptionAr: 'إدارة متكاملة لدورة حياة المشروع من الفكرة حتى التسليم.',
      shortDescriptionEn: 'Integrated project lifecycle management from concept to handover.',
      descriptionAr: 'إدارة احترافية للمشاريع تشمل التخطيط والجدولة ومراقبة التكاليف والجودة وإدارة العقود والمطالبات.',
      descriptionEn: 'Professional project management covering planning, scheduling, cost control, quality assurance, and contract & claims administration.' },
    { titleAr: 'الخدمات اللوجستية', titleEn: 'Logistics Services', slug: 'logistics', icon: 'truck', featured: false,
      shortDescriptionAr: 'حلول لوجستية شاملة للنقل والتخزين والتوزيع.',
      shortDescriptionEn: 'Comprehensive logistics solutions for transport, warehousing, and distribution.',
      descriptionAr: 'أسطول حديث ومستودعات مجهزة لتقديم خدمات النقل البري والتخزين والتوزيع في جميع مناطق المملكة.',
      descriptionEn: 'A modern fleet and equipped warehouses providing land transport, warehousing, and distribution services across the Kingdom.' },
  ];
  for (let i = 0; i < services.length; i++) {
    const s = services[i];
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: {},
      create: { ...s, displayOrder: i, createdById: admin.id },
    });
  }
  console.log('✓ Services seeded');

  // ---------- Projects ----------
  const projects = [
    { titleAr: 'برج الرفاعي التجاري', titleEn: 'Alrefai Commercial Tower', slug: 'alrefai-commercial-tower', category: 'commercial', featured: true,
      locationAr: 'الرياض، المملكة العربية السعودية', locationEn: 'Riyadh, KSA',
      shortDescriptionAr: 'برج تجاري حديث بارتفاع 40 طابقاً في قلب الرياض.',
      shortDescriptionEn: 'Modern 40-story commercial tower in the heart of Riyadh.',
      descriptionAr: 'برج تجاري متعدد الاستخدامات يضم مكاتب فاخرة ومساحات تجارية ومرافق عالمية المستوى، بتصميم معماري مستدام يحصل على شهادة LEED الذهبية.',
      descriptionEn: 'A mixed-use commercial tower with premium offices, retail spaces, and world-class amenities, featuring sustainable design targeting LEED Gold certification.',
      area: '85,000 m²', budget: '500M SAR', completionDate: new Date('2023-06-01') },
    { titleAr: 'مجمع الصناعات الخفيفة', titleEn: 'Light Industries Complex', slug: 'light-industries-complex', category: 'industrial', featured: true,
      locationAr: 'جدة، المملكة العربية السعودية', locationEn: 'Jeddah, KSA',
      shortDescriptionAr: 'مجمع صناعي متكامل على مساحة 500,000 م².',
      shortDescriptionEn: 'Integrated industrial complex spanning 500,000 sqm.',
      descriptionAr: 'مجمع صناعي متكامل يضم 24 وحدة صناعية ومستودعات حديثة ومرافق لوجستية متطورة لخدمة المصنّعين المحليين والدوليين.',
      descriptionEn: 'A fully integrated industrial complex with 24 industrial units, modern warehouses, and advanced logistics facilities serving local and international manufacturers.',
      area: '500,000 m²', budget: '1.2B SAR', completionDate: new Date('2022-03-01') },
    { titleAr: 'طريق الملك عبدالله', titleEn: 'King Abdullah Road', slug: 'king-abdullah-road', category: 'infrastructure', featured: false,
      locationAr: 'الدمام، المملكة العربية السعودية', locationEn: 'Dammam, KSA',
      shortDescriptionAr: 'طريق سريع بطول 45 كم بستة مسارات.',
      shortDescriptionEn: '45km six-lane highway project.',
      descriptionAr: 'تنفيذ طريق سريع بطول 45 كم يشمل جسرين ونفقين ومرافق خدمية على كامل امتداد الطريق.',
      descriptionEn: 'Construction of a 45km highway including two bridges, two tunnels, and full service facilities.',
      area: '45 km', budget: '800M SAR', completionDate: new Date('2023-01-01') },
    { titleAr: 'مستشفى الرفاعي التخصصي', titleEn: 'Alrefai Specialized Hospital', slug: 'alrefai-specialized-hospital', category: 'construction', featured: true,
      locationAr: 'مكة المكرمة، المملكة العربية السعودية', locationEn: 'Makkah, KSA',
      shortDescriptionAr: 'مستشفى تخصصي بسعة 300 سرير.',
      shortDescriptionEn: '300-bed specialized hospital.',
      descriptionAr: 'مستشفى تخصصي متكامل بسعة 300 سرير يضم مراكز للقلب والأورام والعناية المركزة وأحدث الأنظمة الطبية.',
      descriptionEn: 'A fully integrated 300-bed specialized hospital featuring cardiac, oncology, and intensive care centers with state-of-the-art medical systems.',
      area: '60,000 m²', budget: '700M SAR', completionDate: new Date('2021-09-01') },
    { titleAr: 'مركز المؤتمرات الدولي', titleEn: 'International Conference Center', slug: 'international-conference-center', category: 'commercial', featured: false,
      locationAr: 'الرياض، المملكة العربية السعودية', locationEn: 'Riyadh, KSA',
      shortDescriptionAr: 'مركز مؤتمرات عالمي المستوى يتسع لـ 5,000 شخص.',
      shortDescriptionEn: 'World-class conference center seating 5,000 attendees.',
      descriptionAr: 'مركز مؤتمرات بمواصفات عالمية يتسع لخمسة آلاف مشارك مع قاعات متعددة الاستخدامات وتجهيزات سمعية بصرية متقدمة.',
      descriptionEn: 'An international-standard conference center seating 5,000 with multi-purpose halls and advanced audiovisual systems.',
      area: '40,000 m²', budget: '450M SAR', completionDate: new Date('2022-11-01') },
    { titleAr: 'محطة معالجة المياه', titleEn: 'Water Treatment Plant', slug: 'water-treatment-plant', category: 'engineering', featured: false,
      locationAr: 'ينبع، المملكة العربية السعودية', locationEn: 'Yanbu, KSA',
      shortDescriptionAr: 'محطة معالجة بطاقة 100,000 م³/يوم.',
      shortDescriptionEn: 'Treatment plant with 100,000 m³/day capacity.',
      descriptionAr: 'تصميم وتنفيذ محطة معالجة مياه بصفتها متقدمة بطاقة إنتاجية 100,000 متر مكعب يومياً تخدم أكثر من 500 ألف نسمة.',
      descriptionEn: 'Design and construction of an advanced water treatment plant with 100,000 m³/day capacity serving over 500,000 people.',
      area: '25,000 m²', budget: '300M SAR', completionDate: new Date('2023-04-01') },
  ];
  for (let i = 0; i < projects.length; i++) {
    const p = projects[i];
    await prisma.project.upsert({
      where: { slug: p.slug },
      update: {},
      create: { ...p, displayOrder: i, createdById: admin.id },
    });
  }
  console.log('✓ Projects seeded');

  // ---------- Statistics ----------
  const stats = [
    { labelAr: 'سنوات الخبرة', labelEn: 'Years Experience', value: '15', suffix: '+' },
    { labelAr: 'المشاريع المنجزة', labelEn: 'Completed Projects', value: '120', suffix: '+' },
    { labelAr: 'العملاء المميزون', labelEn: 'Distinguished Clients', value: '85', suffix: '+' },
    { labelAr: 'الشركاء الاستراتيجيون', labelEn: 'Strategic Partners', value: '25', suffix: '+' },
  ];
  const existingStats = await prisma.statistic.count();
  if (existingStats === 0) {
    await prisma.statistic.createMany({ data: stats.map((s, i) => ({ ...s, displayOrder: i })) });
    console.log('✓ Statistics seeded');
  } else {
    console.log('• Statistics already exist, skipped');
  }

  // ---------- Testimonials ----------
  const testimonials = [
    {
      clientNameAr: 'أحمد محمد السعيد', clientNameEn: 'Ahmed Al-Saeed',
      positionAr: 'مدير المشاريع', positionEn: 'Project Director',
      companyAr: 'شركة أرامكو السعودية', companyEn: 'Saudi Aramco',
      contentAr: 'عملنا مع شركة الرفاعي المتحدة في عدة مشاريع كبرى، وهم يتميزون بالاحترافية العالية والالتزام بالمواعيد والجودة الاستثنائية. فريقهم التقني على مستوى عالمي.',
      contentEn: 'We have worked with Alrefai United on several major projects. They are distinguished by high professionalism, on-time delivery, and exceptional quality. Their technical team is world-class.',
      rating: 5, featured: true,
    },
    {
      clientNameAr: 'سارة عبدالله العتيبي', clientNameEn: 'Sara Al-Otaibi',
      positionAr: 'نائب الرئيس للعمليات', positionEn: 'VP of Operations',
      companyAr: 'سابك', companyEn: 'SABIC',
      contentAr: 'شراكة استراتيجية ناجحة بكل المقاييس. شركة الرفاعي المتحدة تفهم متطلباتنا المعقدة وتقدم حلولاً مبتكرة تتجاوز التوقعات. نوصي بهم بشدة.',
      contentEn: 'A successful strategic partnership by all measures. Alrefai United understands our complex requirements and delivers innovative solutions that exceed expectations. Highly recommended.',
      rating: 5, featured: true,
    },
    {
      clientNameAr: 'مهند خالد الفوزان', clientNameEn: 'Mohannad Al-Fawzan',
      positionAr: 'المدير التنفيذي', positionEn: 'CEO',
      companyAr: 'مجموعة الفوزان القابضة', companyEn: 'Al-Fawzan Holding Group',
      contentAr: 'الالتزام والجودة والأمانة هي القيم التي تميز شركة الرفاعي المتحدة. مشاريعهم تتحدث عنهم، وفريقهم يتعامل بأعلى درجات المهنية.',
      contentEn: 'Commitment, quality, and integrity are the values that distinguish Alrefai United. Their projects speak for themselves, and their team operates with the highest professionalism.',
      rating: 5, featured: true,
    },
  ];
  const existingTestimonials = await prisma.testimonial.count();
  if (existingTestimonials === 0) {
    await prisma.testimonial.createMany({ data: testimonials.map((t, i) => ({ ...t, displayOrder: i })) });
    console.log('✓ Testimonials seeded');
  }

  // ---------- Clients ----------
  const clients = [
    { nameAr: 'أرامكو السعودية', nameEn: 'Saudi Aramco', logo: '', featured: true },
    { nameAr: 'سابك', nameEn: 'SABIC', logo: '', featured: true },
    { nameAr: 'هيئة الملكية العقارية', nameEn: 'Real Estate General Authority', logo: '', featured: false },
    { nameAr: 'وزارة الإسكان', nameEn: 'Ministry of Housing', logo: '', featured: true },
    { nameAr: 'شركة الكهرباء السعودية', nameEn: 'Saudi Electricity Company', logo: '', featured: false },
    { nameAr: 'مؤسسة النقد العربي السعودي', nameEn: 'SAMA', logo: '', featured: true },
    { nameAr: 'الخطوط الجوية السعودية', nameEn: 'Saudia Airlines', logo: '', featured: false },
    { nameAr: 'جامعة الملك سعود', nameEn: 'King Saud University', logo: '', featured: false },
  ];
  const existingClients = await prisma.client.count();
  if (existingClients === 0) {
    await prisma.client.createMany({ data: clients.map((c, i) => ({ ...c, displayOrder: i })) });
    console.log('✓ Clients seeded');
  }

  // ---------- Values ----------
  const values = [
    { titleAr: 'النزاهة', titleEn: 'Integrity', descriptionAr: 'الالتزام بالأخلاقيات المهنية والشفافية في جميع تعاملاتنا.', descriptionEn: 'Commitment to professional ethics and transparency in all our dealings.', icon: 'Shield' },
    { titleAr: 'الجودة', titleEn: 'Quality', descriptionAr: 'السعي الدائم للتميز وتجاوز توقعات العملاء.', descriptionEn: 'Continuous pursuit of excellence and exceeding client expectations.', icon: 'Award' },
    { titleAr: 'الالتزام', titleEn: 'Commitment', descriptionAr: 'الوفاء بالوعود وتحقيق الأهداف في المواعيد المحددة.', descriptionEn: 'Fulfilling promises and achieving goals within set timelines.', icon: 'Flag' },
    { titleAr: 'الابتكار', titleEn: 'Innovation', descriptionAr: 'تبني الأفكار الجديدة والتقنيات الحديثة لتحسين الأداء.', descriptionEn: 'Adopting new ideas and modern technologies to improve performance.', icon: 'Lightbulb' },
    { titleAr: 'السلامة', titleEn: 'Safety', descriptionAr: 'حماية الأرواح والممتلكات أولوية قصوى في كل عملياتنا.', descriptionEn: 'Protecting lives and assets is a top priority in all our operations.', icon: 'HardHat' },
    { titleAr: 'الاستدامة', titleEn: 'Sustainability', descriptionAr: 'مسؤولية بيئية واجتماعية لتحقيق أثر إيجابي مستدام.', descriptionEn: 'Environmental and social responsibility for lasting positive impact.', icon: 'Leaf' },
  ];
  const existingValues = await prisma.value.count();
  if (existingValues === 0) {
    await prisma.value.createMany({ data: values.map((v, i) => ({ ...v, displayOrder: i })) });
    console.log('✓ Values seeded');
  }

  // ---------- Industries ----------
  const industries = [
    { nameAr: 'الإنشاءات والبناء', nameEn: 'Construction & Building', slug: 'construction-building', icon: 'Building2', featured: true,
      descriptionAr: 'حلول إنشائية متكاملة للمباني السكنية والتجارية والصناعية.',
      descriptionEn: 'Integrated construction solutions for residential, commercial, and industrial buildings.' },
    { nameAr: 'الطاقة والبتروكيماويات', nameEn: 'Energy & Petrochemicals', slug: 'energy-petrochemicals', icon: 'Factory', featured: true,
      descriptionAr: 'خدمات هندسية وتنفيذية لمنشآت الطاقة والبتروكيماويات.',
      descriptionEn: 'Engineering and execution services for energy and petrochemical facilities.' },
    { nameAr: 'البنية التحتية والنقل', nameEn: 'Infrastructure & Transport', slug: 'infrastructure-transport', icon: 'Truck', featured: true,
      descriptionAr: 'طرق وجسور وأنظمة نقل حديثة وفق أعلى المعايير.',
      descriptionEn: 'Roads, bridges, and modern transport systems to the highest standards.' },
    { nameAr: 'الرعاية الصحية', nameEn: 'Healthcare', slug: 'healthcare', icon: 'HeartPulse', featured: false,
      descriptionAr: 'منشآت طبية متخصصة وفق المعايير الصحية الدولية.',
      descriptionEn: 'Specialized medical facilities built to international healthcare standards.' },
    { nameAr: 'التعليم', nameEn: 'Education', slug: 'education', icon: 'GraduationCap', featured: false,
      descriptionAr: 'حرم جامعي ومدارس ومرافق تعليمية حديثة.',
      descriptionEn: 'University campuses, schools, and modern educational facilities.' },
    { nameAr: 'التجارة والتجزئة', nameEn: 'Retail & Commercial', slug: 'retail-commercial', icon: 'Store', featured: false,
      descriptionAr: 'مراكز تجارية ومتاجر ومساحات تجزئة عصرية.',
      descriptionEn: 'Malls, showrooms, and modern retail spaces.' },
    { nameAr: 'السياحة والضيافة', nameEn: 'Tourism & Hospitality', slug: 'tourism-hospitality', icon: 'Hotel', featured: false,
      descriptionAr: 'فنادق ومنتجعات ومرافق ضيافة عالمية المستوى.',
      descriptionEn: 'Hotels, resorts, and world-class hospitality facilities.' },
    { nameAr: 'الزراعة والأمن الغذائي', nameEn: 'Agriculture & Food Security', slug: 'agriculture-food', icon: 'Wheat', featured: false,
      descriptionAr: 'مشاريع زراعية وأنظمة ري تخدم الأمن الغذائي.',
      descriptionEn: 'Agricultural projects and irrigation systems supporting food security.' },
  ];
  for (let i = 0; i < industries.length; i++) {
    const ind = industries[i];
    await prisma.industry.upsert({
      where: { slug: ind.slug },
      update: {},
      create: { ...ind, displayOrder: i, createdById: admin.id },
    });
  }
  console.log('✓ Industries seeded');

  // ---------- Team members ----------
  const team = [
    { nameAr: 'عبدالله الرفاعي', nameEn: 'Abdullah Alrefai', positionAr: 'الرئيس التنفيذي', positionEn: 'Chief Executive Officer', featured: true },
    { nameAr: 'محمد العتيبي', nameEn: 'Mohammed Al-Otaibi', positionAr: 'مدير العمليات', positionEn: 'Operations Manager', featured: true },
    { nameAr: 'خالد الشهري', nameEn: 'Khalid Al-Shehri', positionAr: 'المدير الهندسي', positionEn: 'Engineering Director', featured: true },
    { nameAr: 'نورة القحطاني', nameEn: 'Noura Al-Qahtani', positionAr: 'مديرة التسويق', positionEn: 'Marketing Manager', featured: false },
  ];
  const existingTeam = await prisma.teamMember.count();
  if (existingTeam === 0) {
    await prisma.teamMember.createMany({ data: team.map((m, i) => ({ ...m, displayOrder: i })) });
    console.log('✓ Team members seeded');
  }

  // ---------- News categories ----------
  const categories = [
    { nameAr: 'أخبار الشركة', nameEn: 'Company News', slug: 'company-news', color: '#0d2d1a' },
    { nameAr: 'المشاريع', nameEn: 'Projects', slug: 'projects', color: '#c9a227' },
    { nameAr: 'الشراكات', nameEn: 'Partnerships', slug: 'partnerships', color: '#166534' },
    { nameAr: 'الجوائز', nameEn: 'Awards', slug: 'awards', color: '#854d0e' },
  ];
  for (const c of categories) {
    await prisma.category.upsert({ where: { slug: c.slug }, update: {}, create: c });
  }

  // ---------- News posts ----------
  const posts = [
    {
      titleAr: 'إطلاق مشروع برج الرفاعي التجاري', titleEn: 'Launch of Alrefai Commercial Tower Project',
      slug: 'alrefai-commercial-tower-launch', status: 'PUBLISHED' as const, categorySlug: 'projects',
      excerptAr: 'نعلن عن بدء أعمال الإنشاء في برج الرفاعي التجاري بارتفاع 40 طابقاً في قلب الرياض.',
      excerptEn: 'We announce the start of construction of the 40-story Alrefai Commercial Tower in the heart of Riyadh.',
      contentAr: 'شهدت العاصمة الرياض احتفالية رسمية لإطلاق مشروع برج الرفاعي التجاري، الذي يعد أحد أضخم المشاريع التجارية في المنطقة بارتفاع 40 طابقاً ومساحة إجمالية تتجاوز 85 ألف متر مربع. وسيضم البرج مكاتب فاخرة ومساحات تجارية ومرافق عالمية المستوى، مع تصاميم مستدامة تحقق شهادة LEED الذهبية. ويكتمل المشروع المقرر خلال ثلاث سنوات بشراكة مع كبرى شركات التصميم والاستشارات الهندسية العالمية.',
      contentEn: 'The capital Riyadh hosted the official launch ceremony of the Alrefai Commercial Tower project, one of the largest commercial projects in the region, standing 40 stories with a total area exceeding 85,000 sqm. The tower will feature premium offices, retail spaces, and world-class amenities, with sustainable designs targeting LEED Gold certification. The project is scheduled for completion within three years in partnership with leading global design and engineering consultancies.',
      publishedAt: new Date('2024-01-15'),
    },
    {
      titleAr: 'شراكة استراتيجية مع أرامكو السعودية', titleEn: 'Strategic Partnership with Saudi Aramco',
      slug: 'strategic-partnership-aramco', status: 'PUBLISHED' as const, categorySlug: 'partnerships',
      excerptAr: 'توقيع اتفاقية شراكة استراتيجية طويلة المدى مع شركة أرامكو السعودية.',
      excerptEn: 'Signing a long-term strategic partnership agreement with Saudi Aramco.',
      contentAr: 'وقعت شركة الرفاعي المتحدة اتفاقية شراكة استراتيجية مع شركة أرامكو السعودية لتقديم خدمات الهندسة والإنشاءات لكبرى مشاريع الطاقة في المملكة. وتشمل الاتفاقية مشاريع البنية التحتية ومنشآت المعالجة والمرافق المساندة، وتعزز مكانة الشركة كمزود موثوق للحلول المتكاملة في قطاع الطاقة.',
      contentEn: 'Alrefai United Company signed a strategic partnership agreement with Saudi Aramco to provide engineering and construction services for major energy projects across the Kingdom. The agreement covers infrastructure projects, processing facilities, and supporting utilities, reinforcing the company\'s position as a trusted provider of integrated solutions in the energy sector.',
      publishedAt: new Date('2024-01-10'),
    },
    {
      titleAr: 'جائزة التميز في السلامة المهنية', titleEn: 'Occupational Safety Excellence Award',
      slug: 'safety-excellence-award', status: 'PUBLISHED' as const, categorySlug: 'awards',
      excerptAr: 'حصول شركة الرفاعي المتحدة على جائزة التميز في السلامة المهنية للعام 2024.',
      excerptEn: 'Alrefai United Company wins the Occupational Safety Excellence Award for 2024.',
      contentAr: 'توجت شركة الرفاعي المتحدة بجائزة التميز في السلامة المهنية لعام 2024 تقديراً لالتزامها الصارم بمعايير السلامة والصحة المهنية في جميع مواقع عملها. جاءت هذه الجائزة نتيجة سجل حافل خالٍ من الحوادث الكبرى وبرامج تدريب متكاملة شملت أكثر من 500 موظف خلال العام.',
      contentEn: 'Alrefai United Company was honored with the 2024 Occupational Safety Excellence Award in recognition of its strict adherence to health and safety standards across all its work sites. The award followed a track record free of major incidents and comprehensive training programs covering more than 500 employees during the year.',
      publishedAt: new Date('2024-01-05'),
    },
  ];
  const existingPosts = await prisma.post.count();
  if (existingPosts === 0) {
    for (const p of posts) {
      const cat = await prisma.category.findUnique({ where: { slug: p.categorySlug } });
      await prisma.post.create({
        data: {
          titleAr: p.titleAr, titleEn: p.titleEn, slug: p.slug,
          excerptAr: p.excerptAr, excerptEn: p.excerptEn,
          contentAr: p.contentAr, contentEn: p.contentEn,
          status: p.status, publishedAt: p.publishedAt,
          categoryId: cat?.id, authorId: admin.id,
        },
      });
    }
    console.log('✓ News posts seeded');
  }

  // ---------- Social links ----------
  const socials = [
    { platform: 'linkedin', nameAr: 'لينكدإن', nameEn: 'LinkedIn', url: 'https://linkedin.com/company/alrefai-united' },
    { platform: 'twitter', nameAr: 'تويتر', nameEn: 'Twitter (X)', url: 'https://x.com/alrefaiunited' },
    { platform: 'facebook', nameAr: 'فيسبوك', nameEn: 'Facebook', url: 'https://facebook.com/alrefaiunited' },
    { platform: 'instagram', nameAr: 'إنستغرام', nameEn: 'Instagram', url: 'https://instagram.com/alrefaiunited' },
  ];
  const existingSocials = await prisma.socialLink.count();
  if (existingSocials === 0) {
    await prisma.socialLink.createMany({ data: socials.map((s, i) => ({ ...s, displayOrder: i })) });
    console.log('✓ Social links seeded');
  }

  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
