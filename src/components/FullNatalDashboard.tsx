'use client';

import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Heart,
  Briefcase,
  Compass,
  Fingerprint,
  MessageCircle,
  Download,
  CheckCircle2,
  Star,
  Calendar,
  MapPin,
  Clock,
  Loader2
} from 'lucide-react';
import { NatalChartData, SynastryData, HumanDesignData, PlanetPosition, Locale } from '@/types/astro';
import { SIGN_INTERPRETATIONS } from '@/lib/interpretations';
import { getTranslation } from '@/lib/translations';
import { calculateNatalChart } from '@/lib/astroEngine';
import { NatalWheel } from './NatalWheel';
import { AIAstrologerChat } from './AIAstrologerChat';
import { AspectGrid } from './AspectGrid';
import { AstrodynesCard } from './AstrodynesCard';
import { HumanDesignBodygraph } from './HumanDesignBodygraph';
import { RedFlagScanner } from './RedFlagScanner';
import { LilithCard } from './LilithCard';
import { StoriesCardModal } from './StoriesCardModal';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface FullNatalDashboardProps {
  locale: Locale;
  natal: NatalChartData;
  synastry?: SynastryData;
  humanDesign: HumanDesignData;
}

export const FullNatalDashboard: React.FC<FullNatalDashboardProps> = ({
  locale,
  natal,
  synastry,
  humanDesign
}) => {
  const t = getTranslation(locale);
  const [activeTab, setActiveTab] = useState<
    'personality' | 'love' | 'career' | 'karma' | 'synastry' | 'humandesign' | 'chat'
  >('personality');
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetPosition | null>(null);
  const [houseSystem, setHouseSystem] = useState<'placidus' | 'equal' | 'wholesign'>(
    natal.birthData.houseSystem || 'placidus'
  );
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isStoriesOpen, setIsStoriesOpen] = useState(false);
  const printableRef = useRef<HTMLDivElement>(null);

  // Dynamic recalculation when switching house system
  const currentNatal = React.useMemo(() => {
    return calculateNatalChart({ ...natal.birthData, houseSystem });
  }, [natal.birthData, houseSystem]);

  const fullName = `${currentNatal.birthData.name} ${currentNatal.birthData.lastName || ''}`.trim();
  const locationText = `${currentNatal.birthData.cityName}${currentNatal.birthData.country ? `, ${currentNatal.birthData.country}` : ''}`;

  const sun = currentNatal.planets.find((p) => p.id === 'sun')!;
  const moon = currentNatal.planets.find((p) => p.id === 'moon')!;
  const venus = currentNatal.planets.find((p) => p.id === 'venus')!;
  const mars = currentNatal.planets.find((p) => p.id === 'mars')!;
  const jupiter = currentNatal.planets.find((p) => p.id === 'jupiter')!;
  const saturn = currentNatal.planets.find((p) => p.id === 'saturn')!;
  const lilith = currentNatal.planets.find((p) => p.id === 'lilith');
  const node = currentNatal.planets.find((p) => p.id === 'northnode');
  const asc = currentNatal.ascendant;
  const mc = currentNatal.midheaven;

  const sunData = SIGN_INTERPRETATIONS[sun.sign.id];
  const moonData = SIGN_INTERPRETATIONS[moon.sign.id];
  const ascData = SIGN_INTERPRETATIONS[asc.sign.id];
  const venusData = SIGN_INTERPRETATIONS[venus.sign.id];
  const marsData = SIGN_INTERPRETATIONS[mars.sign.id];

  const handleDownloadPdf = async () => {
    if (!printableRef.current) return;
    setIsGeneratingPdf(true);

    try {
      const element = printableRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#FAF8F5'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = pdfHeight;
      let position = 0;
      const pageHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }

      const safeName = fullName.replace(/[^a-zA-Zа-яА-Я0-9]/g, '_');
      pdf.save(`Natal_Chart_${safeName}.pdf`);
    } catch (e) {
      console.error('PDF export failed, triggering print dialog instead:', e);
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Personalized Printable Container */}
      <div ref={printableRef} className="space-y-8">
        {/* Certificate / Official Header Bar */}
        <div className="bg-white border-2 border-amber-300 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-2 right-4 text-7xl opacity-5 text-amber-700 font-serif select-none pointer-events-none">
            ✦
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold mb-3">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t.premiumActive}</span>
              </div>

              <div className="text-xs uppercase tracking-widest text-amber-800 font-mono font-bold mb-1">
                {t.forPersonHeader}
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-stone-900 mb-2 tracking-tight">
                {locale === 'ru' ? `Для ${fullName} из г. ${natal.birthData.cityName}` : `For ${fullName} from ${natal.birthData.cityName}`}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-stone-600 pt-1">
                <span className="flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-600" />
                  <span>
                    {natal.birthData.day}.{String(natal.birthData.month).padStart(2, '0')}.{natal.birthData.year}
                  </span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>
                    {String(natal.birthData.hour).padStart(2, '0')}:{String(natal.birthData.minute).padStart(2, '0')} (UTC+{natal.birthData.timezoneOffset})
                  </span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-600" />
                  <span>
                    {locationText} ({natal.birthData.latitude.toFixed(2)}°, {natal.birthData.longitude.toFixed(2)}°)
                  </span>
                </span>
              </div>
            </div>

            {/* Actions (Excluded from print) */}
            <div className="flex flex-wrap items-center gap-3 print:hidden">
              <button
                onClick={() => setIsStoriesOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-300 hover:bg-amber-100 text-stone-900 text-xs sm:text-sm font-bold transition-all flex items-center space-x-2 cursor-pointer shadow-xs"
              >
                <span>📸</span>
                <span>{t.shareStoriesBtn}</span>
              </button>

              <button
                onClick={() => setActiveTab('chat')}
                className="px-4 py-2.5 rounded-xl bg-stone-100 border border-stone-300 hover:bg-stone-200 text-stone-900 text-xs sm:text-sm font-bold transition-all flex items-center space-x-2 cursor-pointer shadow-xs"
              >
                <MessageCircle className="w-4 h-4 text-amber-600" />
                <span>{t.askAstrologerBtn}</span>
              </button>

              <button
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-stone-950 font-black text-xs sm:text-sm transition-all flex items-center space-x-2 cursor-pointer shadow-md shadow-amber-500/20 disabled:opacity-50"
              >
                {isGeneratingPdf ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{t.generatingPdf}</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>{t.downloadPdfBtn}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* House System Switcher Bar (Excluded from print) */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white border border-stone-200 rounded-2xl shadow-xs print:hidden">
          <div className="flex items-center space-x-2 text-xs font-bold text-stone-700">
            <Compass className="w-4 h-4 text-amber-600" />
            <span>{t.houseSystemLabel}</span>
          </div>
          <div className="flex items-center space-x-1.5">
            {[
              { id: 'placidus', label: t.houseSystemPlacidus },
              { id: 'equal', label: t.houseSystemEqual },
              { id: 'wholesign', label: t.houseSystemWholeSign }
            ].map((hs) => (
              <button
                key={hs.id}
                onClick={() => setHouseSystem(hs.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  houseSystem === hs.id
                    ? 'bg-amber-500 text-stone-950 shadow-xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                }`}
              >
                {hs.label}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Tabs (Excluded from print) */}
        <div className="flex gap-2 overflow-x-auto pb-2 border-b border-stone-200 no-scrollbar print:hidden">
          {[
            { id: 'personality', label: t.tabPersonality, icon: Sparkles },
            { id: 'love', label: t.tabLove, icon: Heart },
            { id: 'career', label: t.tabCareer, icon: Briefcase },
            { id: 'karma', label: t.tabKarma, icon: Compass },
            { id: 'synastry', label: t.tabSynastry, icon: Star },
            { id: 'humandesign', label: t.tabHd, icon: Fingerprint },
            { id: 'chat', label: t.tabChat, icon: MessageCircle }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-stone-900 text-white shadow-md scale-[1.02]'
                    : 'bg-white text-stone-600 hover:bg-stone-50 border border-stone-200'
                }`}
              >
                <Icon className="w-4 h-4 text-amber-400" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: PERSONALITY & INTERACTIVE WHEEL */}
        {activeTab === 'personality' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Interactive SVG Natal Wheel */}
              <div className="lg:col-span-6 bg-white border border-stone-200 rounded-3xl p-6 shadow-md flex flex-col items-center">
                <h3 className="text-base font-bold text-stone-900 mb-2 flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>{locale === 'ru' ? 'Натальное колесо планет' : 'Interactive Natal Wheel'}</span>
                </h3>
                <p className="text-xs text-stone-500 mb-4 text-center">
                  {locale === 'ru' ? `Координаты неба на момент рождения ${fullName}` : `Sky map at the moment of ${fullName}'s birth`}
                </p>
                <NatalWheel chart={currentNatal} onSelectPlanet={(p) => setSelectedPlanet(p)} />
              </div>

              {/* Quick Planetary Table */}
              <div className="lg:col-span-6 space-y-3">
                <h3 className="text-lg font-bold text-stone-900 mb-3">
                  {locale === 'ru' ? 'Координаты планет и домов' : 'Planetary Coordinates & Houses'}
                </h3>
                <div className="grid grid-cols-2 gap-2.5 max-h-[460px] overflow-y-auto pr-1">
                  {currentNatal.planets.map((p) => {
                    const isSelected = selectedPlanet?.id === p.id;
                    const planetName = locale === 'ru' ? p.nameRu : p.nameEn;
                    const signName = locale === 'ru' ? p.sign.nameRu : p.sign.nameEn;

                    return (
                      <div
                        key={p.id}
                        onClick={() => setSelectedPlanet(p)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-amber-50 border-amber-500 ring-1 ring-amber-400'
                            : 'bg-white border-stone-200 hover:border-amber-300 shadow-xs'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <span className="w-7 h-7 rounded-xl bg-amber-100 flex items-center justify-center font-bold text-amber-800 text-sm">
                            {p.symbol}
                          </span>
                          <div>
                            <div className="flex items-center space-x-1.5">
                              <span className="text-xs font-bold text-stone-900">{planetName}</span>
                              {p.isRetrograde && (
                                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-100 text-rose-700">
                                  ℞
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-stone-500">
                              {signName} ({p.degreeInSign}°)
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 font-mono font-semibold">
                            {p.house} {locale === 'ru' ? 'дом' : 'house'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Selected or Default Planet Deep Insight */}
            <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-sm">
              <h3 className="text-xl font-black text-stone-900 mb-4 flex items-center space-x-2">
                <span className="text-amber-600">✦</span>
                <span>
                  {selectedPlanet
                    ? `${locale === 'ru' ? selectedPlanet.nameRu : selectedPlanet.nameEn} in ${locale === 'ru' ? selectedPlanet.sign.nameRu : selectedPlanet.sign.nameEn}`
                    : `${locale === 'ru' ? 'Солнце в знаке' : 'Sun in'} ${locale === 'ru' ? sun.sign.nameRu : sun.sign.nameEn} (${t.sunCore})`}
                </span>
              </h3>

              <div className="prose max-w-none text-sm text-stone-700 leading-relaxed space-y-4">
                {!selectedPlanet || selectedPlanet.id === 'sun' ? (
                  <>
                    <p>{sunData?.sunMeaning}</p>
                    <p>
                      <strong>{locale === 'ru' ? 'Суперсила личности:' : 'Core Superpower:'}</strong> {sunData?.superpower}
                    </p>
                    <p>
                      <strong>{locale === 'ru' ? 'Теневая сторона и точки роста:' : 'Shadow side & Growth points:'}</strong> {sunData?.shadowSide}
                    </p>
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 mt-4 text-xs text-amber-950">
                      <strong>Ascendant ({asc.degreeInSign}°):</strong> {ascData?.ascMeaning}
                    </div>
                  </>
                ) : selectedPlanet.id === 'moon' ? (
                  <>
                    <p>{moonData?.moonMeaning}</p>
                    <p><strong>{locale === 'ru' ? 'Подсознательные потребности:' : 'Subconscious needs:'}</strong> {moonData?.essence}</p>
                  </>
                ) : selectedPlanet.id === 'venus' ? (
                  <>
                    <p>{venusData?.venusMeaning}</p>
                  </>
                ) : selectedPlanet.id === 'mars' ? (
                  <>
                    <p>{marsData?.marsMeaning}</p>
                  </>
                ) : (
                  <p>
                    {locale === 'ru'
                      ? `Положение планеты ${selectedPlanet.nameRu} в ${selectedPlanet.sign.nameRu} в ${selectedPlanet.house} доме активирует важный вектор развития.`
                      : `The placement of ${selectedPlanet.nameEn} in ${selectedPlanet.sign.nameEn} in house ${selectedPlanet.house} activates a unique evolutionary pattern.`}
                  </p>
                )}
              </div>
            </div>

            {/* Astrodynes & Talismans Section */}
            <AstrodynesCard
              planets={currentNatal.planets}
              dominantPlanet={currentNatal.dominantPlanet}
              talismans={currentNatal.talismans}
              locale={locale}
              onSelectPlanet={setSelectedPlanet}
            />

            {/* Cross-Planetary Aspect Matrix */}
            <AspectGrid
              planets={currentNatal.planets}
              ascendant={currentNatal.ascendant}
              midheaven={currentNatal.midheaven}
              aspects={currentNatal.aspects}
              locale={locale}
            />
          </div>
        )}

        {/* TAB 2: LOVE & RELATIONSHIPS */}
        {activeTab === 'love' && (
          <div className="space-y-6">
            <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-sm">
              <h2 className="text-2xl font-black text-stone-900 mb-3 flex items-center space-x-2">
                <Heart className="w-6 h-6 text-rose-500" />
                <span>{locale === 'ru' ? 'Любовный сценарий и 7-й дом партнерства' : 'Love Blueprint & 7th House of Partnership'}</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200">
                  <span className="text-xs font-bold text-rose-700 uppercase tracking-wider block mb-1">
                    Венера в {locale === 'ru' ? venus.sign.nameRu : venus.sign.nameEn} ({venus.house} дом)
                  </span>
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                    {venusData?.venusMeaning}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-red-50 border border-red-200">
                  <span className="text-xs font-bold text-red-700 uppercase tracking-wider block mb-1">
                    Марс в {locale === 'ru' ? mars.sign.nameRu : mars.sign.nameEn} ({mars.house} дом)
                  </span>
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                    {marsData?.marsMeaning}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MONEY & CAREER */}
        {activeTab === 'career' && (
          <div className="space-y-6">
            <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-sm">
              <h2 className="text-2xl font-black text-stone-900 mb-3 flex items-center space-x-2">
                <Briefcase className="w-6 h-6 text-amber-600" />
                <span>{locale === 'ru' ? 'Финансовый код и Карьерная реализация' : 'Financial Code & Career Fulfillment'}</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200">
                  <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block mb-1">
                    MC: {locale === 'ru' ? mc.sign.nameRu : mc.sign.nameEn}
                  </span>
                  <p className="text-xs text-stone-600">
                    {locale === 'ru' ? 'Высшая точка вашей профессиональной реализации и признания.' : 'Highest point of career achievement and leadership.'}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-yellow-50 border border-yellow-200">
                  <span className="text-xs font-bold text-yellow-800 uppercase tracking-wider block mb-1">
                    Юпитер в {locale === 'ru' ? jupiter.sign.nameRu : jupiter.sign.nameEn}
                  </span>
                  <p className="text-xs text-stone-600">
                    {locale === 'ru' ? 'Точка масштабной денежной удачи и расширения влияния.' : 'Gateway of wealth expansion and lucrative opportunities.'}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200">
                  <span className="text-xs font-bold text-stone-800 uppercase tracking-wider block mb-1">
                    Сатурн в {locale === 'ru' ? saturn.sign.nameRu : saturn.sign.nameEn}
                  </span>
                  <p className="text-xs text-stone-600">
                    {locale === 'ru' ? 'Долгосрочные системные активы и дисциплина капитала.' : 'Long-term assets, structural discipline and endurance.'}
                  </p>
                </div>
              </div>

              {/* Part of Fortune Section */}
              {currentNatal.partOfFortune && (
                <div className="bg-gradient-to-br from-amber-500/10 via-amber-100/30 to-white border-2 border-amber-300 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4 mt-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-2xl bg-amber-500 text-stone-950 font-black text-2xl flex items-center justify-center shadow-md shadow-amber-500/30">
                        ⊗
                      </div>
                      <div>
                        <span className="text-[11px] font-mono uppercase tracking-widest text-amber-800 font-bold">
                          {t.partOfFortuneTitle}
                        </span>
                        <h3 className="text-xl font-black text-stone-900">
                          {locale === 'ru'
                            ? `Точка Фортуны в знаке ${currentNatal.partOfFortune.sign.nameRu} (${currentNatal.partOfFortune.degreeInSign}°), ${currentNatal.partOfFortune.house} дом`
                            : `Part of Fortune in ${currentNatal.partOfFortune.sign.nameEn} (${currentNatal.partOfFortune.degreeInSign}°), House ${currentNatal.partOfFortune.house}`}
                        </h3>
                      </div>
                    </div>
                    <span className="px-3.5 py-1.5 rounded-full bg-white border border-amber-300 text-amber-900 font-bold text-xs shadow-2xs">
                      {locale === 'ru' ? 'Секрет изобилия' : 'Key to Prosperity'}
                    </span>
                  </div>

                  <p className="text-sm text-stone-700 leading-relaxed">
                    {locale === 'ru'
                      ? `В натальной карте Колесо Удачи (Точка Фортуны) указывает на ту сферу жизни, где человек естественным образом получает признание, финансовые плоды и глубокое моральное удовлетворение. Находясь в знаке ${currentNatal.partOfFortune.sign.nameRu} и ${currentNatal.partOfFortune.house}-м доме, ваша удача раскрывается через развитие качеств ${currentNatal.partOfFortune.sign.nameRu}: ${currentNatal.partOfFortune.sign.element === 'Огонь' ? 'лидерскую инициативу, решительность и смелые авторские проекты' : currentNatal.partOfFortune.sign.element === 'Земля' ? 'создание осязаемых практических продуктов, системный подход и надежные инвестиции' : currentNatal.partOfFortune.sign.element === 'Воздух' ? 'интеллектуальную работу, экспертные связи, торговлю и работу с информацией' : 'интуицию, психологию, заботу о людях и эмоциональное доверие'}.`
                      : `In your astrological chart, the Part of Fortune marks the sphere where you naturally attract serendipity, prosperity, and fulfillment. Located in ${currentNatal.partOfFortune.sign.nameEn} within House ${currentNatal.partOfFortune.house}, your greatest fortune flows through embracing ${currentNatal.partOfFortune.sign.nameEn} virtues: sustained dedication, authentic self-expression, and deliberate alignment with your gifts.`}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: KARMA */}
        {activeTab === 'karma' && (
          <div className="space-y-6">
            <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-sm">
              <h2 className="text-2xl font-black text-stone-900 mb-3 flex items-center space-x-2">
                <Compass className="w-6 h-6 text-purple-600" />
                <span>{locale === 'ru' ? 'Кармические узлы судьбы (Раху и Кету)' : 'Karmic Destiny Nodes (Rahu & Ketu)'}</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="p-5 rounded-2xl bg-purple-50 border border-purple-200">
                  <span className="text-xs font-bold text-purple-800 uppercase tracking-wider block mb-1">
                    Северный Узел (Раху): {locale === 'ru' ? node?.sign.nameRu : node?.sign.nameEn}
                  </span>
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                    {locale === 'ru'
                      ? `Главный вектор эволюции вашей души в этом воплощении. Задача — наработать качества знака ${node?.sign.nameRu}.`
                      : `The evolutionary vector of your life. Your mission is to develop the gifts of ${node?.sign.nameEn}.`}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200">
                  <span className="text-xs font-bold text-rose-800 uppercase tracking-wider block mb-1">
                    Черная Луна (Лилит): {locale === 'ru' ? lilith?.sign.nameRu : lilith?.sign.nameEn}
                  </span>
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                    {locale === 'ru'
                      ? 'Точка скрытых страхов и подсознательных искушений, преодолевая которые вы обретаете глубинную силу.'
                      : 'Shadow point of subconscious trials; mastering it unlocks profound intuitive magnetism.'}
                  </p>
                </div>
              </div>

              {/* Deep Lilith Shadow Work Section */}
              {lilith && (
                <div className="mt-6">
                  <LilithCard lilith={lilith} locale={locale} />
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: SYNASTRY */}
        {activeTab === 'synastry' && (
          <div className="space-y-6">
            <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <h2 className="text-2xl font-black text-stone-900 flex items-center space-x-2">
                <Star className="w-6 h-6 text-amber-500 fill-amber-400" />
                <span>{locale === 'ru' ? 'Гороскоп Совместимости (Синастрия)' : 'Compatibility Report (Synastry)'}</span>
              </h2>

              {synastry ? (
                <div className="space-y-6">
                  <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <span className="text-xs text-rose-700 font-bold uppercase tracking-wider">
                        {locale === 'ru' ? 'Итоговый индекс гармонии' : 'Overall Harmony Score'}
                      </span>
                      <h3 className="text-2xl font-bold text-stone-900">
                        {synastry.person1.birthData.name} + {synastry.person2.birthData.name}
                      </h3>
                      <p className="text-xs text-stone-600 mt-1">
                        {synastry.compatibility.verdict}
                      </p>
                    </div>
                    <div className="text-center px-6 py-3 rounded-2xl bg-white border border-rose-300 shadow-sm">
                      <div className="text-3xl font-black text-rose-600 font-mono">
                        {synastry.compatibility.totalScore}%
                      </div>
                    </div>
                  </div>

                  {/* Red Flag & Shadow Compatibility Scanner */}
                  <RedFlagScanner synastry={synastry} locale={locale} />
                </div>
              ) : (
                <div className="text-center py-10 text-stone-500">
                  <p>{locale === 'ru' ? 'Для расчета совместимости требуется ввести данные партнера в новом расчете.' : 'To compute compatibility, enter partner details during onboarding.'}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 6: HUMAN DESIGN */}
        {activeTab === 'humandesign' && (
          <div className="space-y-6">
            <HumanDesignBodygraph data={humanDesign} locale={locale} />
          </div>
        )}

        {/* TAB 7: AI ASTROLOGER CHAT */}
        {activeTab === 'chat' && (
          <div>
            <AIAstrologerChat chart={natal} />
          </div>
        )}
      </div>

      {/* Instagram/Telegram Stories Modal */}
      <StoriesCardModal
        isOpen={isStoriesOpen}
        onClose={() => setIsStoriesOpen(false)}
        natal={currentNatal}
        locale={locale}
      />
    </div>
  );
};
