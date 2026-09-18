'use client';

import React from 'react';
import { PlanetPosition, Locale } from '@/types/astro';
import { Moon, Sparkles, Eye, ShieldAlert } from 'lucide-react';

interface LilithCardProps {
  lilith: PlanetPosition;
  locale: Locale;
}

export const LilithCard: React.FC<LilithCardProps> = ({ lilith, locale }) => {
  const signId = lilith.sign.id;

  const lilithDescriptionsRu: Record<string, { archetype: string; magnetism: string; shadowTrap: string }> = {
    aries: {
      archetype: 'Бунтующий Воин (Первобытная страсть)',
      magnetism: 'Вас невозможно подчинить или сломать. Окружающих притягивает ваша дикая смелость и готовность бросить вызов любой системе.',
      shadowTrap: 'Вспышки ярости и разрушение мостов из-за уязвленной гордости. Учитесь направлять этот огонь в спорт и бизнес.'
    },
    taurus: {
      archetype: 'Искуситель Чувственности (Денежный гипноз)',
      magnetism: 'Особый телесный магнетизм, гедонизм и способность чувствовать роскошь. Вы буквально притягиваете финансовые потоки и эстетику.',
      shadowTrap: 'Страх бедности и патологическая жадность или тяга к эмоциональному контролю над партнером через комфорт.'
    },
    gemini: {
      archetype: 'Магистр Слова и Манипуляций',
      magnetism: 'Острый, как бритва, язык, язвительное обаяние и способность выведать любую тайну. Ваш голос завораживает слушателей.',
      shadowTrap: 'Склонность к сплетням, интеллектуальному высокомерию и поверхностным связям вместо подлинной близости.'
    },
    cancer: {
      archetype: 'Роковая Мать / Таинственная глубина',
      magnetism: 'Невероятная подсознательная притягательность, гипнотический взгляд и способность считывать чужую душевную боль без слов.',
      shadowTrap: 'Эмоциональный шантаж, манипуляция обидой и глубокий подсознательный страх быть покинутым.'
    },
    leo: {
      archetype: 'Темное Солнце (Королевский гипноз)',
      magnetism: 'Царственная аура, от которой захватывает дух. Вам завидуют и вами восхищаются одновременно — вы родились для центра внимания.',
      shadowTrap: 'Болезненная зависимость от комплиментов и аплодисментов. Ненависть к конкурентам и страх показаться обычным.'
    },
    virgo: {
      archetype: 'Холодный Перфекционист (Скрытый расчет)',
      magnetism: 'Безупречный стиль, сдержанная элегантность и аналитический гений, замечающий то, что скрыто от остальных 99% людей.',
      shadowTrap: 'Самоистязание критикой, ипохондрия и привычка обесценивать чужие несовершенства.'
    },
    libra: {
      archetype: 'Черная Венера (Соблазн зеркал)',
      magnetism: 'Изысканный шарм, сексуальная утонченность и способность заставить любого человека влюбиться в собственное отражение рядом с вами.',
      shadowTrap: 'Потеря себя в партнере, страх одиночества и неспособность сделать твердый выбор без одобрения извне.'
    },
    scorpio: {
      archetype: 'Владыка Трансформаций (Максимальная роковая сила)',
      magnetism: 'Наивысшая точка проявления Лилит. Непробиваемый магнетизм, опасная сексуальная притягательность и рентгеновская интуиция.',
      shadowTrap: 'Тяга к эмоциональным драмам, ревность и саморазрушение. Ваш урок — превратить эту мощь в созидание и исцеление.'
    },
    sagittarius: {
      archetype: 'Ложный Пророк / Духовный авантюрист',
      magnetism: 'Аура великих замыслов, заразительный оптимизм и дерзость мысли. Люди идут за вами, как за духовным лидером.',
      shadowTrap: 'Фанатизм, поучение других свысока и бегство от реальных обязательств в иллюзорные горизонты.'
    },
    capricorn: {
      archetype: 'Железный Властелин (Ледяной авторитет)',
      magnetism: 'Холодная, статусная харизма несгибаемого лидера. Вы вызываете трепет и уважение одним своим молчаливым присутствием.',
      shadowTrap: 'Эмоциональная сухость, жестокость к себе и подавление чувств ради социального статуса.'
    },
    aquarius: {
      archetype: 'Странник Будущего (Анархист)',
      magnetism: 'Абсолютная непредсказуемость, футуристическое мышление и космическая отстраненность, заставляющая людей гадать о вашей загадке.',
      shadowTrap: 'Холодный цинизм, разрыв связей при первых признаках ограничений и страх глубокой душевной привязанности.'
    },
    pisces: {
      archetype: 'Океаническая Сирена (Мистический омут)',
      magnetism: 'Тайное мистическое очарование, аура жертвенности и способность утягивать людей в свой фантазийный мир грез.',
      shadowTrap: 'Иллюзии, зависимость от людей-спасателей или токсичных личностей и привычка убегать от реальности.'
    }
  };

  const data = lilithDescriptionsRu[signId] || lilithDescriptionsRu['scorpio'];

  return (
    <div className="bg-gradient-to-br from-purple-950/5 via-stone-900/5 to-amber-900/5 border-2 border-purple-300/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-200/60 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-900 text-amber-300 font-black text-2xl flex items-center justify-center shadow-md">
            ⚸
          </div>
          <div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-purple-800 font-bold">
              {locale === 'ru' ? 'ТЕНЕВОЙ МАГНЕТИЗМ И РОКОВОЙ КОД' : 'SHADOW MAGNETISM & TABOO ESSENCE'}
            </div>
            <h3 className="text-xl font-black text-stone-900">
              {locale === 'ru'
                ? `Лилит (Черная Луна) в ${lilith.sign.nameRu} (${lilith.house} дом)`
                : `Lilith (Black Moon) in ${lilith.sign.nameEn} (House ${lilith.house})`}
            </h3>
          </div>
        </div>

        <span className="px-3.5 py-1.5 rounded-full bg-purple-100 border border-purple-300 text-purple-900 font-bold text-xs shadow-2xs self-start sm:self-auto">
          {data.archetype}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
        {/* Magnetism */}
        <div className="p-5 rounded-2xl bg-white/80 border border-purple-200 shadow-2xs space-y-2">
          <div className="flex items-center space-x-2 text-purple-900 font-bold text-sm">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>{locale === 'ru' ? 'В чем ваш гипнотический магнетизм:' : 'Your Hypnotic Magnetism:'}</span>
          </div>
          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
            {data.magnetism}
          </p>
        </div>

        {/* Shadow Trap */}
        <div className="p-5 rounded-2xl bg-white/80 border border-rose-200 shadow-2xs space-y-2">
          <div className="flex items-center space-x-2 text-rose-900 font-bold text-sm">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>{locale === 'ru' ? 'Кармическая ловушка и искушение:' : 'Karmic Pitfall & Temptation:'}</span>
          </div>
          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
            {data.shadowTrap}
          </p>
        </div>
      </div>
    </div>
  );
};
