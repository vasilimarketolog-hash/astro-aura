'use client';

import React, { useState } from 'react';
import { Aspect, PlanetPosition, Locale } from '@/types/astro';

interface AspectGridProps {
  planets: PlanetPosition[];
  ascendant: PlanetPosition;
  midheaven: PlanetPosition;
  aspects: Aspect[];
  locale: Locale;
}

export const AspectGrid: React.FC<AspectGridProps> = ({
  planets,
  ascendant,
  midheaven,
  aspects,
  locale
}) => {
  const [hoveredCell, setHoveredCell] = useState<{
    p1: PlanetPosition;
    p2: PlanetPosition;
    aspect?: Aspect;
  } | null>(null);

  // Filter major planets for the matrix
  const majorIds = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
  const gridPlanets: PlanetPosition[] = [
    ...planets.filter(p => majorIds.includes(p.id)),
    ascendant,
    midheaven
  ];

  const aspectGlyphs: Record<string, string> = {
    conjunction: '☌',
    sextile: '⚹',
    square: '□',
    trine: '△',
    opposition: '☍'
  };

  const findAspect = (id1: string, id2: string): Aspect | undefined => {
    return aspects.find(
      (a) =>
        (a.planet1.id === id1 && a.planet2.id === id2) ||
        (a.planet1.id === id2 && a.planet2.id === id1)
    );
  };

  return (
    <div className="bg-white border border-stone-200 rounded-3xl p-5 sm:p-7 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
        <div>
          <h3 className="text-base sm:text-lg font-black text-stone-900 flex items-center space-x-2">
            <span className="text-amber-600">✦</span>
            <span>{locale === 'ru' ? 'Аспектная сетка (Матрица Geocult)' : 'Cross-Planetary Aspect Matrix'}</span>
          </h3>
          <p className="text-xs text-stone-500">
            {locale === 'ru'
              ? 'Точные угловые взаимодействия, орбисы и взаимное влияние планет'
              : 'Exact angular aspects, orbs, and planetary interplay'}
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-stone-600">
          <span className="flex items-center space-x-1 px-2 py-0.5 rounded-md bg-sky-50 text-sky-800 border border-sky-200">
            <span className="font-bold">△ ⚹ ☌</span>
            <span>{locale === 'ru' ? 'Гармония' : 'Harmonious'}</span>
          </span>
          <span className="flex items-center space-x-1 px-2 py-0.5 rounded-md bg-rose-50 text-rose-800 border border-rose-200">
            <span className="font-bold">□ ☍</span>
            <span>{locale === 'ru' ? 'Напряжение' : 'Tension'}</span>
          </span>
        </div>
      </div>

      {/* Grid Container */}
      <div className="overflow-x-auto pb-2">
        <table className="w-full border-collapse select-none text-center">
          <thead>
            <tr>
              <th className="p-1 text-[11px] font-bold text-stone-400 bg-stone-50 rounded-tl-xl"></th>
              {gridPlanets.map((colP) => (
                <th
                  key={colP.id}
                  className="p-1.5 text-xs font-bold text-stone-800 bg-stone-50 border-b border-stone-200"
                  title={locale === 'ru' ? colP.nameRu : colP.nameEn}
                >
                  <span className="font-mono text-amber-700">{colP.symbol}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {gridPlanets.map((rowP, rowIdx) => (
              <tr key={rowP.id} className="hover:bg-amber-50/20">
                <td
                  className="p-1.5 text-xs font-bold text-stone-800 bg-stone-50 border-r border-stone-200 text-left whitespace-nowrap"
                  title={locale === 'ru' ? rowP.nameRu : rowP.nameEn}
                >
                  <span className="inline-flex items-center space-x-1.5">
                    <span className="text-amber-700 font-mono">{rowP.symbol}</span>
                    <span className="hidden md:inline text-[11px] text-stone-700">
                      {locale === 'ru' ? rowP.nameRu : rowP.nameEn}
                    </span>
                  </span>
                </td>

                {gridPlanets.map((colP, colIdx) => {
                  if (rowIdx === colIdx) {
                    return (
                      <td key={colP.id} className="p-1 bg-stone-100/60 border border-stone-200 text-stone-300 text-[10px]">
                        —
                      </td>
                    );
                  }

                  // Lower triangular matrix
                  if (rowIdx < colIdx) {
                    return (
                      <td key={colP.id} className="p-1 bg-stone-50/40 border border-stone-100/80"></td>
                    );
                  }

                  const asp = findAspect(rowP.id, colP.id);

                  if (!asp) {
                    return (
                      <td
                        key={colP.id}
                        className="p-1 border border-stone-100 hover:bg-stone-50 transition-colors"
                        onMouseEnter={() => setHoveredCell({ p1: rowP, p2: colP })}
                        onMouseLeave={() => setHoveredCell(null)}
                      >
                        <span className="text-stone-300 text-[10px]">·</span>
                      </td>
                    );
                  }

                  const isHarm = asp.isHarmonious;
                  const glyph = aspectGlyphs[asp.aspectType] || '☌';

                  return (
                    <td
                      key={colP.id}
                      className={`p-1 border transition-all cursor-pointer ${
                        isHarm
                          ? 'bg-sky-50/70 border-sky-200 hover:bg-sky-100'
                          : 'bg-rose-50/70 border-rose-200 hover:bg-rose-100'
                      }`}
                      onMouseEnter={() => setHoveredCell({ p1: rowP, p2: colP, aspect: asp })}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      <div className="flex flex-col items-center justify-center leading-tight py-0.5">
                        <span
                          className={`text-xs font-black ${
                            isHarm ? 'text-sky-700' : 'text-rose-700'
                          }`}
                        >
                          {glyph}
                        </span>
                        <span className="text-[9px] font-mono text-stone-600">
                          {asp.orb}°
                        </span>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Hover Information Banner */}
      <div className="min-h-12 p-3 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-700 flex items-center justify-between">
        {hoveredCell?.aspect ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 w-full">
            <div className="flex items-center space-x-2">
              <span
                className={`px-2 py-0.5 rounded-md font-black text-xs ${
                  hoveredCell.aspect.isHarmonious
                    ? 'bg-sky-100 text-sky-800 border border-sky-300'
                    : 'bg-rose-100 text-rose-800 border border-rose-300'
                }`}
              >
                {aspectGlyphs[hoveredCell.aspect.aspectType]} {hoveredCell.aspect.nameRu}
              </span>
              <span className="font-bold text-stone-900">
                {locale === 'ru' ? hoveredCell.aspect.planet1.nameRu : hoveredCell.aspect.planet1.nameEn}
                {' ↔ '}
                {locale === 'ru' ? hoveredCell.aspect.planet2.nameRu : hoveredCell.aspect.planet2.nameEn}
              </span>
            </div>
            <div className="text-stone-500 font-mono text-[11px]">
              {locale === 'ru' ? `Угол: ${hoveredCell.aspect.actualAngle}°, Орбис: ${hoveredCell.aspect.orb}°` : `Angle: ${hoveredCell.aspect.actualAngle}°, Orb: ${hoveredCell.aspect.orb}°`}
            </div>
          </div>
        ) : hoveredCell ? (
          <span className="text-stone-500">
            {locale === 'ru'
              ? `Нет мажорного аспекта между ${hoveredCell.p1.nameRu} и ${hoveredCell.p2.nameRu}`
              : `No major aspect between ${hoveredCell.p1.nameEn} and ${hoveredCell.p2.nameEn}`}
          </span>
        ) : (
          <span className="text-stone-500">
            {locale === 'ru'
              ? 'Наведите курсор на ячейку матрицы для просмотра расшифровки аспекта и точного орбиса'
              : 'Hover over any matrix cell to view the exact aspect details and orb'}
          </span>
        )}
      </div>
    </div>
  );
};
