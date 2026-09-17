import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { MediaItem } from '../../types';
import { EmptyState } from '../common/EmptyState';
import { parseVideoEmbedUrl } from '../../services/supabaseStorage';
import {
  Image,
  Award,
  Video,
  ExternalLink,
  X,
  Maximize2,
  Calendar,
  Play
} from 'lucide-react';

interface MediaGallerySectionProps {
  media: MediaItem[];
}

export const MediaGallerySection: React.FC<MediaGallerySectionProps> = ({ media }) => {
  const { language, t } = useLanguage();
  const [selectedType, setSelectedType] = useState<string>('all');
  const [lightboxItem, setLightboxItem] = useState<MediaItem | null>(null);

  const filteredMedia = selectedType === 'all'
    ? media
    : media.filter(m => m.type === selectedType);

  return (
    <section id="media" className="scroll-mt-28 py-12 sm:py-20 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-4 sm:gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-3">
              <Award className="w-3.5 h-3.5" />
              <span>{language === 'fa' ? 'اسناد، تصدیق‌نامه‌ها و رسانه‌ها' : 'Media & Credentials'}</span>
            </div>
            <h2 className="text-2xl xs:text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {t('mediaTitle')}
            </h2>
            <p className="mt-2 text-sm sm:text-base md:text-lg text-slate-600">
              {t('mediaSubtitle')}
            </p>
          </div>

          {/* Type Filter Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-2 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0">
            {[
              { id: 'all', label: language === 'fa' ? 'تمام موارد' : 'All Media' },
              { id: 'certificate', label: language === 'fa' ? 'تصدیق‌نامه‌ها' : 'Certificates' },
              { id: 'photo', label: language === 'fa' ? 'عکس‌ها و رویدادها' : 'Photos & Events' },
              { id: 'video', label: language === 'fa' ? 'ویدیوها' : 'Videos' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedType(tab.id)}
                className={`shrink-0 whitespace-nowrap px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer min-h-[38px] ${
                  selectedType === tab.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Media Grid or Empty State */}
        {filteredMedia.length === 0 ? (
          <EmptyState
            icon={Image}
            title={{ en: 'No media items in this category', fa: 'در این دسته‌بندی سندی یا تصویری موجود نیست' }}
            description={{
              en: 'Certificates, project photos, and event media will appear here.',
              fa: 'تصدیق‌نامه‌ها، تصاویر پروژه‌ها و ویدیوهای کنفرانس‌ها در این بخش نمایش داده می‌شوند.'
            }}
            actionLabel={{ en: 'Show All Media', fa: 'نمایش تمام موارد' }}
            onAction={() => setSelectedType('all')}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredMedia.map((item) => (
            <div
              key={item.id}
              onClick={() => setLightboxItem(item)}
              className="group relative bg-slate-50 rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer flex flex-col"
            >
              {/* Image / Video Aspect Box */}
              <div className="relative aspect-[4/3] bg-slate-900 overflow-hidden">
                <img
                  src={
                    item.thumbnailUrl ||
                    (item.type === 'video'
                      ? parseVideoEmbedUrl(item.url).thumbnailUrl || item.url
                      : item.url)
                  }
                  alt={item.title[language]}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="p-2.5 rounded-full bg-white/95 text-slate-900 shadow-md">
                    {item.type === 'video' ? (
                      <Play className="w-5 h-5 fill-current text-indigo-600 ml-0.5" />
                    ) : (
                      <Maximize2 className="w-5 h-5" />
                    )}
                  </div>
                </div>
                <div className="absolute top-2.5 left-2.5 rtl:left-auto rtl:right-2.5 flex items-center gap-1.5">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-xs flex items-center gap-1 ${
                    item.type === 'video' ? 'bg-rose-600/90' : 'bg-slate-900/80'
                  }`}>
                    {item.type === 'video' && <Play className="w-2.5 h-2.5 fill-current" />}
                    <span>{item.type}</span>
                  </span>
                </div>
              </div>

              {/* Title & Caption */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {item.title[language]}
                  </h3>
                  {item.caption && (
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                      {item.caption[language]}
                    </p>
                  )}
                </div>
                <div className="pt-3 flex items-center gap-1 text-[11px] text-slate-400">
                  <Calendar className="w-3 h-3" />
                  <span>{item.date}</span>
                </div>
              </div>
            </div>
          ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fadeIn">
          <div className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-700">
            <button
              onClick={() => setLightboxItem(null)}
              className="absolute top-4 right-4 rtl:right-auto rtl:left-4 z-10 p-2 rounded-full bg-slate-900/80 text-white hover:bg-slate-900 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="bg-slate-950 flex items-center justify-center overflow-hidden">
              {lightboxItem.type === 'video' ? (
                <div className="w-full aspect-video max-h-[70vh] bg-black flex items-center justify-center">
                  {parseVideoEmbedUrl(lightboxItem.url).isEmbeddable ? (
                    <iframe
                      src={parseVideoEmbedUrl(lightboxItem.url).embedUrl}
                      title={lightboxItem.title[language]}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : (
                    <div className="p-8 text-center text-white space-y-3">
                      <Play className="w-12 h-12 text-rose-500 mx-auto" />
                      <p className="text-sm font-medium">External Video Resource</p>
                      <a
                        href={lightboxItem.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Watch on Video Platform</span>
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <div className="max-h-[70vh] bg-slate-950 flex items-center justify-center overflow-hidden w-full">
                  <img
                    src={lightboxItem.url}
                    alt={lightboxItem.title[language]}
                    referrerPolicy="no-referrer"
                    className="max-h-[70vh] w-auto object-contain"
                  />
                </div>
              )}
            </div>

            <div className="p-6 bg-white space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700">
                  {lightboxItem.type}
                </span>
                <span className="text-xs text-slate-400">
                  &bull; {lightboxItem.date}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                {lightboxItem.title[language]}
              </h3>
              {lightboxItem.caption && (
                <p className="text-sm text-slate-600">
                  {lightboxItem.caption[language]}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
