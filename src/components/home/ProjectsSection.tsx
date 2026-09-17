import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ProjectItem } from '../../types';
import { EmptyState } from '../common/EmptyState';
import {
  ExternalLink,
  Github,
  CheckCircle2,
  FolderGit2,
  X,
  Sparkles
} from 'lucide-react';

interface ProjectsSectionProps {
  projects: ProjectItem[];
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects }) => {
  const { language, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeModalProject, setActiveModalProject] = useState<ProjectItem | null>(null);

  const categories = [
    { id: 'all', label: language === 'fa' ? 'تمام پروژه‌ها' : 'All Projects' },
    { id: 'web', label: language === 'fa' ? 'پلتفرم‌های وب' : 'Web Platforms' },
    { id: 'mobile', label: language === 'fa' ? 'اپلیکیشن‌های موبایل' : 'Mobile Apps' },
    { id: 'research', label: language === 'fa' ? 'پژوهش و هوش مصنوعی' : 'Research & NLP' },
    { id: 'product', label: language === 'fa' ? 'محصولات دیجیتال' : 'Digital Products' }
  ];

  const filteredProjects = selectedCategory === 'all'
    ? projects
    : projects.filter(p => p.category === selectedCategory);

  return (
    <section id="projects" className="scroll-mt-28 py-12 sm:py-20 bg-slate-50/60 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-4 sm:gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-3">
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>{language === 'fa' ? 'پروژه‌ها و نوآوری‌ها' : 'Shipped Work'}</span>
            </div>
            <h2 className="text-2xl xs:text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {t('projectsTitle')}
            </h2>
            <p className="mt-2 text-sm sm:text-base md:text-lg text-slate-600">
              {t('projectsSubtitle')}
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-2 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`shrink-0 whitespace-nowrap px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer min-h-[38px] ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid or Empty State */}
        {filteredProjects.length === 0 ? (
          <EmptyState
            icon={FolderGit2}
            title={{ en: 'No projects match this category', fa: 'در این دسته‌بندی پروژه‌ای یافت نشد' }}
            description={{
              en: 'Try selecting another category or check back soon for recent project additions.',
              fa: 'دسته‌بندی دیگری را انتخاب کنید یا دوباره بررسی فرمایید.'
            }}
            actionLabel={{ en: 'Show All Projects', fa: 'نمایش تمام پروژه‌ها' }}
            onAction={() => setSelectedCategory('all')}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all flex flex-col"
            >
              {/* Image Preview Container */}
              <div
                className="relative aspect-[16/10] bg-slate-100 overflow-hidden cursor-pointer"
                onClick={() => setActiveModalProject(project)}
              >
                <img
                  src={project.imageUrl}
                  alt={project.title[language]}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3 flex gap-2">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-slate-900/80 backdrop-blur-xs text-white">
                    {project.category}
                  </span>
                  {project.featured && (
                    <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-600 text-white flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Featured
                    </span>
                  )}
                </div>
                <div className="absolute bottom-3 right-3 rtl:right-auto rtl:left-3 px-2 py-0.5 rounded-md bg-white/90 text-slate-800 text-xs font-bold shadow-xs">
                  {project.completedYear}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3
                    onClick={() => setActiveModalProject(project)}
                    className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors cursor-pointer"
                  >
                    {project.title[language]}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                    {project.description[language]}
                  </p>
                </div>

                {/* Tech Stack Chips */}
                <div className="pt-2">
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.slice(0, 4).map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-xs font-medium">
                        +{project.technologies.length - 4}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Action Links */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setActiveModalProject(project)}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                  >
                    {language === 'fa' ? 'مشاهده جزییات' : 'View Details & Metrics'} &rarr;
                  </button>

                  <div className="flex items-center gap-3">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-500 hover:text-slate-900 transition-colors"
                        title="View GitHub Repository"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-500 hover:text-indigo-600 transition-colors"
                        title="Live Demo"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          </div>
        )}
      </div>

      {/* Project Details Modal */}
      {activeModalProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="relative bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200">
            <button
              onClick={() => setActiveModalProject(null)}
              className="absolute top-5 right-5 rtl:right-auto rtl:left-5 p-2 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-6">
              <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-slate-100">
                <img
                  src={activeModalProject.imageUrl}
                  alt={activeModalProject.title[language]}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md">
                    {activeModalProject.category}
                  </span>
                  <span className="text-xs text-slate-500">
                    &bull; Completed {activeModalProject.completedYear}
                  </span>
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900">
                  {activeModalProject.title[language]}
                </h3>
              </div>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {activeModalProject.description[language]}
              </p>

              {/* Key Highlights */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  {language === 'fa' ? 'ویژگی‌های برجسته و دستاوردها:' : 'Key Engineering Highlights:'}
                </h4>
                <div className="space-y-2">
                  {activeModalProject.highlights[language].map((highlight, hIdx) => (
                    <div key={hIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech Stack */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  {language === 'fa' ? 'تکنالوژی‌های استفاده‌شده:' : 'Technologies Used:'}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeModalProject.technologies.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-semibold"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-100 flex flex-col xs:flex-row items-stretch xs:items-center gap-2.5 sm:gap-3">
                {activeModalProject.demoUrl && (
                  <a
                    href={activeModalProject.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 px-5 py-3 xs:py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm min-h-[44px]"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>{language === 'fa' ? 'مشاهده پیش‌نمایش آنلاین' : 'Live Product Demo'}</span>
                  </a>
                )}
                {activeModalProject.githubUrl && (
                  <a
                    href={activeModalProject.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 px-5 py-3 xs:py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors min-h-[44px]"
                  >
                    <Github className="w-4 h-4" />
                    <span>{language === 'fa' ? 'سورس‌کد در گیت‌هب' : 'Source Code'}</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
