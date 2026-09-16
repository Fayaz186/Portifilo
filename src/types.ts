export type Language = 'en' | 'fa';

export interface BilingualText {
  en: string;
  fa: string;
}

export interface BilingualList {
  en: string[];
  fa: string[];
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  googleScholar?: string;
  researchGate?: string;
  youtube?: string;
  email?: string;
  telegram?: string;
  website?: string;
}

export interface ProfileBio {
  name: BilingualText;
  title: BilingualText;
  roles: BilingualList;
  shortBio: BilingualText;
  fullBio: BilingualText;
  location: BilingualText;
  email: string;
  phone: string;
  avatarUrl: string;
  logoUrl?: string;
  resumeDownloadUrl?: string;
  availableForHire: boolean;
  socialLinks: SocialLinks;
  stats: {
    yearsExperience: number;
    projectsCompleted: number;
    researchPapers: number;
  };
  interests: BilingualList;
}

export interface ExperienceItem {
  id: string;
  role: BilingualText;
  company: BilingualText;
  location: BilingualText;
  period: BilingualText;
  current: boolean;
  description: BilingualList;
  technologies: string[];
  certificateUrl?: string;
}

export interface EducationItem {
  id: string;
  degree: BilingualText;
  institution: BilingualText;
  location: BilingualText;
  period: BilingualText;
  gpa?: string;
  honors?: BilingualText;
  coursework: BilingualList;
}

export interface SkillCategory {
  id: string;
  name: BilingualText;
  skills: {
    name: string;
    level: number; // 0 - 100
    iconName?: string;
    badge?: string;
  }[];
}

export interface ProjectItem {
  id: string;
  title: BilingualText;
  description: BilingualText;
  category: 'web' | 'mobile' | 'research' | 'product';
  technologies: string[];
  imageUrl: string;
  demoUrl?: string;
  githubUrl?: string;
  featured: boolean;
  completedYear: string;
  highlights: BilingualList;
}

export interface ResearchPaper {
  id: string;
  title: BilingualText;
  authors: string[];
  venue: BilingualText; // Journal / Conference
  year: number;
  abstract: BilingualText;
  keywords: string[];
  doi?: string;
  pdfUrl?: string;
  codeUrl?: string;
  citationCount?: number;
}

export interface MediaItem {
  id: string;
  title: BilingualText;
  type: 'photo' | 'video' | 'certificate' | 'project';
  url: string;
  thumbnailUrl?: string;
  caption?: BilingualText;
  date: string;
}

export interface AchievementItem {
  id: string;
  title: BilingualText;
  organization: BilingualText;
  date: string;
  description: BilingualText;
  badge?: string;
  credentialUrl?: string;
}

export interface ContactMessage {
  id: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface FirebaseClientConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export interface PortfolioData {
  profile: ProfileBio;
  experiences: ExperienceItem[];
  education: EducationItem[];
  skills: SkillCategory[];
  projects: ProjectItem[];
  research: ResearchPaper[];
  media: MediaItem[];
  achievements: AchievementItem[];
}
