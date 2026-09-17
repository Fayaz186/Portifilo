import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';
import { ProfileBio } from '../../types';
import {
  FileText,
  Briefcase,
  Mail,
  Github,
  Linkedin,
  Twitter,
  BookOpen,
  MapPin,
  Sparkles,
  ArrowDown,
  Camera,
  Upload,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { uploadPortfolioAsset, saveProfile } from '../../services/storageService';
import { compressImageFile } from '../../utils/imageCompressor';

interface HeroSectionProps {
  profile: ProfileBio;
  onOpenResume: () => void;
  onUpdateProfile?: (updated: ProfileBio) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ profile, onOpenResume, onUpdateProfile }) => {
  const { language, t } = useLanguage();
  const [activeRoleIndex, setActiveRoleIndex] = useState(0);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    setUploadSuccess(false);

    try {
      // 1. Try Supabase Storage first
      let photoUrl = '';
      try {
        const res = await uploadPortfolioAsset(file, 'profile-photos');
        if (!res.isFallback && res.url) {
          photoUrl = res.url;
        }
      } catch (err) {
        console.warn('Supabase storage upload failed, using optimized local compression fallback:', err);
      }

      // 2. If no cloud storage URL, compress locally to a lightweight high-quality Data URL (under 100KB)
      if (!photoUrl) {
        photoUrl = await compressImageFile(file, 800, 800, 0.85);
      }

      // 3. Save to profile
      const updatedProfile = { ...profile, avatarUrl: photoUrl };
      await saveProfile(updatedProfile);
      if (onUpdateProfile) {
        onUpdateProfile(updatedProfile);
      }

      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 4000);
    } catch (err: any) {
      console.error('Failed to update profile photo:', err);
    } finally {
      setIsUploadingPhoto(false);
      // Reset input value
      e.target.value = '';
    }
  };

  const defaultRoles = {
    en: ['Web Designer', 'Web Developer', 'Computer Science Student'],
    fa: ['طراح وب', 'توسعه‌دهنده وب', 'دانشجوی علوم کامپیوتر']
  };

  const roles = (profile.roles?.[language]?.length === 3)
    ? profile.roles[language]
    : defaultRoles[language];

  useEffect(() => {
    setActiveRoleIndex(0);
  }, [language]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveRoleIndex((prev) => (prev + 1) % roles.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [roles.length]);

  return (
    <section
      id="hero"
      className="relative pt-10 pb-16 md:pt-14 md:pb-20 overflow-hidden border-b border-slate-200/80 bg-gradient-to-b from-slate-50 via-white to-slate-50/50"
    >
      {/* Decorative background grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f015_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f015_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            {/* Availability Pill */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold shadow-xs"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>{t('availableBadge')}</span>
            </motion.div>

            {/* Main Name & Title */}
            <div className="space-y-2">
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] break-words"
              >
                {profile.name[language]}
              </motion.h1>

              {/* Dynamic Rotating Role */}
              <div className="min-h-[2.75rem] py-1 flex flex-wrap items-center gap-2">
                <span className="text-base sm:text-lg font-semibold text-slate-500">
                  {language === 'fa' ? 'تخصص و نقش:' : 'I am a'}
                </span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={activeRoleIndex + language}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                    className="text-base sm:text-lg font-bold text-indigo-600 bg-indigo-50/80 px-2.5 py-1 rounded-md border border-indigo-100 break-words"
                  >
                    {roles[activeRoleIndex]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>

            {/* Short Bio */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal"
            >
              {profile.shortBio[language]}
            </motion.p>

            {/* Location & Contact Meta */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-slate-500 font-medium">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="break-words">{profile.location[language]}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="break-all">{profile.email}</span>
              </div>
            </div>

            {/* Call to action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col xs:flex-row flex-wrap items-stretch xs:items-center gap-3 pt-2 w-full xs:w-auto"
            >
              <button
                id="hero-resume-btn"
                onClick={onOpenResume}
                className="w-full xs:w-auto flex items-center justify-center gap-2 px-5 py-3 xs:py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-200 transition-all hover:translate-y-[-1px] cursor-pointer min-h-[44px]"
              >
                <FileText className="w-4 h-4" />
                <span>{t('downloadResume')}</span>
              </button>

              <a
                id="hero-projects-btn"
                href="#projects"
                className="w-full xs:w-auto flex items-center justify-center gap-2 px-5 py-3 xs:py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm border border-slate-300 shadow-xs transition-all hover:border-slate-400 cursor-pointer min-h-[44px]"
              >
                <Briefcase className="w-4 h-4 text-indigo-600" />
                <span>{t('viewProjects')}</span>
              </a>

              <a
                id="hero-contact-btn"
                href="#contact"
                className="w-full xs:w-auto flex items-center justify-center gap-2 px-4 py-3 xs:py-2.5 rounded-xl text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors min-h-[44px]"
              >
                <span>{t('contactMe')}</span>
                <span className="rtl:rotate-180">&rarr;</span>
              </a>
            </motion.div>

            {/* Social Links Row */}
            <div className="pt-2 flex items-center gap-2.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mr-1 rtl:mr-0 rtl:ml-1">
                {language === 'fa' ? 'شبکه‌ها و ارتباطات:' : 'Profiles:'}
              </span>
              {profile.socialLinks.github && (
                <a
                  href={profile.socialLinks.github}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 transition-colors"
                  title="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {profile.socialLinks.linkedin && (
                <a
                  href={profile.socialLinks.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 transition-colors"
                  title="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {profile.socialLinks.twitter && (
                <a
                  href={profile.socialLinks.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 transition-colors"
                  title="Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {profile.socialLinks.googleScholar && (
                <a
                  href={profile.socialLinks.googleScholar}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 transition-colors"
                  title="Google Scholar"
                >
                  <BookOpen className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Right Column: Visual Portrait & Badges */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative max-w-md w-full">
              {/* Outer Glow Ring */}
              <div className="absolute -inset-1.5 bg-gradient-to-tr from-indigo-600 via-sky-500 to-indigo-400 rounded-3xl blur-sm opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>

              <div className="relative bg-white p-3 sm:p-4 rounded-3xl shadow-xl border border-slate-200/90 overflow-hidden">
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-slate-100 group">
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name[language]}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/fayaz.jpeg';
                    }}
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
                  />

                  {/* Photo Change Action Overlay / Badge */}
                  <label
                    title={language === 'fa' ? 'تغییر عکس پروفایل' : 'Change profile photo'}
                    className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/85 hover:bg-slate-900 text-white backdrop-blur-md text-xs font-semibold shadow-lg transition-all cursor-pointer border border-white/20 hover:scale-105"
                  >
                    {isUploadingPhoto ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                        <span>{language === 'fa' ? 'در حال آپلود...' : 'Updating...'}</span>
                      </>
                    ) : uploadSuccess ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{language === 'fa' ? 'عکس ذخیره شد!' : 'Updated!'}</span>
                      </>
                    ) : (
                      <>
                        <Camera className="w-3.5 h-3.5 text-indigo-300" />
                        <span>{language === 'fa' ? 'تغییر عکس' : 'Change Photo'}</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoSelect}
                      disabled={isUploadingPhoto}
                    />
                  </label>

                  {/* Subtle gradient overlay at bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none"></div>

                  <div className="absolute bottom-4 left-4 right-4 text-white pointer-events-none">
                    <p className="font-bold text-lg leading-tight">
                      {profile.name[language]}
                    </p>
                    <p className="text-xs text-slate-200 line-clamp-1">
                      {profile.title[language]}
                    </p>
                  </div>
                </div>

                {/* Floating mini stats badge */}
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="text-xl font-bold text-slate-900">
                      {profile.stats.projectsCompleted}+
                    </div>
                    <div className="text-xs text-slate-500 font-medium">
                      {t('completedProjects')}
                    </div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="text-xl font-bold text-indigo-600">
                      {profile.stats.researchPapers}
                    </div>
                    <div className="text-xs text-slate-500 font-medium">
                      {t('publishedResearch')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Metrics Strip */}
        <div className="mt-10 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 p-4 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="text-center sm:text-left rtl:sm:text-right border-b sm:border-b-0 sm:border-r rtl:sm:border-r-0 rtl:sm:border-l border-slate-100 p-2 sm:p-3">
            <div className="text-3xl font-extrabold text-slate-900">
              {profile.stats.yearsExperience}+
            </div>
            <div className="text-xs text-slate-500 font-medium mt-1">
              {t('yearsExp')}
            </div>
          </div>

          <div className="text-center md:text-left rtl:md:text-right border-b sm:border-b-0 sm:border-r rtl:sm:border-r-0 rtl:sm:border-l border-slate-100 p-2">
            <div className="text-3xl font-extrabold text-indigo-600">
              {profile.stats.projectsCompleted}+
            </div>
            <div className="text-xs text-slate-500 font-medium mt-1">
              {t('completedProjects')}
            </div>
          </div>

          <div className="text-center md:text-left rtl:md:text-right p-2">
            <div className="text-3xl font-extrabold text-slate-900">
              {profile.stats.researchPapers}
            </div>
            <div className="text-xs text-slate-500 font-medium mt-1">
              {t('publishedResearch')}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
