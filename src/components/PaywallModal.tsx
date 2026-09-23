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
  Sparkles,
  Copy,
  CheckCheck,
  QrCode,
  CreditCard,
  Wallet,
  ExternalLink
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

  // Payment method selection: 'card' (Lava.top) or 'crypto' (USDT/TON)
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'crypto'>('card');
  const [cryptoNetwork, setCryptoNetwork] = useState<'TRC20' | 'TON'>('TRC20');
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [cryptoTxId, setCryptoTxId] = useState('');
  const [isCryptoSubmitting, setIsCryptoSubmitting] = useState(false);

  // Waitlist fallback state when payment gateway is not active
  const [isWaitlistMode, setIsWaitlistMode] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [isWaitlistLoading, setIsWaitlistLoading] = useState(false);
  const [isWaitlistSuccess, setIsWaitlistSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const WALLETS = {
    TRC20: process.env.NEXT_PUBLIC_CRYPTO_WALLET_TRC20 || 'TJAyTZmUUWsdo96pdhL1i2LrMmQbFE2XPL',
    TON: process.env.NEXT_PUBLIC_CRYPTO_WALLET_TON || 'EQBvW8Z5huBkMJYdn3PCDLyUrMpJAssqXOvisMWgDVnDsMz7'
  };

  const LAVA_LINKS: Record<string, string> = {
    ru_trial_sub: process.env.NEXT_PUBLIC_LAVA_RU_TRIAL || 'https://app.lava.top/products/fa0657d8-746d-4094-a8a6-51d6627fdd79',
    ru_onetime_report: process.env.NEXT_PUBLIC_LAVA_RU_LIFETIME || 'https://app.lava.top/products/0714aedd-1499-4881-8f1c-94d2a68910c4',
    ru_vip_combo: process.env.NEXT_PUBLIC_LAVA_RU_VIP || 'https://app.lava.top/products/339c1712-84bc-481c-a791-e55e2c4db241',
    ru_default: process.env.NEXT_PUBLIC_LAVA_RU_URL || 'https://app.lava.top/products/fa0657d8-746d-4094-a8a6-51d6627fdd79',

    en_trial_sub: process.env.NEXT_PUBLIC_LAVA_EN_TRIAL || 'https://app.lava.top/products/7354e768-5369-45a4-bef4-d0d8cbb73553',
    en_onetime_report: process.env.NEXT_PUBLIC_LAVA_EN_LIFETIME || 'https://app.lava.top/products/69315043-7aa3-4204-ad94-f451f3615351',
    en_vip_combo: process.env.NEXT_PUBLIC_LAVA_EN_VIP || 'https://app.lava.top/products/e8d306bc-47bb-4fc6-887a-54819d0db331',
    en_default: process.env.NEXT_PUBLIC_LAVA_EN_URL || 'https://app.lava.top/products/7354e768-5369-45a4-bef4-d0d8cbb73553',

    es_trial_sub: process.env.NEXT_PUBLIC_LAVA_EN_TRIAL || 'https://app.lava.top/products/7354e768-5369-45a4-bef4-d0d8cbb73553',
    es_onetime_report: process.env.NEXT_PUBLIC_LAVA_EN_LIFETIME || 'https://app.lava.top/products/69315043-7aa3-4204-ad94-f451f3615351',
    es_vip_combo: process.env.NEXT_PUBLIC_LAVA_EN_VIP || 'https://app.lava.top/products/e8d306bc-47bb-4fc6-887a-54819d0db331',
    es_default: process.env.NEXT_PUBLIC_LAVA_EN_URL || 'https://app.lava.top/products/7354e768-5369-45a4-bef4-d0d8cbb73553'
  };

  const TARIFF_PLANS_RU: TariffPlan[] = [
    {
      id: 'trial_sub',
      title: 'Пробный период (Trial)',
      badge: 'Самый популярный',
      price: 190,
      oldPrice: 890,
      currency: '₽',
      periodText: 'за 3 дня, далее 690 ₽/нед',
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
      price: 690,
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
      price: 1890,
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
      price: 5,
      oldPrice: 15,
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

  const TARIFF_PLANS_ES: TariffPlan[] = [
    {
      id: 'trial_sub',
      title: 'Acceso de Prueba (3 Días)',
      badge: 'Más Popular',
      price: 5,
      oldPrice: 15,
      currency: '$',
      periodText: 'por 3 días, luego $9.99/sem',
      description: 'Ideal para empezar: acceso completo a todas las funciones, descarga de PDF y Astróloga IA.',
      features: [
        'Informe PDF personalizado con tu nombre (30+ págs)',
        'Carta Astral Completa (10 planetas + 12 casas)',
        'Nodos kármicos y códigos de abundancia',
        'Astróloga IA «Astra» personalizada 24/7',
        'Cancela en cualquier momento con 1 clic'
      ],
      isPopular: true,
      type: 'subscription'
    },
    {
      id: 'onetime_report',
      title: 'Acceso Único De Por Vida',
      badge: 'Sin Suscripción',
      price: 9,
      oldPrice: 29,
      currency: '$',
      periodText: 'pago único',
      description: 'Un solo pago. Obtienes tu carta astral completa y el informe en PDF para siempre.',
      features: [
        'Descarga de PDF personalizado con tu nombre',
        'Carta astral completa con todos los aspectos',
        'Código financiero (casas 2 y 8)',
        'Guía del amor y matrimonio (casa 7 y Venus)',
        'Acceso de por vida sin cargos recurrentes'
      ],
      type: 'onetime'
    },
    {
      id: 'vip_combo',
      title: 'VIP: Paquete Todo Incluido',
      badge: 'Mejor Valor',
      price: 19,
      oldPrice: 49,
      currency: '$',
      periodText: 'pago único',
      description: 'El paquete definitivo: Carta Astral + Compatibilidad de Pareja + Diseño Humano.',
      features: [
        'Todas las funciones de la Carta Astral Completa',
        'Sinastría Completa (informe de compatibilidad)',
        'Diseño Humano Bodygraph (Tipo, Estrategia, Centros)',
        'Astróloga IA ilimitada por 1 año',
        'Certificado PDF VIP prémium personalizado'
      ],
      type: 'vip'
    }
  ];

  const plans = locale === 'es' ? TARIFF_PLANS_ES : locale === 'ru' ? TARIFF_PLANS_RU : TARIFF_PLANS_EN;

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
      const planKey = `${locale}_${selectedPlan.id}`;
      const defaultKey = `${locale}_default`;
      const targetLavaUrl =
        LAVA_LINKS[planKey] ||
        LAVA_LINKS[defaultKey] ||
        LAVA_LINKS.ru_default ||
        LAVA_LINKS.en_default;

      if (targetLavaUrl && targetLavaUrl.startsWith('http') && targetLavaUrl !== 'https://lava.top/') {
        const separator = targetLavaUrl.includes('?') ? '&' : '?';
        const redirectUrl = email.trim()
          ? `${targetLavaUrl}${separator}email=${encodeURIComponent(email.trim())}`
          : targetLavaUrl;
        const newTab = window.open(redirectUrl, '_blank');
        if (!newTab || newTab.closed || typeof newTab.closed === 'undefined') {
          window.location.href = redirectUrl;
        }
        setIsProcessing(false);
        return;
      }

      const res = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: selectedPlan.id,
          email: email.trim(),
          provider: 'lava',
          locale
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

  const getCryptoAmount = (planId: string) => {
    if (planId === 'trial_sub') return locale === 'ru' ? '2.00' : '5.00';
    if (planId === 'onetime_report') return locale === 'ru' ? '7.00' : '9.00';
    if (planId === 'vip_combo') return '19.00';
    return '9.00';
  };

  const handleCopyWallet = (address: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(address);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2500);
    }
  };

  const handleCryptoPaymentConfirm = () => {
    setIsCryptoSubmitting(true);
    setTimeout(() => {
      try {
        confetti({
          particleCount: 110,
          spread: 80,
          origin: { y: 0.6 }
        });
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem('aa_crypto_orders') || '[]';
          const list = JSON.parse(stored);
          list.push({
            planId: selectedPlan.id,
            network: cryptoNetwork,
            address: WALLETS[cryptoNetwork],
            txId: cryptoTxId.trim(),
            email: email.trim(),
            timestamp: Date.now()
          });
          localStorage.setItem('aa_crypto_orders', JSON.stringify(list));
        }
      } catch {
        // ignore
      }
      setIsCryptoSubmitting(false);
      onPaymentSuccess(selectedPlan.id);
      onClose();
    }, 1200);
  };

  const handleSimulatePayment = () => {
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // confetti error ignored
    }
    onPaymentSuccess(selectedPlan.id);
    onClose();
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
              {locale === 'es' ? 'El descuento expira en:' : locale === 'ru' ? 'Скидка сгорает через:' : 'Discount expires in:'}{' '}
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 mb-2">
            {locale === 'es' ? 'Elige tu plan para desbloquear tu informe completo' : locale === 'ru' ? 'Выберите тариф для открытия полного разбора' : 'Choose Your Access Plan'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto">
            {locale === 'es'
              ? 'Obtén tu informe personalizado en PDF, acceso a los 10 planetas, 12 casas y Astróloga IA.'
              : locale === 'ru'
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
                  {isSelected
                    ? (locale === 'es' ? 'Plan seleccionado' : locale === 'ru' ? 'Выбранный тариф' : 'Selected Plan')
                    : (locale === 'es' ? 'Seleccionar plan' : locale === 'ru' ? 'Выбрать тариф' : 'Select Plan')}
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
                  {locale === 'es'
                    ? 'Estamos activando la pasarela de pago'
                    : locale === 'ru'
                    ? 'Мы подключаем прием платежей'
                    : 'We are connecting payment processing'}
                </h3>
                <p className="text-xs text-stone-600">
                  {locale === 'es'
                    ? 'Deja tu correo para recibir acceso prioritario con 90% de descuento'
                    : locale === 'ru'
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
                    {locale === 'es'
                      ? '¡Gracias! Estás en la lista prioritaria. Revisa tu correo.'
                      : locale === 'ru'
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
                    {locale === 'es' ? 'Ver vista previa de la carta completa →' : locale === 'ru' ? 'Открыть демо-доступ к полной карте →' : 'Preview demo access to full chart →'}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    {locale === 'es' ? 'Cerrar' : locale === 'ru' ? 'Закрыть' : 'Close'}
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
                        <span>{locale === 'es' ? 'Obtener acceso' : locale === 'ru' ? 'Получить доступ' : 'Get Access'}</span>
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
            {/* Payment Method Switcher: Card (Lava.top) vs Crypto */}
            <div className="flex rounded-2xl bg-stone-200/80 p-1 mb-4">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'bg-white text-stone-900 shadow-sm'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                <CreditCard className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{locale === 'es' ? 'Tarjeta bancaria (Lava / Visa / MC)' : locale === 'ru' ? 'Банковская карта (Lava / Visa / МИР)' : 'Card (Lava / Visa / MC)'}</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('crypto')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                  paymentMethod === 'crypto'
                    ? 'bg-white text-stone-900 shadow-sm'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                <Wallet className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{locale === 'es' ? 'Criptomoneda (USDT / TON)' : locale === 'ru' ? 'Криптовалюта (USDT / TON)' : 'Crypto (USDT / TON)'}</span>
              </button>
            </div>

            {paymentMethod === 'card' ? (
              <div>
                <p className="text-[11px] text-stone-500 mb-3 text-left">
                  {locale === 'es'
                    ? 'Aceptamos tarjetas internacionales Visa y Mastercard (Latinoamérica, EE.UU., Europa y mundial).'
                    : locale === 'ru'
                    ? 'Принимаются карты иностранных банков (Visa, Mastercard со всего мира), а также карты РФ и СНГ (МИР, СБП, SberPay).'
                    : 'Accepting global Visa & Mastercard (US, Europe, Worldwide) as well as CIS cards.'}
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-full sm:flex-1">
                    <label className="block text-xs font-bold text-stone-700 mb-1 text-left">
                      {locale === 'es'
                        ? '¿A dónde enviamos tu informe PDF y datos de acceso?'
                        : locale === 'ru'
                        ? 'Куда отправить копию отчета и данные для входа?'
                        : 'Where should we send your official PDF and access details?'}
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
                          <span>{locale === 'es' ? 'Conectando con Lava...' : locale === 'ru' ? 'Подключение к Lava...' : 'Connecting to Lava...'}</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 fill-amber-400 text-amber-400" />
                          <span>
                            {locale === 'es'
                              ? `Pagar ${selectedPlan.price} ${selectedPlan.currency} vía Lava`
                              : locale === 'ru'
                              ? `Оплатить ${selectedPlan.price} ${selectedPlan.currency} через Lava`
                              : `Pay ${selectedPlan.price} ${selectedPlan.currency} via Lava`}
                          </span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-700">
                    {locale === 'es' ? 'Selecciona la red de transferencia:' : locale === 'ru' ? 'Выберите сеть перевода:' : 'Select Network:'}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setCryptoNetwork('TRC20')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        cryptoNetwork === 'TRC20'
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                      }`}
                    >
                      USDT (TRC-20)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCryptoNetwork('TON')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        cryptoNetwork === 'TON'
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                      }`}
                    >
                      USDT (TON)
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-stone-200 flex flex-col md:flex-row items-center gap-4">
                  <div className="shrink-0 flex flex-col items-center">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(WALLETS[cryptoNetwork])}`}
                      alt="Wallet QR Code"
                      className="w-28 h-28 rounded-xl border border-stone-200 shadow-xs"
                    />
                    <span className="text-[10px] text-stone-400 mt-1 flex items-center gap-1">
                      <QrCode className="w-3 h-3" /> {locale === 'es' ? 'Escanear para pagar' : locale === 'ru' ? 'QR-код для перевода' : 'Scan to pay'}
                    </span>
                  </div>

                  <div className="flex-1 w-full space-y-2 text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-stone-500 font-medium">
                        {locale === 'es' ? 'Monto exacto a transferir:' : locale === 'ru' ? 'Точная сумма к переводу:' : 'Exact amount to send:'}
                      </span>
                      <span className="text-sm font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        {getCryptoAmount(selectedPlan.id)} USDT
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] text-stone-500 font-semibold block mb-1">
                        {locale === 'es'
                          ? `Dirección de billetera (${cryptoNetwork}):`
                          : locale === 'ru'
                          ? `Адрес кошелька (${cryptoNetwork}):`
                          : `Wallet Address (${cryptoNetwork}):`}
                      </span>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          readOnly
                          value={WALLETS[cryptoNetwork]}
                          className="flex-1 px-3 py-2 text-xs font-mono bg-stone-50 border border-stone-300 rounded-lg text-stone-800 select-all"
                        />
                        <button
                          type="button"
                          onClick={() => handleCopyWallet(WALLETS[cryptoNetwork])}
                          className="px-3 py-2 rounded-lg bg-stone-900 hover:bg-black text-white text-xs font-bold transition-all flex items-center space-x-1 shrink-0 cursor-pointer"
                        >
                          {copiedAddress ? (
                            <>
                              <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">{locale === 'es' ? '¡Copiado!' : locale === 'ru' ? 'Скопировано!' : 'Copied!'}</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>{locale === 'es' ? 'Copiar' : locale === 'ru' ? 'Копировать' : 'Copy'}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="pt-1">
                      <input
                        type="text"
                        value={cryptoTxId}
                        onChange={(e) => setCryptoTxId(e.target.value)}
                        placeholder={
                          locale === 'es'
                            ? 'Tu correo o TxID de transferencia (opcional)'
                            : locale === 'ru'
                            ? 'Ваш email или TxID перевода (для квитанции)'
                            : 'Your email or TxID (optional)'
                        }
                        className="w-full px-3 py-2 rounded-lg bg-white border border-stone-300 text-stone-900 placeholder-stone-400 text-xs focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                  <p className="text-[11px] text-stone-500 text-left">
                    {locale === 'es'
                      ? 'Tras enviar USDT, haz clic en confirmar abajo para desbloquear tu carta de inmediato.'
                      : locale === 'ru'
                      ? 'После отправки USDT нажмите кнопку подтверждения — отчет откроется моментально.'
                      : 'After sending USDT, click confirm below to instantly unlock your complete chart.'}
                  </p>
                  <button
                    type="button"
                    onClick={handleCryptoPaymentConfirm}
                    disabled={isCryptoSubmitting}
                    className="w-full sm:w-auto px-6 py-3 min-h-[44px] rounded-xl bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-[1.02] flex items-center justify-center space-x-2 shrink-0 cursor-pointer disabled:opacity-50"
                  >
                    {isCryptoSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{locale === 'es' ? 'Verificando...' : locale === 'ru' ? 'Проверка...' : 'Checking...'}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>{locale === 'es' ? 'He transferido USDT — Desbloquear 🎉' : locale === 'ru' ? 'Я перевел средства — открыть отчет 🎉' : 'I have sent USDT — Unlock 🎉'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Security & Payment Provider Icons */}
        <div className="flex flex-wrap items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-200 gap-3">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>256-bit SSL • {locale === 'es' ? 'Garantía de reembolso 100%' : locale === 'ru' ? 'Гарантия возврата 100%' : '100% Money Back Guarantee'}</span>
          </div>

          <div className="flex items-center space-x-3 text-stone-500 font-mono text-[11px] font-bold">
            <span>МИР</span>
            <span>СБП</span>
            <span>VISA</span>
            <span>MasterCard</span>
            <span>Apple Pay</span>
          </div>
        </div>

        {/* Sandbox Test Mode Bar */}
        <div className="mt-3 p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/80 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-2 text-amber-900 font-medium">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              {locale === 'es'
                ? 'Modo de prueba Sandbox'
                : locale === 'ru'
                ? 'Режим тестирования шлюза'
                : 'Gateway Sandbox Mode'}
            </span>
          </div>
          <button
            type="button"
            onClick={handleSimulatePayment}
            className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] transition-all shadow-sm cursor-pointer"
          >
            ⚡ {locale === 'es' ? 'Pago de prueba (Desbloquear todo)' : locale === 'ru' ? 'Тестовая оплата (Разблокировать всё)' : 'Simulate Payment (Unlock All)'}
          </button>
        </div>
      </div>
    </div>
  );
};
