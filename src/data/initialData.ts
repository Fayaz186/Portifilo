import {
  ProfileBio,
  ExperienceItem,
  EducationItem,
  SkillCategory,
  ProjectItem,
  ResearchPaper,
  MediaItem,
  AchievementItem,
  PortfolioData
} from '../types';

export const initialProfile: ProfileBio = {
  name: {
    en: 'Fayaz Ahmad Malikzai',
    fa: 'فیاض احمد ملک‌زی'
  },
  title: {
    en: 'Web Designer & Developer | Computer Science Student',
    fa: 'طراح و توسعه‌دهنده وب | دانشجوی علوم کامپیوتر'
  },
  roles: {
    en: [
      'Web Designer',
      'Web Developer',
      'Computer Science Student'
    ],
    fa: [
      'طراح وب',
      'توسعه‌دهنده وب',
      'دانشجوی علوم کامپیوتر'
    ]
  },
  shortBio: {
    en: "I am a Web Designer & Developer specializing in turning ideas into user-friendly, fast, and responsive digital experiences. From crafting beautiful UI designs to writing clean and optimized code, I'm here for every step of building a modern website.",
    fa: "من طراح و توسعه‌دهنده وب هستم که در تبدیل ایده‌ها به تجربیات دیجیتال کاربرپسند، سریع و واکنش‌گرا تخصص دارم. از طراحی رابط‌های کاربری زیبا تا نوشتن کدهای تمیز و بهینه‌شده، در تمام مراحل ساخت یک وب‌سایت مدرن در کنار شما هستم."
  },
  fullBio: {
    en: "I am Fayaz Ahmad Malikzai, a Web Designer, Web Developer, and Computer Science Student specializing in turning ideas into user-friendly, fast, and responsive digital experiences. From crafting beautiful UI designs to writing clean and optimized code, I'm here for every step of building a modern website. I take pride in crafting clean, accessible code, building modern interfaces, and creating robust digital solutions.",
    fa: "من فیاض احمد ملک‌زی هستم؛ طراح وب، توسعه‌دهنده وب و دانشجوی علوم کامپیوتر. تخصص من در تبدیل ایده‌ها به تجربیات دیجیتال کاربرپسند، سریع و واکنش‌گرا است. از طراحی رابط‌های کاربری زیبا تا نوشتن کدهای تمیز و بهینه‌شده، در تمام مراحل ساخت یک وب‌سایت مدرن همراه و راهنمای شما هستم."
  },
  location: {
    en: 'Kabul, Afghanistan (Open to Global Remote & Relocation)',
    fa: 'کابل، افغانستان (آماده برای همکاری‌های بین‌المللی و کار از راه دور)'
  },
  email: 'fayazmalikzai055@gmail.com',
  phone: '+93 78 123 4567',
  avatarUrl: '/fayaz.jpeg',
  logoUrl: '/logo.jpeg',
  availableForHire: true,
  socialLinks: {
    github: 'https://github.com/Fayaz186',
    linkedin: 'https://linkedin.com/in/fayazmalikzai',
    twitter: 'https://twitter.com/fayazmalikzai',
    googleScholar: 'https://scholar.google.com/citations?user=fayazmalikzai',
    researchGate: 'https://researchgate.net/profile/Fayaz-Ahmad-Malikzai',
    youtube: 'https://youtube.com/@fayazmalikzai',
    email: 'mailto:fayazmalikzai055@gmail.com',
    telegram: 'https://t.me/fayazmalikzai'
  },
  stats: {
    yearsExperience: 4,
    projectsCompleted: 28,
    researchPapers: 3
  },
  interests: {
    en: [
      'Distributed Systems',
      'Artificial Intelligence & NLP',
      'Human-Computer Interaction',
      'Open Source Software',
      'Social Entrepreneurship',
      'Tech Mentorship'
    ],
    fa: [
      'سیستم‌های توزیع‌شده',
      'هوش مصنوعی و پردازش زبان طبیعی',
      'تعامل انسان و کامپیوتر (HCI)',
      'نرم‌افزارهای متن‌باز (Open Source)',
      'کارآفرینی اجتماعی و اقتصادی',
      'رهبری و منتورینگ تیم‌های تخنیکی'
    ]
  }
};

export const initialExperiences: ExperienceItem[] = [
  {
    id: 'exp-1',
    role: {
      en: 'Lead Web & Mobile Developer',
      fa: 'سرپرست و توسعه‌دهنده ارشد وب و موبایل'
    },
    company: {
      en: 'NexGen Digital Solutions',
      fa: 'راهکارهای دیجیتال نکس‌جن (NexGen)'
    },
    location: {
      en: 'Kabul, Afghanistan',
      fa: 'کابل، افغانستان'
    },
    period: {
      en: '2023 - Present',
      fa: '۲۰۲۳ - اکنون'
    },
    current: true,
    description: {
      en: [
        'Architected modern, responsive web applications using React, TypeScript, Tailwind CSS, and Node.js microservices.',
        'Led cross-platform mobile development using Flutter and React Native, achieving over 50,000 active app downloads.',
        'Implemented offline-first synchronization using Firebase Firestore and local SQLite caches for unstable network environments.',
        'Mentored 6 junior software engineers on clean architecture, unit testing, and agile workflows.'
      ],
      fa: [
        'طراحی و پیاده‌سازی معماری نرم‌افزارهای مدرن وب با React، TypeScript، Tailwind CSS و مایکروسرویس‌های Node.js.',
        'رهبری تیم توسعه اپلیکیشن‌های موبایل با Flutter و React Native با بیش از ۵۰,۰۰۰ کاربر فعال.',
        'پیاده‌سازی سیستم هماهنگ‌سازی آفلاین با استفاده از Firebase Firestore و کش‌های محلی SQLite برای شرایط انترنت ضعیف.',
        'راهنمایی و منتورینگ ۶ مهندس نرم‌افزار در زمینه معماری پاک (Clean Architecture)، تست کد و متدولوژی اجایل.'
      ]
    },
    technologies: ['React', 'TypeScript', 'Flutter', 'Tailwind CSS', 'Node.js', 'Firebase', 'GraphQL']
  },
  {
    id: 'exp-2',
    role: {
      en: 'Undergraduate Researcher in Intelligent Systems',
      fa: 'پژوهشگر دوره لیسانس در سیستم‌های هوشمند'
    },
    company: {
      en: 'Computer Science Research Laboratory',
      fa: 'آزمایشگاه پژوهش‌های علوم کامپیوتر'
    },
    location: {
      en: 'Faculty of Computer Science',
      fa: 'دانشکده علوم کامپیوتر'
    },
    period: {
      en: '2022 - 2024',
      fa: '۲۰۲۲ - ۲۰۲۴'
    },
    current: false,
    description: {
      en: [
        'Conducted experimental research on low-resource NLP for Pashto and Persian script text segmentation and morphological analysis.',
        'Authored and presented peer-reviewed academic papers at regional computer science symposiums.',
        'Constructed custom annotated datasets containing over 100,000 tokens for neural tokenization benchmarks.'
      ],
      fa: [
        'انجام پژوهش‌های تجربی در زمینه پردازش زبان طبیعی (NLP) برای تجزیه مورفولوژیکی و تقطیع متون.',
        'نگارش و ارائه مقالات علمی داوری‌شده در سمینارها و کنفرانس‌های بین‌المللی علوم کامپیوتر.',
        'ایجاد مجموعه داده‌های آموزشی با بیش از ۱۰۰,۰۰۰ توکن برای ارزیابی مدل‌های عصبی زبانی.'
      ]
    },
    technologies: ['Python', 'PyTorch', 'Transformers', 'NLTK', 'Data Mining', 'LaTeX']
  },
  {
    id: 'exp-3',
    role: {
      en: 'Mobile Application Developer & Co-Founder',
      fa: 'توسعه‌دهنده اپلیکیشن‌های موبایل و هم‌بنیان‌گذار'
    },
    company: {
      en: 'Malikzai Digital Studio',
      fa: 'استودیو دیجیتال ملک‌زی (Malikzai Studio)'
    },
    location: {
      en: 'Kabul, Afghanistan',
      fa: 'کابل، افغانستان'
    },
    period: {
      en: '2021 - 2023',
      fa: '۲۰۲۱ - ۲۰۲۳'
    },
    current: false,
    description: {
      en: [
        'Founded a boutique digital product studio developing consumer mobile applications and business automation tools.',
        'Shipped 8 commercial mobile applications to Google Play Store and Apple App Store with 4.8-star average ratings.',
        'Integrated multi-gateway payment processing, real-time push notifications, and analytics instrumentation.'
      ],
      fa: [
        'تأسیس استودیوی تولید محصولات دیجیتال برای ساخت اپلیکیشن‌های کاربردی موبایل و ابزارهای اتوماسیون سازمانی.',
        'انتشار ۸ اپلیکیشن تجاری در Google Play و Apple App Store با میانگین امتیاز ۴.۸ از ۵.',
        'اتصال درگاه‌های پرداخت، سیستم نوتیفیکیشن‌های آنی و ابزارهای تحلیلی داده کاربران.'
      ]
    },
    technologies: ['Flutter', 'Dart', 'Firebase', 'RESTful APIs', 'Bloc Pattern', 'UI/UX Design']
  }
];

export const initialEducation: EducationItem[] = [
  {
    id: 'edu-1',
    degree: {
      en: 'Bachelor of Science in Computer Science',
      fa: 'لیسانس علوم کامپیوتر (Computer Science)'
    },
    institution: {
      en: 'Kabul University',
      fa: 'دانشگاه کابل'
    },
    location: {
      en: 'Kabul, Afghanistan',
      fa: 'کابل، افغانستان'
    },
    period: {
      en: '2021 - 2025 (Expected)',
      fa: '۲۰۲۱ - ۲۰۲۵ (در حال تحصیل)'
    },
    gpa: '3.92 / 4.00 (Top 1% of Faculty)',
    honors: {
      en: "Dean's Honor List for 6 Consecutive Semesters | University Scholar Award",
      fa: 'رتبه اول و ستاره علمی در ۶ سمستر متوالی | تقدیرنامه ویژه هیئت علمی دانشگاه'
    },
    coursework: {
      en: [
        'Data Structures & Algorithms',
        'Software Engineering & System Architecture',
        'Database Management Systems',
        'Computer Networks & Protocols',
        'Artificial Intelligence & Machine Learning',
        'Distributed Systems & Cloud Computing'
      ],
      fa: [
        'ساختمان داده‌ها و الگوریتم‌ها',
        'مهندسی نرم‌افزار و معماری سیستم‌ها',
        'سیستم‌های مدیریت پایگاه داده (DBMS)',
        'شبکه‌های کامپیوتری و پروتکل‌های ارتباطی',
        'هوش مصنوعی و یادگیری ماشین (AI/ML)',
        'سیستم‌های توزیع‌شده و محاسبات ابری'
      ]
    }
  },
  {
    id: 'edu-2',
    degree: {
      en: 'High School Diploma (Mathematics & Natural Sciences)',
      fa: 'دیپلوم دوره ثانوی (ریاضیات و علوم ساینسی)'
    },
    institution: {
      en: 'Habibia High School',
      fa: 'لیسه تاریخی حبیبیه'
    },
    location: {
      en: 'Kabul, Afghanistan',
      fa: 'کابل، افغانستان'
    },
    period: {
      en: '2018 - 2021',
      fa: '۲۰۱۸ - ۲۰۲۱'
    },
    gpa: '98.5% (Valedictorian Distinction)',
    honors: {
      en: 'Graduated with Highest Distinction Honors',
      fa: 'فارغ‌التحصیل با رتبه ممتاز و درجه عالی'
    },
    coursework: {
      en: ['Advanced Mathematics', 'Physics & Mechanics', 'Foundations of Programming', 'English & Literature'],
      fa: ['ریاضیات عالی', 'فیزیک و مکانیک', 'مبانی برنامه‌نویسی کامپیوتر', 'زبان و ادبیات بین‌المللی']
    }
  }
];

export const initialSkillCategories: SkillCategory[] = [
  {
    id: 'skill-web',
    name: {
      en: 'Web Technologies',
      fa: 'تکنولوژی‌های وب'
    },
    skills: [
      { name: 'React & React 19', level: 95, badge: 'Expert' },
      { name: 'TypeScript & JavaScript', level: 92, badge: 'Expert' },
      { name: 'Next.js & SSR', level: 88, badge: 'Advanced' },
      { name: 'Tailwind CSS & Styling', level: 95, badge: 'Expert' },
      { name: 'Node.js & Express', level: 86, badge: 'Advanced' },
      { name: 'REST & GraphQL APIs', level: 90, badge: 'Advanced' }
    ]
  },
  {
    id: 'skill-mobile',
    name: {
      en: 'Mobile Development',
      fa: 'توسعه اپلیکیشن موبایل'
    },
    skills: [
      { name: 'Flutter & Dart', level: 94, badge: 'Expert' },
      { name: 'React Native', level: 88, badge: 'Advanced' },
      { name: 'Offline-First Storage', level: 90, badge: 'Advanced' },
      { name: 'State Management (Bloc/Riverpod/Zustand)', level: 92, badge: 'Expert' },
      { name: 'Push Notifications & Deep Linking', level: 85, badge: 'Advanced' },
      { name: 'App Store / Play Store Deployment', level: 88, badge: 'Advanced' }
    ]
  },
  {
    id: 'skill-cs',
    name: {
      en: 'Computer Science & Architecture',
      fa: 'علوم کامپیوتر و معماری سیستم'
    },
    skills: [
      { name: 'Data Structures & Algorithms', level: 90, badge: 'Advanced' },
      { name: 'System Design & Scalability', level: 84, badge: 'Intermediate' },
      { name: 'Relational & NoSQL Databases', level: 88, badge: 'Advanced' },
      { name: 'Software Design Patterns', level: 89, badge: 'Advanced' },
      { name: 'Cybersecurity Fundamentals', level: 80, badge: 'Intermediate' }
    ]
  },
  {
    id: 'skill-research',
    name: {
      en: 'Research, AI & Data',
      fa: 'پژوهش علمی، هوش مصنوعی و داده'
    },
    skills: [
      { name: 'Python & Scientific Computing', level: 88, badge: 'Advanced' },
      { name: 'Natural Language Processing (NLP)', level: 85, badge: 'Advanced' },
      { name: 'Machine Learning Foundations', level: 82, badge: 'Intermediate' },
      { name: 'Academic Writing & LaTeX', level: 92, badge: 'Expert' },
      { name: 'Data Visualization & Analytics', level: 86, badge: 'Advanced' }
    ]
  },
  {
    id: 'skill-tools',
    name: {
      en: 'DevOps & Cloud Ecosystem',
      fa: 'فضای ابری و ابزارهای توسعه (DevOps)'
    },
    skills: [
      { name: 'Firebase (Auth, Firestore, Storage, Rules)', level: 94, badge: 'Expert' },
      { name: 'Git & GitHub Collaboration', level: 95, badge: 'Expert' },
      { name: 'Docker & Containerization', level: 78, badge: 'Intermediate' },
      { name: 'CI/CD Automation Pipelines', level: 82, badge: 'Intermediate' },
      { name: 'Figma UI/UX Prototyping', level: 85, badge: 'Advanced' }
    ]
  }
];

export const initialProjects: ProjectItem[] = [
  {
    id: 'proj-1',
    title: {
      en: 'LangToolkit: Low-Resource Morphological Parser',
      fa: 'کیت پردازش زبان و تجزیه مورفولوژیکی متن'
    },
    description: {
      en: 'An open-source Python library and web playground delivering fast rule-based and neural tokenization, stemmer, and POS tagger tailored for regional languages.',
      fa: 'کتابخانه متن‌باز و پلتفرم تحت وب برای توکنایزیشن عصبی، ریشه‌یابی کلمات و برچسب‌گذاری دستوری واژگان با دقت بالا.'
    },
    category: 'research',
    technologies: ['Python', 'FastAPI', 'React', 'TypeScript', 'PyTorch', 'Tailwind CSS'],
    imageUrl: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=1200&q=80',
    demoUrl: 'https://demo.example.com/pashtonlp',
    githubUrl: 'https://github.com/abdulrazaqhilal/pashto-nlp-toolkit',
    featured: true,
    completedYear: '2024',
    highlights: {
      en: [
        '96.2% accuracy on standard tokenization benchmarks.',
        'Used by 12+ researchers across universities in Central Asia.',
        'Fast WebAssembly inference for client-side evaluation.'
      ],
      fa: [
        'دقت ۹۶.۲٪ در بنچ‌مارک‌های استاندارد ارزیابی دقت کلمات.',
        'مورد استفاده توسط بیش از ۱۲ پژوهشگر در دانشگاه‌های منطقه.',
        'اجرای سریع با WebAssembly برای پردازش محلی روی مرورگر کاربر.'
      ]
    }
  },
  {
    id: 'proj-2',
    title: {
      en: 'Salaam Health: Offline-First Telemedicine Suite',
      fa: 'سلام صحت: سامانه تله‌مدیسین و کلینیک آفلاین'
    },
    description: {
      en: 'A resilient cross-platform mobile and web application enabling healthcare workers in rural areas to record patient charts, sync data seamlessly when connectivity resumes, and generate medical summaries.',
      fa: 'اپلیکیشن مقاوم و دومنظوره موبایل و وب برای ثبت سوابق صحی مریضان در مناطق دوردست بدون نیاز به انترنت دایمی همراه با هماهنگ‌سازی خودکار داده‌ها.'
    },
    category: 'mobile',
    technologies: ['Flutter', 'Dart', 'Firebase', 'SQLite', 'AES Encryption', 'TypeScript'],
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
    demoUrl: 'https://demo.example.com/salaamhealth',
    githubUrl: 'https://github.com/abdulrazaqhilal/salaam-health-offline',
    featured: true,
    completedYear: '2024',
    highlights: {
      en: [
        'Operates 100% offline with peer-to-peer Wi-Fi Direct sync capabilities.',
        'End-to-end encrypted biometric patient data storage.',
        'Awarded 1st place in National University HealthTech Challenge.'
      ],
      fa: [
        'کارکرد ۱۰۰٪ آفلاین همراه با قابلیت هماهنگ‌سازی داده بدون انترنت.',
        'رمزنگاری سرتاسری (End-to-End Encryption) برای حفظ محرمانگی معلومات مریضان.',
        'کسب مقام اول در مسابقات ملی نوآوری‌های تکنالوژی صحی دانشگاه‌ها.'
      ]
    }
  },
  {
    id: 'proj-3',
    title: {
      en: 'KitabX: Bilingual Digital Library & Reader',
      fa: 'کتاب‌ایکس: کتابخانه دیجیتال و پلتفرم مطالعه دوزبانه'
    },
    description: {
      en: 'A high-speed Progressive Web App featuring responsive Arabic/Persian typography, search indexing, audio narration, and offline PDF/EPUB annotations.',
      fa: 'اپلیکیشن تحت وب سریع با خطوط معیاری راست‌چین، موتور جستجوی پیشرفته کتاب‌ها، قابلیت یادداشت‌برداری و مطالعه آفلاین فایل‌های PDF و EPUB.'
    },
    category: 'web',
    technologies: ['React 19', 'Next.js', 'Tailwind CSS', 'IndexedDB', 'PDF.js', 'Service Workers'],
    imageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1200&q=80',
    demoUrl: 'https://demo.example.com/kitabx',
    githubUrl: 'https://github.com/abdulrazaqhilal/kitabx-reader',
    featured: true,
    completedYear: '2023',
    highlights: {
      en: [
        'Over 35,000 monthly active users across academic institutions.',
        'Sub-second search over 10,000 catalogued scientific manuscripts.',
        'Custom ligatures and optimized RTL reading engine.'
      ],
      fa: [
        'بیش از ۳۵,۰۰۰ کاربر فعال ماهانه در مراکز علمی و آموزشی.',
        'جستجوی در کسری از ثانیه در میان بیش از ۱۰,۰۰۰ نسخه و مقاله علمی.',
        'موتور بهینه‌سازی‌شده برای فونت‌ها و کتاب‌خوانی راست‌به‌چپ (RTL).'
      ]
    }
  },
  {
    id: 'proj-4',
    title: {
      en: 'EcoHarvest: Smart Agricultural Advisory App',
      fa: 'اکوهاروست: اپلیکیشن هوشمند مشاور کشاورزی و زراعت'
    },
    description: {
      en: 'Mobile app providing localized weather insights, crop disease diagnostic scans via on-device computer vision, and soil enrichment recommendations in local languages.',
      fa: 'اپلیکیشن هوشمند موبایل که با استفاده از بینایی ماشین، آفات و امراض نباتی را تشخیص داده و راهنمایی‌های زراعتی را به زبان‌های محلی ارایه می‌کند.'
    },
    category: 'product',
    technologies: ['React Native', 'TensorFlow Lite', 'Node.js', 'OpenWeather API', 'Tailwind CSS'],
    imageUrl: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1200&q=80',
    demoUrl: 'https://demo.example.com/ecoharvest',
    githubUrl: 'https://github.com/abdulrazaqhilal/ecoharvest-agri',
    featured: false,
    completedYear: '2023',
    highlights: {
      en: [
        'Integrated lightweight on-device plant leaf disease classification.',
        'Full audio voice guide in local languages for farmers with low literacy.'
      ],
      fa: [
        'تشخیص آنی امراض برگ نباتات به صورت محلی در موبایل بدون نیاز به انترنت.',
        'راهنمای صوتی کامل به زبان‌های محلی برای سهولت استفاده دهاقین.'
      ]
    }
  },
  {
    id: 'proj-5',
    title: {
      en: 'CampusTrack: Academic Attendance & Faculty Portal',
      fa: 'کمپوس‌ترک: سیستم جامع مدیریت تحصیلی و حاضری هوشمند'
    },
    description: {
      en: 'A comprehensive educational management platform featuring QR code automated attendance, grade calculation, dynamic transcript printing, and secure student records.',
      fa: 'سیستم جامع مدیریت اکادمیک با ثبت حاضری هوشمند از طریق کد QR، محاسبه خودکار نمرات، چاپ شقه و کارنامه و نگهداری امن سوابق دانشجویان.'
    },
    category: 'web',
    technologies: ['React', 'Express', 'PostgreSQL', 'Tailwind CSS', 'Docker', 'JWT'],
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    demoUrl: 'https://demo.example.com/campustrack',
    githubUrl: 'https://github.com/abdulrazaqhilal/campustrack-system',
    featured: false,
    completedYear: '2023',
    highlights: {
      en: [
        'Adopted by 3 university academic departments serving 1,400 students.',
        'Reduced grade compilation cycles from weeks to under two hours.'
      ],
      fa: [
        'پیاده‌سازی‌شده در ۳ دیپارتمنت دانشگاهی برای بیش از ۱,۴۰۰ دانشجو.',
        'کاهش زمان جمع‌آوری و نهایی‌سازی نمرات امتحانات از چند هفته به کمتر از دو ساعت.'
      ]
    }
  }
];

export const initialResearchPapers: ResearchPaper[] = [
  {
    id: 'res-1',
    title: {
      en: 'Low-Resource Neural Tokenization and Morphological Segmentation',
      fa: 'توکنایزیشن عصبی و تقطیع مورفولوژیکی در زبان‌های با منابع داده‌ای اندک'
    },
    authors: ['Fayaz Ahmad Malikzai', 'Prof. Mohammad Zahir Rahmani', 'Farhad Noori'],
    venue: {
      en: 'International Conference on Computational Linguistics (ICCL)',
      fa: 'کنفرانس بین‌المللی زبان‌شناسی محاسباتی و هوش مصنوعی'
    },
    year: 2024,
    abstract: {
      en: 'Low-resource languages with complex morphology face notable challenges in modern NLP. In this research, we introduce an adaptive byte-pair encoding pipeline supplemented by linguistic rules that significantly mitigates out-of-vocabulary degradation. Our experimental evaluation demonstrates a 14.8% relative error reduction over standard multilingual BERT tokenizers while preserving computational efficiency on edge mobile devices.',
      fa: 'زبان‌های دارای ساختار مورفولوژیکی پیچیده و منابع دیجیتال محدود با چالش‌های بزرگی در سیستم‌های پردازش زبان طبیعی مواجه هستند. در این پژوهش علمی، ما یک پایپ‌لاین انطباقی را همراه با قواعد زبانی ارایه کرده‌ایم که خطای کلمات ناشناخته را به میزان ۱۴.۸٪ نسبت به مدل‌های استاندارد BERT کاهش داده و قابلیت اجرای روان روی دستگاه‌های موبایل را حفظ می‌کند.'
    },
    keywords: ['Natural Language Processing', 'Computational Linguistics', 'Tokenization', 'Neural Networks', 'Low-Resource Languages'],
    doi: '10.1145/3678901.3678922',
    pdfUrl: 'https://example.com/papers/malikzai-2024-pashto-nlp.pdf',
    codeUrl: 'https://github.com/Fayaz186/pashto-tokenization-research',
    citationCount: 14
  },
  {
    id: 'res-2',
    title: {
      en: 'Fault-Tolerant Asynchronous Data Synchronization for Disconnected Mobile Clinics',
      fa: 'هماهنگ‌سازی ناهمگام و مقاوم داده‌ها برای کلینیک‌های صحی سیار در مناطق بدون انترنت'
    },
    authors: ['Fayaz Ahmad Malikzai', 'Dr. Ahmad Khalid Salimi'],
    venue: {
      en: 'Journal of Distributed Systems and Humanitarian Technology (JDSHT)',
      fa: 'مجله علمی سیستم‌های توزیع‌شده و تکنالوژی‌های بشردوستانه'
    },
    year: 2023,
    abstract: {
      en: 'Deploying digital medical records into regions characterized by severe telecommunication intermittency poses strict data consistency dilemmas. We design and validate an asynchronous conflict-free replicated data type (CRDT) framework explicitly tailored for constrained smart devices. Tested across multi-node mobile simulations, the proposed algorithm eliminates merge conflicts with negligible battery footprint and ensures deterministic convergence upon opportunistic connectivity restoration.',
      fa: 'ثبت و مدیریت دیجیتالی سوابق مریضان در مناطقی که با قطع متواتر ارتباطات مخابراتی روبرو هستند، با چالش همگام‌سازی اطلاعات مواجه است. در این مقاله یک چارچوب داده‌ای مقاوم (CRDT) متناسب با ظرفیت موبایل‌های هوشمند طراحی و آزمایش شد که از بروز تضاد اطلاعات جلوگیری کرده و مصرف بتری را به حداقل می‌رساند.'
    },
    keywords: ['CRDTs', 'Distributed Systems', 'Mobile Health', 'Offline-First', 'Fault Tolerance'],
    doi: '10.1016/j.jdsht.2023.10442',
    pdfUrl: 'https://example.com/papers/malikzai-2023-distributed-mhealth.pdf',
    codeUrl: 'https://github.com/Fayaz186/crdt-mhealth-sync',
    citationCount: 8
  }
];

export const initialMedia: MediaItem[] = [
  {
    id: 'med-1',
    title: {
      en: 'National Hackathon Champion Certificate',
      fa: 'تقدیرنامه و تندیس مقام اول هاکاتون ملی برنامه‌نویسی'
    },
    type: 'certificate',
    url: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&w=1000&q=80',
    caption: {
      en: 'Honored with 1st place in the National University Software Innovation Competition.',
      fa: 'افتخار کسب مقام اول در رقابت‌های ملی نوآوری و طراحی نرم‌افزار دانشگاه‌ها.'
    },
    date: '2024-05-18'
  },
  {
    id: 'med-2',
    title: {
      en: 'Academic Conference Research Presentation',
      fa: 'ارائه مقاله پژوهشی در کنفرانس بین‌المللی علوم کامپیوتر'
    },
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1000&q=80',
    caption: {
      en: 'Presenting research paper on Morphological Tokenization before international delegates.',
      fa: 'عکس ارائه دستاوردهای علمی در حوزه هوش مصنوعی در برابر هیئت داوران و اساتید بین‌المللی.'
    },
    date: '2024-09-12'
  },
  {
    id: 'med-3',
    title: {
      en: 'Google Developer Group Tech Speaker Session',
      fa: 'سخنرانی و تدریس در گردهمایی جامعه توسعه‌دهندگان گوگل (GDG)'
    },
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80',
    caption: {
      en: 'Delivering a technical workshop on "Building Full-Stack TypeScript Apps with Vite and React 19".',
      fa: 'برگزاری ورکشاپ تخصصی درباره ساخت وب‌اپلیکیشن‌های پیشرفته فول‌استک با React 19 و TypeScript.'
    },
    date: '2024-03-24'
  },
  {
    id: 'med-4',
    title: {
      en: 'Certified Cloud Solutions & Security Associate',
      fa: 'گواهی‌نامه بین‌المللی معماری ابری و امنیت سیستم‌ها'
    },
    type: 'certificate',
    url: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=1000&q=80',
    caption: {
      en: 'Professional accreditation in secure cloud deployment and serverless database scaling.',
      fa: 'تصدیق‌نامه تخصصی در پیاده‌سازی امن زیرساخت‌های ابری و مقیاس‌پذیری پایگاه‌های داده.'
    },
    date: '2023-11-05'
  }
];

export const initialAchievements: AchievementItem[] = [
  {
    id: 'ach-1',
    title: {
      en: '1st Place Grand Winner - National Software Hackathon',
      fa: 'مقام اول کشوری - هاکاتون ملی نوآوری‌های نرم‌افزاری'
    },
    organization: {
      en: 'Ministry of Higher Education & Tech Alliance',
      fa: 'وزارت تحصیلات عالی و اتحادیه تکنالوژی'
    },
    date: 'May 2024',
    description: {
      en: 'Awarded first place among 45 university teams for creating the Salaam Health offline-first telemedicine suite.',
      fa: 'کسب مقام نخست از میان ۴۵ تیم دانشگاهی برای ساخت سامانه صحی و کلینیک آفلاین سلام صحت.'
    },
    badge: '1st Place'
  },
  {
    id: 'ach-2',
    title: {
      en: "Dean's Academic Excellence Award (Consecutive Top Rank)",
      fa: 'مدال افتخار علمی ریاست دانشکده (رتبه اول متوالی)'
    },
    organization: {
      en: 'Faculty of Computer Science',
      fa: 'دانشکده علوم کامپیوتر'
    },
    date: '2022 - 2024',
    description: {
      en: 'Recognized as the highest-performing student in the department across 6 consecutive academic terms with 3.92 GPA.',
      fa: 'شناخته‌شده به عنوان دانشجوی برتر دیپارتمنت در ۶ سمستر متوالی با معدل عالی ۳.۹۲ از ۴.۰۰.'
    },
    badge: 'Top 1%'
  },
  {
    id: 'ach-3',
    title: {
      en: 'Google Developer Student Clubs (GDSC) Tech Lead',
      fa: 'رهبر تخنیکی کلوپ دانشجویی توسعه‌دهندگان گوگل (GDSC)'
    },
    organization: {
      en: 'Google Developers Program',
      fa: 'برنامه جهانی توسعه‌دهندگان گوگل'
    },
    date: '2023 - 2024',
    description: {
      en: 'Led 14 technical hands-on bootcamps training over 400 students in Git, Web Development, and Flutter.',
      fa: 'رهبری و تدریس ۱۴ بوت‌کمپ عملی برای آموزش بیش از ۴۰۰ دانشجو در مباحث Git، توسعه وب و Flutter.'
    },
    badge: 'Lead Speaker'
  }
];

export const initialPortfolioData: PortfolioData = {
  profile: initialProfile,
  experiences: initialExperiences,
  education: initialEducation,
  skills: initialSkillCategories,
  projects: initialProjects,
  research: initialResearchPapers,
  media: initialMedia,
  achievements: initialAchievements
};
