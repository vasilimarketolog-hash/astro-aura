'use client';

import React from 'react';
import { Sparkles, Star, Compass } from 'lucide-react';
import { Locale } from '@/types/astro';
import { getTranslation } from '@/lib/translations';

interface HeaderProps {
  locale: Locale;
  onToggleLocale: (newLocale: Locale) => void;
  onStartQuiz: () => void;
  hasCalculatedData?: boolean;
  onViewReport?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  locale,
  onToggleLocale,
  onStartQuiz,
  hasCalculatedData,
  onViewReport
}) => {
  const t = getTranslation(locale);

  return (
    <header className="sticky top-0 z-40 w-full max-w-full overflow-hidden backdrop-blur-md bg-[#FAF8F5]/90 border-b border-stone-200/80 shadow-xs pt-safe">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        {/* Brand Logo */}
        <div
          className="flex items-center space-x-2 sm:space-x-3 cursor-pointer shrink-0"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 p-[2px] shadow-sm shrink-0">
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
              <Compass className="w-5 h-5 text-amber-600 animate-pulse" />
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-lg sm:text-xl font-extrabold bg-gradient-to-r from-stone-900 via-stone-800 to-amber-700 bg-clip-text text-transparent tracking-tight">
              AstroAura
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full bg-amber-50 border border-amber-300/80 text-amber-800 font-bold font-mono">
              {t.proBadge}
            </span>
          </div>
        </div>

        {/* Live Social Proof Badge */}
        <div className="hidden lg:flex items-center space-x-4 text-xs text-stone-600">
          <div className="flex items-center space-x-1.5 bg-amber-50/70 border border-amber-200/80 px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>
              {t.calculatedToday} <strong className="text-stone-900 font-mono">{t.cardsCount}</strong>
            </span>
          </div>

          <div className="flex items-center space-x-1 text-amber-500">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="font-bold text-stone-900 ml-1">4.94</span>
            <span className="text-stone-500 text-[11px]">{t.reviewsCount}</span>
          </div>
        </div>

        {/* Actions & Language Switcher */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          {/* Language Switcher with WCAG 2.1 compliant 44x44px target sizes */}
          <div className="flex items-center bg-stone-100 border border-stone-200 rounded-xl p-0.5 text-xs shadow-inner shrink-0">
            <button
              type="button"
              aria-label="Switch language to Russian"
              onClick={() => onToggleLocale('ru')}
              className={`min-w-[38px] sm:min-w-[42px] min-h-[38px] sm:min-h-[40px] px-2 flex items-center justify-center rounded-lg font-bold transition-all cursor-pointer ${
                locale === 'ru'
                  ? 'bg-white text-stone-900 shadow-xs border border-stone-200'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              RU
            </button>
            <button
              type="button"
              aria-label="Switch language to English"
              onClick={() => onToggleLocale('en')}
              className={`min-w-[38px] sm:min-w-[42px] min-h-[38px] sm:min-h-[40px] px-2 flex items-center justify-center rounded-lg font-bold transition-all cursor-pointer ${
                locale === 'en'
                  ? 'bg-white text-stone-900 shadow-xs border border-stone-200'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              aria-label="Switch language to Spanish"
              onClick={() => onToggleLocale('es')}
              className={`min-w-[38px] sm:min-w-[42px] min-h-[38px] sm:min-h-[40px] px-2 flex items-center justify-center rounded-lg font-bold transition-all cursor-pointer ${
                locale === 'es'
                  ? 'bg-white text-stone-900 shadow-xs border border-stone-200'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              ES
            </button>
          </div>

          {hasCalculatedData && onViewReport ? (
            <button
              type="button"
              onClick={onViewReport}
              className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-amber-50 border border-amber-300 text-amber-900 hover:bg-amber-100 transition-all shadow-xs flex items-center space-x-1.5 sm:space-x-2 cursor-pointer shrink-0"
            >
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="whitespace-nowrap">{t.myChart}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onStartQuiz}
              className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white transition-all shadow-md shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] flex items-center space-x-1 sm:space-x-1.5 cursor-pointer shrink-0"
            >
              <Sparkles className="w-4 h-4 text-yellow-100 shrink-0" />
              <span className="whitespace-nowrap">{t.calculateFree}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
