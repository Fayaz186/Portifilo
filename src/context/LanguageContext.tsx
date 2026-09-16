import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';

interface Translations {
  [key: string]: {
    en: string;
    fa: string;
  };
}

export const dictionary: Translations = {
  // Navigation
  navHome: { en: 'Home', fa: 'خانه' },
  navAbout: { en: 'About', fa: 'درباره من' },
  navExperience: { en: 'Experience', fa: 'تجربه‌ها' },
  navEducation: { en: 'Education', fa: 'تحصیلات' },
  navSkills: { en: 'Skills', fa: 'مهارت‌ها' },
  navProjects: { en: 'Projects', fa: 'پروژه‌ها' },
  navResearch: { en: 'Research', fa: 'پژوهش‌ها' },
  navMedia: { en: 'Media', fa: 'رسانه‌ها و اسناد' },
  navContact: { en: 'Contact', fa: 'تماس و ارتباط' },
  navResume: { en: 'Resume / CV', fa: 'رزومه / خلص سوانح' },
  adminLogin: { en: 'Admin Portal', fa: 'پورتال مدیریت' },

  // Hero Section
  availableBadge: { en: 'Open for Projects & Collaborations', fa: 'آماده برای پروژه‌ها و همکاری‌های جدید' },
  downloadResume: { en: 'Generate PDF Resume', fa: 'ایجاد و دریافت رزومه PDF' },
  viewProjects: { en: 'Explore Work', fa: 'مشاهده پروژه‌ها' },
  contactMe: { en: 'Get In Touch', fa: 'تماس بگیرید' },
  yearsExp: { en: 'Years Experience', fa: 'سال تجربه کاری' },
  completedProjects: { en: 'Shipped Projects', fa: 'پروژه‌های انجام‌شده' },
  publishedResearch: { en: 'Research Papers', fa: 'مقالات و پژوهش‌های علمی' },

  // Section Headers
  aboutTitle: { en: 'Biography & Background', fa: 'زندگینامه و پیشینه علمی' },
  aboutSubtitle: { en: 'Passionate about distributed engineering, low-resource NLP, and digital products.', fa: 'متعهد به توسعه نرم‌افزار، هوش مصنوعی، پروسس زبان طبیعی و ساخت محصولات دیجیتال کاربردی.' },
  experienceTitle: { en: 'Professional Experience', fa: 'تجربه‌های مسلکی و کاری' },
  experienceSubtitle: { en: 'Track record of engineering robust mobile, web, and distributed systems.', fa: 'پیشینه درخشان در طراحی و توسعه سیستم‌های نرم‌افزاری وب، موبایل و سیستم‌های مقیاس‌پذیر.' },
  educationTitle: { en: 'Academic Education', fa: 'پیشینه تحصیلی و دانشگاهی' },
  educationSubtitle: { en: 'Computer science foundations, research methodologies, and honors.', fa: 'پایه‌های علوم کامپیوتر، روش‌های تحقیق علمی و دستاوردهای اکادمیک.' },
  skillsTitle: { en: 'Technical Proficiencies', fa: 'مهارت‌ها و توانمندی‌های تخنیکی' },
  skillsSubtitle: { en: 'Core technologies, engineering toolchains, and specialized domains.', fa: 'زبان‌های برنامه‌نویسی، ابزارهای مدرن نرم‌افزاری و تخصص‌های اصلی.' },
  projectsTitle: { en: 'Featured Portfolio', fa: 'پروژه‌های منتخب و نوآوری‌ها' },
  projectsSubtitle: { en: 'Real-world digital products shipped for mobile, web, and communities.', fa: 'محصولات دیجیتال واقعی ساخته‌شده برای وب، موبایل و آسان‌سازی کار کاربران.' },
  researchTitle: { en: 'Publications & Academic Research', fa: 'پژوهش‌ها و مقالات علمی' },
  researchSubtitle: { en: 'Advancing low-resource natural language processing and resilient systems.', fa: 'تحقیقات علمی منتشرشده در زمینه هوش مصنوعی، پروسس زبان و سیستم‌های پایدار.' },
  mediaTitle: { en: 'Gallery & Credentials', fa: 'اسناد، مدارک و گالری رسانه‌ای' },
  mediaSubtitle: { en: 'Certificates, conferences, workshops, and development milestones.', fa: 'گواهی‌نامه‌ها، کنفرانس‌های بین‌المللی، ورکشاپ‌ها و رویدادهای تخصصی.' },
  contactTitle: { en: 'Initiate a Conversation', fa: 'برقراری ارتباط و پیام مستقیم' },
  contactSubtitle: { en: 'Have an innovative project, research opportunity, or consulting request?', fa: 'آیا پروژه، فرصت تحقیقاتی یا پیشنهاد کاری دارید؟ برایم پیام بفرستید.' },

  // Resume Generator
  resumeModalTitle: { en: 'Professional Resume & CV Generator', fa: 'سازنده رزومه مسلکی و خلص سوانح' },
  resumeSubtitle: { en: 'Export high-definition, printer-ready PDF CV with customizable sections.', fa: 'خروجی باکیفیت و آماده چاپ به فرمت PDF همراه با انتخاب بخش‌های دلخواه.' },
  printDownloadPdf: { en: 'Print / Save as PDF', fa: 'چاپ / ذخیره به صورت PDF' },
  chooseTemplate: { en: 'Resume Style', fa: 'سبک و دیزاین رزومه' },
  includeSections: { en: 'Included Sections', fa: 'بخش‌های شامل در رزومه' },
  exportJson: { en: 'Backup Data (JSON)', fa: 'پشتیبان‌گیری از اطلاعات (JSON)' },
  close: { en: 'Close', fa: 'بستن' },

  // Contact Form
  formName: { en: 'Your Name', fa: 'نام شما' },
  formEmail: { en: 'Your Email', fa: 'ایمیل آدرس شما' },
  formSubject: { en: 'Subject', fa: 'موضوع پیام' },
  formMessage: { en: 'Message Details', fa: 'متن پیام' },
  formSubmit: { en: 'Send Message', fa: 'ارسال پیام' },
  formSending: { en: 'Sending securely...', fa: 'در حال ارسال پیام...' },
  formSuccess: { en: 'Thank you! Your message was received securely. Abdul Razaq will respond soon.', fa: 'تشکر! پیام شما با موفقیت دریافت شد. عبدالرازق به زودی با شما تماس خواهد گرفت.' },

  // Admin & Management
  adminTitle: { en: 'Admin Content Management', fa: 'مدیریت محتوا و پورتال ادمین' },
  saveChanges: { en: 'Save Updates', fa: 'ذخیره تغییرات' },
  addNew: { en: 'Add New', fa: 'افزودن مورد جدید' },
  delete: { en: 'Delete', fa: 'حذف' },
  edit: { en: 'Edit', fa: 'ویرایش' },
  cancel: { en: 'Cancel', fa: 'انصراف' },
  confirmDelete: { en: 'Are you sure you want to delete this item?', fa: 'آیا مطمئن هستید که می‌خواهید این مورد را حذف کنید؟' }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('arh_preferred_lang');
    if (saved === 'fa' || saved === 'en') return saved;
    // Migrate old 'ps' setting to 'fa' (Dari)
    if (saved === 'ps') {
      localStorage.setItem('arh_preferred_lang', 'fa');
      return 'fa';
    }
    return 'fa'; // Default to Dari
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('arh_preferred_lang', lang);
  };

  const isRTL = language === 'fa';

  useEffect(() => {
    document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', language);
  }, [language, isRTL]);

  const t = (key: string): string => {
    const item = dictionary[key];
    if (!item) return key;
    return item[language] || item.fa || item.en || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
