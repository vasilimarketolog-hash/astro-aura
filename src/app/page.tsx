'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { QuizFlow } from '@/components/QuizFlow';
import { TeaserReport } from '@/components/TeaserReport';
import { PaywallModal } from '@/components/PaywallModal';
import { FullNatalDashboard } from '@/components/FullNatalDashboard';
import { ReviewsSection } from '@/components/ReviewsSection';
import { Footer } from '@/components/Footer';
import { NatalChartData, SynastryData, HumanDesignData, CalculationType, Locale } from '@/types/astro';

type AppView = 'landing' | 'quiz' | 'teaser' | 'unlocked';

export default function Home() {
  const [view, setView] = useState<AppView>('landing');
  const [locale, setLocale] = useState<Locale>('ru');
  const [selectedFocus, setSelectedFocus] = useState<string | undefined>(undefined);
  const [isPaywallOpen, setIsPaywallOpen] = useState<boolean>(false);
  const [isPaid, setIsPaid] = useState<boolean>(false);

  // Calculated Results
  const [natalData, setNatalData] = useState<NatalChartData | null>(null);
  const [synastryData, setSynastryData] = useState<SynastryData | undefined>(undefined);
  const [humanDesignData, setHumanDesignData] = useState<HumanDesignData | null>(null);

  const handleStartQuiz = (focus?: string) => {
    setSelectedFocus(focus);
    setView('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuizComplete = (data: {
    natal: NatalChartData;
    synastry?: SynastryData;
    humanDesign: HumanDesignData;
    calculationType: CalculationType;
  }) => {
    setNatalData(data.natal);
    setSynastryData(data.synastry);
    setHumanDesignData(data.humanDesign);

    if (isPaid) {
      setView('unlocked');
    } else {
      setView('teaser');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePaymentSuccess = (planId: string) => {
    setIsPaid(true);
    setIsPaywallOpen(false);
    setView('unlocked');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-amber-400 selection:text-black relative overflow-x-hidden">
      {/* Dynamic Cosmic Star Particles / Glow background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-200/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[600px] h-[600px] bg-yellow-100/30 rounded-full blur-[180px]" />
      </div>

      {/* Header with Language Switcher */}
      <Header
        locale={locale}
        onToggleLocale={setLocale}
        onStartQuiz={() => handleStartQuiz()}
        hasCalculatedData={!!natalData}
        onViewReport={() => setView(isPaid ? 'unlocked' : 'teaser')}
      />

      {/* Main Content Area */}
      <main className="flex-1 relative z-10">
        {view === 'landing' && (
          <>
            <HeroSection locale={locale} onStart={handleStartQuiz} />
            <ReviewsSection />
          </>
        )}

        {view === 'quiz' && (
          <QuizFlow
            locale={locale}
            initialFocus={selectedFocus}
            onComplete={handleQuizComplete}
            onCancel={() => setView('landing')}
          />
        )}

        {view === 'teaser' && natalData && humanDesignData && (
          <TeaserReport
            locale={locale}
            natal={natalData}
            synastry={synastryData}
            humanDesign={humanDesignData}
            onUnlockPaywall={() => setIsPaywallOpen(true)}
          />
        )}

        {view === 'unlocked' && natalData && humanDesignData && (
          <FullNatalDashboard
            locale={locale}
            natal={natalData}
            synastry={synastryData}
            humanDesign={humanDesignData}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Paywall & Checkout Modal */}
      <PaywallModal
        locale={locale}
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
