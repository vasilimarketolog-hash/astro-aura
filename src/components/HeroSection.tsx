'use client';

import React from 'react';
import { Sparkles, HeartHandshake, Fingerprint, ShieldCheck, Compass, ArrowRight, Zap, Star } from 'lucide-react';
import { Locale } from '@/types/astro';
import { getTranslation } from '@/lib/translations';

interface HeroSectionProps {
  locale: Locale;
  onStart: (focus?: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ locale, onStart }) => {
  const t = getTranslation(locale);

  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24">
      {/* Soft warm champagne & peach ambient glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-amber-200/30 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-rose-100/40 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-[300px] h-[300px] bg-yellow-100/50 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Top Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white border border-amber-300/80 shadow-xs mb-6 animate-pulse">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-semibold text-stone-800">
            {t.nasaBadge}
          </span>
        </div>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-stone-900 leading-tight sm:leading-snug mb-6">
          {t.heroTitle1} <br />
          <span className="bg-gradient-to-r from-amber-700 via-amber-600 to-yellow-600 bg-clip-text text-transparent">
            {t.heroTitle2}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-stone-600 max-w-3xl mx-auto mb-8 font-normal leading-relaxed">
          {t.heroSubtitle}
        </p>

        {/* Primary CTA Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <button
            type="button"
            onClick={() => onStart()}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-stone-900 via-stone-800 to-amber-900 hover:from-black hover:to-stone-900 text-white font-bold text-lg shadow-xl shadow-stone-900/15 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-3 cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-amber-300" />
            <span>{t.heroCta}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-stone-600 border-y border-stone-200/80 py-4 mb-14 bg-white/50 backdrop-blur-xs rounded-xl">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-amber-600" />
            <span>{t.badgeSpeed}</span>
          </div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{t.badgePrivacy}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span>{t.badgeAccuracy}</span>
          </div>
        </div>

        {/* 3 Interactive Cards to choose focus */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {/* Card 1: Natal */}
          <div
            onClick={() => onStart('natal')}
            className="group relative p-6 rounded-3xl bg-white border border-stone-200 hover:border-amber-400 transition-all duration-300 hover:shadow-xl hover:shadow-stone-200/60 cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mb-4 text-amber-700 group-hover:scale-110 transition-transform">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 mb-2 flex items-center justify-between">
              {t.cardNatalTitle}
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-medium">{t.cardNatalBadge}</span>
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 mb-4 leading-relaxed">
              {t.cardNatalDesc}
            </p>
            <div className="text-xs font-bold text-amber-700 group-hover:text-amber-800 flex items-center space-x-1">
              <span>{t.cardNatalCta}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Synastry */}
          <div
            onClick={() => onStart('synastry')}
            className="group relative p-6 rounded-3xl bg-white border border-stone-200 hover:border-rose-400 transition-all duration-300 hover:shadow-xl hover:shadow-rose-100/60 cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center mb-4 text-rose-600 group-hover:scale-110 transition-transform">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 mb-2 flex items-center justify-between">
              {t.cardSynastryTitle}
              <span className="text-xs px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-medium">{t.cardSynastryBadge}</span>
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 mb-4 leading-relaxed">
              {t.cardSynastryDesc}
            </p>
            <div className="text-xs font-bold text-rose-600 group-hover:text-rose-700 flex items-center space-x-1">
              <span>{t.cardSynastryCta}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Human Design */}
          <div
            onClick={() => onStart('humandesign')}
            className="group relative p-6 rounded-3xl bg-white border border-stone-200 hover:border-yellow-500 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-100/60 cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-yellow-50 border border-yellow-200 flex items-center justify-center mb-4 text-yellow-700 group-hover:scale-110 transition-transform">
              <Fingerprint className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 mb-2 flex items-center justify-between">
              {t.cardHdTitle}
              <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 font-medium">{t.cardHdBadge}</span>
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 mb-4 leading-relaxed">
              {t.cardHdDesc}
            </p>
            <div className="text-xs font-bold text-yellow-700 group-hover:text-yellow-800 flex items-center space-x-1">
              <span>{t.cardHdCta}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
