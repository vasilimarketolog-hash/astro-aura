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
  HelpCircle,
  Camera,
  Activity,
  AlertTriangle,
  Download,
  Mail,
  CheckCircle
} from 'lucide-react';
import { NatalChartData, SynastryData, HumanDesignData, Locale, CalculationType } from '@/types/astro';
import { generateTeaserInsights, SIGN_INTERPRETATIONS, SIGN_INTERPRETATIONS_EN, SIGN_INTERPRETATIONS_ES } from '@/lib/interpretations';
import { getTranslation } from '@/lib/translations';
import { StoriesCardModal } from './StoriesCardModal';

interface TeaserReportProps {
  locale: Locale;
  calcType?: CalculationType;
  natal: NatalChartData;
  synastry?: SynastryData;
  humanDesign: HumanDesignData;
  onUnlockPaywall: () => void;
}

function formatSnippet(text?: string, limit = 115): string {
  if (!text) return '';
  if (text.length <= limit) return text;
  const sub = text.slice(0, limit);
  const lastSpace = sub.lastIndexOf(' ');
  const trimmed = lastSpace > 20 ? sub.slice(0, lastSpace) : sub;
  const clean = trimmed.replace(/[.,;:\s\-–—!]+$/, '');
  return `${clean}...`;
}

export const TeaserReport: React.FC<TeaserReportProps> = ({
  locale,
  calcType = 'all',
  natal,
  synastry,
  humanDesign,
  onUnlockPaywall
}) => {
  const t = getTranslation(locale);
  const [timeLeft, setTimeLeft] = useState(14 * 60 + 59);
  const [isStoriesOpen, setIsStoriesOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isEmailSaved, setIsEmailSaved] = useState(false);

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

  const insights = generateTeaserInsights(sun.sign.id, moon.sign.id, asc.sign.id, locale);
  const dict = locale === 'es' ? SIGN_INTERPRETATIONS_ES : locale === 'en' ? SIGN_INTERPRETATIONS_EN : SIGN_INTERPRETATIONS;
  const sunData = dict[sun.sign.id] || dict.aries;
  const moonData = dict[moon.sign.id] || dict.cancer;
  const ascData = dict[asc.sign.id] || dict.leo;

  const fullName = `${natal.birthData.name} ${natal.birthData.lastName || ''}`.trim();
  const cityName = locale === 'es' ? (natal.birthData.cityEs || natal.birthData.cityEn || natal.birthData.cityName) : locale === 'en' ? (natal.birthData.cityEn || natal.birthData.cityName) : natal.birthData.cityName;
  let countryName = locale === 'es' ? (natal.birthData.countryEs || natal.birthData.countryEn || natal.birthData.country) : locale === 'en' ? (natal.birthData.countryEn || natal.birthData.country) : natal.birthData.country;
  if (locale === 'en' && countryName) {
    if (countryName === 'Беларусь') countryName = 'Belarus';
    else if (countryName === 'Россия') countryName = 'Russia';
    else if (countryName === 'Казахстан') countryName = 'Kazakhstan';
    else if (countryName === 'Украина') countryName = 'Ukraine';
    else if (countryName === 'Узбекистан') countryName = 'Uzbekistan';
  } else if (locale === 'es' && countryName) {
    if (countryName === 'Беларусь') countryName = 'Bielorrusia';
    else if (countryName === 'Россия') countryName = 'Rusia';
    else if (countryName === 'Казахстан') countryName = 'Kazajistán';
    else if (countryName === 'Украина') countryName = 'Ucrania';
    else if (countryName === 'Узбекистан') countryName = 'Uzbekistán';
  }
  const locationText = `${cityName}${countryName ? `, ${countryName}` : ''}`;

  const getSignName = (s: { nameRu: string; nameEn: string; nameEs?: string }) => {
    if (locale === 'es') return s.nameEs || s.nameEn;
    if (locale === 'en') return s.nameEn;
    return s.nameRu;
  };

  const handlePrintPdf = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsEmailSaved(true);
    }
  };

  // Reusable Component: Human Design Blueprint Card
  const renderHumanDesignCard = (isPrimary = false) => (
    <div
      key="card-hd"
      className={`bg-white rounded-3xl p-6 sm:p-8 mb-8 shadow-md relative overflow-hidden ${
        isPrimary ? 'border-2 border-amber-400 ring-2 ring-amber-300/30' : 'border-2 border-amber-300/80'
      }`}
    >
      {isPrimary && (
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-[11px] font-extrabold uppercase tracking-wider mb-4">
          <Star className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
          <span>{locale === 'ru' ? 'Основной расчет • Дизайн Человека' : locale === 'es' ? 'Cálculo Principal • Diseño Humano' : 'Primary Reading • Human Design'}</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-5">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
              {locale === 'ru' ? 'Дизайн Человека • Энергетический профиль' : locale === 'es' ? 'Diseño Humano • Perfil Energético' : 'Human Design • Energy Blueprint'}
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-stone-900">
              {humanDesign.type} ({humanDesign.profile})
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
            {humanDesign.innerAuthority}
          </span>
        </div>
      </div>

      <p className="text-xs sm:text-sm text-stone-700 leading-relaxed mb-6">
        {locale === 'ru'
          ? `Ваша генетическая стратегия успеха — «${humanDesign.strategy}». В полной версии карты доступен интерактивный 9-центровый векторный бодиграф с расшифровкой определенных и открытых центров.`
          : locale === 'es'
          ? `Tu estrategia genética de éxito es «${humanDesign.strategy}». En la versión completa accedes al biógrafo interactivo de 9 centros con análisis profundo de canales y puertas.`
          : `Your genetic strategy is "${humanDesign.strategy}". The full version includes an interactive 9-center vector bodygraph with deep channel analysis.`}
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-stone-50 border border-stone-200 mb-4">
        <div>
          <span className="text-[10px] uppercase font-bold text-stone-500 block">
            {locale === 'ru' ? 'Стратегия' : locale === 'es' ? 'Estrategia' : 'Strategy'}
          </span>
          <strong className="text-xs text-stone-900 font-semibold line-clamp-1">{humanDesign.strategy}</strong>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-stone-500 block">
            {locale === 'ru' ? 'Авторитет' : locale === 'es' ? 'Autoridad' : 'Authority'}
          </span>
          <strong className="text-xs text-stone-900 font-semibold line-clamp-1">{humanDesign.innerAuthority}</strong>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-stone-500 block">
            {locale === 'ru' ? 'Тема Ложного Я' : locale === 'es' ? 'Tema del No-Ser' : 'Not-Self Theme'}
          </span>
          <strong className="text-xs text-rose-700 font-semibold line-clamp-1">{humanDesign.notSelfTheme}</strong>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-stone-500 block">
            {locale === 'ru' ? 'Определено центров' : locale === 'es' ? 'Centros definidos' : 'Defined Centers'}
          </span>
          <strong className="text-xs text-amber-800 font-semibold">
            {humanDesign.definedCenters.length} {locale === 'ru' ? 'из 9' : locale === 'es' ? 'de 9' : 'of 9'}
          </strong>
        </div>
      </div>

      <button
        type="button"
        onClick={onUnlockPaywall}
        className="w-full py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer print:hidden"
      >
        <Lock className="w-3.5 h-3.5 text-amber-700" />
        <span>{locale === 'ru' ? 'Открыть интерактивный Бодиграф (все 9 центров)' : locale === 'es' ? 'Desbloquear Biógrafo Interactivo (los 9 centros)' : 'Unlock Interactive 9-Center Bodygraph'}</span>
      </button>
    </div>
  );

  // Reusable Component: Synastry Compatibility Card
  const renderSynastryCard = (isPrimary = false) => {
    if (!synastry) return null;
    return (
      <div
        key="card-synastry"
        className={`bg-rose-50/60 rounded-3xl p-6 sm:p-8 mb-8 shadow-xs space-y-4 ${
          isPrimary ? 'border-2 border-rose-300 ring-2 ring-rose-200' : 'border border-rose-200'
        }`}
      >
        {isPrimary && (
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-900 text-[11px] font-extrabold uppercase tracking-wider mb-2">
            <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-500" />
            <span>{locale === 'ru' ? 'Основной расчет • Совместимость' : locale === 'es' ? 'Cálculo Principal • Compatibilidad' : 'Primary Reading • Compatibility'}</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="w-5 h-5 text-rose-500" />
            <span className="font-bold text-stone-900 text-lg sm:text-xl">
              {synastry.person1.birthData.name} + {synastry.person2.birthData.name}
            </span>
          </div>
          <div className="px-3.5 py-1.5 rounded-full bg-rose-100 text-rose-800 font-mono font-bold text-sm sm:text-base">
            {synastry.compatibility.totalScore}%
          </div>
        </div>

        <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
          {synastry.compatibility.verdict}
        </p>

        {/* Red Flag & Shadow Compatibility Teaser */}
        <div className="relative p-4 rounded-2xl bg-white border border-rose-200 overflow-hidden">
          <div className="absolute inset-0 backdrop-blur-[5px] bg-white/80 z-10 flex items-center justify-between px-5">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span className="text-xs font-bold text-stone-900">
                {locale === 'ru' ? '⚠️ Скрытые трения и Red Flags пары (3 триггера)' : locale === 'es' ? '⚠️ Fricciones ocultas y Red Flags de la pareja (3 disparadores)' : '⚠️ Relationship Red Flags & Friction Points'}
              </span>
            </div>
            <button
              type="button"
              onClick={onUnlockPaywall}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold transition-colors cursor-pointer print:hidden"
            >
              {t.unlockButton}
            </button>
          </div>
          <div className="opacity-20 text-xs text-stone-600 select-none">
            {locale === 'ru'
              ? 'Потенциал скрытых обид, финансовый контроль и борьба за лидерство в быту...'
              : locale === 'es'
              ? 'Riesgo de resentimientos reprimidos, disputas financieras y lucha de poder cotidiano...'
              : 'Hidden resentment potential, financial dominance disputes, and household power dynamics...'}
          </div>
        </div>
      </div>
    );
  };

  // Reusable Component: The Big 3 (Sun, Moon, Ascendant)
  const renderBig3Cards = () => (
    <div key="card-big3" className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {/* Sun */}
      <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-3 right-3 text-3xl opacity-10 text-amber-600">☉</div>
        <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block mb-1">
          {t.sunCore}
        </span>
        <div className="text-xl font-black text-stone-900 mb-2 flex items-center space-x-2">
          <span className="text-amber-600">{sun.sign.symbol}</span>
          <span>{getSignName(sun.sign)}</span>
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
          <span>{getSignName(moon.sign)}</span>
          <span className="text-xs font-mono text-stone-500 font-normal">({moon.degreeInSign}°)</span>
        </div>
        <p className="text-xs text-stone-600 leading-relaxed">
          {formatSnippet(moonData?.moonMeaning, 115)}
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
          <span>{getSignName(asc.sign)}</span>
          <span className="text-xs font-mono text-stone-500 font-normal">({asc.degreeInSign}°)</span>
        </div>
        <p className="text-xs text-stone-600 leading-relaxed">
          {formatSnippet(ascData?.ascMeaning, 115)}
        </p>
      </div>
    </div>
  );

  // Reusable Component: Revealed Psychological Dualism Hook
  const renderDualismCard = () => (
    <div key="card-dualism" className="bg-white border-2 border-amber-200 rounded-3xl p-6 sm:p-8 mb-8 shadow-md">
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
  );

  // Reusable Component: Elements Balance
  const renderElementsCard = () => (
    <div key="card-elements" className="bg-white border border-stone-200 rounded-3xl p-6 mb-8 shadow-sm">
      <h3 className="text-base font-bold text-stone-900 mb-3 flex items-center justify-between">
        <span>{t.elementsTitle}</span>
        <span className="text-xs font-bold text-amber-700">
          {t.dominantElementPrefix} {locale === 'es' ? (natal.dominantElement.primaryEs || natal.dominantElement.primaryEn || natal.dominantElement.primary) : locale === 'en' ? (natal.dominantElement.primaryEn || natal.dominantElement.primary) : (natal.dominantElement.primaryRu || natal.dominantElement.primary)}
        </span>
      </h3>
      <div className="grid grid-cols-4 gap-2 text-center text-xs">
        <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200">
          <Flame className="w-4 h-4 text-rose-500 mx-auto mb-1" />
          <span className="text-stone-600 block">{locale === 'ru' ? 'Огонь' : locale === 'es' ? 'Fuego' : 'Fire'}</span>
          <strong className="text-stone-900 text-sm font-bold">{natal.dominantElement.fire}%</strong>
        </div>
        <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
          <Mountain className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
          <span className="text-stone-600 block">{locale === 'ru' ? 'Земля' : locale === 'es' ? 'Tierra' : 'Earth'}</span>
          <strong className="text-stone-900 text-sm font-bold">{natal.dominantElement.earth}%</strong>
        </div>
        <div className="p-3 rounded-2xl bg-sky-50 border border-sky-200">
          <Wind className="w-4 h-4 text-sky-500 mx-auto mb-1" />
          <span className="text-stone-600 block">{locale === 'ru' ? 'Воздух' : locale === 'es' ? 'Aire' : 'Air'}</span>
          <strong className="text-stone-900 text-sm font-bold">{natal.dominantElement.air}%</strong>
        </div>
        <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200">
          <Droplet className="w-4 h-4 text-blue-500 mx-auto mb-1" />
          <span className="text-stone-600 block">{locale === 'ru' ? 'Вода' : locale === 'es' ? 'Agua' : 'Water'}</span>
          <strong className="text-stone-900 text-sm font-bold">{natal.dominantElement.water}%</strong>
        </div>
      </div>
    </div>
  );

  // Locked Sections Tailored to CalcType
  const renderLockedSections = () => {
    let item1Title = t.lockedItem1Title;
    let item1Desc = t.lockedItem1Desc;
    let item1Blurred = locale === 'ru'
      ? 'Ваш второй дом управляется сильной планетой, указывающей на приток капитала через личный бренд, консалтинг и технологии...'
      : locale === 'es'
      ? 'Tu segunda casa está regida por un planeta dominante, indicando ingresos exponenciales mediante marca personal, consultoría e innovación...'
      : 'Your second house is governed by a prominent planetary ruler, indicating wealth inflow via personal branding, advisory, and tech innovations...';

    let item2Title = t.lockedItem2Title;
    let item2Desc = t.lockedItem2Desc;
    let item2Blurred = locale === 'ru'
      ? 'Ваш Северный узел в знаке требует полного отказа от старой привычки жертвовать собой ради одобрения других...'
      : locale === 'es'
      ? 'Tu Nodo Norte te exige despojarte por completo de la tendencia a sacrificarte por aprobación ajena...'
      : 'Your North Node calls for completely shedding the outdated instinct to sacrifice your purpose for external validation...';

    let item3Title = t.lockedItem3Title;
    let item3Desc = t.lockedItem3Desc;
    let item3Blurred = locale === 'ru'
      ? 'Ваша Лилит пробуждает гипнотическое влияние на партнеров через архетип независимости и бескомпромиссной чувственности...'
      : locale === 'es'
      ? 'Tu Lilith despierta un magnetismo hipnótico sobre los demás a través de una autonomía sensual indomable...'
      : 'Your Lilith awakens magnetic influence over partners through uncompromising sensual autonomy and taboo emotional depth...';

    let item4Title = t.lockedItem4Title;
    let item4Desc = t.lockedItem4Desc;
    let item4Blurred = locale === 'ru'
      ? 'Активированные каналы между Сакралом и Горлом открывают доступ к неиссякаемой созидательной силе манифестации...'
      : locale === 'es'
      ? 'Los canales activos entre el Sacral y la Garganta abren acceso a una fuerza creativa inagotable de manifestación...'
      : 'Activated channels between Sacral and Throat unlock access to inexhaustible creative manifestor potential...';

    if (calcType === 'humandesign') {
      item1Title = locale === 'ru' ? '9 Энергетических Центров: Определенные и Открытые зоны' : locale === 'es' ? '9 Centros Energéticos: Definidos y Vulnerabilidades Abiertas' : '9 Energy Centers: Defined & Open Vulnerabilities';
      item1Desc = locale === 'ru' ? 'Где вы излучаете постоянную силу, а где считываете чужую энергию и обуславливаетесь' : locale === 'es' ? 'Dónde irradias fuerza constante y dónde absorbes el condicionamiento ajeno' : 'Where you radiate consistent power vs absorb external conditioning';
      item1Blurred = locale === 'ru' ? 'Ваш открытый центр Солнечного Сплетения усиливает чужие эмоции втрое, создавая ложное чувство вины...' : locale === 'es' ? 'Tu centro del Plexo Solar abierto triplica las emociones ajenas, provocando culpa condicionada...' : 'Your open Solar Plexus triples external emotions, causing conditioned guilt...';

      item2Title = locale === 'ru' ? '36 Каналов Силы и Контуры Интеграции' : locale === 'es' ? '36 Canales de Fuerza y Circuitos de Integración' : '36 Power Channels & Circuitry';
      item2Desc = locale === 'ru' ? 'Ваши устойчивые врожденные сверхспособности и фиксированные паттерны мышления' : locale === 'es' ? 'Tus dones congénitos, mecánica cuántica y patrones de pensamiento definidos' : 'Your innate superpowers, quantum mechanics, and fixed cognitive patterns';
      item2Blurred = locale === 'ru' ? 'Канал 34-20 наделяет вас колоссальной харизмой и способностью действовать в моменте "здесь и сейчас"...' : locale === 'es' ? 'El Canal 34-20 te otorga un carisma magnético y la capacidad de actuar en el aquí y ahora...' : 'Channel 34-20 grants magnetic charisma and instantaneous action in the present moment...';

      item3Title = locale === 'ru' ? 'Генетическая диета и Среда Обитания (PHS)' : locale === 'es' ? 'Dieta Genética y Entorno Ideal (PHS)' : 'Primary Health System & Ideal Environment';
      item3Desc = locale === 'ru' ? 'Как питать мозг и в каких локациях тело чувствует максимальный прилив сил' : locale === 'es' ? 'Cómo nutrir tu cerebro y qué entornos físicos maximizan tu energía vital' : 'Optimal brain nutrition regimen and resonant physical environments';
      item3Blurred = locale === 'ru' ? 'Тип пищеварительной системы требует теплой пищи в спокойной уединенной обстановке без яркого света...' : locale === 'es' ? 'Tu sistema digestivo requiere alimentos templados en un entorno sereno y sin sobreestimulación...' : 'Your digestive constitution requires warm meals in serene, low-stimulus settings...';

      item4Title = locale === 'ru' ? 'Крест Инкарнации (Глобальное Предназначение)' : locale === 'es' ? 'Cruz de Encarnación (Propósito Cósmico del Alma)' : 'Incarnation Cross (Soul’s Cosmic Purpose)';
      item4Desc = locale === 'ru' ? '70% программирования вашей личности: миссия, с которой вы пришли в этот мир' : locale === 'es' ? 'El 70% de tu impronta de neutrinos: la misión trascendente de tu vida' : '70% of your neutrino imprint: the overarching theme of your life incarnation';
      item4Blurred = locale === 'ru' ? 'Ваш Крест Служения направляет вас вести за собой команды через нестандартные творческие решения...' : locale === 'es' ? 'Tu Cruz de Servicio te impulsa a guiar a otros mediante innovación creativa no lineal...' : 'Your Incarnation Cross directs you to guide collectives via non-linear innovation...';
    } else if (calcType === 'synastry') {
      item1Title = locale === 'ru' ? 'Сексуальный и Эмоциональный Резонанс Пары' : locale === 'es' ? 'Matriz de Intimidad Sexual y Emocional' : 'Sexual & Emotional Intimacy Matrix';
      item1Desc = locale === 'ru' ? 'Аспекты Венера-Марс, эротические триггеры и динамика физического влечения' : locale === 'es' ? 'Dinámica Venus-Marte, disparadores de deseo y pasión a largo plazo' : 'Venus-Mars dynamics, sensual triggers, and long-term passion sustainability';
      item1Blurred = locale === 'ru' ? 'Венера партнера в трине к вашему Марсу образует редкую искру моментального и глубокого притяжения...' : locale === 'es' ? 'El trígono de Venus de tu pareja con tu Marte despierta una atracción inmediata y magnética...' : 'Partner’s Venus trine your Mars ignites an instantaneous, magnetic physical resonance...';

      item2Title = locale === 'ru' ? 'Кармические Узлы и Долги Прошлых Воплощений' : locale === 'es' ? 'Lazos Kármicos y Deudas del Pasado' : 'Karmic Ties & Past-Life Debts';
      item2Desc = locale === 'ru' ? 'Для чего судьба свела вас вместе и какие уроки пара обязана пройти' : locale === 'es' ? 'La razón cósmica por la que el destino los unió y los aprendizajes a superar' : 'The evolutionary soul purpose behind your meeting and necessary growth trials';
      item2Blurred = locale === 'ru' ? 'Соединение Лунного Узла с Сатурном указывает на незавершенное кармическое обязательство из прошлого...' : locale === 'es' ? 'La conjunción del Nodo Lunar con Saturno indica un pacto pendiente y resistencia compartida...' : 'Lunar Node conjunct Saturn signifies an unresolved past-life contract and shared endurance...';

      item3Title = locale === 'ru' ? 'Точки Разрыва и Скрытые Провокации' : locale === 'es' ? 'Puntos de Ruptura y Trampas Ocultas' : 'Friction Triggers & Breakup Traps';
      item3Desc = locale === 'ru' ? 'Опасные сценарии обид, борьбы за власть и как предотвратить выгорание союза' : locale === 'es' ? 'Ciclos de resentimiento, luchas de control y cómo proteger la unión' : 'Dangerous resentment loops, dominance battles, and how to safeguard the bond';
      item3Blurred = locale === 'ru' ? 'Квадратура Плутона к Меркурию может приводить к манипулятивному молчанию и проверкам на прочность...' : locale === 'es' ? 'La cuadratura de Plutón con Mercurio puede detonar silencios punitivos y pruebas de poder...' : 'Pluto square Mercury can produce manipulative silent treatments and power tests...';

      item4Title = locale === 'ru' ? 'Сценарий Брака и Совместное Финансовое Поле' : locale === 'es' ? 'Destino Matrimonial y Abundancia Compartida' : 'Marriage Destiny & Shared Prosperity';
      item4Desc = locale === 'ru' ? 'Увеличивает ли союз достаток обоих или ведет к утечкам ресурсов' : locale === 'es' ? 'Si la pareja multiplica la prosperidad mutua o genera fugas de energía' : 'Whether this partnership multiplies abundance or triggers financial leaks';
      item4Blurred = locale === 'ru' ? 'Гармоничный Юпитер во 2-м доме совместной карты сулит кратное расширение материальной базы в браке...' : locale === 'es' ? 'Un Júpiter armónico en la Casa 2 compuesta promete una notable expansión material conjunta...' : 'Harmonious Jupiter in the composite 2nd house promises exponential wealth expansion...';
    }

    const lockedList = [
      { id: 1, title: item1Title, desc: item1Desc, blurred: item1Blurred, iconBg: 'bg-amber-100 text-amber-700 border-amber-300' },
      { id: 2, title: item2Title, desc: item2Desc, blurred: item2Blurred, iconBg: 'bg-purple-100 text-purple-700 border-purple-300' },
      { id: 3, title: item3Title, desc: item3Desc, blurred: item3Blurred, iconBg: 'bg-rose-100 text-rose-800 border-rose-300' },
      { id: 4, title: item4Title, desc: item4Desc, blurred: item4Blurred, iconBg: 'bg-indigo-100 text-indigo-800 border-indigo-300' },
    ];

    return (
      <div key="card-locked" className="space-y-4 mb-10">
        <h3 className="text-lg font-bold text-stone-900 text-center mb-4">
          {t.lockedSectionsTitle}
        </h3>

        {lockedList.map((item) => (
          <div key={item.id} className="relative p-5 rounded-3xl bg-white border border-stone-200 overflow-hidden shadow-sm">
            <div className="absolute inset-0 backdrop-blur-[5px] bg-white/75 z-10 flex items-center justify-between px-6">
              <div className="flex items-center space-x-3">
                <div className={`w-9 h-9 rounded-2xl border flex items-center justify-center shrink-0 ${item.iconBg}`}>
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-sm font-bold text-stone-900 block">
                    {item.title}
                  </span>
                  <span className="text-xs text-stone-600">
                    {item.desc}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={onUnlockPaywall}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-stone-900 to-amber-900 hover:from-black text-white text-xs font-bold transition-colors cursor-pointer shadow-sm shrink-0 print:hidden"
              >
                {t.unlockButton}
              </button>
            </div>
            <div className="opacity-20 select-none text-xs text-stone-600 space-y-2">
              <p>{item.blurred}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-32">
      {/* Top Special Offer Banner */}
      <div className="bg-gradient-to-r from-amber-100/90 via-yellow-50 to-amber-100/90 border border-amber-300 rounded-2xl p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm print:hidden">
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

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
          {/* Download PDF Action */}
          <button
            type="button"
            onClick={handlePrintPdf}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-white border border-stone-300 text-stone-800 hover:bg-stone-50 text-xs font-bold transition-all shadow-xs cursor-pointer"
            title={locale === 'ru' ? 'Скачать отчет в формате PDF' : locale === 'es' ? 'Descargar informe en formato PDF' : 'Download report as PDF'}
          >
            <Download className="w-3.5 h-3.5 text-stone-700" />
            <span>{t.downloadReportPdfBtn || (locale === 'ru' ? 'Скачать PDF' : locale === 'es' ? 'Descargar PDF' : 'Download PDF')}</span>
          </button>

          {/* Stories Generator Action */}
          <button
            type="button"
            onClick={() => setIsStoriesOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-white border border-amber-300 text-stone-800 hover:bg-amber-50 text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5 text-amber-600" />
            <span>{t.shareStoriesBtn || 'Stories 📸'}</span>
          </button>

          {/* Countdown */}
          <div className="flex items-center space-x-2 bg-white/90 px-3.5 py-2 rounded-xl border border-amber-300 shadow-xs">
            <span className="text-xs text-stone-600 font-medium">{t.discountTimer}</span>
            <span className="font-mono text-base font-bold text-amber-800">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      {/* Main Header with personalized Name & City */}
      <div className="text-center mb-8">
        <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold shadow-xs">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t.onlineReportBadge || (locale === 'ru' ? 'Отчет открыт онлайн' : locale === 'es' ? 'Informe en línea' : 'Report open online')}</span>
          </div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-stone-800 text-xs shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>
              {t.forUserPrefix} <strong className="text-stone-900 font-bold">{fullName}</strong> ({locationText})
            </span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-stone-900 mb-3 tracking-tight">
          {calcType === 'humandesign'
            ? t.hdPassportReady
            : calcType === 'synastry'
            ? t.synastryPassportReady
            : t.passportReady}
        </h1>
        <p className="text-sm sm:text-base text-stone-600 max-w-2xl mx-auto leading-relaxed">
          {calcType === 'humandesign'
            ? t.hdSubtext
            : calcType === 'synastry'
            ? t.synastrySubtext
            : `${insights.headline}. ${t.lockedReportSubtext}`}
        </p>
      </div>

      {/* Top Email Backup Bar (Non-blocking notification bar) */}
      <div className="bg-gradient-to-r from-amber-50/90 via-white to-stone-50 border border-amber-200/80 rounded-2xl p-4 sm:p-5 mb-8 shadow-xs print:hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3 text-center sm:text-left">
            <div className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0 text-amber-700">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-stone-900">
                {t.saveEmailTitle}
              </h4>
              <p className="text-[11px] sm:text-xs text-stone-600">
                {t.saveEmailDesc}
              </p>
            </div>
          </div>
          {isEmailSaved ? (
            <div className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold shrink-0">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{t.emailSaved}</span>
            </div>
          ) : (
            <form
              onSubmit={handleEmailSubmit}
              className="flex w-full sm:w-auto items-center gap-2 shrink-0"
            >
              <input
                type="email"
                required
                placeholder={t.saveEmailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-3 py-2 rounded-xl border border-stone-300 bg-white text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 w-full sm:w-56 shadow-xs"
              />
              <button
                type="submit"
                className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
              >
                {t.saveEmailBtn}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* DYNAMIC CARD ORDERING BY MODE */}
      {calcType === 'humandesign' ? (
        <>
          {renderHumanDesignCard(true)}
          {renderBig3Cards()}
          {renderDualismCard()}
          {renderElementsCard()}
        </>
      ) : calcType === 'synastry' ? (
        <>
          {renderSynastryCard(true)}
          {renderBig3Cards()}
          {renderDualismCard()}
          {renderElementsCard()}
          {renderHumanDesignCard(false)}
        </>
      ) : (
        <>
          {renderBig3Cards()}
          {renderDualismCard()}
          {renderElementsCard()}
          {renderHumanDesignCard(false)}
          {synastry && renderSynastryCard(false)}
        </>
      )}

      {/* LOCKED SECTIONS (PAYWALL HOOKS WITH FROSTED GLASS) */}
      {renderLockedSections()}

      {/* Bottom Email Backup Box */}
      <div className="bg-white border-2 border-stone-200 rounded-3xl p-6 sm:p-8 mb-10 shadow-sm print:hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold">
              <Mail className="w-3 h-3 text-amber-700" />
              <span>{locale === 'ru' ? 'Резервная копия отчета' : locale === 'es' ? 'Copia de respaldo del informe' : 'Report Backup'}</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-stone-900">
              {t.bottomEmailTitle}
            </h3>
            <p className="text-xs text-stone-600 max-w-lg leading-relaxed">
              {t.bottomEmailDesc}
            </p>
          </div>

          {isEmailSaved ? (
            <div className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold shrink-0">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{t.emailSaved}</span>
            </div>
          ) : (
            <form
              onSubmit={handleEmailSubmit}
              className="flex w-full sm:w-auto items-center gap-2 shrink-0"
            >
              <input
                type="email"
                required
                placeholder={t.saveEmailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-stone-300 bg-white text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 w-full sm:w-64 shadow-xs"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-sm shrink-0 cursor-pointer"
              >
                {t.bottomEmailBtn}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Floating Sticky Bottom Conversion Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 p-4 bg-white/95 backdrop-blur-md border-t border-stone-200 shadow-2xl print:hidden">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-amber-600 animate-spin" />
            </div>
            <div className="text-left">
              <div className="text-sm font-bold text-stone-900">
                {t.stickyUnlockTitle}
              </div>
              <div className="text-xs text-amber-800 font-semibold">
                {t.trialNotice} <span className="font-black text-stone-900 underline">{t.trialPrice}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onUnlockPaywall}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-stone-900 via-stone-800 to-amber-900 hover:from-black text-white font-bold text-sm shadow-xl shadow-stone-900/15 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Unlock className="w-4 h-4 text-amber-300" />
            <span>{t.openFullAccess}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Instagram/Telegram Stories Modal */}
      <StoriesCardModal
        isOpen={isStoriesOpen}
        onClose={() => setIsStoriesOpen(false)}
        natal={natal}
        locale={locale}
      />
    </div>
  );
};
