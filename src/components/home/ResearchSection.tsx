import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ResearchPaper } from '../../types';
import { EmptyState } from '../common/EmptyState';
import {
  BookOpen,
  FileText,
  ExternalLink,
  Github,
  Quote,
  Check,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface ResearchSectionProps {
  papers: ResearchPaper[];
}

export const ResearchSection: React.FC<ResearchSectionProps> = ({ papers }) => {
  const { language, t } = useLanguage();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedDoi, setCopiedDoi] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const copyDoi = (doi: string) => {
    navigator.clipboard.writeText(`https://doi.org/${doi}`);
    setCopiedDoi(doi);
    setTimeout(() => setCopiedDoi(null), 2000);
  };

  return (
    <section id="research" className="scroll-mt-28 py-12 sm:py-20 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{language === 'fa' ? 'پژوهش‌های علمی و مقالات' : 'Academic Research'}</span>
          </div>
          <h2 className="text-2xl xs:text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t('researchTitle')}
          </h2>
          <p className="mt-2 text-sm sm:text-base md:text-lg text-slate-600">
            {t('researchSubtitle')}
          </p>
        </div>

        {/* Papers List or Empty State */}
        {papers.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title={{ en: 'No research papers published yet', fa: 'تاکنون مقاله پژوهشی منتشر نشده است' }}
            description={{
              en: 'Academic research papers on natural language processing, distributed computing, and machine learning will be posted here.',
              fa: 'مقالات علمی و پژوهشی در حوزه‌های پردازش زبان طبیعی و سیستم‌های توزیع‌شده در این بخش قرار می‌گیرند.'
            }}
          />
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {papers.map((paper) => {
            const isExpanded = expandedId === paper.id;
            return (
              <div
                key={paper.id}
                className="bg-slate-50/70 rounded-2xl p-4 sm:p-8 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 pb-4 border-b border-slate-200/60">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap text-xs">
                      <span className="px-2.5 py-0.5 rounded-full font-bold bg-indigo-100/70 text-indigo-700">
                        {paper.year}
                      </span>
                      <span className="text-slate-500 font-medium">
                        {paper.venue[language]}
                      </span>
                      {paper.citationCount !== undefined && (
                        <span className="px-2 py-0.5 rounded-md bg-slate-200/70 text-slate-700 font-semibold">
                          {paper.citationCount} {language === 'fa' ? 'ارجاع' : 'Citations'}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base sm:text-xl font-bold text-slate-900 leading-snug break-words">
                      {paper.title[language]}
                    </h3>

                    {/* Authors */}
                    <div className="text-xs sm:text-sm text-slate-600">
                      <span className="font-semibold">{language === 'fa' ? 'نویسندگان:' : 'Authors:'} </span>
                      {paper.authors.map((author, aIdx) => (
                        <span
                          key={aIdx}
                          className={(author.includes('Malikzai') || author.includes('Fayaz')) ? 'font-bold text-indigo-600' : ''}
                        >
                          {author}{aIdx < paper.authors.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions right */}
                  <div className="flex items-center gap-2 shrink-0">
                    {paper.pdfUrl && (
                      <a
                        href={paper.pdfUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 shadow-xs transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5 text-rose-600" />
                        <span>PDF</span>
                      </a>
                    )}
                    {paper.codeUrl && (
                      <a
                        href={paper.codeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 shadow-xs transition-colors"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>Code</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Abstract snippet & toggle */}
                <div className="pt-4 space-y-3">
                  <div className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    <span className="font-bold text-slate-800">
                      {language === 'fa' ? 'چکیده (Abstract):' : 'Abstract:'}{' '}
                    </span>
                    {isExpanded ? paper.abstract[language] : `${paper.abstract[language].slice(0, 240)}...`}
                  </div>

                  <button
                    onClick={() => toggleExpand(paper.id)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                  >
                    {isExpanded ? (
                      <>
                        <span>{language === 'fa' ? 'بستن چکیده' : 'Show Less'}</span>
                        <ChevronUp className="w-3.5 h-3.5" />
                      </>
                    ) : (
                      <>
                        <span>{language === 'fa' ? 'مطالعه کامل چکیده' : 'Read Full Abstract'}</span>
                        <ChevronDown className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>

                  {/* Keywords */}
                  <div className="pt-2 flex flex-wrap items-center gap-1.5">
                    {paper.keywords.map((kw, kIdx) => (
                      <span
                        key={kIdx}
                        className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-white text-slate-600 border border-slate-200"
                      >
                        #{kw}
                      </span>
                    ))}

                    {paper.doi && (
                      <button
                        onClick={() => copyDoi(paper.doi!)}
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-mono text-slate-500 hover:text-indigo-600 bg-white border border-slate-200 cursor-pointer transition-colors"
                        title="Copy DOI Link"
                      >
                        {copiedDoi === paper.doi ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>Copied DOI</span>
                          </>
                        ) : (
                          <>
                            <Quote className="w-3 h-3" />
                            <span>DOI: {paper.doi}</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        )}
      </div>
    </section>
  );
};
