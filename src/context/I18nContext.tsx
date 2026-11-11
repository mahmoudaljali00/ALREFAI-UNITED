'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Locale = 'ar' | 'en';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  dir: 'rtl' | 'ltr';
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children, initialLocale = 'ar' }: { children: ReactNode; initialLocale?: Locale }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const savedLocale = localStorage.getItem('locale') as Locale | null;
      if (savedLocale === 'ar' || savedLocale === 'en') {
        setLocaleState(savedLocale);
        if (typeof document !== 'undefined') {
          document.documentElement.dir = savedLocale === 'ar' ? 'rtl' : 'ltr';
          document.documentElement.lang = savedLocale;
        }
      } else {
        localStorage.setItem('locale', initialLocale);
        if (typeof document !== 'undefined') {
          document.documentElement.dir = initialLocale === 'ar' ? 'rtl' : 'ltr';
          document.documentElement.lang = initialLocale;
        }
      }
    } catch {
      // LocalStorage not available
    }
  }, [initialLocale]);

  // Synchronize across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'locale' && (e.newValue === 'ar' || e.newValue === 'en')) {
        const next = e.newValue as Locale;
        setLocaleState(next);
        if (typeof document !== 'undefined') {
          document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr';
          document.documentElement.lang = next;
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem('locale', newLocale);
      document.cookie = `locale=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    } catch {
      // ignore
    }
    if (typeof document !== 'undefined') {
      document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = newLocale;
    }
  };

  const dir: 'rtl' | 'ltr' = locale === 'ar' ? 'rtl' : 'ltr';

  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let value: any = translations[locale];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    if (!value) {
      const fallbackLocale = locale === 'ar' ? 'en' : 'ar';
      let fallbackValue: any = translations[fallbackLocale];
      for (const k of keys) {
        fallbackValue = fallbackValue?.[k];
      }
      if (fallbackValue) return fallbackValue;
      return key;
    }
    
    if (params) {
      return Object.entries(params).reduce(
        (str, [paramKey, paramValue]) => str.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramValue)),
        value
      );
    }
    
    return value;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, dir }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

const translations = {
  ar: {
    nav: {
      home: 'الرئيسية',
      about: 'من نحن',
      services: 'خدماتنا',
      projects: 'مشاريعنا',
      industries: 'قطاعاتنا',
      sustainability: 'الاستدامة',
      news: 'الأخبار',
      contact: 'تواصل معنا',
    },
    hero: {
      headline: 'نبني الثقة... ونصنع المستقبل',
      subheadline: 'شركة الرفاعي المتحدة — شريككم نحو النمو والاستدامة والتميز',
      ctaPrimary: 'اكتشف خدماتنا',
      ctaSecondary: 'تواصل معنا',
      scrollIndicator: 'اكتشف المزيد',
    },
    about: {
      title: 'من نحن',
      subtitle: 'شركة الرفاعي المتحدة',
      vision: 'رؤيتنا',
      mission: 'مهمتنا',
      values: 'قيمنا',
      experience: 'سنوات الخبرة',
      projects: 'المشاريع',
      clients: 'العملاء',
      partners: 'الشركاء الاستراتيجيون',
      team: 'فريق العمل',
      description1: 'شركة الرفاعي المتحدة هي شركة رائدة في مجال الهندسة والإنشاءات والتجارة والخدمات اللوجستية، تأسست برؤية واضحة لتكون الشريك المفضل للمشاريع الكبرى في المنطقة.',
      description2: 'على مدار أكثر من 15 عاماً، نجحنا في تنفيذ مشاريع نوعية في قطاعات متنوعة، وحققنا سمعة متميزة مبنية على الثقة والجودة والالتزام.',
    },
    services: {
      title: 'خدماتنا',
      subtitle: 'حلول متكاملة للتميز المؤسسي',
      learnMore: 'اعرف المزيد',
      viewAll: 'عرض جميع الخدمات',
    },
    projects: {
      title: 'مشاريعنا',
      subtitle: 'منجزاتنا تتحدث عنا',
      all: 'الكل',
      construction: 'إنشاءات',
      engineering: 'هندسة',
      infrastructure: 'بنية تحتية',
      commercial: 'تجاري',
      industrial: 'صناعي',
      other: 'أخرى',
      viewProject: 'عرض المشروع',
      featuredProject: 'مشاريع نصنع بها الفرق',
    },
    whyUs: {
      title: 'لماذا الرفاعي المتحدة؟',
      subtitle: 'نحن شريككم الموثوق للنجاح المستدام',
      quality: 'الجودة',
      reliability: 'الموثوقية',
      professionalism: 'الاحترافية',
      innovation: 'الابتكار',
      safety: 'السلامة',
      partnership: 'الشراكة طويلة المدى',
    },
    values: {
      title: 'قيمنا',
      subtitle: 'الأساس الذي نبني عليه مستقبلنا',
      integrity: 'النزاهة',
      quality: 'الجودة',
      commitment: 'الالتزام',
      innovation: 'الابتكار',
      safety: 'السلامة',
      sustainability: 'الاستدامة',
    },
    industries: {
      title: 'قطاعاتنا',
      subtitle: 'نخدم قطاعات حيوية بخبرة متميزة',
    },
    statistics: {
      title: 'بأرقام',
      subtitle: 'مسيرة حافلة بالإنجازات',
    },
    partners: {
      title: 'شركاؤنا وعملاؤنا',
      subtitle: 'نفخر بثقة كبرى المؤسسات',
    },
    testimonials: {
      title: 'آراء عملائنا',
      subtitle: 'شهادات تعكس التزامنا بالتميز',
    },
    news: {
      title: 'الأخبار والمستجدات',
      subtitle: 'تابعوا أحدث أخبارنا ومشاريعنا',
      readMore: 'اقرأ المزيد',
      latestNews: 'أحدث الأخبار',
      categories: 'التصنيفات',
    },
    cta: {
      title: 'لنبنِ المستقبل معاً',
      subtitle: 'نحن مستعدون لسماع رؤيتكم وتحويلها إلى واقع',
      button: 'تواصل معنا',
    },
    contact: {
      title: 'تواصل معنا',
      subtitle: 'نحن هنا لخدمتكم',
      address: 'العنوان',
      phone: 'الهاتف',
      email: 'البريد الإلكتروني',
      whatsapp: 'واتساب',
      workingHours: 'ساعات العمل',
      form: {
        name: 'الاسم الكامل',
        email: 'البريد الإلكتروني',
        phone: 'رقم الهاتف',
        company: 'الشركة',
        subject: 'الموضوع',
        message: 'الرسالة',
        privacy: 'أوافق على سياسة الخصوصية',
        submit: 'إرسال الرسالة',
        submitting: 'جاري الإرسال...',
        success: 'تم إرسال رسالتكم بنجاح، سنتواصل معكم قريباً',
        error: 'حدث خطأ، يرجى المحاولة مرة أخرى',
      },
    },
    footer: {
      description: 'شركة رائدة في تقديم الحلول الهندسية والإنشائية والتجارية واللوجستية.',
      quickLinks: 'روابط سريعة',
      services: 'خدماتنا',
      contactInfo: 'معلومات التواصل',
      newsletter: 'النشرة البريدية',
      newsletterDesc: 'اشتركوا للحصول على أحدث أخبارنا وعروضنا',
      emailPlaceholder: 'بريدك الإلكتروني',
      subscribe: 'اشتراك',
      privacy: 'سياسة الخصوصية',
      terms: 'شروط الاستخدام',
      copyright: '© شركة الرفاعي المتحدة. جميع الحقوق محفوظة.',
      followUs: 'تابعونا',
    },
    common: {
      loading: 'جاري التحميل...',
      error: 'حدث خطأ',
      retry: 'إعادة المحاولة',
      viewAll: 'عرض الكل',
      learnMore: 'اعرف المزيد',
      contactUs: 'تواصل معنا',
      getStarted: 'ابدأ الآن',
      submit: 'إرسال',
      cancel: 'إلغاء',
      save: 'حفظ',
      edit: 'تعديل',
      delete: 'حذف',
      add: 'إضافة',
      search: 'بحث',
      filter: 'تصفية',
      sort: 'ترتيب',
      language: 'اللغة',
      arabic: 'العربية',
      english: 'English',
      back: 'رجوع',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      backToSite: 'العودة إلى الموقع',
      name: 'الاسم',
      id: 'المعرّف',
      title: 'العنوان',
      slug: 'الرابط المختصر',
      status: 'الحالة',
      featured: 'مميز',
      normal: 'عادي',
      order: 'الترتيب',
      createdAt: 'تاريخ الإنشاء',
      actions: 'الإجراءات',
      all: 'الكل',
      active: 'نشط',
      inactive: 'غير نشط',
      view: 'عرض',
      previous: 'السابق',
      next: 'التالي',
    },
    admin: {
      dashboard: 'لوحة التحكم',
      dashboardSubtitle: 'نظرة عامة على محتوى وأداء الموقع',
      overview: 'نظرة عامة',
      companyInfo: 'معلومات الشركة',
      services: 'الخدمات',
      manageServices: 'إدارة الخدمات',
      addService: 'إضافة خدمة جديدة',
      addServiceDesc: 'إنشاء خدمة جديدة في الموقع',
      titleRequired: 'عنوان الخدمة باللغتين مطلوب',
      loginSuccess: 'تم تسجيل الدخول بنجاح',
      projects: 'المشاريع',
      industries: 'القطاعات',
      team: 'الفريق',
      clients: 'العملاء',
      testimonials: 'الشهادات',
      news: 'الأخبار',
      messages: 'الرسائل',
      media: 'الملفات',
      settings: 'الإعدادات',
      seo: 'تحسين محركات البحث',
      users: 'المستخدمون',
      analytics: 'التحليلات',
      login: 'تسجيل الدخول',
      logout: 'تسجيل الخروج',
      profile: 'الملف الشخصي',
      totalProjects: 'إجمالي المشاريع',
      totalServices: 'إجمالي الخدمات',
      totalClients: 'إجمالي العملاء',
      unreadMessages: 'رسائل غير مقروءة',
      publishedArticles: 'مقالات منشورة',
      websiteVisits: 'زيارات الموقع',
      addNew: 'إضافة جديد',
      editItem: 'تعديل',
      deleteItem: 'حذف',
      confirmDelete: 'تأكيد الحذف',
      deleteConfirmation: 'هل أنت متأكد من حذف هذا العنصر؟ لا يمكن التراجع عن هذا الإجراء.',
      yesDelete: 'نعم، احذف',
      noCancel: 'لا، إلغاء',
      createdSuccessfully: 'تم الإنشاء بنجاح',
      updatedSuccessfully: 'تم التحديث بنجاح',
      deletedSuccessfully: 'تم الحذف بنجاح',
      errorOccurred: 'حدث خطأ، يرجى المحاولة مرة أخرى',
      requiredField: 'هذا الحقل مطلوب',
      invalidEmail: 'بريد إلكتروني غير صحيح',
      invalidUrl: 'رابط غير صحيح',
      imageRequired: 'الصورة مطلوبة',
      slugExists: 'هذا المعرف مستخدم بالفعل',
      createAccount: 'إنشاء حساب',
      createAccountSubtitle: 'إعداد أول حساب لمشرف لوحة التحكم',
      yourName: 'الاسم',
      confirmPassword: 'تأكيد كلمة المرور',
      passwordsDoNotMatch: 'كلمتا المرور غير متطابقتين',
      passwordHint: '8 أحرف على الأقل، وتحتوي على أحرف وأرقام',
      weakPassword: 'كلمة المرور ضعيفة: 8 أحرف على الأقل مع أحرف وأرقام',
      accountCreated: 'تم إنشاء الحساب بنجاح',
      alreadyHaveAccount: 'لديك حساب بالفعل؟ تسجيل الدخول',
      noAccountYet: 'لا يوجد حساب بعد؟ إنشاء حساب',
      loginSubtitle: 'سجّل الدخول للوصول إلى لوحة التحكم',
      quickActions: 'إجراءات سريعة',
      recentActivity: 'النشاط الأخير',
      newProjectCreated: 'تم إنشاء مشروع جديد',
      newMessageReceived: 'تم استلام رسالة جديدة',
      articlePublished: 'تم نشر مقال',
      newClientAdded: 'تمت إضافة عميل',
      noServicesFound: 'لا توجد خدمات بعد',
      showing: 'عرض',
      of: 'من',
      results: 'نتيجة',
    },
  },
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      services: 'Services',
      projects: 'Projects',
      industries: 'Industries',
      sustainability: 'Sustainability',
      news: 'News',
      contact: 'Contact',
    },
    hero: {
      headline: 'Building Trust. Shaping the Future.',
      subheadline: 'ALREFAI UNITED COMPANY — Your trusted partner for growth, excellence and sustainable development.',
      ctaPrimary: 'Explore Our Services',
      ctaSecondary: 'Contact Us',
      scrollIndicator: 'Discover More',
    },
    about: {
      title: 'Who We Are',
      subtitle: 'ALREFAI UNITED COMPANY',
      vision: 'Our Vision',
      mission: 'Our Mission',
      values: 'Our Values',
      experience: 'Years of Experience',
      projects: 'Projects',
      clients: 'Clients',
      partners: 'Strategic Partners',
      team: 'Team Members',
      description1: 'ALREFAI UNITED COMPANY is a leading company in engineering, construction, trading, and logistics services, founded with a clear vision to be the preferred partner for major projects in the region.',
      description2: 'Over more than 15 years, we have successfully executed distinguished projects across diverse sectors, building a distinguished reputation based on trust, quality, and commitment.',
    },
    services: {
      title: 'Our Services',
      subtitle: 'Integrated Solutions for Corporate Excellence',
      learnMore: 'Learn More',
      viewAll: 'View All Services',
    },
    projects: {
      title: 'Our Projects',
      subtitle: 'Our Achievements Speak for Themselves',
      all: 'All',
      construction: 'Construction',
      engineering: 'Engineering',
      infrastructure: 'Infrastructure',
      commercial: 'Commercial',
      industrial: 'Industrial',
      other: 'Other',
      viewProject: 'View Project',
      featuredProject: 'Projects That Make an Impact',
    },
    whyUs: {
      title: 'Why ALREFAI UNITED?',
      subtitle: 'Your Trusted Partner for Sustainable Success',
      quality: 'Quality',
      reliability: 'Reliability',
      professionalism: 'Professionalism',
      innovation: 'Innovation',
      safety: 'Safety',
      partnership: 'Long-Term Partnership',
    },
    values: {
      title: 'Our Values',
      subtitle: 'The Foundation We Build Our Future On',
      integrity: 'Integrity',
      quality: 'Quality',
      commitment: 'Commitment',
      innovation: 'Innovation',
      safety: 'Safety',
      sustainability: 'Sustainability',
    },
    industries: {
      title: 'Industries We Serve',
      subtitle: 'Serving Vital Sectors with Distinguished Expertise',
    },
    statistics: {
      title: 'By The Numbers',
      subtitle: 'A Journey Full of Achievements',
    },
    partners: {
      title: 'Our Partners & Clients',
      subtitle: 'Proud of the Trust of Leading Institutions',
    },
    testimonials: {
      title: 'Client Testimonials',
      subtitle: 'Reflecting Our Commitment to Excellence',
    },
    news: {
      title: 'News & Updates',
      subtitle: 'Stay Updated with Our Latest News and Projects',
      readMore: 'Read More',
      latestNews: 'Latest News',
      categories: 'Categories',
    },
    cta: {
      title: 'Let\'s Build the Future Together',
      subtitle: 'We Are Ready to Hear Your Vision and Turn It Into Reality',
      button: 'Contact Us',
    },
    contact: {
      title: 'Contact Us',
      subtitle: 'We Are Here to Serve You',
      address: 'Address',
      phone: 'Phone',
      email: 'Email',
      whatsapp: 'WhatsApp',
      workingHours: 'Working Hours',
      form: {
        name: 'Full Name',
        email: 'Email',
        phone: 'Phone Number',
        company: 'Company',
        subject: 'Subject',
        message: 'Message',
        privacy: 'I agree to the privacy policy',
        submit: 'Send Message',
        submitting: 'Sending...',
        success: 'Your message has been sent successfully. We will contact you soon.',
        error: 'An error occurred. Please try again.',
      },
    },
    footer: {
      description: 'A leading company providing engineering, construction, trading and logistics solutions.',
      quickLinks: 'Quick Links',
      services: 'Services',
      contactInfo: 'Contact Information',
      newsletter: 'Newsletter',
      newsletterDesc: 'Subscribe to get our latest news and offers',
      emailPlaceholder: 'Your Email',
      subscribe: 'Subscribe',
      privacy: 'Privacy Policy',
      terms: 'Terms & Conditions',
      copyright: '© ALREFAI UNITED COMPANY. All Rights Reserved.',
      followUs: 'Follow Us',
    },
    common: {
      loading: 'Loading...',
      error: 'An error occurred',
      retry: 'Retry',
      viewAll: 'View All',
      learnMore: 'Learn More',
      contactUs: 'Contact Us',
      getStarted: 'Get Started',
      submit: 'Submit',
      cancel: 'Cancel',
      save: 'Save',
      edit: 'Edit',
      delete: 'Delete',
      add: 'Add',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      language: 'Language',
      arabic: 'العربية',
      english: 'English',
      back: 'Back',
      email: 'Email',
      password: 'Password',
      backToSite: 'Back to website',
      name: 'Name',
      id: 'ID',
      title: 'Title',
      slug: 'Slug',
      status: 'Status',
      featured: 'Featured',
      normal: 'Normal',
      order: 'Order',
      createdAt: 'Created',
      actions: 'Actions',
      all: 'All',
      active: 'Active',
      inactive: 'Inactive',
      view: 'View',
      previous: 'Previous',
      next: 'Next',
    },
    admin: {
      dashboard: 'Dashboard',
      dashboardSubtitle: 'Overview of your website content and performance',
      overview: 'Overview',
      companyInfo: 'Company Information',
      services: 'Services',
      manageServices: 'Manage your services',
      addService: 'Add New Service',
      addServiceDesc: 'Create a new service',
      titleRequired: 'Title in both languages is required',
      loginSuccess: 'Login successful',
      projects: 'Projects',
      industries: 'Industries',
      team: 'Team',
      clients: 'Clients',
      testimonials: 'Testimonials',
      news: 'News',
      messages: 'Messages',
      media: 'Media',
      settings: 'Settings',
      seo: 'SEO',
      users: 'Users',
      analytics: 'Analytics',
      login: 'Login',
      logout: 'Logout',
      profile: 'Profile',
      totalProjects: 'Total Projects',
      totalServices: 'Total Services',
      totalClients: 'Total Clients',
      unreadMessages: 'Unread Messages',
      publishedArticles: 'Published Articles',
      websiteVisits: 'Website Visits',
      addNew: 'Add New',
      editItem: 'Edit',
      deleteItem: 'Delete',
      confirmDelete: 'Confirm Delete',
      deleteConfirmation: 'Are you sure you want to delete this item? This action cannot be undone.',
      yesDelete: 'Yes, Delete',
      noCancel: 'No, Cancel',
      createdSuccessfully: 'Created successfully',
      updatedSuccessfully: 'Updated successfully',
      deletedSuccessfully: 'Deleted successfully',
      errorOccurred: 'An error occurred. Please try again.',
      requiredField: 'This field is required',
      invalidEmail: 'Invalid email address',
      invalidUrl: 'Invalid URL',
      imageRequired: 'Image is required',
      slugExists: 'This slug is already in use',
      createAccount: 'Create Account',
      createAccountSubtitle: 'Set up the first admin account for the dashboard',
      yourName: 'Name',
      confirmPassword: 'Confirm Password',
      passwordsDoNotMatch: 'Passwords do not match',
      passwordHint: 'At least 8 characters, with letters and numbers',
      weakPassword: 'Weak password: at least 8 characters with letters and numbers',
      accountCreated: 'Account created successfully',
      alreadyHaveAccount: 'Already have an account? Sign in',
      noAccountYet: 'No account yet? Create one',
      loginSubtitle: 'Sign in to access the dashboard',
      quickActions: 'Quick actions',
      recentActivity: 'Recent activity',
      newProjectCreated: 'New project created',
      newMessageReceived: 'New message received',
      articlePublished: 'Article published',
      newClientAdded: 'New client added',
      noServicesFound: 'No services found',
      showing: 'Showing',
      of: 'of',
      results: 'results',
    },
  },
};

export function getTranslations(locale: Locale) {
  return translations[locale];
}

export function getAllLocales(): Locale[] {
  return ['ar', 'en'];
}