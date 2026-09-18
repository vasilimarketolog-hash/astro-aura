'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  User,
  Heart,
  Briefcase,
  Search,
  CheckCircle2,
  Loader2,
  HelpCircle,
  Globe
} from 'lucide-react';
import { BirthData, CalculationType, NatalChartData, SynastryData, HumanDesignData, Locale } from '@/types/astro';
import { searchCities, POPULAR_CITIES, CityInfo, geocodeWorldwideCity } from '@/lib/cities';
import { calculateNatalChart, calculateSynastry, calculateHumanDesign } from '@/lib/astroEngine';
import { getTranslation } from '@/lib/translations';
import { getWizardState, saveWizardState } from '@/lib/storage';

interface QuizFlowProps {
  locale: Locale;
  step?: number;
  calcType?: CalculationType;
  initialFocus?: string;
  onStepChange?: (newStep: number) => void;
  onComplete: (data: {
    natal: NatalChartData;
    synastry?: SynastryData;
    humanDesign: HumanDesignData;
    calculationType: CalculationType;
  }) => void;
  onCancel: () => void;
}

export const QuizFlow: React.FC<QuizFlowProps> = ({
  locale,
  step: propStep,
  calcType: propCalcType,
  initialFocus,
  onStepChange,
  onComplete,
  onCancel
}) => {
  const t = getTranslation(locale);
  const [localStep, setLocalStep] = useState<number>(propStep || 1);
  const step = propStep !== undefined && localStep !== 99 ? propStep : localStep;

  const [calcType, setCalcType] = useState<CalculationType>(
    propCalcType || (initialFocus === 'synastry' ? 'synastry' : initialFocus === 'humandesign' ? 'humandesign' : 'all')
  );

  // Person 1 Data
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState<'female' | 'male' | 'other'>('male');
  const [day, setDay] = useState<number>(15);
  const [month, setMonth] = useState<number>(5);
  const [year, setYear] = useState<number>(1995);
  const [hour, setHour] = useState<number>(12);
  const [minute, setMinute] = useState<number>(30);
  const [unknownTime, setUnknownTime] = useState(false);

  // City search Person 1
  const [citySearch, setCitySearch] = useState('');
  const [selectedCity, setSelectedCity] = useState<CityInfo>(POPULAR_CITIES[0]);
  const [isGeocoding, setIsGeocoding] = useState(false);

  // Person 2 Data (if synastry)
  const [p2Name, setP2Name] = useState('');
  const [p2LastName, setP2LastName] = useState('');
  const [p2Gender, setP2Gender] = useState<'female' | 'male' | 'other'>('female');
  const [p2Day, setP2Day] = useState<number>(20);
  const [p2Month, setP2Month] = useState<number>(10);
  const [p2Year, setP2Year] = useState<number>(1993);
  const [p2Hour, setP2Hour] = useState<number>(14);
  const [p2Minute, setP2Minute] = useState<number>(0);
  const [p2UnknownTime, setP2UnknownTime] = useState(false);
  const [p2CitySearch, setP2CitySearch] = useState('');
  const [p2SelectedCity, setP2SelectedCity] = useState<CityInfo>(POPULAR_CITIES[0]);

  // Restore from sessionStorage on initial client mount
  useEffect(() => {
    const saved = getWizardState();
    if (saved) {
      if (saved.firstName) setFirstName(saved.firstName);
      if (saved.lastName) setLastName(saved.lastName);
      if (saved.gender) setGender(saved.gender);
      if (saved.day !== undefined) setDay(saved.day);
      if (saved.month !== undefined) setMonth(saved.month);
      if (saved.year !== undefined) setYear(saved.year);
      if (saved.hour !== undefined) setHour(saved.hour);
      if (saved.minute !== undefined) setMinute(saved.minute);
      if (saved.unknownTime !== undefined) setUnknownTime(saved.unknownTime);
      if (saved.selectedCity) setSelectedCity(saved.selectedCity);

      if (saved.p2Name) setP2Name(saved.p2Name);
      if (saved.p2LastName) setP2LastName(saved.p2LastName);
      if (saved.p2Gender) setP2Gender(saved.p2Gender);
      if (saved.p2Day !== undefined) setP2Day(saved.p2Day);
      if (saved.p2Month !== undefined) setP2Month(saved.p2Month);
      if (saved.p2Year !== undefined) setP2Year(saved.p2Year);
      if (saved.p2Hour !== undefined) setP2Hour(saved.p2Hour);
      if (saved.p2Minute !== undefined) setP2Minute(saved.p2Minute);
      if (saved.p2UnknownTime !== undefined) setP2UnknownTime(saved.p2UnknownTime);
      if (saved.p2SelectedCity) setP2SelectedCity(saved.p2SelectedCity);
    }
  }, []);

  // Save changes to sessionStorage whenever inputs change
  useEffect(() => {
    saveWizardState({
      calcType,
      firstName,
      lastName,
      gender,
      day,
      month,
      year,
      hour,
      minute,
      unknownTime,
      selectedCity,
      p2Name,
      p2LastName,
      p2Gender,
      p2Day,
      p2Month,
      p2Year,
      p2Hour,
      p2Minute,
      p2UnknownTime,
      p2SelectedCity,
    });
  }, [
    calcType,
    firstName,
    lastName,
    gender,
    day,
    month,
    year,
    hour,
    minute,
    unknownTime,
    selectedCity,
    p2Name,
    p2LastName,
    p2Gender,
    p2Day,
    p2Month,
    p2Year,
    p2Hour,
    p2Minute,
    p2UnknownTime,
    p2SelectedCity,
  ]);

  // Loading animation state (8.5 seconds)
  const [loadingPhase, setLoadingPhase] = useState(0);
  const [progressPercent, setProgressPercent] = useState(3);

  const monthsRu = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];
  const monthsEn = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const months = locale === 'ru' ? monthsRu : monthsEn;

  const filteredCities = searchCities(citySearch, locale);
  const fullName = `${firstName.trim() || (locale === 'ru' ? 'Василий' : 'Vasily')} ${lastName.trim() || (locale === 'ru' ? 'Булгаков' : 'Bulgakov')}`.trim();

  const handleCustomCityLookup = async (inputQuery: string, isPerson2 = false) => {
    if (!inputQuery.trim()) return;
    setIsGeocoding(true);
    const result = await geocodeWorldwideCity(inputQuery);
    setIsGeocoding(false);
    if (result) {
      if (isPerson2) {
        setP2SelectedCity(result);
      } else {
        setSelectedCity(result);
      }
    }
  };

  useEffect(() => {
    if (step === 99) {
      const startTime = Date.now();
      const totalDuration = 8500;

      const progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(99, Math.floor((elapsed / totalDuration) * 100));
        setProgressPercent(progress);
      }, 100);

      const t1 = setTimeout(() => setLoadingPhase(1), 1600);
      const t2 = setTimeout(() => setLoadingPhase(2), 3200);
      const t3 = setTimeout(() => setLoadingPhase(3), 4800);
      const t4 = setTimeout(() => setLoadingPhase(4), 6400);
      const t5 = setTimeout(() => setLoadingPhase(5), 7800);

      const finishTimeout = setTimeout(() => {
        setProgressPercent(100);

        const p1Birth: BirthData = {
          name: firstName.trim() || (locale === 'ru' ? 'Василий' : 'Vasily'),
          lastName: lastName.trim() || (locale === 'ru' ? 'Булгаков' : 'Bulgakov'),
          country: selectedCity.country,
          gender,
          day,
          month,
          year,
          hour: unknownTime ? 12 : hour,
          minute: unknownTime ? 0 : minute,
          unknownTime,
          cityName: locale === 'ru' ? selectedCity.name : selectedCity.nameEn,
          latitude: selectedCity.latitude,
          longitude: selectedCity.longitude,
          timezoneOffset: selectedCity.timezoneOffset
        };

        const natal1 = calculateNatalChart(p1Birth);
        const hd = calculateHumanDesign(p1Birth);

        let synastryResult: SynastryData | undefined = undefined;
        if (calcType === 'synastry') {
          const p2Birth: BirthData = {
            name: p2Name.trim() || (locale === 'ru' ? 'Партнер' : 'Partner'),
            lastName: p2LastName.trim() || '',
            country: p2SelectedCity.country,
            gender: p2Gender,
            day: p2Day,
            month: p2Month,
            year: p2Year,
            hour: p2UnknownTime ? 12 : p2Hour,
            minute: p2UnknownTime ? 0 : p2Minute,
            unknownTime: p2UnknownTime,
            cityName: locale === 'ru' ? p2SelectedCity.name : p2SelectedCity.nameEn,
            latitude: p2SelectedCity.latitude,
            longitude: p2SelectedCity.longitude,
            timezoneOffset: p2SelectedCity.timezoneOffset
          };
          const natal2 = calculateNatalChart(p2Birth);
          synastryResult = calculateSynastry(natal1, natal2);
        }

        onComplete({
          natal: natal1,
          synastry: synastryResult,
          humanDesign: hd,
          calculationType: calcType
        });
      }, totalDuration);

      return () => {
        clearInterval(progressInterval);
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
        clearTimeout(t5);
        clearTimeout(finishTimeout);
      };
    }
  }, [step]);

  const handleNext = () => {
    let nextStep = step + 1;
    if (step === 5 && calcType !== 'synastry') {
      nextStep = 99;
    } else if (step === 6 && calcType === 'synastry') {
      nextStep = 99;
    } else if (step === 4 && calcType === 'humandesign') {
      nextStep = 99;
    }

    if (nextStep === 99) {
      setLocalStep(99);
    } else {
      if (onStepChange) {
        onStepChange(nextStep);
      } else {
        setLocalStep(nextStep);
      }
    }
  };

  const handlePrev = () => {
    if (step === 1) {
      onCancel();
    } else {
      const prevStep = step - 1;
      if (onStepChange) {
        onStepChange(prevStep);
      } else {
        setLocalStep(prevStep);
      }
    }
  };

  const cityNameDisplay = locale === 'ru' ? selectedCity.name : selectedCity.nameEn;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Step Indicator */}
      {step < 99 && (
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2 font-medium">
            <button
              onClick={handlePrev}
              className="flex items-center space-x-1 hover:text-stone-900 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{step === 1 ? t.toHome : t.back}</span>
            </button>
            <span className="font-mono text-amber-700 font-bold">
              {t.quizStep} {step} {t.quizOf} {calcType === 'synastry' ? 6 : 5}
            </span>
          </div>
          <div className="w-full bg-stone-200 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 h-full transition-all duration-300 rounded-full"
              style={{ width: `${(step / (calcType === 'synastry' ? 6 : 5)) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* STEP 1: Purpose / Type */}
      {step === 1 && (
        <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 mx-auto flex items-center justify-center text-amber-600 mb-3 shadow-xs">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mb-2">
              {t.step1Title}
            </h2>
            <p className="text-sm text-stone-600">
              {t.step1Subtitle}
            </p>
          </div>

          <div className="space-y-3 mb-8">
            {[
              {
                id: 'all',
                title: t.optAllTitle,
                desc: t.optAllDesc,
                icon: Sparkles,
                badge: 'PRO'
              },
              {
                id: 'synastry',
                title: t.optSynastryTitle,
                desc: t.optSynastryDesc,
                icon: Heart,
                badge: 'Love'
              },
              {
                id: 'humandesign',
                title: t.optHdTitle,
                desc: t.optHdDesc,
                icon: User,
                badge: 'Energy'
              }
            ].map((item) => {
              const Icon = item.icon;
              const isSelected = calcType === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setCalcType(item.id as CalculationType)}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-amber-50/60 border-amber-500 shadow-md ring-1 ring-amber-400'
                      : 'bg-stone-50/60 border-stone-200 hover:border-amber-300'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl ${isSelected ? 'bg-amber-100 text-amber-800' : 'bg-white text-stone-600 border border-stone-200'}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-stone-900 text-base">{item.title}</span>
                        {item.badge && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-600 mt-1">{item.desc}</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? 'border-amber-600 bg-amber-600' : 'border-stone-400'}`}>
                    {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleNext}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-stone-900 via-stone-800 to-amber-900 hover:from-black hover:to-stone-900 text-white font-bold text-base shadow-lg shadow-stone-900/15 transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>{t.continue}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* STEP 2: Name, Surname & Gender */}
      {step === 2 && (
        <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mb-2">
              {t.step2Title}
            </h2>
            <p className="text-sm text-stone-600">
              {t.step2Subtitle}
            </p>
          </div>

          <div className="space-y-5 mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-2 uppercase tracking-wider">
                  {t.firstNameLabel}
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder={t.firstNamePlaceholder}
                  className="w-full px-4 py-3.5 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-colors"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-2 uppercase tracking-wider">
                  {t.lastNameLabel}
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder={t.lastNamePlaceholder}
                  className="w-full px-4 py-3.5 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-2 uppercase tracking-wider">
                {t.genderLabel}
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'male', label: t.genderMale },
                  { id: 'female', label: t.genderFemale }
                ].map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setGender(g.id as any)}
                    className={`py-3 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
                      gender === g.id
                        ? 'bg-amber-50 border-amber-500 text-amber-900 shadow-xs'
                        : 'bg-stone-50 border-stone-200 text-stone-600 hover:border-stone-400'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleNext}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-stone-900 via-stone-800 to-amber-900 hover:from-black hover:to-stone-900 text-white font-bold text-base shadow-lg shadow-stone-900/15 transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>{t.next}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* STEP 3: Date of Birth */}
      {step === 3 && (
        <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mb-2">
              {t.step3Title}
            </h2>
            <p className="text-sm text-stone-600">
              {t.step3Subtitle}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-8">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">{t.dayLabel}</label>
              <select
                value={day}
                onChange={(e) => setDay(Number(e.target.value))}
                className="w-full px-3 py-3 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 focus:outline-none focus:border-amber-500 focus:bg-white font-medium"
              >
                {[...Array(31)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">{t.monthLabel}</label>
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="w-full px-3 py-3 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 focus:outline-none focus:border-amber-500 focus:bg-white font-medium"
              >
                {months.map((m, i) => (
                  <option key={i + 1} value={i + 1}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">{t.yearLabel}</label>
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full px-3 py-3 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 focus:outline-none focus:border-amber-500 focus:bg-white font-medium"
              >
                {Array.from({ length: 85 }, (_, i) => 2015 - i).map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleNext}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-stone-900 via-stone-800 to-amber-900 hover:from-black hover:to-stone-900 text-white font-bold text-base shadow-lg shadow-stone-900/15 transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>{t.next}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* STEP 4: Exact Birth Time */}
      {step === 4 && (
        <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mb-2">
              {t.step4Title}
            </h2>
            <p className="text-sm text-stone-600">
              {t.step4Subtitle}
            </p>
          </div>

          {!unknownTime ? (
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">{t.hoursLabel}</label>
                <select
                  value={hour}
                  onChange={(e) => setHour(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 focus:outline-none focus:border-amber-500 font-medium"
                >
                  {[...Array(24)].map((_, i) => (
                    <option key={i} value={i}>
                      {String(i).padStart(2, '0')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">{t.minutesLabel}</label>
                <select
                  value={minute}
                  onChange={(e) => setMinute(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 focus:outline-none focus:border-amber-500 font-medium"
                >
                  {[...Array(60)].map((_, i) => (
                    <option key={i} value={i}>
                      {String(i).padStart(2, '0')}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-stone-700 text-xs mb-6 flex items-center space-x-3">
              <HelpCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <span>{t.unknownTimeNotice}</span>
            </div>
          )}

          <div className="flex items-center space-x-3 mb-8 cursor-pointer" onClick={() => setUnknownTime(!unknownTime)}>
            <input
              type="checkbox"
              checked={unknownTime}
              onChange={(e) => setUnknownTime(e.target.checked)}
              className="w-5 h-5 rounded border-stone-300 text-amber-600 focus:ring-amber-500 bg-stone-50 cursor-pointer"
            />
            <label className="text-sm font-semibold text-stone-700 cursor-pointer">
              {t.unknownTimeCheck}
            </label>
          </div>

          <button
            onClick={handleNext}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-stone-900 via-stone-800 to-amber-900 hover:from-black hover:to-stone-900 text-white font-bold text-base shadow-lg shadow-stone-900/15 transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>{t.next}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* STEP 5: Place of Birth with Global Autocomplete */}
      {step === 5 && (
        <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mb-2">
              {t.step5Title}
            </h2>
            <p className="text-sm text-stone-600">
              {t.step5Subtitle}
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-stone-400" />
              <input
                type="text"
                value={citySearch}
                onChange={(e) => setCitySearch(e.target.value)}
                onBlur={() => handleCustomCityLookup(citySearch)}
                placeholder={t.citySearchPlaceholder}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>

            {/* City Suggestion List */}
            <div className="max-h-48 overflow-y-auto rounded-xl border border-stone-200 bg-stone-50 divide-y divide-stone-200">
              {filteredCities.map((city) => {
                const isSelected = selectedCity.name === city.name;
                const cName = locale === 'ru' ? city.name : city.nameEn;
                const cCountry = locale === 'ru' ? city.country : city.countryEn;

                return (
                  <div
                    key={`${city.name}-${city.country}`}
                    onClick={() => {
                      setSelectedCity(city);
                      setCitySearch(cName);
                    }}
                    className={`px-4 py-2.5 flex items-center justify-between cursor-pointer transition-colors ${
                      isSelected ? 'bg-amber-100/70 text-amber-950 font-semibold' : 'hover:bg-stone-100 text-stone-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-amber-600" />
                      <span className="text-sm">{cName}</span>
                      <span className="text-xs text-stone-500">({cCountry})</span>
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
                  </div>
                );
              })}
            </div>

            {isGeocoding && (
              <div className="text-xs text-amber-700 flex items-center space-x-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{t.searchingGlobal}</span>
              </div>
            )}

            <div className="text-xs text-stone-600 flex items-center space-x-1.5 pt-1">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span>
                {t.selectedCityText} <strong className="text-stone-900 font-bold">{cityNameDisplay}</strong> ({locale === 'ru' ? selectedCity.country : selectedCity.countryEn}, UTC+{selectedCity.timezoneOffset})
              </span>
            </div>
          </div>

          <button
            onClick={handleNext}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-stone-900 via-stone-800 to-amber-900 hover:from-black hover:to-stone-900 text-white font-bold text-base shadow-lg shadow-stone-900/15 transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>{calcType === 'synastry' ? (locale === 'ru' ? 'Ввести данные партнера' : 'Enter Partner Details') : (locale === 'ru' ? 'Рассчитать натальную карту' : 'Generate Natal Chart')}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* STEP 6: Partner Data (If Synastry) */}
      {step === 6 && (
        <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 mx-auto flex items-center justify-center text-rose-600 mb-3 shadow-xs">
              <Heart className="w-6 h-6" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mb-2">
              {t.step6Title}
            </h2>
            <p className="text-sm text-stone-600">
              {t.step6Subtitle}
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1 uppercase tracking-wider">
                  {t.partnerNameLabel}
                </label>
                <input
                  type="text"
                  value={p2Name}
                  onChange={(e) => setP2Name(e.target.value)}
                  placeholder="Имя"
                  className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-rose-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1 uppercase tracking-wider">
                  Фамилия
                </label>
                <input
                  type="text"
                  value={p2LastName}
                  onChange={(e) => setP2LastName(e.target.value)}
                  placeholder="Фамилия"
                  className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1 uppercase tracking-wider">
                {t.partnerBirthLabel}
              </label>
              <div className="grid grid-cols-3 gap-2">
                <select
                  value={p2Day}
                  onChange={(e) => setP2Day(Number(e.target.value))}
                  className="px-3 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 text-sm font-medium"
                >
                  {[...Array(31)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
                <select
                  value={p2Month}
                  onChange={(e) => setP2Month(Number(e.target.value))}
                  className="px-3 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 text-sm font-medium"
                >
                  {months.map((m, i) => (
                    <option key={i + 1} value={i + 1}>{m}</option>
                  ))}
                </select>
                <select
                  value={p2Year}
                  onChange={(e) => setP2Year(Number(e.target.value))}
                  className="px-3 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 text-sm font-medium"
                >
                  {Array.from({ length: 85 }, (_, i) => 2015 - i).map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-2 cursor-pointer" onClick={() => setP2UnknownTime(!p2UnknownTime)}>
              <input
                type="checkbox"
                checked={p2UnknownTime}
                onChange={(e) => setP2UnknownTime(e.target.checked)}
                className="w-4 h-4 rounded border-stone-300 text-rose-600"
              />
              <label className="text-xs text-stone-700 font-medium">{t.partnerUnknownTime}</label>
            </div>
          </div>

          <button
            onClick={handleNext}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-stone-900 via-rose-900 to-stone-900 hover:from-black text-white font-bold text-base shadow-lg shadow-stone-900/15 transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>{locale === 'ru' ? 'Рассчитать совместимость' : 'Calculate Compatibility'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* STEP 99: Animated Processing & Real In-Depth 8.5s Calculation Screen */}
      {step === 99 && (
        <div className="bg-white border-2 border-amber-200 rounded-3xl p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden">
          <div className="w-28 h-28 mx-auto mb-6 relative flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-amber-400 animate-spin" />
            <div className="absolute inset-2 rounded-full border-2 border-amber-200 animate-ping" />
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Sparkles className="w-8 h-8 text-white animate-pulse" />
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-stone-900 mb-2">
            {t.calcHeading}
          </h2>

          <p className="text-xs sm:text-sm text-stone-600 mb-6 h-8 flex items-center justify-center font-medium">
            {loadingPhase === 0 && t.phase1}
            {loadingPhase === 1 && t.phase2.replace('{city}', cityNameDisplay)}
            {loadingPhase === 2 && t.phase3}
            {loadingPhase === 3 && t.phase4}
            {loadingPhase === 4 && t.phase5}
            {loadingPhase === 5 && t.phase6.replace('{name}', fullName)}
          </p>

          <div className="w-full max-w-md mx-auto bg-stone-100 h-3.5 rounded-full overflow-hidden border border-stone-200 mb-3 p-[2px]">
            <div
              className="bg-gradient-to-r from-amber-500 to-yellow-500 h-full transition-all duration-150 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between max-w-md mx-auto text-xs text-stone-500 font-mono">
            <span>NASA Swiss Ephemeris v2.10</span>
            <span className="font-bold text-amber-700">{progressPercent}%</span>
          </div>
        </div>
      )}
    </div>
  );
};
