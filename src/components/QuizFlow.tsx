'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Heart,
  User,
  Search,
  CheckCircle2,
  Loader2,
  HelpCircle,
  Globe
} from 'lucide-react';
import { BirthData, CalculationType, NatalChartData, SynastryData, HumanDesignData, Locale } from '@/types/astro';
import { searchCities, POPULAR_CITIES, CityInfo, geocodeWorldwideCity, geocodeWorldwideCities } from '@/lib/cities';
import { calculateNatalChart, calculateSynastry, calculateHumanDesign } from '@/lib/astroEngine';
import { getTranslation } from '@/lib/translations';
import { getWizardState, saveWizardState } from '@/lib/storage';

const NAME_REGEX = /^[a-zA-Zа-яА-ЯёЁ\s\-]{2,}$/;

function isValidBirthDate(d?: number, m?: number, y?: number): boolean {
  if (!d || !m || !y) return false;
  if (y < 1900 || y > 2026) return false;
  const dateObj = new Date(y, m - 1, d);
  return (
    dateObj.getFullYear() === y &&
    dateObj.getMonth() === m - 1 &&
    dateObj.getDate() === d
  );
}

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
  const [gender, setGender] = useState<'female' | 'male' | 'other' | ''>('male');
  const [day, setDay] = useState<number | ''>('');
  const [month, setMonth] = useState<number | ''>('');
  const [year, setYear] = useState<number | ''>('');
  const [hour, setHour] = useState<number | ''>('');
  const [minute, setMinute] = useState<number | ''>('');
  const [unknownTime, setUnknownTime] = useState(false);

  // City search Person 1
  const [citySearch, setCitySearch] = useState('');
  const [selectedCity, setSelectedCity] = useState<CityInfo | null>(null);
  const [isGeocoding, setIsGeocoding] = useState(false);

  // Person 2 Data (if synastry)
  const [p2Name, setP2Name] = useState('');
  const [p2LastName, setP2LastName] = useState('');
  const [p2Gender, setP2Gender] = useState<'female' | 'male' | 'other' | ''>('female');
  const [p2Day, setP2Day] = useState<number | ''>('');
  const [p2Month, setP2Month] = useState<number | ''>('');
  const [p2Year, setP2Year] = useState<number | ''>('');
  const [p2Hour, setP2Hour] = useState<number | ''>('');
  const [p2Minute, setP2Minute] = useState<number | ''>('');
  const [p2UnknownTime, setP2UnknownTime] = useState(false);
  const [p2CitySearch, setP2CitySearch] = useState('');
  const [p2SelectedCity, setP2SelectedCity] = useState<CityInfo | null>(null);

  // Restore from sessionStorage on initial client mount
  useEffect(() => {
    const saved = getWizardState();
    if (saved) {
      if (saved.firstName) setFirstName(saved.firstName);
      if (saved.lastName) setLastName(saved.lastName);
      if (saved.gender) setGender(saved.gender);
      if (saved.day !== undefined && saved.day !== null) setDay(saved.day);
      if (saved.month !== undefined && saved.month !== null) setMonth(saved.month);
      if (saved.year !== undefined && saved.year !== null) setYear(saved.year);
      if (saved.hour !== undefined && saved.hour !== null) setHour(saved.hour);
      if (saved.minute !== undefined && saved.minute !== null) setMinute(saved.minute);
      if (saved.unknownTime !== undefined) setUnknownTime(saved.unknownTime);
      if (saved.selectedCity) {
        setSelectedCity(saved.selectedCity);
        setCitySearch(locale === 'ru' ? saved.selectedCity.name : saved.selectedCity.nameEn);
      }

      if (saved.p2Name) setP2Name(saved.p2Name);
      if (saved.p2LastName) setP2LastName(saved.p2LastName);
      if (saved.p2Gender) setP2Gender(saved.p2Gender);
      if (saved.p2Day !== undefined && saved.p2Day !== null) setP2Day(saved.p2Day);
      if (saved.p2Month !== undefined && saved.p2Month !== null) setP2Month(saved.p2Month);
      if (saved.p2Year !== undefined && saved.p2Year !== null) setP2Year(saved.p2Year);
      if (saved.p2Hour !== undefined && saved.p2Hour !== null) setP2Hour(saved.p2Hour);
      if (saved.p2Minute !== undefined && saved.p2Minute !== null) setP2Minute(saved.p2Minute);
      if (saved.p2UnknownTime !== undefined) setP2UnknownTime(saved.p2UnknownTime);
      if (saved.p2SelectedCity) {
        setP2SelectedCity(saved.p2SelectedCity);
        setP2CitySearch(locale === 'ru' ? saved.p2SelectedCity.name : saved.p2SelectedCity.nameEn);
      }
    }
  }, [locale]);

  // Save changes to sessionStorage whenever inputs change
  useEffect(() => {
    saveWizardState({
      calcType,
      firstName,
      lastName,
      gender: (gender as any) || 'male',
      day: day !== '' ? Number(day) : undefined,
      month: month !== '' ? Number(month) : undefined,
      year: year !== '' ? Number(year) : undefined,
      hour: hour !== '' ? Number(hour) : undefined,
      minute: minute !== '' ? Number(minute) : undefined,
      unknownTime,
      selectedCity: selectedCity || undefined,
      p2Name,
      p2LastName,
      p2Gender: (p2Gender as any) || 'female',
      p2Day: p2Day !== '' ? Number(p2Day) : undefined,
      p2Month: p2Month !== '' ? Number(p2Month) : undefined,
      p2Year: p2Year !== '' ? Number(p2Year) : undefined,
      p2Hour: p2Hour !== '' ? Number(p2Hour) : undefined,
      p2Minute: p2Minute !== '' ? Number(p2Minute) : undefined,
      p2UnknownTime,
      p2SelectedCity: p2SelectedCity || undefined,
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

  const currentYear = new Date().getFullYear(); // 2026
  const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i);

  const [remoteCities, setRemoteCities] = useState<CityInfo[]>([]);
  const [isP2Geocoding, setIsP2Geocoding] = useState(false);
  const [remoteP2Cities, setRemoteP2Cities] = useState<CityInfo[]>([]);

  const localCities = useMemo(() => searchCities(citySearch, locale), [citySearch, locale]);
  const displayedCities = localCities.length > 0 ? localCities : remoteCities;

  const localP2Cities = useMemo(() => searchCities(p2CitySearch, locale), [p2CitySearch, locale]);
  const displayedP2Cities = localP2Cities.length > 0 ? localP2Cities : remoteP2Cities;

  // Debounced worldwide geocoding for Person 1 (250ms)
  useEffect(() => {
    const q = citySearch.trim();
    if (q.length < 2 || localCities.length > 0) {
      setRemoteCities([]);
      setIsGeocoding(false);
      return;
    }

    setIsGeocoding(true);
    const timer = setTimeout(async () => {
      const results = await geocodeWorldwideCities(q);
      setRemoteCities(results);
      setIsGeocoding(false);
    }, 250);

    return () => clearTimeout(timer);
  }, [citySearch, localCities.length]);

  // Debounced worldwide geocoding for Person 2 (250ms)
  useEffect(() => {
    const q = p2CitySearch.trim();
    if (q.length < 2 || localP2Cities.length > 0) {
      setRemoteP2Cities([]);
      setIsP2Geocoding(false);
      return;
    }

    setIsP2Geocoding(true);
    const timer = setTimeout(async () => {
      const results = await geocodeWorldwideCities(q);
      setRemoteP2Cities(results);
      setIsP2Geocoding(false);
    }, 250);

    return () => clearTimeout(timer);
  }, [p2CitySearch, localP2Cities.length]);

  const fullName = [firstName.trim(), lastName.trim()].filter(Boolean).join(' ') || (locale === 'ru' ? 'Гость' : 'Guest');

  const handleCustomCityLookup = async (inputQuery: string, isPerson2 = false) => {
    if (!inputQuery.trim()) return;
    if (isPerson2) setIsP2Geocoding(true);
    else setIsGeocoding(true);

    const result = await geocodeWorldwideCity(inputQuery);

    if (isPerson2) setIsP2Geocoding(false);
    else setIsGeocoding(false);

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
      const totalDuration = 3500;

      const progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(99, Math.floor((elapsed / totalDuration) * 100));
        setProgressPercent(progress);
      }, 50);

      const t1 = setTimeout(() => setLoadingPhase(1), 600);
      const t2 = setTimeout(() => setLoadingPhase(2), 1300);
      const t3 = setTimeout(() => setLoadingPhase(3), 2000);
      const t4 = setTimeout(() => setLoadingPhase(4), 2700);
      const t5 = setTimeout(() => setLoadingPhase(5), 3200);

      const finishTimeout = setTimeout(() => {
        setProgressPercent(100);

        const effectiveCity = selectedCity || POPULAR_CITIES[0];
        const p1Birth: BirthData = {
          name: firstName.trim() || (locale === 'ru' ? 'Алексей' : 'Alex'),
          lastName: lastName.trim() || '',
          country: effectiveCity.country,
          gender: (gender as any) || 'male',
          day: Number(day) || 1,
          month: Number(month) || 1,
          year: Number(year) || 2000,
          hour: unknownTime ? 12 : (hour !== '' ? Number(hour) : 12),
          minute: unknownTime ? 0 : (minute !== '' ? Number(minute) : 0),
          unknownTime,
          cityName: locale === 'ru' ? effectiveCity.name : effectiveCity.nameEn,
          latitude: effectiveCity.latitude,
          longitude: effectiveCity.longitude,
          timezoneOffset: effectiveCity.timezoneOffset
        };

        const natal1 = calculateNatalChart(p1Birth);
        const hd = calculateHumanDesign(p1Birth);

        let synastryResult: SynastryData | undefined = undefined;
        if (calcType === 'synastry') {
          const effectiveP2City = p2SelectedCity || selectedCity || POPULAR_CITIES[0];
          const p2Birth: BirthData = {
            name: p2Name.trim() || (locale === 'ru' ? 'Партнер' : 'Partner'),
            lastName: p2LastName.trim() || '',
            country: effectiveP2City.country,
            gender: (p2Gender as any) || 'female',
            day: Number(p2Day) || 1,
            month: Number(p2Month) || 1,
            year: Number(p2Year) || 2000,
            hour: p2UnknownTime ? 12 : (p2Hour !== '' ? Number(p2Hour) : 12),
            minute: p2UnknownTime ? 0 : (p2Minute !== '' ? Number(p2Minute) : 0),
            unknownTime: p2UnknownTime,
            cityName: locale === 'ru' ? effectiveP2City.name : effectiveP2City.nameEn,
            latitude: effectiveP2City.latitude,
            longitude: effectiveP2City.longitude,
            timezoneOffset: effectiveP2City.timezoneOffset
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

  // Validation State & Helpers
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [attemptedNext, setAttemptedNext] = useState(false);

  const markTouched = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  useEffect(() => {
    setAttemptedNext(false);
  }, [step]);

  // Step 1 Validation
  const isStep1Valid = Boolean(calcType && ['all', 'synastry', 'humandesign'].includes(calcType));

  // Step 2 Validation (First Name, Last Name, Gender)
  const firstNameTrimmed = firstName.trim();
  const lastNameTrimmed = lastName.trim();

  let firstNameError: string | null = null;
  if (touched.firstName || attemptedNext) {
    if (!firstNameTrimmed) {
      firstNameError = t.valFirstNameRequired;
    } else if (!NAME_REGEX.test(firstNameTrimmed) || firstNameTrimmed.length < 2) {
      firstNameError = t.valFirstNameInvalid;
    }
  }

  let lastNameError: string | null = null;
  if ((touched.lastName || attemptedNext) && lastNameTrimmed) {
    if (!NAME_REGEX.test(lastNameTrimmed) || lastNameTrimmed.length < 2) {
      lastNameError = t.valLastNameInvalid;
    }
  }

  const isStep2Valid =
    firstNameTrimmed.length >= 2 &&
    NAME_REGEX.test(firstNameTrimmed) &&
    (!lastNameTrimmed || (lastNameTrimmed.length >= 2 && NAME_REGEX.test(lastNameTrimmed))) &&
    Boolean(gender);

  // Step 3 Validation (Date of Birth)
  const isDateValid = Boolean(
    day !== '' &&
    month !== '' &&
    year !== '' &&
    isValidBirthDate(Number(day), Number(month), Number(year))
  );
  let dateError: string | null = null;
  if ((touched.day || touched.month || touched.year || attemptedNext) && !isDateValid) {
    dateError = t.valDateInvalid;
  }
  const isStep3Valid = isDateValid;

  // Step 4 Validation (Exact Birth Time)
  const isTimeValid =
    unknownTime ||
    (hour !== '' && hour !== undefined && Number(hour) >= 0 && Number(hour) <= 23 &&
     minute !== '' && minute !== undefined && Number(minute) >= 0 && Number(minute) <= 59);
  let timeError: string | null = null;
  if ((touched.time || attemptedNext) && !isTimeValid) {
    timeError = t.valTimeRequired;
  }
  const isStep4Valid = isTimeValid;

  // Step 5 Validation (City)
  const isCityValid = Boolean(
    selectedCity && selectedCity.name && selectedCity.latitude !== undefined && selectedCity.longitude !== undefined
  );
  let cityError: string | null = null;
  if ((touched.city || attemptedNext) && !isCityValid) {
    cityError = t.valCityRequired;
  }
  const isStep5Valid = isCityValid;

  // Step 6 Validation (Partner Data for Synastry)
  const p2NameTrimmed = p2Name.trim();
  const p2LastNameTrimmed = p2LastName.trim();

  let p2NameError: string | null = null;
  if (touched.p2Name || attemptedNext) {
    if (!p2NameTrimmed) {
      p2NameError = t.valP2NameRequired;
    } else if (!NAME_REGEX.test(p2NameTrimmed) || p2NameTrimmed.length < 2) {
      p2NameError = t.valP2NameInvalid;
    }
  }

  let p2LastNameError: string | null = null;
  if ((touched.p2LastName || attemptedNext) && p2LastNameTrimmed) {
    if (!NAME_REGEX.test(p2LastNameTrimmed) || p2LastNameTrimmed.length < 2) {
      p2LastNameError = t.valLastNameInvalid;
    }
  }

  const isP2DateValid = Boolean(
    p2Day !== '' &&
    p2Month !== '' &&
    p2Year !== '' &&
    isValidBirthDate(Number(p2Day), Number(p2Month), Number(p2Year))
  );
  let p2DateError: string | null = null;
  if ((touched.p2Day || touched.p2Month || touched.p2Year || attemptedNext) && !isP2DateValid) {
    p2DateError = t.valP2DateInvalid;
  }

  const isP2TimeValid =
    p2UnknownTime ||
    (p2Hour !== '' && p2Hour !== undefined && Number(p2Hour) >= 0 && Number(p2Hour) <= 23 &&
     p2Minute !== '' && p2Minute !== undefined && Number(p2Minute) >= 0 && Number(p2Minute) <= 59);

  const isP2CityValid = Boolean(
    p2SelectedCity && p2SelectedCity.name && p2SelectedCity.latitude !== undefined
  );
  let p2CityError: string | null = null;
  if ((touched.p2City || attemptedNext) && !isP2CityValid) {
    p2CityError = t.valP2CityRequired;
  }

  const isStep6Valid =
    p2NameTrimmed.length >= 2 &&
    NAME_REGEX.test(p2NameTrimmed) &&
    (!p2LastNameTrimmed || (p2LastNameTrimmed.length >= 2 && NAME_REGEX.test(p2LastNameTrimmed))) &&
    isP2DateValid &&
    isP2TimeValid &&
    isP2CityValid;

  const isCurrentStepValid = (): boolean => {
    if (step === 1) return isStep1Valid;
    if (step === 2) return isStep2Valid;
    if (step === 3) return isStep3Valid;
    if (step === 4) return isStep4Valid;
    if (step === 5) return isStep5Valid;
    if (step === 6) return isStep6Valid;
    return true;
  };
  const stepValid = isCurrentStepValid();

  const handleNext = () => {
    setAttemptedNext(true);
    if (!stepValid) {
      setTimeout(() => {
        const invalidEl = document.querySelector<HTMLElement>('[aria-invalid="true"]');
        if (invalidEl) {
          invalidEl.focus();
        }
      }, 50);
      return;
    }

    setAttemptedNext(false);
    let nextStep = step + 1;
    if (step === 5 && calcType !== 'synastry') {
      nextStep = 99;
    } else if (step === 6 && calcType === 'synastry') {
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

  const cityNameDisplay = selectedCity ? (locale === 'ru' ? selectedCity.name : selectedCity.nameEn) : '';

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Step Indicator */}
      {step < 99 && (
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2 font-medium">
            <button
              type="button"
              onClick={handlePrev}
              className="min-h-[44px] min-w-[44px] -ml-2 px-2.5 py-2 rounded-lg flex items-center space-x-1.5 hover:text-stone-900 transition-colors cursor-pointer"
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
            type="button"
            onClick={handleNext}
            aria-disabled={!isStep1Valid}
            className={`w-full py-4 rounded-xl bg-gradient-to-r from-stone-900 via-stone-800 to-amber-900 text-white font-bold text-base shadow-lg shadow-stone-900/15 transition-all flex items-center justify-center space-x-2 ${
              !isStep1Valid
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:from-black hover:to-stone-900 cursor-pointer'
            }`}
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
                <label htmlFor="first-name-input" className="block text-xs font-bold text-stone-700 mb-2 uppercase tracking-wider">
                  {t.firstNameLabel} <span className="text-red-500">*</span>
                </label>
                <input
                  id="first-name-input"
                  type="text"
                  required
                  aria-required="true"
                  aria-invalid={Boolean(firstNameError)}
                  aria-describedby={firstNameError ? 'first-name-error' : undefined}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  onBlur={() => markTouched('firstName')}
                  placeholder={t.firstNamePlaceholder}
                  className={`w-full px-4 py-3.5 rounded-xl border text-stone-900 placeholder-stone-400 focus:outline-none transition-colors ${
                    firstNameError
                      ? 'border-red-400 focus:border-red-500 bg-red-50/20'
                      : 'bg-stone-50 border-stone-300 focus:border-amber-500 focus:bg-white'
                  }`}
                  autoFocus
                />
                {firstNameError && (
                  <p id="first-name-error" role="alert" className="text-xs text-red-500 mt-1.5 flex items-center gap-1 font-medium">
                    <span>⚠️</span>
                    <span>{firstNameError}</span>
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="last-name-input" className="block text-xs font-bold text-stone-700 mb-2 uppercase tracking-wider">
                  {t.lastNameLabel}
                </label>
                <input
                  id="last-name-input"
                  type="text"
                  aria-invalid={Boolean(lastNameError)}
                  aria-describedby={lastNameError ? 'last-name-error' : undefined}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  onBlur={() => markTouched('lastName')}
                  placeholder={t.lastNamePlaceholder}
                  className={`w-full px-4 py-3.5 rounded-xl border text-stone-900 placeholder-stone-400 focus:outline-none transition-colors ${
                    lastNameError
                      ? 'border-red-400 focus:border-red-500 bg-red-50/20'
                      : 'bg-stone-50 border-stone-300 focus:border-amber-500 focus:bg-white'
                  }`}
                />
                {lastNameError && (
                  <p id="last-name-error" role="alert" className="text-xs text-red-500 mt-1.5 flex items-center gap-1 font-medium">
                    <span>⚠️</span>
                    <span>{lastNameError}</span>
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-2 uppercase tracking-wider">
                {t.genderLabel} <span className="text-red-500">*</span>
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
            type="button"
            onClick={handleNext}
            aria-disabled={!isStep2Valid}
            className={`w-full py-4 rounded-xl bg-gradient-to-r from-stone-900 via-stone-800 to-amber-900 text-white font-bold text-base shadow-lg shadow-stone-900/15 transition-all flex items-center justify-center space-x-2 ${
              !isStep2Valid
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:from-black hover:to-stone-900 cursor-pointer'
            }`}
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

          <div className="grid grid-cols-3 gap-3 mb-2">
            <div>
              <label htmlFor="birth-day-select" className="block text-xs font-bold text-stone-700 mb-1.5">
                {t.dayLabel} <span className="text-red-500">*</span>
              </label>
              <select
                id="birth-day-select"
                aria-required="true"
                aria-invalid={Boolean(dateError)}
                aria-describedby={dateError ? 'birth-date-error' : undefined}
                value={day}
                onChange={(e) => {
                  setDay(e.target.value ? Number(e.target.value) : '');
                  markTouched('day');
                }}
                onBlur={() => markTouched('day')}
                className={`w-full px-3 py-3 rounded-xl border text-stone-900 focus:outline-none font-medium transition-colors ${
                  dateError
                    ? 'border-red-400 focus:border-red-500 bg-red-50/20'
                    : 'bg-stone-50 border-stone-300 focus:border-amber-500 focus:bg-white'
                }`}
              >
                <option value="">{locale === 'ru' ? 'День' : 'Day'}</option>
                {[...Array(31)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="birth-month-select" className="block text-xs font-bold text-stone-700 mb-1.5">
                {t.monthLabel} <span className="text-red-500">*</span>
              </label>
              <select
                id="birth-month-select"
                aria-required="true"
                aria-invalid={Boolean(dateError)}
                aria-describedby={dateError ? 'birth-date-error' : undefined}
                value={month}
                onChange={(e) => {
                  setMonth(e.target.value ? Number(e.target.value) : '');
                  markTouched('month');
                }}
                onBlur={() => markTouched('month')}
                className={`w-full px-3 py-3 rounded-xl border text-stone-900 focus:outline-none font-medium transition-colors ${
                  dateError
                    ? 'border-red-400 focus:border-red-500 bg-red-50/20'
                    : 'bg-stone-50 border-stone-300 focus:border-amber-500 focus:bg-white'
                }`}
              >
                <option value="">{locale === 'ru' ? 'Месяц' : 'Month'}</option>
                {months.map((m, i) => (
                  <option key={i + 1} value={i + 1}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="birth-year-select" className="block text-xs font-bold text-stone-700 mb-1.5">
                {t.yearLabel} <span className="text-red-500">*</span>
              </label>
              <select
                id="birth-year-select"
                aria-required="true"
                aria-invalid={Boolean(dateError)}
                aria-describedby={dateError ? 'birth-date-error' : undefined}
                value={year}
                onChange={(e) => {
                  setYear(e.target.value ? Number(e.target.value) : '');
                  markTouched('year');
                }}
                onBlur={() => markTouched('year')}
                className={`w-full px-3 py-3 rounded-xl border text-stone-900 focus:outline-none font-medium transition-colors ${
                  dateError
                    ? 'border-red-400 focus:border-red-500 bg-red-50/20'
                    : 'bg-stone-50 border-stone-300 focus:border-amber-500 focus:bg-white'
                }`}
              >
                <option value="">{locale === 'ru' ? 'Год' : 'Year'}</option>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {dateError && (
            <p id="birth-date-error" role="alert" className="text-xs text-red-500 mb-6 flex items-center gap-1 font-medium">
              <span>⚠️</span>
              <span>{dateError}</span>
            </p>
          )}
          {!dateError && <div className="mb-6" />}

          <button
            type="button"
            onClick={handleNext}
            aria-disabled={!isStep3Valid}
            className={`w-full py-4 rounded-xl bg-gradient-to-r from-stone-900 via-stone-800 to-amber-900 text-white font-bold text-base shadow-lg shadow-stone-900/15 transition-all flex items-center justify-center space-x-2 ${
              !isStep3Valid
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:from-black hover:to-stone-900 cursor-pointer'
            }`}
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
              {calcType === 'humandesign'
                ? (locale === 'ru'
                  ? 'Точное время необходимо для вычисления активаций Дизайна и Личности, каналов и ворот'
                  : 'Exact birth time is essential to compute Design & Personality activations and bodygraph gates')
                : calcType === 'synastry'
                ? (locale === 'ru'
                  ? 'Точное время необходимо для расчета домов партнерства и точных аспектов пары'
                  : 'Exact birth time is needed to align relationship houses and precise couple aspects')
                : t.step4Subtitle}
            </p>
          </div>

          {!unknownTime ? (
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="birth-hour-select" className="block text-xs font-bold text-stone-700 mb-1.5">{t.hoursLabel}</label>
                <select
                  id="birth-hour-select"
                  aria-invalid={Boolean(timeError)}
                  aria-describedby={timeError ? 'birth-time-error' : undefined}
                  value={hour}
                  onChange={(e) => {
                    setHour(e.target.value !== '' ? Number(e.target.value) : '');
                    markTouched('time');
                  }}
                  onBlur={() => markTouched('time')}
                  className={`w-full px-4 py-3 rounded-xl border text-stone-900 focus:outline-none font-medium transition-colors ${
                    timeError ? 'border-red-400 focus:border-red-500 bg-red-50/20' : 'bg-stone-50 border-stone-300 focus:border-amber-500'
                  }`}
                >
                  <option value="">{locale === 'ru' ? 'ЧЧ' : 'HH'}</option>
                  {[...Array(24)].map((_, i) => (
                    <option key={i} value={i}>
                      {String(i).padStart(2, '0')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="birth-minute-select" className="block text-xs font-bold text-stone-700 mb-1.5">{t.minutesLabel}</label>
                <select
                  id="birth-minute-select"
                  aria-invalid={Boolean(timeError)}
                  aria-describedby={timeError ? 'birth-time-error' : undefined}
                  value={minute}
                  onChange={(e) => {
                    setMinute(e.target.value !== '' ? Number(e.target.value) : '');
                    markTouched('time');
                  }}
                  onBlur={() => markTouched('time')}
                  className={`w-full px-4 py-3 rounded-xl border text-stone-900 focus:outline-none font-medium transition-colors ${
                    timeError ? 'border-red-400 focus:border-red-500 bg-red-50/20' : 'bg-stone-50 border-stone-300 focus:border-amber-500'
                  }`}
                >
                  <option value="">{locale === 'ru' ? 'ММ' : 'MM'}</option>
                  {[...Array(60)].map((_, i) => (
                    <option key={i} value={i}>
                      {String(i).padStart(2, '0')}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-stone-700 text-xs mb-4 flex items-center space-x-3">
              <HelpCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <span>
                {calcType === 'humandesign'
                  ? (locale === 'ru'
                    ? 'Расчет будет выполнен по усредненному полдню (12:00). Большинство ворот и энергетический тип будут определены точно, но линии профиля могут зависеть от часа.'
                    : 'Calculated using solar noon (12:00). Your core energy type and key gates will be determined, though precise profile lines may vary.')
                  : t.unknownTimeNotice}
              </span>
            </div>
          )}

          {timeError && (
            <p id="birth-time-error" role="alert" className="text-xs text-red-500 mb-4 flex items-center gap-1 font-medium">
              <span>⚠️</span>
              <span>{timeError}</span>
            </p>
          )}

          <div
            className="flex items-center space-x-3 mb-8 cursor-pointer"
            onClick={() => {
              const nextVal = !unknownTime;
              setUnknownTime(nextVal);
              markTouched('time');
            }}
          >
            <input
              id="unknown-time-checkbox"
              type="checkbox"
              checked={unknownTime}
              onChange={(e) => {
                setUnknownTime(e.target.checked);
                markTouched('time');
              }}
              className="w-5 h-5 rounded border-stone-300 text-amber-600 focus:ring-amber-500 bg-stone-50 cursor-pointer"
            />
            <label htmlFor="unknown-time-checkbox" className="text-sm font-semibold text-stone-700 cursor-pointer">
              {t.unknownTimeCheck}
            </label>
          </div>

          <button
            type="button"
            onClick={handleNext}
            aria-disabled={!isStep4Valid}
            className={`w-full py-4 rounded-xl bg-gradient-to-r from-stone-900 via-stone-800 to-amber-900 text-white font-bold text-base shadow-lg shadow-stone-900/15 transition-all flex items-center justify-center space-x-2 ${
              !isStep4Valid
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:from-black hover:to-stone-900 cursor-pointer'
            }`}
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
              {calcType === 'humandesign'
                ? (locale === 'ru'
                  ? 'Координаты определяют точный часовой пояс для пересчета времени в UTC для расчета Бодиграфа'
                  : 'Coordinates determine the exact timezone to convert local time to UTC for the Bodygraph')
                : calcType === 'synastry'
                ? (locale === 'ru'
                  ? 'Географические координаты необходимы для вычисления точной сетки домов первого партнера'
                  : 'Geographical coordinates are needed to calculate the primary partner house system')
                : t.step5Subtitle}
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-stone-400" />
              <input
                id="birth-city-input"
                type="text"
                aria-required="true"
                aria-invalid={Boolean(cityError)}
                aria-describedby={cityError ? 'birth-city-error' : undefined}
                value={citySearch}
                onChange={(e) => {
                  setCitySearch(e.target.value);
                  markTouched('city');
                }}
                onBlur={() => {
                  markTouched('city');
                  handleCustomCityLookup(citySearch);
                }}
                placeholder={t.citySearchPlaceholder}
                className={`w-full pl-12 pr-10 py-3.5 rounded-xl border text-stone-900 placeholder-stone-400 focus:outline-none transition-colors ${
                  cityError
                    ? 'border-red-400 focus:border-red-500 bg-red-50/20'
                    : 'bg-stone-50 border-stone-300 focus:border-amber-500 focus:bg-white'
                }`}
              />
              {isGeocoding && (
                <div className="absolute right-3.5 top-3.5">
                  <Loader2 className="w-5 h-5 text-amber-600 animate-spin" />
                </div>
              )}
            </div>

            {cityError && (
              <p id="birth-city-error" role="alert" className="text-xs text-red-500 flex items-center gap-1 font-medium">
                <span>⚠️</span>
                <span>{cityError}</span>
              </p>
            )}

            {/* City Suggestion List */}
            <div className="max-h-48 overflow-y-auto rounded-xl border border-stone-200 bg-stone-50 divide-y divide-stone-200">
              {displayedCities.map((city) => {
                const isSelected = selectedCity?.name === city.name && selectedCity?.country === city.country;
                const cName = locale === 'ru' ? city.name : city.nameEn;
                const cCountry = locale === 'ru' ? city.country : city.countryEn;
                const cRegion = locale === 'ru' ? city.region : city.regionEn;

                return (
                  <div
                    key={`${city.name}-${city.region || ''}-${city.country}`}
                    onClick={() => {
                      setSelectedCity(city);
                      setCitySearch(cName);
                      markTouched('city');
                    }}
                    className={`px-4 py-2.5 flex items-center justify-between cursor-pointer transition-colors ${
                      isSelected ? 'bg-amber-100/70 text-amber-950 font-semibold' : 'hover:bg-stone-100 text-stone-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                      <span className="text-sm font-medium">{cName}</span>
                      <span className="text-xs text-stone-400">
                        {cRegion ? `${cRegion}, ` : ''}{cCountry}
                      </span>
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />}
                  </div>
                );
              })}
              {citySearch.trim().length >= 2 && !isGeocoding && displayedCities.length === 0 && (
                <div className="p-4 text-center text-xs text-stone-500 font-medium">
                  {t.cityNotFound}
                </div>
              )}
            </div>

            {isGeocoding && (
              <div className="text-xs text-amber-700 flex items-center space-x-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{t.searchingGlobal}</span>
              </div>
            )}

            {selectedCity && selectedCity.name && (
              <div className="text-xs text-stone-600 flex items-center space-x-1.5 pt-1">
                <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>
                  {t.selectedCityText} <strong className="text-stone-900 font-bold">{cityNameDisplay}</strong>
                  {selectedCity.region ? `, ${locale === 'ru' ? selectedCity.region : selectedCity.regionEn}` : ''} ({locale === 'ru' ? selectedCity.country : selectedCity.countryEn}, UTC+{selectedCity.timezoneOffset})
                </span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleNext}
            aria-disabled={!isStep5Valid}
            className={`w-full py-4 rounded-xl bg-gradient-to-r from-stone-900 via-stone-800 to-amber-900 text-white font-bold text-base shadow-lg shadow-stone-900/15 transition-all flex items-center justify-center space-x-2 ${
              !isStep5Valid
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:from-black hover:to-stone-900 cursor-pointer'
            }`}
          >
            <span>
              {calcType === 'synastry'
                ? (locale === 'ru' ? 'Ввести данные партнера' : 'Enter Partner Details')
                : calcType === 'humandesign'
                ? (locale === 'ru' ? 'Построить Бодиграф Дизайна Человека' : 'Calculate Human Design Bodygraph')
                : (locale === 'ru' ? 'Рассчитать натальную карту' : 'Generate Natal Chart')}
            </span>
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
                <label htmlFor="p2-name-input" className="block text-xs font-bold text-stone-700 mb-1 uppercase tracking-wider">
                  {t.partnerNameLabel} <span className="text-red-500">*</span>
                </label>
                <input
                  id="p2-name-input"
                  type="text"
                  required
                  aria-required="true"
                  aria-invalid={Boolean(p2NameError)}
                  aria-describedby={p2NameError ? 'p2-name-error' : undefined}
                  value={p2Name}
                  onChange={(e) => {
                    setP2Name(e.target.value);
                    markTouched('p2Name');
                  }}
                  onBlur={() => markTouched('p2Name')}
                  placeholder={locale === 'ru' ? 'Имя' : 'Name'}
                  className={`w-full px-4 py-3 rounded-xl border text-stone-900 placeholder-stone-400 focus:outline-none transition-colors ${
                    p2NameError ? 'border-red-400 focus:border-rose-500 bg-red-50/20' : 'bg-stone-50 border-stone-300 focus:border-rose-500'
                  }`}
                />
                {p2NameError && (
                  <p id="p2-name-error" role="alert" className="text-xs text-red-500 mt-1 flex items-center gap-1 font-medium">
                    <span>⚠️</span>
                    <span>{p2NameError}</span>
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="p2-last-name-input" className="block text-xs font-bold text-stone-700 mb-1 uppercase tracking-wider">
                  {t.lastNameLabel}
                </label>
                <input
                  id="p2-last-name-input"
                  type="text"
                  aria-invalid={Boolean(p2LastNameError)}
                  aria-describedby={p2LastNameError ? 'p2-last-name-error' : undefined}
                  value={p2LastName}
                  onChange={(e) => {
                    setP2LastName(e.target.value);
                    markTouched('p2LastName');
                  }}
                  onBlur={() => markTouched('p2LastName')}
                  placeholder={t.lastNamePlaceholder}
                  className={`w-full px-4 py-3 rounded-xl border text-stone-900 placeholder-stone-400 focus:outline-none transition-colors ${
                    p2LastNameError ? 'border-red-400 focus:border-rose-500 bg-red-50/20' : 'bg-stone-50 border-stone-300 focus:border-rose-500'
                  }`}
                />
                {p2LastNameError && (
                  <p id="p2-last-name-error" role="alert" className="text-xs text-red-500 mt-1 flex items-center gap-1 font-medium">
                    <span>⚠️</span>
                    <span>{p2LastNameError}</span>
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1 uppercase tracking-wider">
                {t.partnerBirthLabel} <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                <select
                  id="p2-day-select"
                  aria-required="true"
                  aria-invalid={Boolean(p2DateError)}
                  aria-describedby={p2DateError ? 'p2-date-error' : undefined}
                  value={p2Day}
                  onChange={(e) => {
                    setP2Day(e.target.value ? Number(e.target.value) : '');
                    markTouched('p2Day');
                  }}
                  onBlur={() => markTouched('p2Day')}
                  className={`px-3 py-2.5 rounded-xl border text-stone-900 text-sm font-medium transition-colors ${
                    p2DateError ? 'border-red-400 bg-red-50/20' : 'bg-stone-50 border-stone-300'
                  }`}
                >
                  <option value="">{locale === 'ru' ? 'День' : 'Day'}</option>
                  {[...Array(31)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
                <select
                  id="p2-month-select"
                  aria-required="true"
                  aria-invalid={Boolean(p2DateError)}
                  aria-describedby={p2DateError ? 'p2-date-error' : undefined}
                  value={p2Month}
                  onChange={(e) => {
                    setP2Month(e.target.value ? Number(e.target.value) : '');
                    markTouched('p2Month');
                  }}
                  onBlur={() => markTouched('p2Month')}
                  className={`px-3 py-2.5 rounded-xl border text-stone-900 text-sm font-medium transition-colors ${
                    p2DateError ? 'border-red-400 bg-red-50/20' : 'bg-stone-50 border-stone-300'
                  }`}
                >
                  <option value="">{locale === 'ru' ? 'Месяц' : 'Month'}</option>
                  {months.map((m, i) => (
                    <option key={i + 1} value={i + 1}>{m}</option>
                  ))}
                </select>
                <select
                  id="p2-year-select"
                  aria-required="true"
                  aria-invalid={Boolean(p2DateError)}
                  aria-describedby={p2DateError ? 'p2-date-error' : undefined}
                  value={p2Year}
                  onChange={(e) => {
                    setP2Year(e.target.value ? Number(e.target.value) : '');
                    markTouched('p2Year');
                  }}
                  onBlur={() => markTouched('p2Year')}
                  className={`px-3 py-2.5 rounded-xl border text-stone-900 text-sm font-medium transition-colors ${
                    p2DateError ? 'border-red-400 bg-red-50/20' : 'bg-stone-50 border-stone-300'
                  }`}
                >
                  <option value="">{locale === 'ru' ? 'Год' : 'Year'}</option>
                  {years.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
              {p2DateError && (
                <p id="p2-date-error" role="alert" className="text-xs text-red-500 mt-1 flex items-center gap-1 font-medium">
                  <span>⚠️</span>
                  <span>{p2DateError}</span>
                </p>
              )}
            </div>

            {/* Partner City Selection */}
            <div>
              <label htmlFor="p2-city-input" className="block text-xs font-bold text-stone-700 mb-1 uppercase tracking-wider">
                {locale === 'ru' ? 'Город рождения партнера' : 'Partner’s Birth City'} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
                <input
                  id="p2-city-input"
                  type="text"
                  aria-required="true"
                  aria-invalid={Boolean(p2CityError)}
                  aria-describedby={p2CityError ? 'p2-city-error' : undefined}
                  value={p2CitySearch}
                  onChange={(e) => {
                    setP2CitySearch(e.target.value);
                    markTouched('p2City');
                  }}
                  onBlur={() => {
                    markTouched('p2City');
                    handleCustomCityLookup(p2CitySearch, true);
                  }}
                  placeholder={t.citySearchPlaceholder}
                  className={`w-full pl-10 pr-9 py-2.5 rounded-xl border text-stone-900 placeholder-stone-400 focus:outline-none text-sm transition-colors ${
                    p2CityError
                      ? 'border-red-400 focus:border-rose-500 bg-red-50/20'
                      : 'bg-stone-50 border-stone-300 focus:border-rose-500'
                  }`}
                />
                {isP2Geocoding && (
                  <div className="absolute right-3 top-2.5">
                    <Loader2 className="w-4 h-4 text-rose-600 animate-spin" />
                  </div>
                )}
              </div>

              {/* Partner city suggestion dropdown when typing */}
              {p2CitySearch.trim().length > 0 && !p2SelectedCity && (
                <div className="max-h-36 overflow-y-auto rounded-xl border border-stone-200 bg-stone-50 divide-y divide-stone-200 mt-1">
                  {displayedP2Cities.map((city) => {
                    const cName = locale === 'ru' ? city.name : city.nameEn;
                    const cCountry = locale === 'ru' ? city.country : city.countryEn;
                    const cRegion = locale === 'ru' ? city.region : city.regionEn;

                    return (
                      <div
                        key={`p2-${city.name}-${city.region || ''}-${city.country}`}
                        onClick={() => {
                          setP2SelectedCity(city);
                          setP2CitySearch(cName);
                          markTouched('p2City');
                        }}
                        className="px-3 py-2 flex items-center justify-between cursor-pointer hover:bg-stone-100 text-stone-700 text-xs"
                      >
                        <div className="flex items-center space-x-1.5">
                          <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          <span className="font-medium">{cName}</span>
                          <span className="text-stone-400">
                            {cRegion ? `${cRegion}, ` : ''}{cCountry}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  {p2CitySearch.trim().length >= 2 && !isP2Geocoding && displayedP2Cities.length === 0 && (
                    <div className="p-3 text-center text-xs text-stone-500 font-medium">
                      {t.cityNotFound}
                    </div>
                  )}
                </div>
              )}

              {selectedCity && (
                <button
                  type="button"
                  onClick={() => {
                    setP2SelectedCity(selectedCity);
                    setP2CitySearch(locale === 'ru' ? selectedCity.name : selectedCity.nameEn);
                    markTouched('p2City');
                  }}
                  className="text-xs text-rose-600 hover:text-rose-700 mt-1.5 underline cursor-pointer inline-block"
                >
                  {locale === 'ru' ? `Тот же город, что у вас (${selectedCity.name})` : `Same city as yours (${selectedCity.nameEn})`}
                </button>
              )}

              {p2CityError && (
                <p id="p2-city-error" role="alert" className="text-xs text-red-500 mt-1 font-medium">
                  ⚠️ {p2CityError}
                </p>
              )}

              {p2SelectedCity && (
                <p className="text-xs text-stone-600 mt-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span>
                    {locale === 'ru' ? p2SelectedCity.name : p2SelectedCity.nameEn}
                    {p2SelectedCity.region ? `, ${locale === 'ru' ? p2SelectedCity.region : p2SelectedCity.regionEn}` : ''} ({locale === 'ru' ? p2SelectedCity.country : p2SelectedCity.countryEn}, UTC+{p2SelectedCity.timezoneOffset})
                  </span>
                </p>
              )}
            </div>

            <div
              className="flex items-center space-x-3 pt-2 cursor-pointer"
              onClick={() => {
                const nextVal = !p2UnknownTime;
                setP2UnknownTime(nextVal);
                markTouched('p2Time');
              }}
            >
              <input
                id="p2-unknown-time-checkbox"
                type="checkbox"
                checked={p2UnknownTime}
                onChange={(e) => {
                  setP2UnknownTime(e.target.checked);
                  markTouched('p2Time');
                }}
                className="w-4 h-4 rounded border-stone-300 text-rose-600 cursor-pointer"
              />
              <label htmlFor="p2-unknown-time-checkbox" className="text-xs text-stone-700 font-medium cursor-pointer">
                {t.partnerUnknownTime}
              </label>
            </div>
          </div>

          <button
            type="button"
            onClick={handleNext}
            aria-disabled={!isStep6Valid}
            className={`w-full py-4 rounded-xl bg-gradient-to-r from-stone-900 via-rose-900 to-stone-900 text-white font-bold text-base shadow-lg shadow-stone-900/15 transition-all flex items-center justify-center space-x-2 ${
              !isStep6Valid
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:from-black cursor-pointer'
            }`}
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
            {calcType === 'humandesign'
              ? (locale === 'ru' ? 'Построение Бодиграфа Дизайна Человека...' : 'Generating Human Design Bodygraph...')
              : calcType === 'synastry'
              ? (locale === 'ru' ? 'Вычисление синастрии и совместимости пары...' : 'Calculating Compatibility & Synastry...')
              : t.calcHeading}
          </h2>

          <p className="text-xs sm:text-sm text-stone-600 mb-6 h-8 flex items-center justify-center font-medium">
            {calcType === 'humandesign' ? (
              loadingPhase === 0 ? (locale === 'ru' ? 'Активация 64 ворот рейв-мандалы...' : 'Activating 64 Rave Mandala gates...') :
              loadingPhase === 1 ? (locale === 'ru' ? `Синхронизация координат и часового пояса для г. ${cityNameDisplay}...` : `Aligning coordinates and timezone for ${cityNameDisplay}...`) :
              loadingPhase === 2 ? (locale === 'ru' ? 'Расчет личности (черные ворота) и дизайна (красные ворота)...' : 'Computing Personality and Design planetary activations...') :
              loadingPhase === 3 ? (locale === 'ru' ? 'Определение 9 энергетических центров и каналов...' : 'Synthesizing 9 energy centers and definition channels...') :
              loadingPhase === 4 ? (locale === 'ru' ? 'Идентификация Генетического Типа, Профиля и Внутреннего Авторитета...' : 'Identifying Genetic Type, Profile, and Inner Authority...') :
              (locale === 'ru' ? `Формирование персонального Бодиграфа для ${fullName}...` : `Finalizing Human Design blueprint for ${fullName}...`)
            ) : calcType === 'synastry' ? (
              loadingPhase === 0 ? (locale === 'ru' ? 'Сопоставление натальных карт обоих партнеров...' : 'Cross-analyzing natal positions of both partners...') :
              loadingPhase === 1 ? (locale === 'ru' ? `Синхронизация часовых поясов для г. ${cityNameDisplay}...` : `Aligning local timezones for ${cityNameDisplay}...`) :
              loadingPhase === 2 ? (locale === 'ru' ? 'Расчет синастрических аспектов Солнце-Луна и Венера-Марс...' : 'Calculating Sun-Moon and Venus-Mars synastry aspects...') :
              loadingPhase === 3 ? (locale === 'ru' ? 'Вычисление индекса сексуального и эмоционального притяжения...' : 'Computing emotional and attraction compatibility scores...') :
              loadingPhase === 4 ? (locale === 'ru' ? 'Анализ кармических уроков и скрытых зон конфликта...' : 'Analyzing karmic lessons and relationship friction triggers...') :
              (locale === 'ru' ? `Формирование персонального прогноза пары для ${fullName}...` : `Finalizing compatibility forecast for ${fullName}...`)
            ) : (
              <>
                {loadingPhase === 0 && t.phase1}
                {loadingPhase === 1 && t.phase2.replace('{city}', cityNameDisplay)}
                {loadingPhase === 2 && t.phase3}
                {loadingPhase === 3 && t.phase4}
                {loadingPhase === 4 && t.phase5}
                {loadingPhase === 5 && t.phase6.replace('{name}', fullName)}
              </>
            )}
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
