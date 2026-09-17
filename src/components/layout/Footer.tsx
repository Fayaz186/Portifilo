import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ProfileBio } from '../../types';
import {
  Github,
  Linkedin,
  Twitter,
  BookOpen,
  Mail,
  Send,
  Youtube,
  ArrowUp,
  Heart
} from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';

interface FooterProps {
  profile: ProfileBio;
  onOpenResume: () => void;
}

export const Footer: React.FC<FooterProps> = ({ profile, onOpenResume }) => {
  const { language, t } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="main-footer" className="bg-slate-950 text-slate-300 pt-12 sm:pt-16 pb-8 sm:pb-12 border-t border-slate-800 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 pb-10 sm:pb-12 border-b border-slate-800/80">
          {/* Col 1: Bio */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <BrandLogo customLogoUrl={profile.logoUrl} size="md" />
              <span className="font-bold text-white text-lg tracking-tight">
                {profile.name[language]}
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed line-clamp-3">
              {profile.shortBio[language]}
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{t('availableBadge')}</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
              {language === 'fa' ? 'بخش‌های پرکاربرد' : 'Quick Navigation'}
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <a href="#about" className="hover:text-indigo-400 transition-colors">
                  {t('navAbout')}
                </a>
              </li>
              <li>
                <a href="#projects" className="hover:text-indigo-400 transition-colors">
                  {t('navProjects')}
                </a>
              </li>
              <li>
                <a href="#research" className="hover:text-indigo-400 transition-colors">
                  {t('navResearch')}
                </a>
              </li>
              <li>
                <a href="#media" className="hover:text-indigo-400 transition-colors">
                  {t('navMedia')}
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenResume}
                  className="hover:text-indigo-400 transition-colors text-left rtl:text-right cursor-pointer"
                >
                  {t('navResume')}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Research & Interests */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
              {language === 'fa' ? 'زمینه‌های تخصصی و نقش‌ها' : 'Core Disciplines'}
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {profile.roles[language].map((role, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2.5 py-1 rounded-md bg-slate-900 text-slate-300 border border-slate-800"
                >
                  {role}
                </span>
              ))}
            </div>
            <p className="text-xs text-slate-500 pt-2">
              {profile.location[language]}
            </p>
          </div>

          {/* Col 4: Connect & Socials */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
              {language === 'fa' ? 'شبکه‌های اجتماعی و ارتباط' : 'Connect & Socials'}
            </h4>
            <div className="flex flex-wrap gap-2">
              {profile.socialLinks.github && (
                <a
                  href={profile.socialLinks.github}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                  aria-label="GitHub Profile"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {profile.socialLinks.linkedin && (
                <a
                  href={profile.socialLinks.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {profile.socialLinks.twitter && (
                <a
                  href={profile.socialLinks.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                  aria-label="X / Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {profile.socialLinks.googleScholar && (
                <a
                  href={profile.socialLinks.googleScholar}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                  aria-label="Google Scholar"
                >
                  <BookOpen className="w-4 h-4" />
                </a>
              )}
              {profile.socialLinks.youtube && (
                <a
                  href={profile.socialLinks.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                  aria-label="YouTube Channel"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
              {profile.socialLinks.telegram && (
                <a
                  href={profile.socialLinks.telegram}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                  aria-label="Telegram"
                >
                  <Send className="w-4 h-4" />
                </a>
              )}
              <a
                href={`mailto:${profile.email}`}
                className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Send Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
            <p className="text-xs text-slate-400 break-all">
              {profile.email}
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 text-center sm:text-left rtl:sm:text-right">
          <div>
            &copy; {new Date().getFullYear()} {profile.name[language]}. All rights reserved.
          </div>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 sm:gap-4">
            <span>React &bull; TypeScript &bull; Tailwind CSS &bull; Firebase</span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
