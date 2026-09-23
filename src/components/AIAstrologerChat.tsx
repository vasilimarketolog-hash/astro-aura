'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Compass } from 'lucide-react';
import { NatalChartData, Locale } from '@/types/astro';

interface AIAstrologerChatProps {
  chart: NatalChartData;
  locale?: Locale;
}

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export const AIAstrologerChat: React.FC<AIAstrologerChatProps> = ({ chart, locale = 'ru' }) => {
  const sunSign = chart.planets.find(p => p.id === 'sun')?.sign;
  const sunSignName = locale === 'es'
    ? (sunSign?.nameEs || sunSign?.nameEn || 'Aries')
    : locale === 'ru'
    ? (sunSign?.nameRu || 'Овен')
    : (sunSign?.nameEn || 'Aries');

  const ascSign = chart.ascendant.sign;
  const ascSignName = locale === 'es'
    ? (ascSign.nameEs || ascSign.nameEn || 'Leo')
    : locale === 'ru'
    ? (ascSign.nameRu || 'Лев')
    : (ascSign.nameEn || 'Leo');

  const getGreeting = () => {
    if (locale === 'es') {
      return `¡Hola, ${chart.birthData.name}! Soy tu astróloga personal Astra. He analizado tu carta astral con el Sol en ${sunSignName} y Ascendente en ${ascSignName}. ¿Por qué área te gustaría comenzar: amor y pareja, dinero y vocación profesional o lecciones kármicas?`;
    }
    if (locale === 'en') {
      return `Hello, ${chart.birthData.name}! I am your personal astrologer Astra. I have analyzed your natal chart with Sun in ${sunSignName} and Ascendant in ${ascSignName}. Which area should we explore first: love & marriage, wealth & career, or your karmic mission?`;
    }
    return `Здравствуйте, ${chart.birthData.name}! Я ваш персональный астролог Астра. Я изучила вашу натальную карту с Солнцем в ${sunSignName} и Асцендентом в ${ascSignName}. С какой сферы мы начнем: любовь и брак, деньги и карьера или кармические задачи?`;
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      text: getGreeting()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const quickPromptsRu = [
    'Какое мое главное кармическое предназначение?',
    'Какой партнер мне подходит для крепкого брака?',
    'Через какую деятельность ко мне придут большие деньги?',
    'В чем моя скрытая суперсила по Асценденту?'
  ];

  const quickPromptsEn = [
    'What is my primary karmic soul purpose?',
    'What kind of partner suits me best for marriage?',
    'Which path will bring me the greatest financial wealth?',
    'What is my hidden superpower from my Ascendant?'
  ];

  const quickPromptsEs = [
    '¿Cuál es mi principal propósito de vida y karma?',
    '¿Qué tipo de pareja es ideal para mí para una relación sólida?',
    '¿A través de qué actividades llegará mi mayor abundancia financiera?',
    '¿Cuál es mi superpoder oculto según mi Ascendente?'
  ];

  const quickPrompts = locale === 'es' ? quickPromptsEs : locale === 'ru' ? quickPromptsRu : quickPromptsEn;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: query
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/astrologer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: query,
          chart,
          locale,
          history: messages.map((m) => ({ role: m.role, text: m.text }))
        })
      });

      const data = await res.json();
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: data.answer || (locale === 'es' ? 'No se pudo obtener la respuesta de la astróloga. Inténtalo de nuevo.' : locale === 'ru' ? 'Не удалось получить ответ астролога. Попробуйте еще раз.' : 'Could not retrieve answer from astrologer. Please try again.')
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'model',
          text: locale === 'es'
            ? 'La conexión con el servidor planetario se interrumpió temporalmente. Por favor, repite tu pregunta en un momento.'
            : locale === 'ru'
            ? 'Связь с планетарным сервером временно прервана. Пожалуйста, повторите вопрос через минуту.'
            : 'Planetary server connection temporarily interrupted. Please ask again in a moment.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[560px] bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-md">
      {/* Chat Header */}
      <div className="p-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center">
            <Compass className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <div className="text-sm font-bold text-stone-900 flex items-center space-x-1.5">
              <span>{locale === 'es' ? 'Astra IA' : locale === 'ru' ? 'Астра AI' : 'Astra AI'}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <div className="text-[11px] text-stone-500">
              {locale === 'es'
                ? 'Tu astróloga personal • Análisis de tu carta en tiempo real'
                : locale === 'ru'
                ? 'Ваш персональный астролог • Анализ карты в реальном времени'
                : 'Your personal astrologer • Real-time chart analysis'}
            </div>
          </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FAF8F5]/60">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start space-x-2.5 ${m.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              m.role === 'user'
                ? 'bg-stone-900 text-white'
                : 'bg-amber-100 text-amber-800 border border-amber-300'
            }`}>
              {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div className={`max-w-[82%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
              m.role === 'user'
                ? 'bg-stone-900 text-white rounded-br-none shadow-sm'
                : 'bg-white border border-stone-200 text-stone-800 rounded-bl-none shadow-sm'
            }`}>
              {m.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center space-x-2 text-xs text-amber-800 bg-amber-50 p-3 rounded-2xl w-fit border border-amber-200">
            <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
            <span>
              {locale === 'es'
                ? 'Astra está analizando las configuraciones planetarias de tu carta...'
                : locale === 'ru'
                ? 'Астра изучает планетарные конфигурации вашей карты...'
                : 'Astra is analyzing your planetary chart alignments...'}
            </span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Quick Questions Suggestions */}
      <div className="px-4 py-2 border-t border-stone-200 bg-stone-50 flex gap-2 overflow-x-auto no-scrollbar">
        {quickPrompts.map((prompt, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleSend(prompt)}
            disabled={loading}
            className="text-[11px] whitespace-nowrap px-3.5 py-1.5 min-h-[36px] flex items-center rounded-full bg-white border border-stone-300 hover:border-amber-400 text-stone-700 hover:text-stone-950 transition-all cursor-pointer disabled:opacity-50 shadow-xs"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-3 bg-white border-t border-stone-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              locale === 'es'
                ? 'Pregunta sobre amor, dinero, tu carta o tu futuro...'
                : locale === 'ru'
                ? 'Спросите о любви, деньгах, карте или будущем...'
                : 'Ask about love, money, your chart or future...'
            }
            className="flex-1 px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 placeholder-stone-400 text-xs sm:text-sm focus:outline-none focus:border-amber-500 focus:bg-white"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="p-2.5 rounded-xl bg-gradient-to-r from-stone-900 to-amber-900 hover:from-black text-white transition-all disabled:opacity-40 cursor-pointer shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
