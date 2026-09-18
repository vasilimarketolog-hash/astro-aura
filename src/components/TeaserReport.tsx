'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Lock,
  Unlock,
  Flame,
  Droplet,
  Wind,
  Mountain,
  ShieldCheck,
  Star,
  ArrowRight,
  Zap,
  Gift,
  Heart,
  HelpCircle
} from 'lucide-react';
import { NatalChartData, SynastryData, HumanDesignData, Locale } from '@/types/astro';
import { generateTeaserInsights, SIGN_INTERPRETATIONS } from '@/lib/interpretations';
import { getTranslation } from '@/lib/translations';

interface TeaserReportProps {
  locale: Locale;
  natal: NatalChartData;
  synastry?: SynastryData;
  humanDesign: HumanDesignData;
  onUnlockPaywall: () => void;
}

export const TeaserReport: React.FC<TeaserReportProps> = ({
  locale,
  natal,
  synastry,
  humanDesign,
  onUnlockPaywall
}) => {
  const t = getTranslation(locale);
  const [timeLeft, setTimeLeft] = useState(14 * 60 + 59);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const sun = natal.planets.find((p) => p.id === 'sun')!;
  const moon = natal.planets.find((p) => p.id === 'moon')!;
  const asc = natal.ascendant;

  const insights = generateTeaserInsights(sun.sign.id, moon.sign.id, asc.sign.id);
  const sunData = SIGN_INTERPRETATIONS[sun.sign.id];
  const moonData = SIGN_INTERPRETATIONS[moon.sign.id];
  const ascData = SIGN_INTERPRETATIONS[asc.sign.id];

  const fullName = `${natal.birthData.name} ${natal.birthData.lastName || ''}`.trim();
  const locationText = `${natal.birthData.cityName}${natal.birthData.country ? `, ${natal.birthData.country}` : ''}`;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-32">
      {/* Top Special Offer Banner */}
      <div className="bg-gradient-to-r from-amber-100/90 via-yellow-50 to-amber-100/90 border border-amber-300 rounded-2xl p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center space-x-3 text-center sm:text-left">
          <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
            <Gift className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <div className="text-xs text-amber-800 font-bold uppercase tracking-wider">
              {t.specialOffer}
            </div>
            <div className="text-sm font-bold text-stone-900">
              {t.discountActive}
            </div>
          </div>
        </div>

        {/* Countdown */}
        <div className="flex items-center space-x-2 bg-white/80 px-4 py-2 rounded-xl border border-amber-300 shadow-xs">
          <span className="text-xs text-stone-600 font-medium">{t.discountTimer}</span>
          <span className="font-mono text-base font-bold text-amber-800">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Main Header with personalized Name & City */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-stone-800 text-xs mb-3 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>
            {t.forUserPrefix} <strong className="text-stone-900 font-bold">{fullName}</strong> ({locationText})
          </span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-stone-900 mb-3 tracking-tight">
          {t.passportReady}
        </h1>
        <p className="text-sm sm:text-base text-stone-600 max-w-2xl mx-auto leading-relaxed">
          {insights.headline}. Ниже представлена базовая открытая часть вашей карты и заблокированные глубинные ключи судьбы.
        </p>
      </div>

      {/* The Big 3: Sun, Moon, Ascendant Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Sun */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-3 right-3 text-3xl opacity-10 text-amber-600">☉</div>
          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block mb-1">
            {t.sunCore}
          </span>
          <div className="text-xl font-black text-stone-900 mb-2 flex items-center space-x-2">
            <span className="text-amber-600">{sun.sign.symbol}</span>
            <span>{locale === 'ru' ? sun.sign.nameRu : sun.sign.nameEn}</span>
            <span className="text-xs font-mono text-stone-500 font-normal">({sun.degreeInSign}°)</span>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed">
            {sunData?.essence}
          </p>
        </div>

        {/* Moon */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-3 right-3 text-3xl opacity-10 text-indigo-600">☽</div>
          <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider block mb-1">
            {t.moonSoul}
          </span>
          <div className="text-xl font-black text-stone-900 mb-2 flex items-center space-x-2">
            <span className="text-indigo-600">{moon.sign.symbol}</span>
            <span>{locale === 'ru' ? moon.sign.nameRu : moon.sign.nameEn}</span>
            <span className="text-xs font-mono text-stone-500 font-normal">({moon.degreeInSign}°)</span>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed">
            {moonData?.moonMeaning.slice(0, 110)}...
          </p>
        </div>

        {/* Ascendant */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-3 right-3 text-3xl opacity-10 text-purple-600">Asc</div>
          <span className="text-xs font-bold text-purple-700 uppercase tracking-wider block mb-1">
            {t.ascMask}
          </span>
          <div className="text-xl font-black text-stone-900 mb-2 flex items-center space-x-2">
            <span className="text-purple-600">{asc.sign.symbol}</span>
            <span>{locale === 'ru' ? asc.sign.nameRu : asc.sign.nameEn}</span>
            <span className="text-xs font-mono text-stone-500 font-normal">({asc.degreeInSign}°)</span>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed">
            {ascData?.ascMeaning.slice(0, 110)}...
          </p>
        </div>
      </div>

      {/* Revealed Psychological Dualism Hook */}
      <div className="bg-white border-2 border-amber-200 rounded-3xl p-6 sm:p-8 mb-8 shadow-md">
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-300 flex items-center justify-center shrink-0 text-amber-700 mt-1 shadow-xs">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-stone-900 mb-2">
              {t.dualismTitle}
            </h3>
            <p className="text-sm text-stone-700 mb-4 leading-relaxed font-normal">
              {insights.hook}
            </p>
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs sm:text-sm text-stone-600 leading-relaxed">
              {insights.revealedDetail}
            </div>
          </div>
        </div>
      </div>

      {/* Elements Balance */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 mb-8 shadow-sm">
        <h3 className="text-base font-bold text-stone-900 mb-3 flex items-center justify-between">
          <span>{t.elementsTitle}</span>
          <span className="text-xs font-bold text-amber-700">
            {t.dominantElementPrefix} {natal.dominantElement.primary}
          </span>
        </h3>
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200">
            <Flame className="w-4 h-4 text-rose-500 mx-auto mb-1" />
            <span className="text-stone-600 block">{locale === 'ru' ? 'Огонь' : 'Fire'}</span>
            <strong className="text-stone-900 text-sm font-bold">{natal.dominantElement.fire}%</strong>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
            <Mountain className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
            <span className="text-stone-600 block">{locale === 'ru' ? 'Земля' : 'Earth'}</span>
            <strong className="text-stone-900 text-sm font-bold">{natal.dominantElement.earth}%</strong>
          </div>
          <div className="p-3 rounded-2xl bg-sky-50 border border-sky-200">
            <Wind className="w-4 h-4 text-sky-500 mx-auto mb-1" />
            <span className="text-stone-600 block">{locale === 'ru' ? 'Воздух' : 'Air'}</span>
            <strong className="text-stone-900 text-sm font-bold">{natal.dominantElement.air}%</strong>
          </div>
          <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200">
            <Droplet className="w-4 h-4 text-blue-500 mx-auto mb-1" />
            <span className="text-stone-600 block">{locale === 'ru' ? 'Вода' : 'Water'}</span>
            <strong className="text-stone-900 text-sm font-bold">{natal.dominantElement.water}%</strong>
          </div>
        </div>
      </div>

      {/* If Synastry preview */}
      {synastry && (
        <div className="bg-rose-50/50 border border-rose-200 rounded-3xl p-6 mb-8 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-rose-500" />
              <span className="font-bold text-stone-900 text-lg">
                {synastry.person1.birthData.name} + {synastry.person2.birthData.name}
              </span>
            </div>
            <div className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 font-mono font-bold text-sm">
              {synastry.compatibility.totalScore}%
            </div>
          </div>
          <p className="text-xs sm:text-sm text-stone-600">
            {synastry.compatibility.verdict}
          </p>
        </div>
      )}

      {/* LOCKED SECTIONS (PAYWALL HOOKS WITH FROSTED GLASS) */}
      <div className="space-y-4 mb-10">
        <h3 className="text-lg font-bold text-stone-900 text-center mb-4">
          {t.lockedSectionsTitle}
        </h3>

        {/* Locked item 1: Money code */}
        <div className="relative p-5 rounded-3xl bg-white border border-stone-200 overflow-hidden shadow-sm">
          <div className="absolute inset-0 backdrop-blur-[5px] bg-white/75 z-10 flex items-center justify-between px-6">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-bold text-stone-900 block">
                  Финансовый код: 2-й и 8-й дома богатства
                </span>
                <span className="text-xs text-stone-600">
                  Через какую деятельность к вам приходят наибольшие деньги
                </span>
              </div>
            </div>
            <button
              onClick={onUnlockPaywall}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-stone-900 to-amber-900 hover:from-black text-white text-xs font-bold transition-colors cursor-pointer shadow-sm"
            >
              {t.unlockButton}
            </button>
          </div>
          <div className="opacity-20 select-none text-xs text-stone-600 space-y-2">
            <p>Ваш второй дом управляется сильной планетой, указывающей на приток капитала через личный бренд, консалтинг и высокие технологии...</p>
          </div>
        </div>

        {/* Locked item 2: Karmic Node */}
        <div className="relative p-5 rounded-3xl bg-white border border-stone-200 overflow-hidden shadow-sm">
          <div className="absolute inset-0 backdrop-blur-[5px] bg-white/75 z-10 flex items-center justify-between px-6">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-2xl bg-purple-100 border border-purple-300 flex items-center justify-center text-purple-700">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-bold text-stone-900 block">
                  Кармический узел судьбы (Раху и Кету)
                </span>
                <span className="text-xs text-stone-600">
                  Опыт прошлых воплощений и точка неизбежного эволюционного скачка
                </span>
              </div>
            </div>
            <button
              onClick={onUnlockPaywall}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-stone-900 to-amber-900 hover:from-black text-white text-xs font-bold transition-colors cursor-pointer shadow-sm"
            >
              {t.unlockButton}
            </button>
          </div>
          <div className="opacity-20 select-none text-xs text-stone-600 space-y-2">
            <p>Ваш Северный узел в знаке требует полного отказа от старой привычки жертвовать собой ради одобрения других...</p>
          </div>
        </div>
      </div>

      {/* Floating Sticky Bottom Conversion Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 p-4 bg-white/95 backdrop-blur-md border-t border-stone-200 shadow-2xl">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-amber-600 animate-spin" />
            </div>
            <div className="text-left">
              <div className="text-sm font-bold text-stone-900">
                Разблокируйте полную карту и именной PDF
              </div>
              <div className="text-xs text-amber-800 font-semibold">
                {t.trialNotice} <span className="font-black text-stone-900 underline">1 ₽ / $1</span>
              </div>
            </div>
          </div>

          <button
            onClick={onUnlockPaywall}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-stone-900 via-stone-800 to-amber-900 hover:from-black text-white font-bold text-sm shadow-xl shadow-stone-900/15 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Unlock className="w-4 h-4 text-amber-300" />
            <span>{t.openFullAccess}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
