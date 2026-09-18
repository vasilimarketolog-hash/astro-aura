'use client';

import React, { use } from 'react';
import { WizardStepPage } from '@/components/WizardStepPage';
import { Locale } from '@/types/astro';

export default function SynastryStepPage({
  params,
}: {
  params: Promise<{ locale: string; step: string }>;
}) {
  const resolved = use(params);
  const locale: Locale = resolved.locale === 'en' ? 'en' : 'ru';
  const stepNumber = Math.max(1, Math.min(6, parseInt(resolved.step, 10) || 1));

  return (
    <WizardStepPage
      locale={locale}
      calcType="synastry"
      stepNumber={stepNumber}
    />
  );
}
