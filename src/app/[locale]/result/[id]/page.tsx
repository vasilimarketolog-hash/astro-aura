'use client';

import React, { use, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { TeaserReport } from '@/components/TeaserReport';
import { FullNatalDashboard } from '@/components/FullNatalDashboard';
import { PaywallModal } from '@/components/PaywallModal';
import { Locale, NatalChartData, SynastryData, HumanDesignData } from '@/types/astro';
import { getResult, decodePayload, saveResult } from '@/lib/storage';
import { calculateNatalChart, calculateSynastry, calculateHumanDesign } from '@/lib/astroEngine';
import { Loader2, Sparkles } from 'lucide-react';

export default function ResultPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resolvedParams = use(params);
  const locale: Locale = resolvedParams.locale === 'en' ? 'en' : 'ru';
  const id = resolvedParams.id;
  const dParam = searchParams.get('d');

  const [isLoading, setIsLoading] = useState(true);
  const [natalData, setNatalData] = useState<NatalChartData | null>(null);
  const [synastryData, setSynastryData] = useState<SynastryData | undefined>(undefined);
  const [humanDesignData, setHumanDesignData] = useState<HumanDesignData | null>(null);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  useEffect(() => {
    // 1. Try local cache
    const cached = getResult(id);
    if (cached) {
      setNatalData(cached.natal);
      setSynastryData(cached.synastry);
      setHumanDesignData(cached.humanDesign);
      setIsLoading(false);
      return;
    }

    // 2. Try URL query payload
    if (dParam) {
      const payload = decodePayload(dParam);
      if (payload && payload.p1) {
        try {
          const natal1 = calculateNatalChart(payload.p1);
          const hd = calculateHumanDesign(payload.p1);
          let syn: SynastryData | undefined = undefined;

          if (payload.p2) {
            const natal2 = calculateNatalChart(payload.p2);
            syn = calculateSynastry(natal1, natal2);
          }

          saveResult(id, {
            natal: natal1,
            synastry: syn,
            humanDesign: hd,
            calculationType: payload.calcType || 'all',
            timestamp: Date.now(),
          });

          setNatalData(natal1);
          setSynastryData(syn);
          setHumanDesignData(hd);
          setIsLoading(false);
          return;
        } catch (err) {
          console.error('Failed to calculate from URL payload:', err);
        }
      }
    }

    setIsLoading(false);
  }, [id, dParam]);

  const routePrefix = locale === 'en' ? '/en' : '';

  const handleToggleLocale = (newLocale: Locale) => {
    if (newLocale === locale) return;
    const targetPrefix = newLocale === 'en' ? '/en' : '';
    const query = dParam ? `?d=${dParam}` : '';
    router.push(`${targetPrefix}/result/${id}${query}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 text-amber-600 animate-spin mx-auto" />
          <p className="text-sm font-semibold text-stone-700">
            {locale === 'ru' ? 'Загрузка Космического Паспорта...' : 'Loading Cosmic Passport...'}
          </p>
        </div>
      </div>
    );
  }

  if (!natalData || !humanDesignData) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
        <Header locale={locale} onToggleLocale={handleToggleLocale} onStartQuiz={() => router.push(`${routePrefix}/chart/step/1`)} />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md text-center bg-white p-8 rounded-3xl border border-stone-200 shadow-lg space-y-4">
            <Sparkles className="w-8 h-8 text-amber-600 mx-auto" />
            <h2 className="text-xl font-bold text-stone-900">
              {locale === 'ru' ? 'Расчет не найден' : 'Chart Not Found'}
            </h2>
            <p className="text-xs text-stone-600">
              {locale === 'ru'
                ? 'Срок действия временных данных истек, либо ссылка некорректна. Вы можете рассчитать новую карту бесплатно.'
                : 'The temporary calculation link has expired or is invalid. You can generate a new chart for free.'}
            </p>
            <button
              onClick={() => router.push(`${routePrefix}/chart/step/1`)}
              className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-sm"
            >
              {locale === 'ru' ? 'Рассчитать бесплатно' : 'Calculate Free'}
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-amber-400 selection:text-black relative overflow-x-hidden">
      {/* Glow background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-200/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[600px] h-[600px] bg-yellow-100/30 rounded-full blur-[180px]" />
      </div>

      <Header
        locale={locale}
        onToggleLocale={handleToggleLocale}
        onStartQuiz={() => router.push(`${routePrefix}/chart/step/1`)}
      />

      <main className="flex-1 relative z-10">
        {!isPaid ? (
          <TeaserReport
            locale={locale}
            natal={natalData}
            synastry={synastryData}
            humanDesign={humanDesignData}
            onUnlockPaywall={() => setIsPaywallOpen(true)}
          />
        ) : (
          <FullNatalDashboard
            locale={locale}
            natal={natalData}
            synastry={synastryData}
            humanDesign={humanDesignData}
          />
        )}
      </main>

      <Footer />

      <PaywallModal
        locale={locale}
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        onPaymentSuccess={() => {
          setIsPaid(true);
          setIsPaywallOpen(false);
        }}
      />
    </div>
  );
}
