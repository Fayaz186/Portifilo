import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { SkillCategory } from '../../types';
import {
  Code,
  Smartphone,
  Cpu,
  Sparkles,
  Terminal,
  CheckCircle,
  Layers
} from 'lucide-react';

interface SkillsSectionProps {
  categories: SkillCategory[];
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ categories }) => {
  const { language, t } = useLanguage();
  const [selectedCatId, setSelectedCatId] = useState<string>('all');

  const filteredCategories = selectedCatId === 'all'
    ? categories
    : categories.filter(c => c.id === selectedCatId);

  return (
    <section id="skills" className="scroll-mt-28 py-12 sm:py-20 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>{language === 'fa' ? 'مهارت‌ها و توانایی‌های تخنیکی' : 'Core Capabilities'}</span>
          </div>
          <h2 className="text-2xl xs:text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t('skillsTitle')}
          </h2>
          <p className="mt-2 text-sm sm:text-base md:text-lg text-slate-600">
            {t('skillsSubtitle')}
          </p>
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-1.5 sm:gap-2 mb-8 sm:mb-10 overflow-x-auto no-scrollbar pb-2 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0">
          <button
            onClick={() => setSelectedCatId('all')}
            className={`shrink-0 whitespace-nowrap px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer min-h-[38px] ${
              selectedCatId === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {language === 'fa' ? 'تمام مهارت‌ها' : 'All Proficiencies'}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCatId(cat.id)}
              className={`shrink-0 whitespace-nowrap px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer min-h-[38px] ${
                selectedCatId === cat.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.name[language]}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredCategories.map((cat) => (
            <div
              key={cat.id}
              className="bg-slate-50/70 p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all flex flex-col"
            >
              <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-slate-200/80">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <Code className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">
                  {cat.name[language]}
                </h3>
              </div>

              <div className="space-y-4 flex-1">
                {cat.skills.map((skill, sIdx) => (
                  <div key={sIdx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800">
                        {skill.name}
                      </span>
                      {skill.badge && (
                        <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50/80 px-2 py-0.5 rounded-full border border-indigo-100">
                          {skill.badge}
                        </span>
                      )}
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-700"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
