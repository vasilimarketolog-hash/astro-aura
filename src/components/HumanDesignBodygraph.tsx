'use client';

import React, { useState } from 'react';
import { HumanDesignData, Locale } from '@/types/astro';
import { Sparkles, Zap, Shield, HelpCircle, CheckCircle2 } from 'lucide-react';

interface HumanDesignBodygraphProps {
  data: HumanDesignData;
  locale: Locale;
}

interface CenterInfo {
  id: string;
  nameRu: string;
  nameEn: string;
  nameEs: string;
  shape: 'triangle_up' | 'triangle_down' | 'square' | 'diamond' | 'triangle_left' | 'triangle_right';
  x: number;
  y: number;
  width: number;
  height: number;
  colorDefined: string;
  meaningDefinedRu: string;
  meaningDefinedEn: string;
  meaningDefinedEs: string;
  meaningOpenRu: string;
  meaningOpenEn: string;
  meaningOpenEs: string;
}

export const HumanDesignBodygraph: React.FC<HumanDesignBodygraphProps> = ({ data, locale }) => {
  const [selectedCenterId, setSelectedCenterId] = useState<string>('sacral');

  const centers: CenterInfo[] = [
    {
      id: 'head',
      nameRu: 'Теменной Центр',
      nameEn: 'Head Center',
      nameEs: 'Centro Coronario / Cabeza',
      shape: 'triangle_up',
      x: 200,
      y: 40,
      width: 44,
      height: 38,
      colorDefined: '#F59E0B',
      meaningDefinedRu: 'Врожденный поток ментального вдохновения. Вы излучаете идеи и зажигаете окружающих своими озарениями.',
      meaningDefinedEn: 'Consistent innate mental inspiration. You radiate thoughts and spark breakthroughs in others.',
      meaningDefinedEs: 'Flujo innato de inspiración mental. Irradias ideas originales e iluminas a quienes te rodean.',
      meaningOpenRu: 'Ментальная свобода. Вы легко считываете чужие мысли, но склонны переживать из-за вещей, которые вас не касаются.',
      meaningOpenEn: 'Fluid mental receptivity. You sense others’ concepts, but must avoid stressing over irrelevant issues.',
      meaningOpenEs: 'Libertad mental abierta. Captas fácilmente los conceptos ajenos; evita estresarte por preguntas irrelevantes.'
    },
    {
      id: 'ajna',
      nameRu: 'Аджна (Центр Осознанности)',
      nameEn: 'Ajna Center',
      nameEs: 'Centro Ajna (Consciencia Mental)',
      shape: 'triangle_down',
      x: 200,
      y: 105,
      width: 46,
      height: 40,
      colorDefined: '#10B981',
      meaningDefinedRu: 'Фиксированный способ мышления и структурирования фактов. Убедительный голос эксперта и аналитическая ясность.',
      meaningDefinedEn: 'Reliable mental processing and conceptual clarity. Authoritative analytical voice.',
      meaningDefinedEs: 'Procesamiento mental estructurado y conceptualización fiable. Voz analítica y persuasiva.',
      meaningOpenRu: 'Гибкий ум без догм. Способность видеть любую ситуацию с 10 разных точек зрения и чувствовать истину.',
      meaningOpenEn: 'Dogma-free open intellect. Gift of grasping multiple perspectives and truth.',
      meaningOpenEs: 'Mente flexible sin dogmas. Capacidad para contemplar cualquier dilema desde múltiples ángulos y discernir la verdad.'
    },
    {
      id: 'throat',
      nameRu: 'Горловой Центр',
      nameEn: 'Throat Center',
      nameEs: 'Centro de la Garganta',
      shape: 'square',
      x: 200,
      y: 180,
      width: 44,
      height: 44,
      colorDefined: '#8B5CF6',
      meaningDefinedRu: 'Центр материализации и голоса. Ваши слова обладают прямым действием и силой менять реальность.',
      meaningDefinedEn: 'Center of manifestation and voice. Your speech creates immediate material shifts.',
      meaningDefinedEs: 'Centro de la manifestación y la voz. Tus palabras poseen un impacto directo capaz de transformar la realidad.',
      meaningOpenRu: 'Дар оратора по запросу. Говорите только тогда, когда вас искренне спросили, — тогда ваши слова исцеляют.',
      meaningOpenEn: 'Selective verbal power. Speak when recognized and invited to deliver maximum impact.',
      meaningOpenEs: 'Poder oratorio bajo demanda. Habla cuando seas genuinamente reconocido e invitado para desatar tu máximo impacto.'
    },
    {
      id: 'gcenter',
      nameRu: 'G-Центр (Идентичность и Любовь)',
      nameEn: 'G-Center',
      nameEs: 'Centro G (Identidad y Amor)',
      shape: 'diamond',
      x: 200,
      y: 265,
      width: 46,
      height: 46,
      colorDefined: '#F59E0B',
      meaningDefinedRu: 'Четкое чувство «Кто я» и куда ведет жизненный путь. Магнетическое притяжение своей стаи и любви.',
      meaningDefinedEn: 'Unwavering sense of identity, self-love, and life trajectory. Magnet for your soul tribe.',
      meaningDefinedEs: 'Sentido inquebrantable de dirección vital e identidad. Atracción magnética hacia tu círculo correcto.',
      meaningOpenRu: 'Хамелеон пространства. Вы зеркалите энергию места: правильное окружение приносит мгновенный взлет.',
      meaningOpenEn: 'Environmental chameleon. Physical spaces dictate your frequency and serendipity.',
      meaningOpenEs: 'Camaleón de entornos. Los espacios físicos determinan tu frecuencia energética y tus sincronías.'
    },
    {
      id: 'ego',
      nameRu: 'Эго / Сердечный Центр',
      nameEn: 'Heart / Ego Center',
      nameEs: 'Centro del Ego / Corazón',
      shape: 'triangle_left',
      x: 275,
      y: 285,
      width: 36,
      height: 34,
      colorDefined: '#EF4444',
      meaningDefinedRu: 'Стальная сила воли, умение зарабатывать капитал и держать обещания. Врожденная ценность своего труда.',
      meaningDefinedEn: 'Steely willpower, commercial competence, and high self-worth in material negotiations.',
      meaningDefinedEs: 'Fuerza de voluntad firme, maestría material y cumplimiento de compromisos. Autovaloración innata.',
      meaningOpenRu: 'Вам ничего не нужно доказывать миру. Избегайте клятв и обещаний из чувства вины или гордости.',
      meaningOpenEn: 'Nothing to prove to anyone. Liberate yourself from making promises to validate worth.',
      meaningOpenEs: 'No tienes nada que demostrar a nadie. Libérate de hacer promesas para validar tu valor ante el mundo.'
    },
    {
      id: 'spleen',
      nameRu: 'Центр Селезенки (Интуиция тела)',
      nameEn: 'Spleen Center',
      nameEs: 'Centro del Bazo (Intuición)',
      shape: 'triangle_right',
      x: 105,
      y: 360,
      width: 46,
      height: 46,
      colorDefined: '#06B6D4',
      meaningDefinedRu: 'Мгновенная интуиция выживания «здесь и сейчас». Вы кожей чувствуете опасность и безопасных людей.',
      meaningDefinedEn: 'Instant sensory survival instinct. Spontaneous gut knowing of safe people and timing.',
      meaningDefinedEs: 'Instinto de supervivencia espontáneo en el ahora. Detectas al instante la seguridad de personas y situaciones.',
      meaningOpenRu: 'Глубокая чуткость к здоровью и атмосфере. Ловушка: цепляться за то, что уже отжило (отношения, работа).',
      meaningOpenEn: 'High somatic empathy. Pitfall: holding on to relationships or habits that no longer serve.',
      meaningOpenEs: 'Alta empatía somática hacia la salud y el ambiente. Cuidado con apegarte a vínculos o hábitos que ya caducaron.'
    },
    {
      id: 'solar',
      nameRu: 'Солнечное Сплетение (Эмоции)',
      nameEn: 'Solar Plexus Center',
      nameEs: 'Plexo Solar (Emociones)',
      shape: 'triangle_left',
      x: 295,
      y: 360,
      width: 46,
      height: 46,
      colorDefined: '#EC4899',
      meaningDefinedRu: 'Эмоциональная волна. Истина не бывает в моменте — дайте себе переспать с решением, чтобы пришла ясность.',
      meaningDefinedEn: 'Emotional wave frequency. No truth in the moment — wait for clarity over sleep.',
      meaningDefinedEs: 'Ola emocional constante. No hay verdad en el momento: date tiempo para madurar tus decisiones con claridad.',
      meaningOpenRu: 'Эмоциональный эмпат. Вы впитываете чужие настроения в 2 раза сильнее. Учитесь отличать свое от чужого.',
      meaningOpenEn: 'Emotional empath. You amplify ambient moods. Cultivate boundaries and peaceful clarity.',
      meaningOpenEs: 'Empatía emocional amplificada. Filtras y absorbes las emociones del entorno; establece límites de paz interior.'
    },
    {
      id: 'sacral',
      nameRu: 'Сакральный Центр (Жизненная сила)',
      nameEn: 'Sacral Center',
      nameEs: 'Centro Sacral (Energía Vital)',
      shape: 'square',
      x: 200,
      y: 370,
      width: 50,
      height: 50,
      colorDefined: '#F59E0B',
      meaningDefinedRu: 'Неиссякаемый мотор жизненной и сексуальной энергии. Откликайтесь звуками («угу» / «не-а») на любимое дело.',
      meaningDefinedEn: 'Boundless generative life and sexual generator. Respond organically through bodily gut feeling.',
      meaningDefinedEs: 'Motor inagotable de energía vital y creativa. Responde desde el cuerpo y las vísceras a lo que amas hacer.',
      meaningOpenRu: 'Энергетический мудрец. Вы не созданы для 8-часового физического рабства. Отдыхайте до того, как устали.',
      meaningOpenEn: 'Wisdom of vitality. Not built for repetitive endurance. Rest before fatigue sets in.',
      meaningOpenEs: 'Sabiduría energética. No estás diseñado para el esfuerzo agotador monótono. Descansa antes de la fatiga.'
    },
    {
      id: 'root',
      nameRu: 'Корневой Центр (Драйв и Давление)',
      nameEn: 'Root Center',
      nameEs: 'Centro Raíz (Presión y Resiliencia)',
      shape: 'square',
      x: 200,
      y: 465,
      width: 46,
      height: 46,
      colorDefined: '#D97706',
      meaningDefinedRu: 'Природная стрессоустойчивость. Давление дедлайнов вас зажигает и мобилизует для прорывов.',
      meaningDefinedEn: 'Innate pressure resilience. Deadlines fuel your adrenaline and propel massive output.',
      meaningDefinedEs: 'Resiliencia innata bajo presión. Los plazos y la tensión movilizan tu adrenalina para grandes avances.',
      meaningOpenRu: 'Чувствительность к спешке. Не поддавайтесь чужому стрессу и не бегите быстрее, чем требует тело.',
      meaningOpenEn: 'Susceptible to external hurry. Ground yourself and never rush under others’ anxiety.',
      meaningOpenEs: 'Sensibilidad a la prisa ajena. Encuentra tu centro y nunca corras bajo la ansiedad o urgencia de otros.'
    }
  ];

  const isDefined = (center: CenterInfo) => {
    return data.definedCenters.some((dc) => {
      const lower = dc.toLowerCase();
      return (
        lower.includes(center.id) ||
        lower.includes(center.nameRu.toLowerCase().replace(' центр', '')) ||
        lower.includes(center.nameEn.toLowerCase().replace(' center', '')) ||
        (center.nameEs && lower.includes(center.nameEs.toLowerCase().replace(' centro', '')))
      );
    });
  };

  const selectedCenter = centers.find((c) => c.id === selectedCenterId) || centers[0];
  const selectedIsDefined = isDefined(selectedCenter);

  return (
    <div className="space-y-8">
      {/* Top Bio / Archetype Banner */}
      <div className="bg-white border-2 border-amber-300 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-amber-800 font-bold mb-1">
              {locale === 'ru' ? 'Генетический Тип Дизайна Человека' : locale === 'es' ? 'Tipo Genético de Diseño Humano' : 'Human Design Genetic Type'}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 flex items-center space-x-2">
              <span>{data.type}</span>
              <span className="text-base sm:text-lg text-amber-700 font-mono font-bold">
                ({data.profile})
              </span>
            </h2>
          </div>

          <div className="px-4 py-2 rounded-2xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900 shadow-xs">
            {locale === 'ru' ? 'Авторитет:' : locale === 'es' ? 'Autoridad Interna:' : 'Inner Authority:'} <span className="underline">{data.innerAuthority}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
            <span className="text-stone-500 block mb-0.5">{locale === 'ru' ? 'Стратегия жизни:' : locale === 'es' ? 'Estrategia de vida:' : 'Strategy:'}</span>
            <strong className="text-stone-900">{data.strategy}</strong>
          </div>
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
            <span className="text-stone-500 block mb-0.5">{locale === 'ru' ? 'Тема ложного Я:' : locale === 'es' ? 'Tema del No-Ser:' : 'Not-Self Theme:'}</span>
            <strong className="text-rose-700">{data.notSelfTheme}</strong>
          </div>
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
            <span className="text-stone-500 block mb-0.5">{locale === 'ru' ? 'Определенность:' : locale === 'es' ? 'Definición:' : 'Definition:'}</span>
            <strong className="text-stone-900">{data.definition}</strong>
          </div>
        </div>
      </div>

      {/* Main Interactive Bodygraph Canvas & Detail Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* SVG Canvas (Left 6 cols) */}
        <div className="lg:col-span-6 bg-white border border-stone-200 rounded-3xl p-6 shadow-sm flex flex-col items-center select-none">
          <div className="text-center mb-4">
            <h3 className="text-base font-bold text-stone-900 flex items-center justify-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>{locale === 'ru' ? 'Интерактивная карта 9 Центров' : locale === 'es' ? 'Mapa Interactivo de los 9 Centros' : 'Interactive 9 Centers Bodygraph'}</span>
            </h3>
            <p className="text-xs text-stone-500">
              {locale === 'ru' ? 'Нажмите на любой центр для подробного разбора' : locale === 'es' ? 'Haz clic en cualquier centro para ver su análisis energético' : 'Click any center for energetic interpretation'}
            </p>
          </div>

          <svg
            viewBox="0 0 400 520"
            className="w-full max-w-[380px] h-auto drop-shadow-xs"
          >
            {/* Background Body Silhouette Outline */}
            <path
              d="M 200,20 C 230,20 250,50 250,90 C 250,130 230,160 200,160 C 170,160 150,130 150,90 C 150,50 170,20 200,20 Z"
              fill="#FAF8F5"
              stroke="#E5E7EB"
              strokeWidth="1"
            />
            <path
              d="M 120,200 C 160,170 240,170 280,200 C 330,250 350,380 320,490 C 280,510 120,510 80,490 C 50,380 70,250 120,200 Z"
              fill="#FAF8F5"
              stroke="#E5E7EB"
              strokeWidth="1"
            />

            {/* Connecting Channels */}
            <g stroke="#D1D5DB" strokeWidth="2.5" strokeLinecap="round">
              <line x1="200" y1="58" x2="200" y2="85" />
              <line x1="200" y1="125" x2="200" y2="158" />
              <line x1="200" y1="202" x2="200" y2="242" />
              <line x1="210" y1="195" x2="265" y2="280" />
              <line x1="180" y1="200" x2="120" y2="340" />
              <line x1="220" y1="200" x2="280" y2="340" />
              <line x1="220" y1="265" x2="260" y2="285" />
              <line x1="200" y1="288" x2="200" y2="345" />
              <line x1="125" y1="360" x2="175" y2="370" />
              <line x1="115" y1="375" x2="180" y2="455" />
              <line x1="275" y1="360" x2="225" y2="370" />
              <line x1="285" y1="375" x2="220" y2="455" />
              <line x1="200" y1="395" x2="200" y2="442" />
            </g>

            {/* 9 Centers Rendering */}
            {centers.map((center) => {
              const defined = isDefined(center);
              const isSelected = selectedCenterId === center.id;
              const fill = defined ? center.colorDefined : '#FFFFFF';
              const stroke = isSelected ? '#1C1917' : defined ? '#B45309' : '#9CA3AF';
              const strokeWidth = isSelected ? 3 : 1.5;

              return (
                <g
                  key={center.id}
                  className="cursor-pointer transition-transform duration-200"
                  onClick={() => setSelectedCenterId(center.id)}
                >
                  {/* Shapes */}
                  {center.shape === 'triangle_up' && (
                    <polygon
                      points={`${center.x},${center.y - center.height / 2} ${center.x - center.width / 2},${center.y + center.height / 2} ${center.x + center.width / 2},${center.y + center.height / 2}`}
                      fill={fill}
                      stroke={stroke}
                      strokeWidth={strokeWidth}
                    />
                  )}
                  {center.shape === 'triangle_down' && (
                    <polygon
                      points={`${center.x - center.width / 2},${center.y - center.height / 2} ${center.x + center.width / 2},${center.y - center.height / 2} ${center.x},${center.y + center.height / 2}`}
                      fill={fill}
                      stroke={stroke}
                      strokeWidth={strokeWidth}
                    />
                  )}
                  {center.shape === 'square' && (
                    <rect
                      x={center.x - center.width / 2}
                      y={center.y - center.height / 2}
                      width={center.width}
                      height={center.height}
                      rx="6"
                      fill={fill}
                      stroke={stroke}
                      strokeWidth={strokeWidth}
                    />
                  )}
                  {center.shape === 'diamond' && (
                    <polygon
                      points={`${center.x},${center.y - center.height / 2} ${center.x + center.width / 2},${center.y} ${center.x},${center.y + center.height / 2} ${center.x - center.width / 2},${center.y}`}
                      fill={fill}
                      stroke={stroke}
                      strokeWidth={strokeWidth}
                    />
                  )}
                  {center.shape === 'triangle_left' && (
                    <polygon
                      points={`${center.x - center.width / 2},${center.y} ${center.x + center.width / 2},${center.y - center.height / 2} ${center.x + center.width / 2},${center.y + center.height / 2}`}
                      fill={fill}
                      stroke={stroke}
                      strokeWidth={strokeWidth}
                    />
                  )}
                  {center.shape === 'triangle_right' && (
                    <polygon
                      points={`${center.x + center.width / 2},${center.y} ${center.x - center.width / 2},${center.y - center.height / 2} ${center.x - center.width / 2},${center.y + center.height / 2}`}
                      fill={fill}
                      stroke={stroke}
                      strokeWidth={strokeWidth}
                    />
                  )}

                  {/* Center Dot or Label */}
                  <circle
                    cx={center.x}
                    cy={center.y}
                    r={isSelected ? 4 : 2.5}
                    fill={defined ? '#FFFFFF' : '#6B7280'}
                  />
                </g>
              );
            })}
          </svg>

          {/* Legend */}
          <div className="flex items-center space-x-4 text-xs mt-3 pt-3 border-t border-stone-100">
            <div className="flex items-center space-x-1.5">
              <span className="w-3.5 h-3.5 rounded-sm bg-amber-500 border border-amber-600 shadow-2xs" />
              <span className="text-stone-700 font-medium">{locale === 'ru' ? 'Определенный' : locale === 'es' ? 'Definido (Fuerza fija)' : 'Defined (Innate)'}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3.5 h-3.5 rounded-sm bg-white border border-stone-300 shadow-2xs" />
              <span className="text-stone-700 font-medium">{locale === 'ru' ? 'Открытый' : locale === 'es' ? 'Abierto (Receptivo)' : 'Open (Receptive)'}</span>
            </div>
          </div>
        </div>

        {/* Selected Center Deep Card (Right 6 cols) */}
        <div className="lg:col-span-6 bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-amber-800 font-bold">
                {locale === 'ru' ? 'Разбор энергетического центра' : locale === 'es' ? 'Análisis del Centro Energético' : 'Center Deep Dive'}
              </span>
              <h3 className="text-xl font-black text-stone-900">
                {locale === 'ru' ? selectedCenter.nameRu : locale === 'es' ? (selectedCenter.nameEs || selectedCenter.nameEn) : selectedCenter.nameEn}
              </h3>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                selectedIsDefined
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-stone-100 text-stone-700 border border-stone-300'
              }`}
            >
              {selectedIsDefined
                ? locale === 'ru'
                  ? '✦ Определен (Ваша сила)'
                  : locale === 'es'
                  ? '✦ Definido (Poder fijo)'
                  : '✦ Defined (Fixed Power)'
                : locale === 'ru'
                ? '○ Открыт (Зона мудрости)'
                : locale === 'es'
                ? '○ Abierto (Sabiduría)'
                : '○ Open (Wisdom Zone)'}
            </span>
          </div>

          <p className="text-sm text-stone-700 leading-relaxed">
            {selectedIsDefined
              ? locale === 'ru'
                ? selectedCenter.meaningDefinedRu
                : locale === 'es'
                ? (selectedCenter.meaningDefinedEs || selectedCenter.meaningDefinedEn)
                : selectedCenter.meaningDefinedEn
              : locale === 'ru'
              ? selectedCenter.meaningOpenRu
              : locale === 'es'
              ? (selectedCenter.meaningOpenEs || selectedCenter.meaningOpenEn)
              : selectedCenter.meaningOpenEn}
          </p>

          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-stone-800 space-y-2">
            <strong className="text-amber-950 font-bold flex items-center space-x-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-600" />
              <span>{locale === 'ru' ? 'Практическая рекомендация:' : locale === 'es' ? 'Recomendación práctica:' : 'Actionable Advice:'}</span>
            </strong>
            <p>
              {selectedIsDefined
                ? locale === 'ru'
                  ? 'Доверяйте этому центру как постоянной внутренней опоре. В нем у вас нет дефицита энергии — он работает независимо от внешних обстоятельств.'
                  : locale === 'es'
                  ? 'Confía en este centro como tu pilar interno constante. Aquí tu energía fluye de forma autónoma y no dependes del entorno.'
                  : 'Rely on this center as your fixed pillar. Energy here is constant and autonomous.'
                : locale === 'ru'
                ? 'Не принимайте чужие мысли, эмоции и спешку за свои. Ваша сила здесь — наблюдать и оставаться свободным.'
                : locale === 'es'
                ? 'No tomes como propios los pensamientos, emociones o prisas ajenas. Tu don aquí es la sabiduría de observar sin apegarte.'
                : 'Do not internalize surrounding anxiety or pressure. Your gift is discernment and neutrality.'}
            </p>
          </div>

          {/* Key Strengths & Growth Zone */}
          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              {locale === 'ru' ? 'Врожденные суперсилы:' : locale === 'es' ? 'Superpoderes innatos:' : 'Innate Superpowers:'}
            </h4>
            <ul className="space-y-1.5 text-xs text-stone-700">
              {data.keyStrengths.map((str, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
