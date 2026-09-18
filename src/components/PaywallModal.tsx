'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Check,
  ShieldCheck,
  Zap,
  Flame,
  ArrowRight
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
    if (!isOpen) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const selectedPlan = plans.find((p) => p.id === selectedPlanId) || plans[0];

  const handleSimulatedPayment = async () => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsProcessing(false);

    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // fallback
    }

    onPaymentSuccess(selectedPlan.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white border-2 border-amber-300 rounded-3xl p-6 sm:p-8 shadow-2xl my-8 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-stone-100 text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
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

        {/* Email & Payment Actions */}
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
                onClick={handleSimulatedPayment}
                disabled={isProcessing}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-stone-900 via-stone-800 to-amber-900 hover:from-black text-white font-bold text-sm shadow-xl shadow-stone-900/15 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <span className="animate-spin">🌀</span>
                    <span>{locale === 'ru' ? 'Активация доступа...' : 'Activating Access...'}</span>
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
