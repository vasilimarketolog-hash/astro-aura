'use client';

import React from 'react';
import { SynastryData, Locale } from '@/types/astro';
import { AlertTriangle, ShieldCheck, Flame, HeartHandshake, Zap } from 'lucide-react';

interface RedFlagScannerProps {
  synastry: SynastryData;
  locale: Locale;
}

export const RedFlagScanner: React.FC<RedFlagScannerProps> = ({ synastry, locale }) => {
  const conflictRisk = synastry.compatibility.conflictRisk;
  const isHighRisk = conflictRisk >= 40;

  const redFlagsRu = [
    {
      title: 'Борьба за первенство и скрытый контроль',
      desc: 'Подсознательное желание переделать привычки партнера под свои стандарты. Приводит к скрытому раздражению, если не давать друг другу автономности.',
      severity: 'Средний риск'
    },
    {
      title: 'Разная скорость эмоционального отклика',
      desc: 'Один стремится немедленно выяснить отношения на эмоциях, а второй «замыкается в раковину», требуя времени в тишине. Ошибка — давить в момент паузы.',
      severity: 'Частый триггер'
    },
    {
      title: 'Финансовый код и подход к тратам',
      desc: 'Разница в отношении к спонтанным покупкам и накоплениям на будущее. Требует четкого разделения семейного бюджета на личный и общий.',
      severity: 'Зона роста'
    }
  ];

  const redFlagsEn = [
    {
      title: 'Subconscious Power Struggle & Control',
      desc: 'Temptation to micro-manage or alter the partner’s habits. Generates silent friction if mutual autonomy is not respected.',
      severity: 'Moderate'
    },
    {
      title: 'Asynchronous Emotional Pacing',
      desc: 'One pushes for immediate resolution while the other retreats to process quietly. Avoid demanding answers during cooldown.',
      severity: 'Key Trigger'
    },
    {
      title: 'Financial Philosophy & Impulsive Spending',
      desc: 'Different thresholds for security versus spontaneity. Requires a clear boundary between shared and personal funds.',
      severity: 'Growth Area'
    }
  ];

  const redFlagsEs = [
    {
      title: 'Lucha por el control y expectativas ocultas',
      desc: 'Deseo inconsciente de cambiar los hábitos de la pareja según los propios estándares. Provoca resentimiento silencioso si no se respeta la autonomía mutua.',
      severity: 'Riesgo medio'
    },
    {
      title: 'Ritmos emocionales diferentes',
      desc: 'Uno busca resolver los desacuerdos al instante bajo emoción, mientras que el otro se repliega para procesar en silencio. No presiones durante la pausa.',
      severity: 'Detonante clave'
    },
    {
      title: 'Filosofía financiera y gastos impulsivos',
      desc: 'Diferentes umbrales de seguridad frente a gastos espontáneos. Requiere delimitar con claridad el presupuesto compartido del personal.',
      severity: 'Área de crecimiento'
    }
  ];

  const list = locale === 'es' ? redFlagsEs : locale === 'ru' ? redFlagsRu : redFlagsEn;

  return (
    <div className="bg-white border-2 border-rose-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-rose-100 pb-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-[11px] font-bold mb-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>
              {locale === 'es' ? 'ANÁLISIS DE RIESGOS OCULTOS DE LA PAREJA' : locale === 'ru' ? 'СКАНИРОВАНИЕ СКРЫТЫХ РИСКОВ ПАРЫ' : 'HIDDEN RELATIONSHIP RISK SCAN'}
            </span>
          </div>
          <h3 className="text-xl font-black text-stone-900">
            {locale === 'es' ? 'Escáner de Red Flags y Compatibilidad de Sombra' : locale === 'ru' ? 'Сканер Ред-Флагов и Токсичности' : 'Red Flag & Shadow Compatibility Scanner'}
          </h3>
        </div>

        {/* Conflict Meter */}
        <div className="flex items-center space-x-3 px-4 py-2 rounded-2xl bg-rose-50 border border-rose-200">
          <Flame className="w-5 h-5 text-rose-600" />
          <div>
            <div className="text-[10px] uppercase font-mono tracking-wider text-rose-700 font-bold">
              {locale === 'es' ? 'Índice de fricción' : locale === 'ru' ? 'Индекс конфликтов' : 'Friction Index'}
            </div>
            <div className="text-base font-black text-rose-900 font-mono">
              {conflictRisk}% ({isHighRisk ? (locale === 'es' ? 'Atención requerida' : locale === 'ru' ? 'Требует внимания' : 'High Awareness') : (locale === 'es' ? 'Fricción moderada' : locale === 'ru' ? 'Умеренный' : 'Low Friction')})
            </div>
          </div>
        </div>
      </div>

      {/* Red Flags List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {list.map((flag, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-rose-50/40 border border-rose-200 hover:border-rose-400 transition-all space-y-2 shadow-2xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-black text-rose-700 flex items-center space-x-1">
                <span>🚩</span>
                <span>#{idx + 1}</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-rose-200 text-rose-800 font-mono font-semibold">
                {flag.severity}
              </span>
            </div>

            <h4 className="text-xs sm:text-sm font-bold text-stone-900 leading-snug">
              {flag.title}
            </h4>

            <p className="text-xs text-stone-600 leading-relaxed">
              {flag.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Green Flag Resolution Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 border border-emerald-300 text-xs text-stone-800 flex items-start space-x-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-emerald-950 font-bold text-sm block">
            {locale === 'es'
              ? '🟢 Clave de oro para neutralizar conflictos:'
              : locale === 'ru'
              ? '🟢 Золотой ключ нейтрализации конфликтов:'
              : '🟢 Golden Key to Conflict Resolution:'}
          </strong>
          <p className="leading-relaxed">
            {locale === 'es'
              ? 'Nunca inicien discusiones sobre temas delicados (dinero, familia, tareas) con agotamiento físico o hambre. Darle a la pareja 20 minutos de silencio y tranquilidad al llegar a casa disuelve el 80% de los roces en la convivencia.'
              : locale === 'ru'
              ? 'Никогда не обсуждайте чувствительные темы (деньги, родственники, быт) в моменты физической усталости (после 21:00 или на голодный желудок). Давайте партнеру 20 минут тишины после возвращения домой — это нейтрализует 80% споров в союзе.'
              : 'Never initiate high-stakes dialogues when depleted. Offering 20 minutes of decompression silence dissolves 80% of ambient relationship tension.'}
          </p>
        </div>
      </div>
    </div>
  );
};
