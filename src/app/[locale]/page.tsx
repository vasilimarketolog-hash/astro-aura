'use client';

import React, { use } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { ReviewsSection } from '@/components/ReviewsSection';
import { Footer } from '@/components/Footer';
import { Locale } from '@/types/astro';

export default function LocalizedLandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const locale: Locale = resolvedParams.locale === 'es' ? 'es' : resolvedParams.locale === 'en' ? 'en' : 'ru';

  const handleToggleLocale = (newLocale: Locale) => {
    if (newLocale === locale) return;
    if (newLocale === 'es') {
      router.push('/es');
    } else if (newLocale === 'en') {
      router.push('/en');
    } else {
      router.push('/');
    }
  };

  const handleStartQuiz = (focus?: string) => {
    const prefix = locale === 'es' ? '/es' : locale === 'en' ? '/en' : '';
    if (focus === 'synastry') {
      router.push(`${prefix}/synastry/step/1`);
    } else if (focus === 'humandesign') {
      router.push(`${prefix}/hd/step/1`);
    } else {
      router.push(`${prefix}/chart/step/1`);
    }
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
        onToggleLocale={handleToggleLocale}
        onStartQuiz={() => handleStartQuiz()}
      />

      {/* Main Content Area */}
      <main className="flex-1 relative z-10">
        <HeroSection locale={locale} onStart={handleStartQuiz} />
        <ReviewsSection locale={locale} />
      </main>

      {/* Footer */}
      <Footer locale={locale} />
    </div>
  );
}
