import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { BilingualText } from '../../types';
import { FolderOpen } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>;
  title?: BilingualText;
  description?: BilingualText;
  actionLabel?: BilingualText;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = FolderOpen,
  title = { en: 'No items found', fa: 'هیچ موردی یافت نشد' },
  description = {
    en: 'There are currently no records published in this section.',
    fa: 'در حال حاضر هیچ معلوماتی در این بخش ثبت نشده است.'
  },
  actionLabel,
  onAction
}) => {
  const { language } = useLanguage();

  return (
    <div className="w-full py-16 px-6 text-center rounded-3xl bg-white border border-dashed border-slate-200 shadow-xs flex flex-col items-center justify-center my-6">
      <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 shadow-xs">
        <Icon className="w-7 h-7" />
      </div>
      <h4 className="text-lg font-bold text-slate-900 mb-1">
        {title[language]}
      </h4>
      <p className="text-sm text-slate-500 max-w-md mx-auto mb-5 leading-relaxed">
        {description[language]}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          {actionLabel[language]}
        </button>
      )}
    </div>
  );
};
