import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ProfileBio, AchievementItem } from '../../types';
import {
  Award,
  BookOpen,
  Target,
  Sparkles,
  Compass,
  CheckCircle2
} from 'lucide-react';

interface AboutSectionProps {
  profile: ProfileBio;
  achievements: AchievementItem[];
}

export const AboutSection: React.FC<AboutSectionProps> = ({ profile, achievements }) => {
  const { language, t } = useLanguage();

  return (
    <section id="about" className="scroll-mt-28 py-12 sm:py-20 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="max-w-3xl mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>{language === 'fa' ? 'درباره من و بیوگرافی' : 'About Me'}</span>
          </div>
          <h2 className="text-2xl xs:text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t('aboutTitle')}
          </h2>
          <p className="mt-2 text-sm sm:text-base md:text-lg text-slate-600">
            {t('aboutSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Main Biography Text */}
          <div className="lg:col-span-7 space-y-6">
            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed text-sm sm:text-base space-y-4">
              <p className="font-medium text-slate-800 text-base sm:text-lg">
                {profile.title[language]}
              </p>
              <p>
                {profile.fullBio[language]}
              </p>
              <p>
                {language === 'fa'
                  ? 'من بر این باورم که نرم‌افزار اثرگذار در نقطه تلاقی اصول دقیق علوم کامپیوتر و نیازهای واقعی انسان‌ها شکل می‌گیرد. هدف من همواره ایجاد نرم‌افزارهایی با رابط کاربری روان، سریع و با قابلیت کارکرد در شرایط انترنت ضعیف یا آفلاین بوده است تا تکنالوژی به شکلی عادلانه در دسترس همگان قرار گیرد.'
                  : 'I believe impactful software is forged at the intersection of rigorous computer science principles and intuitive human design. Whether architecting resilient offline-first mobile synchronization or engineering open-source neural NLP tools for underserved languages, my objective remains centered on technological equity and practical societal utility.'}
              </p>
            </div>

            {/* Core Interests Tags */}
            <div className="pt-2">
              <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-800 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>{language === 'fa' ? 'علاقه‌مندی‌های پژوهشی و تخصصی' : 'Research & Domain Interests'}</span>
              </h4>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {profile.interests[language].map((interest, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-colors"
                  >
                    <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-indigo-600 shrink-0" />
                    <span>{interest}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Key Achievements & Honors Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-50/80 p-4 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-600" />
                <span>{language === 'fa' ? 'افتخارات و دستاوردهای برجسته' : 'Key Honors & Achievements'}</span>
              </h3>

              <div className="space-y-3 sm:space-y-4">
                {achievements.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 sm:p-3.5 rounded-xl bg-white border border-slate-200/70 hover:border-indigo-300 transition-all shadow-xs"
                  >
                    <div className="flex flex-col xs:flex-row xs:items-start justify-between gap-1.5">
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                        {item.title[language]}
                      </h4>
                      {item.badge && (
                        <span className="self-start shrink-0 text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-indigo-600 font-semibold mt-1">
                      {item.organization[language]} &bull; {item.date}
                    </div>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                      {item.description[language]}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
