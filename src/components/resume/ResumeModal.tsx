import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  ProfileBio,
  ExperienceItem,
  EducationItem,
  SkillCategory,
  ProjectItem,
  ResearchPaper,
  AchievementItem,
  Language
} from '../../types';
import {
  Printer,
  Download,
  X,
  CheckSquare,
  Square,
  Globe,
  Layout,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  FileCode
} from 'lucide-react';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ProfileBio;
  experiences: ExperienceItem[];
  education: EducationItem[];
  skills: SkillCategory[];
  projects: ProjectItem[];
  research: ResearchPaper[];
  achievements: AchievementItem[];
}

export const ResumeModal: React.FC<ResumeModalProps> = ({
  isOpen,
  onClose,
  profile,
  experiences,
  education,
  skills,
  projects,
  research,
  achievements
}) => {
  const { language: siteLang, t } = useLanguage();
  const [cvLang, setCvLang] = useState<Language>(siteLang);
  const [template, setTemplate] = useState<'executive' | 'minimal' | 'academic'>('executive');

  const [sections, setSections] = useState({
    summary: true,
    experience: true,
    education: true,
    skills: true,
    projects: true,
    research: true,
    achievements: true
  });

  if (!isOpen) return null;

  const toggleSection = (key: keyof typeof sections) => {
    setSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportJson = () => {
    const data = {
      profile,
      experiences,
      education,
      skills,
      projects,
      research,
      achievements,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Abdul_Razaq_Hilal_Resume_Data_${cvLang}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const isRTL = cvLang === 'fa';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="relative bg-slate-100 rounded-3xl max-w-5xl w-full my-4 shadow-2xl border border-slate-300 flex flex-col max-h-[96vh] overflow-hidden">
        {/* Modal Top Bar (Controls - Hidden on Print) */}
        <div className="p-4 sm:p-5 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 shrink-0 no-print">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Printer className="w-5 h-5 text-indigo-600" />
              <span>{t('resumeModalTitle')}</span>
            </h2>
            <p className="text-xs text-slate-500">
              {t('resumeSubtitle')}
            </p>
          </div>

          {/* Configuration Controls */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Language Selector */}
            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">
              <button
                onClick={() => setCvLang('en')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  cvLang === 'en' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setCvLang('fa')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  cvLang === 'fa' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                دری
              </button>
            </div>

            {/* Template Selector */}
            <select
              value={template}
              onChange={(e) => setTemplate(e.target.value as any)}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="executive">Modern Executive</option>
              <option value="minimal">Tech Minimalist</option>
              <option value="academic">Academic Scholar</option>
            </select>

            {/* Print / Save as PDF Button */}
            <button
              id="resume-print-btn"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo-200 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>{t('printDownloadPdf')}</span>
            </button>

            {/* JSON Export */}
            <button
              onClick={handleExportJson}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-300 transition-all cursor-pointer"
              title="Backup complete CV data as JSON"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">JSON</span>
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Section Toggles Ribbon (No print) */}
        <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center gap-3 text-xs font-medium text-slate-600 shrink-0 no-print">
          <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
            {t('includeSections')}:
          </span>
          {(['summary', 'experience', 'education', 'skills', 'projects', 'research', 'achievements'] as const).map(sec => (
            <label
              key={sec}
              className="inline-flex items-center gap-1.5 cursor-pointer select-none hover:text-slate-900"
            >
              <input
                type="checkbox"
                checked={sections[sec]}
                onChange={() => toggleSection(sec)}
                className="rounded text-indigo-600 focus:ring-0 cursor-pointer"
              />
              <span className="capitalize">{sec}</span>
            </label>
          ))}
        </div>

        {/* Resume Preview Canvas (Optimized for Screen & Print) */}
        <div className="p-4 sm:p-8 overflow-y-auto flex-1 flex justify-center bg-slate-200/60">
          <div
            id="printable-resume-container"
            dir={isRTL ? 'rtl' : 'ltr'}
            className={`w-full max-w-[210mm] min-h-[297mm] bg-white p-8 sm:p-12 shadow-md print-container transition-all text-slate-800 ${
              template === 'minimal'
                ? 'font-sans'
                : template === 'academic'
                ? 'font-serif'
                : 'font-sans'
            }`}
          >
            {/* Resume Header */}
            <header className="pb-6 border-b-2 border-slate-900 print-avoid-break">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
                    {profile.name[cvLang]}
                  </h1>
                  <p className="text-base sm:text-lg font-bold text-indigo-700 mt-1">
                    {profile.title[cvLang]}
                  </p>
                </div>
                <div className="text-xs text-slate-600 space-y-1 sm:text-right rtl:sm:text-left">
                  <div className="flex items-center sm:justify-end rtl:sm:justify-start gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{profile.email}</span>
                  </div>
                  <div className="flex items-center sm:justify-end rtl:sm:justify-start gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{profile.phone}</span>
                  </div>
                  <div className="flex items-center sm:justify-end rtl:sm:justify-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{profile.location[cvLang]}</span>
                  </div>
                </div>
              </div>

              {/* Roles badge string */}
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-slate-700">
                {profile.roles[cvLang].map((r, i) => (
                  <span key={i} className="after:content-['•'] after:ml-2 rtl:after:mr-2 rtl:after:ml-0 after:text-slate-300 last:after:content-none">
                    {r}
                  </span>
                ))}
              </div>
            </header>

            {/* Resume Body */}
            <div className="pt-6 space-y-6">
              {/* Executive Summary */}
              {sections.summary && (
                 <section className="print-avoid-break space-y-2">
                   <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-1">
                    {cvLang === 'fa' ? 'خلاصه و پروفایل مدیریتی' : 'Executive Profile & Summary'}
                   </h2>
                   <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                     {profile.fullBio[cvLang]}
                   </p>
                 </section>
               )}

              {/* Professional Experience */}
              {sections.experience && (
                <section className="space-y-4">
                  <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-1">
                    {cvLang === 'fa' ? 'تجربیات حرفه‌ای و کاری' : 'Professional Experience'}
                  </h2>
                  <div className="space-y-4">
                    {experiences.map((exp) => (
                      <div key={exp.id} className="print-avoid-break space-y-1.5">
                        <div className="flex items-baseline justify-between text-xs sm:text-sm">
                          <div>
                            <span className="font-bold text-slate-900">{exp.role[cvLang]}</span>
                            <span className="text-slate-500"> &bull; </span>
                            <span className="font-semibold text-indigo-700">{exp.company[cvLang]}</span>
                          </div>
                          <span className="text-xs font-medium text-slate-500">{exp.period[cvLang]}</span>
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 leading-relaxed">
                          {exp.description[cvLang].map((b, bIdx) => (
                            <li key={bIdx}>{b}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Academic Education */}
              {sections.education && (
                <section className="space-y-4 print-avoid-break">
                  <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-1">
                    {cvLang === 'fa' ? 'تحصیلات اکادمیک' : 'Education'}
                  </h2>
                  <div className="space-y-3">
                    {education.map((edu) => (
                      <div key={edu.id} className="space-y-1 text-xs sm:text-sm">
                        <div className="flex items-baseline justify-between">
                          <div>
                            <span className="font-bold text-slate-900">{edu.degree[cvLang]}</span>
                            <span className="text-slate-500"> &bull; </span>
                            <span className="font-semibold text-indigo-700">{edu.institution[cvLang]}</span>
                          </div>
                          <span className="text-xs text-slate-500">{edu.period[cvLang]}</span>
                        </div>
                        {edu.gpa && (
                          <div className="text-xs text-slate-600 font-medium">
                            <span className="font-bold">GPA: </span>{edu.gpa}
                          </div>
                        )}
                        {edu.honors && (
                          <div className="text-xs text-amber-800 font-medium">
                            {edu.honors[cvLang]}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Skills */}
              {sections.skills && (
                <section className="print-avoid-break space-y-2">
                  <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-1">
                    {cvLang === 'fa' ? 'مهارت‌های تخنیکی و ابزارها' : 'Technical Skills & Toolchain'}
                  </h2>
                  <div className="space-y-2 text-xs">
                    {skills.map((cat) => (
                      <div key={cat.id} className="flex flex-wrap items-baseline gap-1.5">
                        <span className="font-bold text-slate-900 min-w-[140px]">
                          {cat.name[cvLang]}:
                        </span>
                        <span className="text-slate-700">
                          {cat.skills.map(s => s.name).join(', ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Academic Research */}
              {sections.research && research.length > 0 && (
                <section className="space-y-3 print-avoid-break">
                  <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-1">
                    {cvLang === 'fa' ? 'پژوهش‌ها و مقالات علمی' : 'Academic Research & Publications'}
                  </h2>
                  <div className="space-y-2.5">
                    {research.map((paper) => (
                      <div key={paper.id} className="text-xs text-slate-700 space-y-1">
                        <div className="font-bold text-slate-900">
                          &ldquo;{paper.title[cvLang]}&rdquo; ({paper.year})
                        </div>
                        <div className="text-slate-600 italic">
                          {paper.authors.join(', ')} &mdash; {paper.venue[cvLang]}
                        </div>
                        {paper.doi && (
                          <div className="text-[11px] font-mono text-indigo-700">
                            DOI: {paper.doi}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Featured Projects */}
              {sections.projects && projects.length > 0 && (
                <section className="space-y-3 print-avoid-break">
                  <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-1">
                    {cvLang === 'fa' ? 'پروژه‌های منتخب' : 'Selected Digital Projects'}
                  </h2>
                  <div className="space-y-2.5">
                    {projects.slice(0, 4).map((proj) => (
                      <div key={proj.id} className="text-xs space-y-0.5">
                        <div className="flex items-baseline justify-between">
                          <span className="font-bold text-slate-900">{proj.title[cvLang]}</span>
                          <span className="text-slate-500 font-mono text-[11px]">{proj.completedYear}</span>
                        </div>
                        <p className="text-slate-600 text-xs">
                          {proj.description[cvLang]}
                        </p>
                        <div className="text-[11px] text-indigo-700 font-semibold">
                          Tech: {proj.technologies.join(', ')}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Honors & Hackathon Achievements */}
              {sections.achievements && achievements.length > 0 && (
                <section className="space-y-2 print-avoid-break">
                  <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-1">
                    {cvLang === 'fa' ? 'افتخارات و جوایز' : 'Key Honors & Awards'}
                  </h2>
                  <div className="space-y-1.5 text-xs">
                    {achievements.map((ach) => (
                      <div key={ach.id} className="flex items-baseline justify-between">
                        <div>
                          <span className="font-bold text-slate-900">{ach.title[cvLang]}</span>
                          <span className="text-slate-500"> &mdash; {ach.organization[cvLang]}</span>
                        </div>
                        <span className="text-slate-500 font-medium">{ach.date}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
