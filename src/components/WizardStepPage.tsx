'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { QuizFlow } from '@/components/QuizFlow';
import { CalculationType, Locale, NatalChartData, SynastryData, HumanDesignData } from '@/types/astro';
import { getWizardState, saveWizardState, getFirstUnfilledStep, generateResultId, encodePayload, saveResult } from '@/lib/storage';

interface WizardStepPageProps {
  locale: Locale;
  calcType: CalculationType;
  stepNumber: number;
}

export const WizardStepPage: React.FC<WizardStepPageProps> = ({
  locale,
  calcType,
  stepNumber,
}) => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  const routePrefix = locale === 'en' ? '/en' : '';
  const basePath =
    calcType === 'synastry'
      ? '/synastry'
      : calcType === 'humandesign'
      ? '/hd'
      : '/chart';

  // Guard against direct jump into intermediate steps
  useEffect(() => {
    setIsClient(true);
    const savedState = getWizardState();
    const firstUnfilled = getFirstUnfilledStep(calcType, savedState);

    // If stepNumber is greater than the allowed step, redirect to first unfilled
    if (stepNumber > 1 && stepNumber > firstUnfilled) {
      router.replace(`${routePrefix}${basePath}/step/${firstUnfilled}`);
    }
  }, [calcType, stepNumber, routePrefix, basePath, router]);

  const handleStepChange = (newStep: number) => {
    if (newStep === 99) {
      // Loading screen step
      return;
    }
    router.push(`${routePrefix}${basePath}/step/${newStep}`);
  };

  const handleComplete = (data: {
    natal: NatalChartData;
    synastry?: SynastryData;
    humanDesign: HumanDesignData;
    calculationType: CalculationType;
  }) => {
    const p1 = data.natal.birthData;
    const resultId = generateResultId({
      calcType: data.calculationType,
      year: p1.year,
      month: p1.month,
      day: p1.day,
      hour: p1.hour,
      minute: p1.minute,
      lat: p1.latitude,
      lon: p1.longitude,
    });

    // Save to localStorage for instant local retrieval
    saveResult(resultId, {
      natal: data.natal,
      synastry: data.synastry,
      humanDesign: data.humanDesign,
      calculationType: data.calculationType,
      timestamp: Date.now(),
    });

    // Encode payload so the link can be opened on other devices
    const payload = encodePayload({
      p1,
      p2: data.synastry?.person2.birthData,
      calcType: data.calculationType,
    });

    router.push(`${routePrefix}/result/${resultId}?d=${payload}`);
  };

  const handleToggleLocale = (newLocale: Locale) => {
    if (newLocale === locale) return;
    const targetPrefix = newLocale === 'en' ? '/en' : '';
    router.push(`${targetPrefix}${basePath}/step/${stepNumber}`);
  };

  const handleCancel = () => {
    router.push(`${routePrefix}/`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-amber-400 selection:text-black relative overflow-x-hidden">
      {/* Dynamic Cosmic Star Particles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-200/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[600px] h-[600px] bg-yellow-100/30 rounded-full blur-[180px]" />
      </div>

      <Header
        locale={locale}
        onToggleLocale={handleToggleLocale}
        onStartQuiz={() => router.push(`${routePrefix}${basePath}/step/1`)}
      />

      <main className="flex-1 relative z-10 py-4">
        {isClient && (
          <QuizFlow
            locale={locale}
            step={stepNumber}
            calcType={calcType}
            onStepChange={handleStepChange}
            onComplete={handleComplete}
            onCancel={handleCancel}
          />
        )}
      </main>

      <Footer locale={locale} />
    </div>
  );
};
