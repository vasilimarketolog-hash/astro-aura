'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Check,
  ShieldCheck,
  Zap,
  Flame,
  ArrowRight,
  Loader2,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TariffPlan, Locale } from '@/types/astro';

interface PaywallModalProps {
  locale: Locale;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (planId: string) => void;
}

export const PaywallModal: React.FC<PaywallModalProps> = ({
  locale,
  isOpen,
  onClose,
  onPaymentSuccess
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>('trial_sub');
  const [email, setEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(14 * 60 + 59);

  // Waitlist fallback state when payment gateway is not active
  const [isWaitlistMode, setIsWaitlistMode] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [isWaitlistLoading, setIsWaitlistLoading] = useState(false);
  const [isWaitlistSuccess, setIsWaitlistSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const TARIFF_PLANS_RU: TariffPlan[] = [
    {
      id: 'trial_sub',
      title: 'Пробный период (Trial)',
      badge: 'Самый популярный',
      price: 1,
      oldPrice: 890,
      currency: '₽',
      periodText: 'за 3 дня, далее 890 ₽/нед',
      description: 'Идеально для быстрого старта: полный доступ ко всем функциям и AI-астрологу.',
      features: [
        'Именной PDF-отчет для скачивания (30+ стр.)',
        'Полная натальная карта (10 планет + 12 домов)',
        'Расчет кармических узлов и точек богатства',
        'AI-Астролог «Астра» (консультации 24/7)',
        'Отмена подписки в любой момент в 1 клик'
      ],
      isPopular: true,
      type: 'subscription'
    },
    {
      id: 'onetime_report',
      title: 'Разовый разбор навсегда',
      badge: 'Без подписок',
      price: 590,
      oldPrice: 1990,
      currency: '₽',
      periodText: 'разовый платеж',
      description: 'Единоразовая оплата. Вы получаете натальную карту и PDF-отчет навсегда.',
      features: [
        'Именной персональный PDF-отчет',
        'Полная натальная карта со всеми аспектами',
        'Финансовый код (2 и 8 дома)',
        'Сценарий любви и брака (7 дом и Венера)',
        'Пожизненный доступ без списаний'
      ],
      type: 'onetime'
    },
    {
      id: 'vip_combo',
      title: 'VIP: Все включено',
      badge: 'Максимальная выгода',
      price: 1290,
      oldPrice: 3990,
      currency: '₽',
      periodText: 'разовый платеж',
      description: 'Полный пакет: Натальная карта + Совместимость + Дизайн Человека.',
      features: [
        'Все возможности Натальной карты',
        'Полный расчет Синастрии (Совместимость)',
        'Бодиграф Дизайна Человека (Тип, Стратегия, Центры)',
        'Безлимитный AI-Астролог на 1 год',
        'Премиальный именной VIP PDF-отчет'
      ],
      type: 'vip'
    }
  ];

  const TARIFF_PLANS_EN: TariffPlan[] = [
    {
      id: 'trial_sub',
      title: 'Trial Access (3 Days)',
      badge: 'Most Popular',
      price: 1,
      oldPrice: 12,
      currency: '$',
      periodText: 'for 3 days, then $9.99/week',
      description: 'Perfect for quick start: full access to all features, PDF download & AI Astrologer.',
      features: [
        'Personalized Named PDF Report (30+ pages)',
        'Full Natal Chart (10 planets + 12 houses)',
        'Karmic nodes and wealth codes analysis',
        '24/7 Personal AI Astrologer Astra',
        'Cancel anytime in 1 click'
      ],
      isPopular: true,
      type: 'subscription'
    },
    {
      id: 'onetime_report',
      title: 'One-Time Lifetime Access',
      badge: 'No Subscription',
      price: 9,
      oldPrice: 29,
      currency: '$',
      periodText: 'one-time payment',
      description: 'One single payment. You get full chart and lifetime PDF report.',
      features: [
        'Named personalized PDF download',
        'Full natal chart with 45 aspects',
        'Financial code (2nd & 8th houses)',
        'Love and marriage blueprint (7th house & Venus)',
        'Lifetime access with zero recurring fees'
      ],
      type: 'onetime'
    },
    {
      id: 'vip_combo',
      title: 'VIP: All-Inclusive Bundle',
      badge: 'Best Value',
      price: 19,
      oldPrice: 49,
      currency: '$',
      periodText: 'one-time payment',
      description: 'The ultimate bundle: Natal Chart + Partner Compatibility + Human Design.',
      features: [
        'All features of Full Natal Chart',
        'Complete Synastry (Compatibility report)',
        'Human Design Bodygraph (Type, Strategy, Centers)',
        'Unlimited AI Astrologer for 1 year',
        'Premium VIP Branded PDF Certificate'
      ],
      type: 'vip'
    }
  ];

  const plans = locale === 'ru' ? TARIFF_PLANS_RU : TARIFF_PLANS_EN;

  useEffect(() => {
    if (!isOpen) {
      setIsWaitlistMode(false);
      setIsWaitlistSuccess(false);
      setErrorMessage(null);
      setIsProcessing(false);
      setIsWaitlistLoading(false);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearInterval(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const selectedPlan = plans.find((p) => p.id === selectedPlanId) || plans[0];

  const handlePaymentClick = async () => {
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: selectedPlan.id,
          email: email.trim()
        })
      });

      const data = await res.json();

      if (data.gatewayActive && data.paymentUrl) {
        window.location.href = data.paymentUrl;
        return;
      }

      // Gateway not active -> show email waitlist form
      setIsWaitlistMode(true);
      if (email.trim()) {
        setWaitlistEmail(email.trim());
      }
    } catch (err) {
      setIsWaitlistMode(true);
      if (email.trim()) {
        setWaitlistEmail(email.trim());
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistEmail.trim() || !waitlistEmail.includes('@')) {
      setErrorMessage(
        locale === 'ru'
          ? 'Пожалуйста, введите корректный адрес электронной почты'
          : 'Please enter a valid email address'
      );
      return;
    }

    setIsWaitlistLoading(true);
    setErrorMessage(null);

    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('aa_waitlist_emails');
        const list = stored ? JSON.parse(stored) : [];
        list.push({
          email: waitlistEmail.trim(),
          planId: selectedPlan.id,
          timestamp: Date.now(),
          locale
        });
        localStorage.setItem('aa_waitlist_emails', JSON.stringify(list));

        if ((window as any).dataLayer) {
          (window as any).dataLayer.push({
            event: 'waitlist_submitted',
            planId: selectedPlan.id,
            email: waitlistEmail.trim()
          });
        }
      }

      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {}

      setIsWaitlistSuccess(true);
    } catch (err) {
      console.error('Waitlist error:', err);
    } finally {
      setIsWaitlistLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white border-2 border-amber-300 rounded-3xl p-6 sm:p-8 shadow-2xl my-8 overflow-hidden">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-5 right-5 min-w-[44px] min-h-[44px] rounded-full bg-stone-100 text-stone-500 hover:text-stone-900 transition-colors cursor-pointer flex items-center justify-center"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs mb-3 font-bold">
            <Flame className="w-4 h-4 text-amber-600" />
            <span>
              {locale === 'ru' ? 'Скидка сгорает через:' : 'Discount expires in:'}{' '}
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 mb-2">
            {locale === 'ru' ? 'Выберите тариф для открытия полного разбора' : 'Choose Your Access Plan'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto">
            {locale === 'ru'
              ? 'Получите именной отчет в PDF, доступ ко всем 10 планетам, 12 домам и AI-астрологу.'
              : 'Get your personalized named PDF report, access to all 10 planets, 12 houses and AI Astrologer.'}
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {plans.map((plan) => {
            const isSelected = plan.id === selectedPlanId;
            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlanId(plan.id)}
                className={`relative rounded-3xl p-5 border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-amber-50/70 border-amber-500 shadow-lg scale-[1.02]'
                    : 'bg-stone-50/60 border-stone-200 hover:border-amber-300'
                }`}
              >
                {plan.badge && (
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    plan.isPopular ? 'bg-amber-500 text-white' : 'bg-stone-800 text-stone-100'
                  }`}>
                    {plan.badge}
                  </div>
                )}

                <div>
                  <h3 className="text-base font-extrabold text-stone-900 mb-1 mt-1">{plan.title}</h3>
                  <p className="text-xs text-stone-600 mb-4 min-h-[32px]">{plan.description}</p>

                  <div className="flex items-baseline space-x-2 mb-1">
                    <span className="text-2xl sm:text-3xl font-black text-stone-900">
                      {plan.price} {plan.currency}
                    </span>
                    <span className="text-sm line-through text-stone-400 font-medium">
                      {plan.oldPrice} {plan.currency}
                    </span>
                  </div>
                  <div className="text-[11px] text-amber-800 font-bold mb-4">
                    {plan.periodText}
                  </div>

                  <ul className="space-y-2 text-xs text-stone-700 mb-6">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <Check className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={`w-full py-2.5 rounded-xl text-xs font-bold text-center transition-colors ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-950 shadow-sm'
                    : 'bg-white text-stone-700 border border-stone-300'
                }`}>
                  {isSelected ? (locale === 'ru' ? 'Выбранный тариф' : 'Selected Plan') : (locale === 'ru' ? 'Выбрать тариф' : 'Select Plan')}
                </div>
              </div>
            );
          })}
        </div>

        {/* Email & Payment Actions or Waitlist Fallback */}
        {isWaitlistMode ? (
          <div className="bg-gradient-to-br from-amber-50 via-white to-orange-50 border-2 border-amber-300 rounded-3xl p-6 sm:p-7 mb-4 shadow-sm">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h3 className="text-base sm:text-lg font-black text-stone-900">
                  {locale === 'ru'
                    ? 'Мы подключаем прием платежей'
                    : 'We are connecting payment processing'}
                </h3>
                <p className="text-xs text-stone-600">
                  {locale === 'ru'
                    ? 'Оставьте email — пришлем доступ первыми со скидкой 90%'
                    : 'Leave your email — get first access with a 90% discount'}
                </p>
              </div>
            </div>

            {isWaitlistSuccess ? (
              <div className="space-y-4 pt-2">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-bold flex items-center space-x-2">
                  <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>
                    {locale === 'ru'
                      ? 'Спасибо! Вы в списке первых. Проверьте почту.'
                      : 'Thank you! You are on the priority list. Check your email.'}
                  </span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      onPaymentSuccess(selectedPlan.id);
                      onClose();
                    }}
                    className="text-xs text-amber-800 hover:text-amber-900 font-bold underline cursor-pointer"
                  >
                    {locale === 'ru' ? 'Открыть демо-доступ к полной карте →' : 'Preview demo access to full chart →'}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    {locale === 'ru' ? 'Закрыть' : 'Close'}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleWaitlistSubmit} className="space-y-3 pt-2">
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <input
                    type="email"
                    required
                    autoFocus
                    placeholder="name@email.com"
                    value={waitlistEmail}
                    onChange={(e) => setWaitlistEmail(e.target.value)}
                    className="w-full sm:flex-1 px-4 py-3 rounded-xl bg-white border border-amber-300 text-stone-900 placeholder-stone-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-inner"
                  />
                  <button
                    type="submit"
                    disabled={isWaitlistLoading}
                    className="w-full sm:w-auto px-6 py-3 min-h-[44px] rounded-xl bg-gradient-to-r from-stone-900 via-stone-800 to-amber-900 hover:from-black text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 shrink-0"
                  >
                    {isWaitlistLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>{locale === 'ru' ? 'Получить доступ' : 'Get Access'}</span>
                      </>
                    )}
                  </button>
                </div>
                {errorMessage && (
                  <p className="text-xs text-rose-600 font-medium text-left">{errorMessage}</p>
                )}
              </form>
            )}
          </div>
        ) : (
          <div className="bg-stone-50 border border-stone-200 rounded-3xl p-5 mb-4">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-full sm:flex-1">
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {locale === 'ru' ? 'Куда отправить копию отчета и данные для входа?' : 'Where should we send your official PDF and access details?'}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-stone-300 text-stone-900 placeholder-stone-400 text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="w-full sm:w-auto flex flex-col items-center">
                <button
                  type="button"
                  onClick={handlePaymentClick}
                  disabled={isProcessing}
                  className="w-full sm:w-auto px-8 py-3.5 min-h-[44px] rounded-2xl bg-gradient-to-r from-stone-900 via-stone-800 to-amber-900 hover:from-black text-white font-bold text-sm shadow-xl shadow-stone-900/15 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                      <span>{locale === 'ru' ? 'Проверка шлюза...' : 'Checking gateway...'}</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span>
                        {locale === 'ru' ? `Оплатить ${selectedPlan.price} ${selectedPlan.currency} и открыть` : `Pay ${selectedPlan.price} ${selectedPlan.currency} & Unlock`}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Security & Payment Provider Icons */}
        <div className="flex flex-wrap items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-200 gap-3">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>256-bit SSL • {locale === 'ru' ? 'Гарантия возврата 100%' : '100% Money Back Guarantee'}</span>
          </div>

          <div className="flex items-center space-x-3 text-stone-500 font-mono text-[11px] font-bold">
            <span>МИР</span>
            <span>СБП</span>
            <span>VISA</span>
            <span>MasterCard</span>
            <span>Stripe</span>
          </div>
        </div>
      </div>
    </div>
  );
};
