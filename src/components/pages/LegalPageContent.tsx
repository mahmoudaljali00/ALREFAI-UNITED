'use client';

import { motion } from 'framer-motion';
import { useI18n } from '@/context/I18nContext';

interface LegalPageContentProps {
  type: 'privacy' | 'terms';
  companyName: string;
  companyNameAr: string;
  email: string;
}

export function LegalPageContent({ type, companyName, companyNameAr, email }: LegalPageContentProps) {
  const { dir } = useI18n();
  const rtl = dir === 'rtl';
  const name = rtl ? companyNameAr : companyName;

  const privacySections = [
    {
      titleAr: 'المعلومات التي نجمعها',
      titleEn: 'Information We Collect',
      bodyAr: 'نجمع المعلومات التي تقدمها طوعاً عند استخدام نموذج التواصل، مثل الاسم والبريد الإلكتروني ورقم الهاتف ورسالتك. كما قد نجمع بيانات استخدام الموقع بشكل مجهول لأغراض تحسين الأداء.',
      bodyEn: 'We collect information you voluntarily provide through the contact form, such as your name, email, phone number, and message. We may also collect anonymous site usage data to improve performance.',
    },
    {
      titleAr: 'كيف نستخدم معلوماتك',
      titleEn: 'How We Use Your Information',
      bodyAr: 'نستخدم معلوماتك فقط للرد على استفساراتك وتقديم الخدمات المطلوبة وتحسين تجربتك على موقعنا. لا نبيع أو نؤجر معلوماتك لأي طرف ثالث.',
      bodyEn: 'We use your information solely to respond to inquiries, deliver requested services, and improve your experience. We never sell or rent your information to third parties.',
    },
    {
      titleAr: 'حماية البيانات',
      titleEn: 'Data Protection',
      bodyAr: 'نطبق إجراءات تقنية وإدارية صارمة لحماية بياناتك من الوصول غير المصرح به أو الفقدان أو التعديل.',
      bodyEn: 'We apply strict technical and administrative measures to protect your data from unauthorized access, loss, or alteration.',
    },
    {
      titleAr: 'حقوقك',
      titleEn: 'Your Rights',
      bodyAr: 'يحق لك طلب الوصول إلى بياناتك أو تصحيحها أو حذفها في أي وقت عبر التواصل معنا على البريد الإلكتروني أدناه.',
      bodyEn: 'You may request access to, correction of, or deletion of your data at any time by contacting us at the email below.',
    },
  ];

  const termsSections = [
    {
      titleAr: 'قبول الشروط',
      titleEn: 'Acceptance of Terms',
      bodyAr: 'باستخدامك هذا الموقع، فإنك توافق على هذه الشروط والأحكام. إذا لم توافق على أي جزء منها، يرجى التوقف عن استخدام الموقع.',
      bodyEn: 'By using this website, you agree to these terms and conditions. If you do not agree with any part, please discontinue use of the site.',
    },
    {
      titleAr: 'حقوق الملكية الفكرية',
      titleEn: 'Intellectual Property',
      bodyAr: `جميع المحتويات على هذا الموقع — بما فيها النصوص والصور والشعارات — مملوكة لـ ${name} ولا يجوز نسخها أو إعادة استخدامها دون إذن كتابي مسبق.`,
      bodyEn: `All content on this website — including text, images, and logos — is owned by ${name} and may not be copied or reused without prior written permission.`,
    },
    {
      titleAr: 'دقة المعلومات',
      titleEn: 'Accuracy of Information',
      bodyAr: 'نبذل جهداً معقولاً لضمان دقة المعلومات المنشورة، لكننا لا نضمن خلوها من الأخطاء أو تحديثها بشكل مستمر.',
      bodyEn: 'We make reasonable efforts to ensure published information is accurate, but we do not guarantee it is error-free or continuously updated.',
    },
    {
      titleAr: 'حدود المسؤولية',
      titleEn: 'Limitation of Liability',
      bodyAr: 'لا تتحمل الشركة أي مسؤولية عن أي أضرار مباشرة أو غير مباشرة تنشأ عن استخدام الموقع أو الاعتماد على محتواه.',
      bodyEn: 'The company is not liable for any direct or indirect damages arising from use of the website or reliance on its content.',
    },
  ];

  const sections = type === 'privacy' ? privacySections : termsSections;
  const title = type === 'privacy' ? (rtl ? 'سياسة الخصوصية' : 'Privacy Policy') : rtl ? 'شروط الاستخدام' : 'Terms & Conditions';

  return (
    <>
      <section className="relative bg-primary-950 overflow-hidden pt-32 pb-16 lg:pt-40 lg:pb-20" dir={dir}>
        <div className="absolute inset-0" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1920&q=80" alt="" className="w-full h-full object-cover opacity-20" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-primary-950/85 via-primary-950/85 to-primary-950/95" aria-hidden="true" />
        <div className="absolute inset-0 bg-[url('/patterns/hero-pattern.svg')] opacity-5" aria-hidden="true" />
        <div className="container-custom relative">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="heading-display text-display-lg text-white"
          >
            {title}
          </motion.h1>
        </div>
      </section>

      <section className="section-padding-lg bg-white" dir={dir}>
        <div className="container-custom max-w-4xl space-y-10">
          {sections.map((section, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              <h2 className="heading-card text-heading-lg text-primary-950 mb-3">
                {rtl ? section.titleAr : section.titleEn}
              </h2>
              <p className="text-body text-neutral-600 leading-loose">{rtl ? section.bodyAr : section.bodyEn}</p>
            </motion.div>
          ))}

          <div className="pt-6 border-t border-neutral-200">
            <p className="text-body-sm text-neutral-500">
              {rtl ? 'لأي استفسارات حول هذه السياسة، تواصل معنا على:' : 'For any inquiries about this policy, contact us at:'}{' '}
              <a href={`mailto:${email}`} className="text-primary-700 hover:text-gold-600 font-medium">
                {email}
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
