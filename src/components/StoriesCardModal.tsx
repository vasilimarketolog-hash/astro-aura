'use client';

import React, { useRef, useState } from 'react';
import { NatalChartData, Locale } from '@/types/astro';
import { Sparkles, Download, Share2, X, Check, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';

interface StoriesCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  natal: NatalChartData;
  locale: Locale;
}

export const StoriesCardModal: React.FC<StoriesCardModalProps> = ({
  isOpen,
  onClose,
  natal,
  locale
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const sun = natal.planets.find((p) => p.id === 'sun')!;
  const moon = natal.planets.find((p) => p.id === 'moon')!;
  const asc = natal.ascendant;
  const pf = natal.partOfFortune;
  const fullName = `${natal.birthData.name} ${natal.birthData.lastName || ''}`.trim();
  const cityName = natal.birthData.cityName;

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsDownloading(true);

    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3, // High-res for Retina displays
        useCORS: true,
        backgroundColor: '#FAF8F5'
      });

      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `AstroAura_Stories_${natal.birthData.name}.png`;
      link.click();
    } catch (err) {
      console.error('Stories export error:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const getSignName = (s: { nameRu: string; nameEn: string; nameEs?: string }) => {
    if (locale === 'es') return s.nameEs || s.nameEn;
    if (locale === 'en') return s.nameEn;
    return s.nameRu;
  };

  const handleShare = async () => {
    if (navigator.share && cardRef.current) {
      try {
        const canvas = await html2canvas(cardRef.current, { scale: 2, backgroundColor: '#FAF8F5' });
        canvas.toBlob(async (blob) => {
          if (!blob) return;
          const file = new File([blob], 'my_astro_card.png', { type: 'image/png' });
          await navigator.share({
            title:
              locale === 'ru'
                ? 'Мой Космический Паспорт на AstroAura.pro'
                : locale === 'es'
                ? 'Mi Pasaporte Cósmico en AstroAura.pro'
                : 'My Cosmic Passport at AstroAura.pro',
            text:
              locale === 'ru'
                ? 'Узнайте свой астрологический код на astroaura.pro!'
                : locale === 'es'
                ? '¡Descubre tu código astrológico en astroaura.pro!'
                : 'Discover your astrological blueprint on astroaura.pro!',
            files: [file]
          });
        });
      } catch (e) {
        // fallback to copy link
        copyLink();
      }
    } else {
      copyLink();
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText('https://astroaura.pro');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl flex flex-col items-center max-h-[95vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 min-w-[44px] min-h-[44px] rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer flex items-center justify-center"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-black text-stone-900 mb-1 flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>
            {locale === 'ru'
              ? 'Визитка для Instagram Stories'
              : locale === 'es'
              ? 'Tarjeta para Instagram Stories'
              : 'Instagram Stories Card'}
          </span>
        </h3>
        <p className="text-xs text-stone-500 mb-4 text-center">
          {locale === 'ru'
            ? 'Идеальный формат 9:16 для Stories, статуса в Telegram и WhatsApp'
            : locale === 'es'
            ? 'Formato vertical 9:16 perfecto para Stories, TikTok y WhatsApp'
            : 'Vertical 9:16 poster ready for social media'}
        </p>

        {/* 9:16 Stories Card Preview Canvas */}
        <div
          ref={cardRef}
          className="w-[300px] h-[533px] rounded-3xl p-6 bg-gradient-to-b from-[#FAF8F5] via-[#FFFDF9] to-[#F5EFE6] border-2 border-amber-300/80 shadow-lg relative overflow-hidden flex flex-col justify-between text-stone-900 select-none shrink-0"
        >
          {/* Subtle Golden Ornaments */}
          <div className="absolute top-3 right-3 text-amber-500/20 text-4xl font-serif">✦</div>
          <div className="absolute bottom-10 left-3 text-amber-500/20 text-3xl font-serif">✦</div>

          {/* Card Header */}
          <div className="text-center pt-2">
            <div className="inline-block text-[9px] font-mono uppercase tracking-[0.25em] text-amber-800 font-bold bg-amber-100/60 px-3 py-1 rounded-full border border-amber-300/60 mb-2">
              ✦ COSMIC PASSPORT ✦
            </div>
            <h2 className="text-xl font-black text-stone-900 tracking-tight leading-tight">
              {fullName}
            </h2>
            <p className="text-[10px] text-stone-500 font-medium">
              {locale === 'ru' ? `г. ${cityName}` : cityName} • {natal.birthData.day}.{String(natal.birthData.month).padStart(2, '0')}.{natal.birthData.year}
            </p>
          </div>

          {/* Central Triad: Sun, Moon, Ascendant */}
          <div className="space-y-2.5 my-auto">
            {/* Sun */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/90 border border-amber-200 shadow-xs">
              <div className="flex items-center space-x-2.5">
                <span className="w-8 h-8 rounded-xl bg-amber-500 text-stone-950 font-black text-base flex items-center justify-center shadow-xs">
                  ☉
                </span>
                <div className="text-left">
                  <div className="text-[9px] uppercase font-mono tracking-wider text-amber-800 font-bold">
                    {locale === 'ru' ? 'Знак Солнца' : locale === 'es' ? 'Signo Solar' : 'Sun Sign'}
                  </div>
                  <div className="text-xs font-black text-stone-900">
                    {getSignName(sun.sign)}
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-mono text-stone-500 font-bold">
                {sun.degreeInSign}° {locale === 'es' ? `Casa ${sun.house}` : locale === 'ru' ? `${sun.house} дом` : `House ${sun.house}`}
              </span>
            </div>

            {/* Moon */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/90 border border-blue-200 shadow-xs">
              <div className="flex items-center space-x-2.5">
                <span className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 font-black text-base flex items-center justify-center shadow-xs">
                  ☽
                </span>
                <div className="text-left">
                  <div className="text-[9px] uppercase font-mono tracking-wider text-blue-800 font-bold">
                    {locale === 'ru' ? 'Знак Луны' : locale === 'es' ? 'Signo Lunar' : 'Moon Sign'}
                  </div>
                  <div className="text-xs font-black text-stone-900">
                    {getSignName(moon.sign)}
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-mono text-stone-500 font-bold">
                {moon.degreeInSign}° {locale === 'es' ? `Casa ${moon.house}` : locale === 'ru' ? `${moon.house} дом` : `House ${moon.house}`}
              </span>
            </div>

            {/* Ascendant */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/90 border border-purple-200 shadow-xs">
              <div className="flex items-center space-x-2.5">
                <span className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 font-bold text-xs flex items-center justify-center shadow-xs">
                  Asc
                </span>
                <div className="text-left">
                  <div className="text-[9px] uppercase font-mono tracking-wider text-purple-800 font-bold">
                    {locale === 'ru' ? 'Асцендент' : locale === 'es' ? 'Ascendente' : 'Ascendant'}
                  </div>
                  <div className="text-xs font-black text-stone-900">
                    {getSignName(asc.sign)}
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-mono text-stone-500 font-bold">
                {asc.degreeInSign}°
              </span>
            </div>

            {/* Part of Fortune Highlight */}
            {pf && (
              <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-amber-100/50 border border-amber-300 text-[10px]">
                <span className="flex items-center space-x-1 font-bold text-amber-900">
                  <span>{locale === 'ru' ? '⊗ Точка Фортуны:' : locale === 'es' ? '⊗ Punto de la Fortuna:' : '⊗ Part of Fortune:'}</span>
                  <span>{getSignName(pf.sign)}</span>
                </span>
                <span className="font-mono text-stone-600 font-semibold">
                  {locale === 'es' ? `Casa ${pf.house}` : locale === 'ru' ? `${pf.house} дом` : `House ${pf.house}`}
                </span>
              </div>
            )}
          </div>

          {/* Card Footer & Branding */}
          <div className="text-center pt-2 border-t border-amber-200/80">
            <div className="text-[9px] text-stone-500 font-medium mb-1">
              {locale === 'ru'
                ? 'Рассчитай свою карту бесплатно на'
                : locale === 'es'
                ? 'Calcula tu carta natal gratis en'
                : 'Calculate your chart for free at'}
            </div>
            <div className="text-xs font-black tracking-wider text-amber-900 font-mono">
              ✦ ASTROAURA.PRO ✦
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3 w-full mt-5">
          <button
            type="button"
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex-1 min-h-[44px] py-3 px-4 rounded-2xl bg-gradient-to-r from-stone-900 via-stone-800 to-amber-900 hover:from-black text-white text-xs font-bold transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
          >
            {isDownloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{locale === 'ru' ? 'Сохранение...' : locale === 'es' ? 'Guardando...' : 'Saving...'}</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-amber-300" />
                <span>{locale === 'ru' ? 'Скачать Stories (PNG)' : locale === 'es' ? 'Descargar Stories (PNG)' : 'Download Stories (PNG)'}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="p-3 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors cursor-pointer border border-stone-200 shrink-0"
            title={locale === 'ru' ? 'Поделиться ссылкой' : locale === 'es' ? 'Compartir enlace' : 'Share link'}
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
