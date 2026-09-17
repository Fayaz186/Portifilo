import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  Menu,
  X,
  FileText,
  Globe,
  Camera
} from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';

interface NavbarProps {
  onOpenResume: () => void;
  customLogoUrl?: string;
  onUploadLogo?: (file: File) => Promise<void>;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenResume,
  customLogoUrl,
  onUploadLogo
}) => {
  const { language, setLanguage, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#about', label: t('navAbout') },
    { href: '#experience', label: t('navExperience') },
    { href: '#education', label: t('navEducation') },
    { href: '#skills', label: t('navSkills') },
    { href: '#projects', label: t('navProjects') },
    { href: '#research', label: t('navResearch') },
    { href: '#media', label: t('navMedia') },
    { href: '#contact', label: t('navContact') },
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'fa' : 'en');
  };

  return (
    <header
      id="main-header"
      className={`sticky top-0 z-40 transition-all duration-300 no-print ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-3'
          : 'bg-white/85 backdrop-blur-xs py-4 border-b border-slate-200/50'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand / Logo */}
        <div id="brand-logo" className="flex items-center gap-2.5 group/logo">
          <div className="relative">
            <BrandLogo customLogoUrl={customLogoUrl} size="md" />
            {onUploadLogo && (
              <label
                title={language === 'fa' ? 'تغییر لوگو' : 'Upload custom logo'}
                className="absolute inset-0 bg-slate-950/70 text-white rounded-xl flex items-center justify-center opacity-0 group-hover/logo:opacity-100 transition-opacity cursor-pointer shadow-md"
              >
                <Camera className="w-4 h-4 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file && onUploadLogo) {
                      await onUploadLogo(file);
                    }
                  }}
                />
              </label>
            )}
          </div>
          <a href="#" className="flex flex-col focus:outline-none">
            <span className="font-bold text-slate-900 leading-tight text-sm sm:text-base tracking-tight group-hover/logo:text-indigo-600 transition-colors line-clamp-1">
              {language === 'fa' ? 'فیاض احمد ملک‌زی' : 'Fayaz Ahmad Malikzai'}
            </span>
            <span className="text-[11px] sm:text-xs text-slate-500 font-medium leading-none hidden xs:block">
              {language === 'fa' ? 'طراح و توسعه‌دهنده وب' : 'Web Designer & Developer'}
            </span>
          </a>
        </div>

        {/* Desktop Navigation - Visible on medium screens and up */}
        <nav id="desktop-nav" className="hidden md:flex items-center gap-0.5 lg:gap-1.5">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-2 py-1 lg:px-2.5 lg:py-1.5 rounded-lg text-xs lg:text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors whitespace-nowrap"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Language Switcher */}
          <button
            id="lang-switcher-btn"
            onClick={toggleLanguage}
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all cursor-pointer shrink-0 min-h-[38px]"
            title="Switch Language"
          >
            <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600" />
            <span>{language === 'en' ? 'دری' : 'English'}</span>
          </button>

          {/* Resume Modal Trigger */}
          <button
            id="resume-trigger-btn"
            onClick={onOpenResume}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs shadow-indigo-200 transition-all cursor-pointer shrink-0 min-h-[38px]"
          >
            <FileText className="w-4 h-4" />
            <span className="hidden xs:inline">{t('navResume')}</span>
            <span className="xs:hidden">CV</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center justify-center gap-1 p-2 rounded-lg text-slate-700 hover:bg-slate-100 cursor-pointer min-h-[40px] min-w-[40px]"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            <span className="text-xs font-semibold hidden xs:inline">{language === 'fa' ? 'منو' : 'Menu'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu-drawer"
          className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3 animate-fadeIn shadow-lg"
        >
          <div className="grid grid-cols-2 gap-2 pt-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-indigo-600 flex items-center min-h-[44px]"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              id="mobile-resume-btn"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenResume();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 text-white font-semibold text-sm shadow-xs min-h-[44px] cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>{t('downloadResume')}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
