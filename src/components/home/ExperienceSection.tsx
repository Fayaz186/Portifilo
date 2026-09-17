import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ExperienceItem, EducationItem } from '../../types';
import {
  Briefcase,
  GraduationCap,
  Calendar,
  MapPin,
  CheckCircle,
  ExternalLink,
  Award
} from 'lucide-react';

interface ExperienceSectionProps {
  experiences: ExperienceItem[];
  education: EducationItem[];
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experiences, education }) => {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'experience' | 'education'>('experience');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#education') {
        setActiveTab('education');
      } else if (hash === '#experience') {
        setActiveTab('experience');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <section id="experience" className="scroll-mt-28 py-12 sm:py-20 bg-slate-50/60 border-b border-slate-200/80">
      <div id="education" className="scroll-mt-28" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-3">
              <Briefcase className="w-3.5 h-3.5" />
              <span>{language === 'fa' ? 'پیشینه کاری و اکادمیک' : 'Career & Academia'}</span>
            </div>
            <h2 className="text-2xl xs:text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {activeTab === 'experience' ? t('experienceTitle') : t('educationTitle')}
            </h2>
            <p className="mt-2 text-sm sm:text-base md:text-lg text-slate-600">
              {activeTab === 'experience' ? t('experienceSubtitle') : t('educationSubtitle')}
            </p>
          </div>

          {/* Toggle Tabs */}
          <div className="w-full sm:w-auto grid grid-cols-2 sm:inline-flex p-1 rounded-xl bg-slate-200/80 border border-slate-300/60 self-stretch sm:self-auto shrink-0">
            <button
              onClick={() => setActiveTab('experience')}
              className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'experience'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Briefcase className="w-4 h-4 text-indigo-600" />
              <span>{t('navExperience')}</span>
            </button>
            <button
              onClick={() => setActiveTab('education')}
              className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'education'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-indigo-600" />
              <span>{t('navEducation')}</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Experience Timeline */}
        {activeTab === 'experience' && (
          <div className="space-y-4 sm:space-y-6">
            {experiences.map((exp, index) => (
              <div
                key={exp.id}
                className="bg-white rounded-2xl p-4 sm:p-8 border border-slate-200/80 shadow-xs hover:border-indigo-200 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                        {exp.role[language]}
                      </h3>
                      {exp.current && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {language === 'fa' ? 'شغل فعلی / فعال' : 'Present / Active'}
                        </span>
                      )}
                    </div>
                    <div className="text-sm font-semibold text-indigo-600 mt-1">
                      {exp.company[language]}
                    </div>
                  </div>

                  <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-1.5 sm:gap-2 text-xs text-slate-500 font-medium">
                    <span className="inline-flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-md">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {exp.period[language]}
                    </span>
                    <span className="inline-flex items-center gap-1 text-slate-400">
                      <MapPin className="w-3.5 h-3.5" />
                      {exp.location[language]}
                    </span>
                  </div>
                </div>

                {/* Bullets */}
                <div className="pt-4 space-y-2.5">
                  {exp.description[language].map((bullet, bIdx) => (
                    <div key={bIdx} className="flex items-start gap-3 text-sm text-slate-600 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>

                {/* Tech Badges */}
                <div className="pt-5 flex flex-wrap items-center gap-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2 rtl:mr-0 rtl:ml-2">
                    {language === 'fa' ? 'تکنالوژی‌ها:' : 'Stack:'}
                  </span>
                  {exp.technologies.map((tech, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2.5 py-1 rounded-md bg-slate-50 text-slate-700 text-xs font-medium border border-slate-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Education Cards */}
        {activeTab === 'education' && (
          <div className="space-y-4 sm:space-y-6" id="education">
            {education.map((edu) => (
              <div
                key={edu.id}
                className="bg-white rounded-2xl p-4 sm:p-8 border border-slate-200/80 shadow-xs hover:border-indigo-200 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                      {edu.degree[language]}
                    </h3>
                    <div className="text-sm font-semibold text-indigo-600 mt-1">
                      {edu.institution[language]}
                    </div>
                  </div>

                  <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-1.5 sm:gap-2 text-xs text-slate-500 font-medium">
                    <span className="inline-flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-md">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {edu.period[language]}
                    </span>
                    <span className="text-slate-400">
                      {edu.location[language]}
                    </span>
                  </div>
                </div>

                {edu.gpa && (
                  <div className="pt-4 flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      {language === 'fa' ? 'نمرات / معدل:' : 'GPA & Standing:'}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200">
                      {edu.gpa}
                    </span>
                  </div>
                )}

                {edu.honors && (
                  <div className="mt-2 p-3 rounded-xl bg-amber-50/70 border border-amber-200/70 text-amber-900 text-xs sm:text-sm flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{edu.honors[language]}</span>
                  </div>
                )}

                {/* Coursework */}
                <div className="pt-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    {language === 'fa' ? 'مضامین و بخش‌های تحصیلی:' : 'Relevant Coursework & Studies:'}
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {edu.coursework[language].map((course, cIdx) => (
                      <span
                        key={cIdx}
                        className="px-2.5 py-1 rounded-md bg-slate-50 text-slate-700 text-xs font-medium border border-slate-200"
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
