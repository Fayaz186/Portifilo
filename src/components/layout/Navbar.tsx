import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import {
  Menu,
  X,
  FileText,
  Globe,
  Lock,
  UserCheck,
  Code2,
  Sparkles,
  Camera
} from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';

interface NavbarProps {
  onOpenResume: () => void;
  onOpenAdmin: () => void;
  customLogoUrl?: string;
  onUploadLogo?: (file: File) => Promise<void>;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenResume,
  onOpenAdmin,
  customLogoUrl,
  onUploadLogo
}) => {
  const { language, setLanguage, t, isRTL } = useLanguage();
  const { isAdmin } = useAuth();
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
            <span className="font-bold text-slate-900 leading-tight text-base tracking-tight group-hover/logo:text-indigo-600 transition-colors">
              {language === 'fa' ? 'عبدالرازق هلال' : 'Abdul Razaq Hilal'}
            </span>
            <span className="text-xs text-slate-500 font-medium leading-none">
              {language === 'fa' ? 'مهندس نرم‌افزار و پژوهشگر' : 'Software Engineer & Researcher'}
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
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Language Switcher */}
          <button
            id="lang-switcher-btn"
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all cursor-pointer"
            title="Switch Language"
          >
            <Globe className="w-4 h-4 text-indigo-600" />
            <span>{language === 'en' ? 'دری' : 'English'}</span>
          </button>

          {/* Resume Modal Trigger */}
          <button
            id="resume-trigger-btn"
            onClick={onOpenResume}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>{t('navResume')}</span>
          </button>

          {/* Admin Button */}
          <button
            id="admin-trigger-btn"
            onClick={onOpenAdmin}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium border transition-all cursor-pointer ${
              isAdmin
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
            title={isAdmin ? 'Admin Dashboard Active' : 'Admin Login'}
          >
            {isAdmin ? (
              <>
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden md:inline">{language === 'fa' ? 'مدیر' : 'Admin'}</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden md:inline">{t('adminLogin')}</span>
              </>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center gap-1 p-2 rounded-lg text-slate-700 hover:bg-slate-100 cursor-pointer"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            <span className="text-xs font-semibold">{language === 'fa' ? 'منو' : 'Menu'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu-drawer"
          className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2 animate-fadeIn shadow-lg"
        >
          <div className="grid grid-cols-2 gap-2 pt-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-indigo-600"
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
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-indigo-600 text-white font-medium text-sm shadow-sm"
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
