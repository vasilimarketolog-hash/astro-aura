'use client';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    ym?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export const trackEvent = (
  eventName: string,
  params?: Record<string, any>
) => {
  if (typeof window === 'undefined') return;

  // Google Analytics 4
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }

  // Yandex Metrika Goal
  const ymId = process.env.NEXT_PUBLIC_YM_ID;
  if (ymId && typeof window.ym === 'function') {
    window.ym(Number(ymId), 'reachGoal', eventName, params);
  }
};
