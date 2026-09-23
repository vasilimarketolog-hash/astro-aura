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

  const lilithDescriptionsEn: Record<string, { archetype: string; magnetism: string; shadowTrap: string }> = {
    aries: {
      archetype: 'Rebel Warrior (Primal Passion)',
      magnetism: 'Unbreakable spirit and wild courage. People are instinctively drawn to your daring edge and fearless presence.',
      shadowTrap: 'Outbursts of rage and burning bridges over injured ego. Channel this intense fire into athletics, business, and bold creations.'
    },
    taurus: {
      archetype: 'Sensual Seducer (Money Magnetism)',
      magnetism: 'Deep body charisma, lavish aesthetic instinct, and an innate ability to magnetize wealth and comfort.',
      shadowTrap: 'Fear of scarcity and obsession with material control over partners. Cultivate genuine inner security.'
    },
    gemini: {
      archetype: 'Master of Words & Manipulation',
      magnetism: 'Razor-sharp wit, hypnotic verbal charm, and the ability to uncover hidden secrets effortlessly.',
      shadowTrap: 'Gossiping, intellectual arrogance, and superficial ties instead of genuine emotional connection.'
    },
    cancer: {
      archetype: 'Femme Fatale / Mystical Depths',
      magnetism: 'Deep subconscious allure, magnetic gaze, and an almost psychic empathy that penetrates emotional walls.',
      shadowTrap: 'Emotional manipulation, guilt-tripping, and persistent fear of abandonment.'
    },
    leo: {
      archetype: 'Dark Sun (Royal Hypnosis)',
      magnetism: 'Regal aura that commands the room. You naturally belong at center stage and draw fascination wherever you go.',
      shadowTrap: 'Craving constant applause, intense envy of rivals, and fear of being ordinary.'
    },
    virgo: {
      archetype: 'Cool Perfectionist (Hidden Calculation)',
      magnetism: 'Impeccable style, quiet sophistication, and a genius eye for details that 99% miss.',
      shadowTrap: 'Self-sabotaging criticism, hypochondria, and hyper-fixating on others’ flaws.'
    },
    libra: {
      archetype: 'Black Venus (Seduction of Mirrors)',
      magnetism: 'Refined charm, graceful beauty, and the ability to make others fall in love with their best self around you.',
      shadowTrap: 'Losing yourself in partners, chronic fear of loneliness, and paralysis when making decisions without external approval.'
    },
    scorpio: {
      archetype: 'Master of Transformation (Peak Taboo Power)',
      magnetism: 'The apex of Lilith power. Unyielding magnetism, dangerous sexual allure, and piercing intuition.',
      shadowTrap: 'Craving emotional crises, jealousy, and self-destruction. Transform this immense power into healing and empowerment.'
    },
    sagittarius: {
      archetype: 'Spiritual Rebel / Rogue Adventurer',
      magnetism: 'Grand visionary aura, infectious daring, and bold philosophy that inspires others to follow.',
      shadowTrap: 'Dogmatism, condescending preaching, and escaping real commitments into endless illusions.'
    },
    capricorn: {
      archetype: 'Iron Sovereign (Commanding Authority)',
      magnetism: 'Cool, authoritative charisma of an unshakable leader. Your silent presence commands deep respect.',
      shadowTrap: 'Emotional numbness, ruthlessness toward yourself, and suppressing vulnerability for status.'
    },
    aquarius: {
      archetype: 'Futuristic Outlaw (Cosmic Rebel)',
      magnetism: 'Unpredictable mind, visionary ideas, and a detached aura that leaves everyone intrigued by your mystery.',
      shadowTrap: 'Cold cynicism, abruptly cutting off ties at any perceived restriction, and fear of emotional vulnerability.'
    },
    pisces: {
      archetype: 'Oceanic Siren (Mystic Siren)',
      magnetism: 'Ethereal charm, mysterious presence, and the power to draw people into enchanting dreamscapes.',
      shadowTrap: 'Vulnerability to illusions, savior-victim complexes, and escapism from harsh reality.'
    }
  };

  const lilithDescriptionsEs: Record<string, { archetype: string; magnetism: string; shadowTrap: string }> = {
    aries: {
      archetype: 'Guerrero Rebelde (Pasión Primordial)',
      magnetism: 'Un espíritu inquebrantable y coraje salvaje. La gente se siente atraída por tu audacia y tu presencia intrépida.',
      shadowTrap: 'Ataques de ira y destruir puentes por orgullo herido. Canaliza este fuego intenso en el deporte, los negocios y metas ambiciosas.'
    },
    taurus: {
      archetype: 'Seductor Sensual (Magnetismo de la Riqueza)',
      magnetism: 'Carisma corporal profundo, instinto estético de lujo y una habilidad innata para atraer abundancia y placer sensorial.',
      shadowTrap: 'Miedo a la carencia y obsesión por controlar a la pareja mediante la comodidad material. Cultiva seguridad interior genuina.'
    },
    gemini: {
      archetype: 'Maestro de la Palabra y Persuasión',
      magnetism: 'Ingenio afilado, encanto verbal hipnótico y la capacidad de descubrir secretos ocultos sin esfuerzo.',
      shadowTrap: 'Chismes, arrogancia intelectual y vínculos superficiales en lugar de intimidad auténtica.'
    },
    cancer: {
      archetype: 'Profundidad Misteriosa / Vínculo Oculto',
      magnetism: 'Atracción subconsciente profunda, mirada magnética y una empatía casi psíquica que penetra barreras emocionales.',
      shadowTrap: 'Chantaje emocional, manipulación a través del resentimiento y miedo inconsciente al abandono.'
    },
    leo: {
      archetype: 'Sol Oscuro (Hipnosis Real)',
      magnetism: 'Aura regia que domina cualquier espacio. Naciste para ser el centro de atención y suscitar admiración magnética.',
      shadowTrap: 'Dependencia de elogios y aplausos. Envidia hacia rivales y pánico a parecer ordinario.'
    },
    virgo: {
      archetype: 'Perfeccionista Frío (Cálculo Oculto)',
      magnetism: 'Estilo impecable, elegancia contenida y un ojo analítico genial que nota lo que el 99% pasa por alto.',
      shadowTrap: 'Autocrítica destructiva, hipocondría y el hábito de juzgar despiadadamente los defectos ajenos.'
    },
    libra: {
      archetype: 'Venus Negra (Seducción de Espejos)',
      magnetism: 'Encanto refinado, gracia irresistible y el poder de hacer que los demás se enamoren de su propio reflejo junto a ti.',
      shadowTrap: 'Perder tu identidad en la pareja, miedo a la soledad e incapacidad para tomar decisiones firmes sin aprobación externa.'
    },
    scorpio: {
      archetype: 'Señor de las Transformaciones (Poder Tabú Máximo)',
      magnetism: 'La cúspide del poder de Lilith. Magnetismo imbatible, intensa atracción sexual e intuición penetrante.',
      shadowTrap: 'Atracción por el drama emocional, celos y autodestrucción. Tu lección es transformar este poder en sanación y trascendencia.'
    },
    sagittarius: {
      archetype: 'Rebelde Espiritual / Aventurero Audaz',
      magnetism: 'Aura de grandes visiones, audacia contagiosa y una filosofía rebelde que inspira a otros a seguirte.',
      shadowTrap: 'Fanatismo, dar lecciones morales con soberbia y huir de los compromisos reales hacia horizontes ilusorios.'
    },
    capricorn: {
      archetype: 'Soberano de Hierro (Autoridad Imponente)',
      magnetism: 'Carisma frío y respetable de líder inquebrantable. Tu presencia serena impone respeto inmediato.',
      shadowTrap: 'Frialdad emocional, excesiva dureza contigo mismo y represión de sentimientos por estatus social.'
    },
    aquarius: {
      archetype: 'Rebelde del Futuro (Anarquista Cósmico)',
      magnetism: 'Impredecibilidad absoluta, pensamiento futurista y un desapego magnético que intriga a todos.',
      shadowTrap: 'Cinismo frío, romper vínculos ante el menor límite y temor a entregarse de corazón.'
    },
    pisces: {
      archetype: 'Sirena Oceánica (Misterio Místico)',
      magnetism: 'Encanto etéreo fascinante, aura de entrega y el don de transportar a los demás a un mundo de ensueño.',
      shadowTrap: 'Caer en ilusiones, dependencia emocional de personas tóxicas y evadir la realidad cotidiana.'
    }
  };

  const descriptionsMap = locale === 'es' ? lilithDescriptionsEs : locale === 'ru' ? lilithDescriptionsRu : lilithDescriptionsEn;
  const data = descriptionsMap[signId] || descriptionsMap['scorpio'];

  const signDisplayName = locale === 'es'
    ? (lilith.sign.nameEs || lilith.sign.nameEn)
    : locale === 'ru'
    ? lilith.sign.nameRu
    : lilith.sign.nameEn;

  return (
    <div className="bg-gradient-to-br from-purple-950/5 via-stone-900/5 to-amber-900/5 border-2 border-purple-300/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-200/60 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-900 text-amber-300 font-black text-2xl flex items-center justify-center shadow-md">
            ⚸
          </div>
          <div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-purple-800 font-bold">
              {locale === 'es' ? 'MAGNETISMO DE LA SOMBRA Y CÓDIGO FATAL' : locale === 'ru' ? 'ТЕНЕВОЙ МАГНЕТИЗМ И РОКОВОЙ КОД' : 'SHADOW MAGNETISM & TABOO ESSENCE'}
            </div>
            <h3 className="text-xl font-black text-stone-900">
              {locale === 'es'
                ? `Lilith (Luna Negra) en ${signDisplayName} (Casa ${lilith.house})`
                : locale === 'ru'
                ? `Лилит (Черная Луна) в ${signDisplayName} (${lilith.house} дом)`
                : `Lilith (Black Moon) in ${signDisplayName} (House ${lilith.house})`}
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
            <span>
              {locale === 'es'
                ? 'Tu magnetismo hipnótico:'
                : locale === 'ru'
                ? 'В чем ваш гипнотический магнетизм:'
                : 'Your Hypnotic Magnetism:'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
            {data.magnetism}
          </p>
        </div>

        {/* Shadow Trap */}
        <div className="p-5 rounded-2xl bg-white/80 border border-rose-200 shadow-2xs space-y-2">
          <div className="flex items-center space-x-2 text-rose-900 font-bold text-sm">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>
              {locale === 'es'
                ? 'Trampa kármica y tentación:'
                : locale === 'ru'
                ? 'Кармическая ловушка и искушение:'
                : 'Karmic Pitfall & Temptation:'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
            {data.shadowTrap}
          </p>
        </div>
      </div>
    </div>
  );
};
