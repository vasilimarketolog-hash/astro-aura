'use client';

import React, { useState } from 'react';
import { Star, ChevronDown, ChevronUp } from 'lucide-react';

export const ReviewsSection: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const reviews = [
    {
      name: 'Екатерина М., 29 лет',
      city: 'Москва',
      rating: 5,
      date: 'Вчера',
      text: 'Я была настроена скептически, но когда прочитала про конфликт Солнца в Тельце и Луны в Скорпионе — у меня побежали мурашки! В точку на 100%. Очень помогли рекомендации по финансам и 2 дому. Спасибо!'
    },
    {
      name: 'Артем Д., 34 года',
      city: 'Санкт-Петербург',
      rating: 5,
      date: '2 дня назад',
      text: 'Делали расчет совместимости с девушкой перед свадьбой. Совпало абсолютно все: и про бытовые трения, и про сексуальную химию. Взял VIP тариф с чатом Астры — теперь регулярно советуюсь перед важными сделками.'
    },
    {
      name: 'Светлана К., 41 год',
      city: 'Минск',
      rating: 5,
      date: '4 дня назад',
      text: 'Впервые вижу настолько красивый и понятный расчет натальной карты без суеверий, а на современном психологическом языке. PDF скачала и распечатала, получилось как подарочная книга.'
    }
  ];

  const faqs = [
    {
      q: 'Насколько точны астрономические расчеты?',
      a: 'Мы используем вычислительные алгоритмы эфемерид NASA и Swiss Ephemeris, учитывающие точные долготы, широты и исторический часовой пояс города на момент вашего рождения с точностью до угловой секунды.'
    },
    {
      q: 'Что делать, если я не знаю точное время своего рождения?',
      a: 'При заполнении выберите опцию «Я не знаю точное время». Система выполнит расчет планет по солнечному полдню (12:00) — все планеты в знаках будут определены с предельной точностью.'
    },
    {
      q: 'Как работает подписка и можно ли ее отменить?',
      a: 'При выборе пробного периода (1 рубль на 3 дня) вы получаете полный доступ ко всем платным разделам и AI-астрологу. Отменить подписку можно в любой момент в 1 клик, никаких скрытых условий.'
    },
    {
      q: 'Безопасна ли оплата?',
      a: 'Все платежи проходят через защищенные банковские шлюзы с протоколом 256-bit SSL шифрования. Мы не храним данные ваших банковских карт.'
    }
  ];

  return (
    <section className="py-16 border-t border-stone-200/80 bg-white/60">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Reviews */}
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 mb-2">
            Что говорят те, кто уже рассчитал свою карту
          </h2>
          <div className="flex items-center justify-center space-x-2 text-amber-500">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-xs text-stone-600 font-bold">
              4.94 из 5 на основе 28,400+ расчетов
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {reviews.map((rev, i) => (
            <div
              key={i}
              className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex">
                    {[...Array(rev.rating)].map((_, j) => (
                      <Star key={j} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] text-stone-400 font-medium">{rev.date}</span>
                </div>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed mb-4">
                  «{rev.text}»
                </p>
              </div>
              <div className="border-t border-stone-100 pt-3 flex items-center justify-between text-xs">
                <span className="font-bold text-stone-900">{rev.name}</span>
                <span className="text-stone-500">{rev.city}</span>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h3 className="text-xl sm:text-2xl font-black text-stone-900 text-center mb-6">
            Часто задаваемые вопросы
          </h3>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-white border border-stone-200 overflow-hidden shadow-xs transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full px-5 py-4 text-left text-xs sm:text-sm font-bold text-stone-900 flex items-center justify-between hover:text-amber-700 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-amber-600 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-xs text-stone-600 leading-relaxed border-t border-stone-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
