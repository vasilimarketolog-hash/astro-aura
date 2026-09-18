'use client';

import React from 'react';
import { PlanetPosition, Talisman, Locale, NatalChartData } from '@/types/astro';
import { Zap, ShieldCheck, Gem } from 'lucide-react';

interface AstrodynesCardProps {
  planets: PlanetPosition[];
  dominantPlanet: NatalChartData['dominantPlanet'];
  talismans: Talisman[];
  locale: Locale;
  onSelectPlanet?: (planet: PlanetPosition) => void;
}

export const AstrodynesCard: React.FC<AstrodynesCardProps> = ({
  planets,
  dominantPlanet,
  talismans,
  locale,
  onSelectPlanet
}) => {
  const majorIds = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
  const majorPlanets = planets.filter((p) => majorIds.includes(p.id));

  return (
    <div className="space-y-6">
      {/* Dominant Planet Featured Card */}
      <div className="bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-white border-2 border-amber-300 rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="absolute top-2 right-4 text-7xl font-serif opacity-5 text-amber-700 pointer-events-none select-none">
          ✦
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-stone-950 font-black text-2xl flex items-center justify-center shadow-md shadow-amber-500/30">
              {dominantPlanet.symbol}
            </div>
            <div>
              <div className="text-[11px] font-mono uppercase tracking-widest text-amber-800 font-bold">
                {locale === 'ru' ? 'Главная доминанта карты' : 'Chart Dominant Ruler'}
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-stone-900">
                {locale === 'ru' ? dominantPlanet.nameRu : dominantPlanet.nameEn}
              </h3>
            </div>
          </div>

          <div className="flex items-center space-x-2 px-4 py-2 rounded-2xl bg-white border border-amber-300 shadow-xs">
            <Zap className="w-4 h-4 text-amber-600 fill-amber-500" />
            <span className="text-xs font-bold text-stone-600">
              {locale === 'ru' ? 'Сила планетного заряда:' : 'Planetary Power Score:'}
            </span>
            <span className="text-base font-black text-amber-700">
              {dominantPlanet.powerScore} / 100
            </span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-stone-700 leading-relaxed max-w-4xl">
          {locale === 'ru' ? dominantPlanet.reasonRu : dominantPlanet.reasonEn}
        </p>
      </div>

      {/* Astrodynes Table */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
          <div>
            <h3 className="text-lg font-black text-stone-900 flex items-center space-x-2">
              <span className="text-amber-600">✦</span>
              <span>{locale === 'ru' ? 'Астродины: Сила и Гармония планет' : 'Astrodynes: Power & Harmony Scores'}</span>
            </h3>
            <p className="text-xs text-stone-500">
              {locale === 'ru'
                ? 'Количественная оценка влияния планет по системе Geocult (эссенциальное достоинство + аспекты)'
                : 'Quantitative evaluation of planetary strength by Geocult algorithm (dignities + aspect weights)'}
            </p>
          </div>
          <div className="text-xs text-stone-500 font-mono">
            {locale === 'ru' ? 'Сортировка по силе влияния' : 'Ranked by power score'}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
          {[...majorPlanets]
            .sort((a, b) => (b.astrodynes?.power ?? 0) - (a.astrodynes?.power ?? 0))
            .map((planet) => {
              const power = planet.astrodynes?.power ?? 50;
              const harmony = planet.astrodynes?.harmony ?? 50;
              const isHarmonious = harmony >= 50;

              return (
                <div
                  key={planet.id}
                  onClick={() => onSelectPlanet && onSelectPlanet(planet)}
                  className="p-4 rounded-2xl border border-stone-200 hover:border-amber-400 bg-stone-50/50 hover:bg-white transition-all cursor-pointer shadow-xs space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <span className="w-7 h-7 rounded-xl bg-amber-100 flex items-center justify-center font-bold text-amber-900 text-sm">
                        {planet.symbol}
                      </span>
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <span className="text-xs font-bold text-stone-900">
                            {locale === 'ru' ? planet.nameRu : planet.nameEn}
                          </span>
                          {planet.isRetrograde && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-100 text-rose-700">
                              ℞
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-stone-500">
                          {locale === 'ru' ? planet.sign.nameRu : planet.sign.nameEn} • {planet.house} {locale === 'ru' ? 'дом' : 'house'}
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-white border border-stone-200 text-stone-700 font-medium shadow-2xs">
                      {planet.astrodynes?.status}
                    </span>
                  </div>

                  {/* Power Bar */}
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-stone-500 font-medium">
                        {locale === 'ru' ? 'Сила (Энергия):' : 'Power (Charge):'}
                      </span>
                      <span className="font-bold text-stone-800 font-mono">{power} / 100</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-500"
                        style={{ width: `${power}%` }}
                      />
                    </div>
                  </div>

                  {/* Harmony Indicator */}
                  <div className="flex items-center justify-between text-[11px] pt-0.5">
                    <span className="text-stone-500">
                      {locale === 'ru' ? 'Баланс гармонии:' : 'Harmony Balance:'}
                    </span>
                    <span
                      className={`font-semibold font-mono ${
                        isHarmonious ? 'text-sky-700' : 'text-rose-700'
                      }`}
                    >
                      {harmony}% ({isHarmonious ? (locale === 'ru' ? 'Гармоничная' : 'Harmonious') : (locale === 'ru' ? 'Напряженная' : 'Challenging')})
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Gemstone Talismans Section */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="border-b border-stone-100 pb-3">
          <h3 className="text-lg font-black text-stone-900 flex items-center space-x-2">
            <Gem className="w-5 h-5 text-amber-600" />
            <span>{locale === 'ru' ? 'Камни-талисманы и минералы силы' : 'Personal Power Talismans & Gems'}</span>
          </h3>
          <p className="text-xs text-stone-500">
            {locale === 'ru'
              ? 'Минералы, подобранные на основе ведущих планет и натальной карты для защиты и успеха'
              : 'Stones and crystals aligned with your chart rulers for protection, luck, and alignment'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          {talismans.map((t, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl border border-stone-200 bg-stone-50/40 hover:bg-white hover:border-amber-400 transition-all shadow-xs space-y-2"
            >
              <div className="flex items-center space-x-2.5">
                <span
                  className="w-4 h-4 rounded-full border border-white shadow-xs"
                  style={{ backgroundColor: t.color }}
                />
                <span className="text-xs font-mono uppercase tracking-wider text-amber-800 font-bold">
                  {locale === 'ru' ? `Планета: ${t.planetNameRu}` : `Ruler: ${t.planetNameEn}`}
                </span>
              </div>
              <h4 className="text-sm font-black text-stone-900">
                {locale === 'ru' ? t.stoneRu : t.stoneEn}
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                {locale === 'ru' ? t.purposeRu : t.purposeEn}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
