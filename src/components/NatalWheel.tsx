'use client';

import React, { useState } from 'react';
import { NatalChartData, PlanetPosition } from '@/types/astro';
import { ZODIAC_SIGNS } from '@/lib/astroEngine';

interface NatalWheelProps {
  chart: NatalChartData;
  onSelectPlanet?: (planet: PlanetPosition) => void;
}

export const NatalWheel: React.FC<NatalWheelProps> = ({ chart, onSelectPlanet }) => {
  const [hoveredPlanet, setHoveredPlanet] = useState<PlanetPosition | null>(null);

  const size = 520;
  const center = size / 2;
  const outerRadius = 240;
  const zodiacInnerRadius = 205;
  const housesInnerRadius = 175;
  const planetsRadius = 145;
  const centerRadius = 45;

  const ascLon = chart.ascendant.longitude;

  const lonToAngle = (lon: number) => {
    const relLon = lon - ascLon;
    const svgAngle = (180 - relLon) * (Math.PI / 180);
    return svgAngle;
  };

  const getCoordinates = (lon: number, radius: number) => {
    const angle = lonToAngle(lon);
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle)
    };
  };

  const describeArc = (startLon: number, endLon: number, rIn: number, rOut: number) => {
    const startIn = getCoordinates(startLon, rIn);
    const endIn = getCoordinates(endLon, rIn);
    const startOut = getCoordinates(startLon, rOut);
    const endOut = getCoordinates(endLon, rOut);

    return `M ${startOut.x} ${startOut.y}
            A ${rOut} ${rOut} 0 0 0 ${endOut.x} ${endOut.y}
            L ${endIn.x} ${endIn.y}
            A ${rIn} ${rIn} 0 0 1 ${startIn.x} ${startIn.y}
            Z`;
  };

  return (
    <div className="relative flex flex-col items-center justify-center select-none">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-full max-w-[480px] h-auto drop-shadow-md"
      >
        <defs>
          <radialGradient id="centerGlowLight" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FEF3C7" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#FAF8F5" stopOpacity="0.9" />
          </radialGradient>
        </defs>

        {/* Outer Background Circles (Warm parchment & gold) */}
        <circle cx={center} cy={center} r={outerRadius} fill="#FFFFFF" stroke="#D97706" strokeWidth="1.5" />
        <circle cx={center} cy={center} r={zodiacInnerRadius} fill="#FAF8F5" stroke="#E5E7EB" strokeWidth="1" />
        <circle cx={center} cy={center} r={housesInnerRadius} fill="#FFFFFF" stroke="#D1D5DB" strokeWidth="1" />
        <circle cx={center} cy={center} r={centerRadius} fill="url(#centerGlowLight)" stroke="#F59E0B" strokeWidth="1.5" />

        {/* 12 Zodiac Sign Segments with pastel accents */}
        {ZODIAC_SIGNS.map((sign, index) => {
          const startDeg = index * 30;
          const endDeg = (index + 1) * 30;
          const midDeg = startDeg + 15;
          const labelPos = getCoordinates(midDeg, (outerRadius + zodiacInnerRadius) / 2);

          const isFire = sign.element === 'Огонь';
          const isEarth = sign.element === 'Земля';
          const isAir = sign.element === 'Воздух';

          const fillColor = isFire
            ? 'rgba(254, 226, 226, 0.45)'
            : isEarth
            ? 'rgba(209, 250, 229, 0.45)'
            : isAir
            ? 'rgba(224, 242, 254, 0.45)'
            : 'rgba(238, 242, 255, 0.45)';

          const glyphColor = isFire
            ? '#DC2626'
            : isEarth
            ? '#059669'
            : isAir
            ? '#0284C7'
            : '#4F46E5';

          return (
            <g key={sign.id}>
              <path
                d={describeArc(startDeg, endDeg, zodiacInnerRadius, outerRadius)}
                fill={fillColor}
                stroke="#E5E7EB"
                strokeWidth="0.8"
              />
              <text
                x={labelPos.x}
                y={labelPos.y + 5}
                fill={glyphColor}
                fontSize="15"
                fontWeight="900"
                textAnchor="middle"
              >
                {sign.symbol}
              </text>
            </g>
          );
        })}

        {/* 12 House Cusps Lines */}
        {chart.houses.map((house) => {
          const pOuter = getCoordinates(house.longitude, zodiacInnerRadius);
          const pInner = getCoordinates(house.longitude, centerRadius);
          const isAngle = house.house === 1 || house.house === 4 || house.house === 7 || house.house === 10;

          return (
            <g key={house.house}>
              <line
                x1={pInner.x}
                y1={pInner.y}
                x2={pOuter.x}
                y2={pOuter.y}
                stroke={isAngle ? '#B45309' : '#D1D5DB'}
                strokeWidth={isAngle ? 1.8 : 0.8}
                strokeDasharray={isAngle ? 'none' : '2,3'}
                opacity={isAngle ? 1 : 0.7}
              />
            </g>
          );
        })}

        {/* Major Aspect Lines across center */}
        {chart.aspects.map((asp, i) => {
          const p1 = getCoordinates(asp.planet1.longitude, centerRadius + 2);
          const p2 = getCoordinates(asp.planet2.longitude, centerRadius + 2);

          const strokeColor = asp.isHarmonious ? '#0284C7' : '#E11D48';

          return (
            <line
              key={i}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke={strokeColor}
              strokeWidth={asp.aspectType === 'conjunction' || asp.aspectType === 'trine' ? 1.4 : 0.8}
              opacity={0.55}
            />
          );
        })}

        {/* Planetary Glyphs */}
        {chart.planets.map((planet, idx) => {
          const r = planetsRadius + ((idx % 3) - 1) * 14;
          const pos = getCoordinates(planet.longitude, r);
          const isSelected = hoveredPlanet?.id === planet.id;

          return (
            <g
              key={planet.id}
              className="cursor-pointer transition-transform duration-200"
              onMouseEnter={() => setHoveredPlanet(planet)}
              onMouseLeave={() => setHoveredPlanet(null)}
              onClick={() => onSelectPlanet && onSelectPlanet(planet)}
            >
              <circle
                cx={pos.x}
                cy={pos.y}
                r={isSelected ? 14 : 10.5}
                fill={isSelected ? '#F59E0B' : '#FFFFFF'}
                stroke={isSelected ? '#D97706' : planet.isRetrograde ? '#DC2626' : '#78716C'}
                strokeWidth={isSelected ? 2 : planet.isRetrograde ? 1.6 : 1.2}
                className="shadow-xs"
              />
              <text
                x={pos.x}
                y={pos.y + 4}
                fill={isSelected ? '#FFFFFF' : '#1C1917'}
                fontSize={isSelected ? '12' : '10'}
                fontWeight="900"
                textAnchor="middle"
              >
                {planet.symbol}
              </text>
              {planet.isRetrograde && (
                <text
                  x={pos.x + 8}
                  y={pos.y - 6}
                  fill="#DC2626"
                  fontSize="8"
                  fontWeight="bold"
                >
                  ℞
                </text>
              )}
            </g>
          );
        })}

        {/* Part of Fortune Glyph (⊗) */}
        {chart.partOfFortune && (() => {
          const pfPos = getCoordinates(chart.partOfFortune.longitude, planetsRadius + 7);
          const isSelected = hoveredPlanet?.id === chart.partOfFortune.id;
          return (
            <g
              key="partoffortune"
              className="cursor-pointer transition-transform duration-200"
              onMouseEnter={() => setHoveredPlanet(chart.partOfFortune)}
              onMouseLeave={() => setHoveredPlanet(null)}
              onClick={() => onSelectPlanet && onSelectPlanet(chart.partOfFortune)}
            >
              <circle
                cx={pfPos.x}
                cy={pfPos.y}
                r={isSelected ? 13 : 9.5}
                fill={isSelected ? '#F59E0B' : '#FEF3C7'}
                stroke="#D97706"
                strokeWidth={1.5}
              />
              <text
                x={pfPos.x}
                y={pfPos.y + 3.5}
                fill="#92400E"
                fontSize={isSelected ? '11' : '9.5'}
                fontWeight="bold"
                textAnchor="middle"
              >
                ⊗
              </text>
            </g>
          );
        })()}

        {/* Center Mystic Emblem */}
        <text
          x={center}
          y={center + 4}
          fill="#D97706"
          fontSize="15"
          fontWeight="bold"
          textAnchor="middle"
        >
          ✦
        </text>
      </svg>

      {/* Hover Information Badge */}
      <div className="h-10 mt-3 text-center">
        {hoveredPlanet ? (
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white border border-amber-300 text-xs shadow-md">
            <span className="text-amber-700 font-bold">{hoveredPlanet.symbol} {hoveredPlanet.nameRu}</span>
            {hoveredPlanet.isRetrograde && (
              <span className="px-1.5 py-0.2 rounded-md bg-rose-100 text-rose-700 font-bold text-[10px]">
                ℞ Ретро
              </span>
            )}
            <span className="text-stone-800">в знаке {hoveredPlanet.sign.nameRu} ({hoveredPlanet.degreeInSign}° {hoveredPlanet.minuteInSign}&apos;)</span>
            <span className="text-stone-500">• Дом {hoveredPlanet.house}</span>
          </div>
        ) : (
          <span className="text-xs text-stone-500">
            Наведите на планету или Точку Фортуны (⊗) для просмотра координат
          </span>
        )}
      </div>
    </div>
  );
};
