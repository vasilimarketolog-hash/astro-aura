import { Locale } from '@/types/astro';
import { ZODIAC_SIGNS } from '@/lib/astroEngine';

export interface SignInterpretation {
  essence: string;
  sunMeaning: string;
  moonMeaning: string;
  ascMeaning: string;
  venusMeaning: string;
  marsMeaning: string;
  shadowSide: string;
  superpower: string;
}

export const SIGN_INTERPRETATIONS: Record<string, SignInterpretation> = {
  aries: {
    essence: 'Первопроходец, пламя инициативы и неукротимая воля к победе.',
    sunMeaning: 'Ваша сущность питается вызовом и движением вперед. Вы прирожденный лидер, который не терпит промедлений и предпочитает учиться на собственных смелых решениях.',
    moonMeaning: 'Внутри вас бушует вулкан эмоций: вы реагируете молниеносно, искренне и прямолинейно. Вам необходимо физическое действие, чтобы успокоить внутреннее напряжение.',
    ascMeaning: 'Мир видит в вас смелого, энергичного и уверенного человека. Первое впечатление — решительность, харизма и готовность взять ситуацию в свои руки.',
    venusMeaning: 'В любви вы охотник: цените накал страстей, откровенность и быстрый темп сближения. Рутина и холодность партнера вас отталкивают.',
    marsMeaning: 'Огромный запас пробивной мощи. В стрессе вы не отступаете, а атакуете проблему в лоб.',
    shadowSide: 'Вспыльчивость, нетерпеливость, склонность бросать начатое на полпути, если пропал первый азарт.',
    superpower: 'Способность зажечь идеей любую команду и сделать первый шаг там, где остальные боятся.'
  },
  taurus: {
    essence: 'Хранитель изобилия, созидатель материальной стабильности и чувственной гармонии.',
    sunMeaning: 'Вы цените прочность, комфорт и осязаемые результаты своего труда. Ваша сила — в терпении, верности своим ориентирам и умении накапливать ресурсы.',
    moonMeaning: 'Ваша душа обретает покой в уюте, вкусной еде, финансовой подушке безопасности и предсказуемости. Любые резкие перемены вызывают внутреннее сопротивление.',
    ascMeaning: 'Вы производите впечатление надежного, привлекательного и очень уравновешенного человека, излучающего основательность и эстетический вкус.',
    venusMeaning: 'Любовь для вас — это тактильность, преданность и совместное наслаждение жизнью. Вы не спешите с признаниями, но если полюбили, это всерьез и надолго.',
    marsMeaning: 'Упорство бульдозера. Вы долго запрягаете, но остановить вас на пути к цели невозможно.',
    shadowSide: 'Упрямство, страх выйти из зоны комфорта, склонность к материальной тревожности.',
    superpower: 'Умение превращать любую хаотичную идею в прибыльную и долговечную систему.'
  },
  gemini: {
    essence: 'Проводник идей, мастер коммуникации и виртуоз информационной гибкости.',
    sunMeaning: 'Ваш ум ненасытен: вы одновременно исследуете несколько тем, мгновенно схватываете суть и обладаете даром слова, соединяющим самых разных людей.',
    moonMeaning: 'Эмоции пропускаются через призму разума. Чтобы успокоиться, вам нужно выговориться, прочитать книгу или переключиться на новую интересную мысль.',
    ascMeaning: 'Вам свойственна визуальная легкость, молодость духа, живая мимика и искреннее любопытство к собеседнику.',
    venusMeaning: 'Вас возбуждает острый интеллект, остроумие и общие разговоры до утра. Если с партнером не о чем поговорить, чувства быстро угасают.',
    marsMeaning: 'Быстрота реакции и многозадачность. Вы действуете через слово, связи и поиск нестандартных лазеек.',
    shadowSide: 'Поверхностность, распыление внимания, ментальное выгорание от перегрузки новостями.',
    superpower: 'Способность находить общий язык с кем угодно и монетизировать информацию быстрее всех.'
  },
  cancer: {
    essence: 'Хранитель рода, интуитивный эмпат и источник глубокой эмоциональной заботы.',
    sunMeaning: 'Ваша сила в чувствительности, преданности близким и умении создать безопасное пространство. За мягкой оболочкой скрывается несгибаемая внутренняя стойкость.',
    moonMeaning: 'Луна в своей обители: колоссальная интуиция, способность буквально кожей чувствовать мысли и невысказанную боль других людей.',
    ascMeaning: 'Мягкий, располагающий взгляд, вызывающий мгновенное доверие. Окружающие инстинктивно ищут у вас поддержки и тепла.',
    venusMeaning: 'Вы стремитесь к эмоциональному слиянию, романтической сказке и созданию крепкого семейного очага. Очень уязвимы к холодности.',
    marsMeaning: 'Защитный тип энергии: ради себя вы можете сомневаться, но ради защиты семьи или любимого дела сметете любые преграды.',
    shadowSide: 'Обидчивость, закрытость в «панцире», склонность драматизировать прошлое.',
    superpower: 'Интуитивное видение скрытых мотивов людей за секунду до того, как они заговорят.'
  },
  leo: {
    essence: 'Солнечный творец, источник тепла, великодушия и природного артистизма.',
    sunMeaning: 'Вы рождены, чтобы сиять и вдохновлять. Ваше достоинство, щедрость и масштаб мышления притягивают внимание, где бы вы ни появились.',
    moonMeaning: 'Вам жизненно необходимо искреннее восхищение и признание ваших заслуг. Когда вас ценят, ваше сердце открывается безгранично.',
    ascMeaning: 'Королевская осанка, яркая прическа или взгляд, приковывающий взгляды. Вас невозможно не заметить в любой толпе.',
    venusMeaning: 'Любовь с размахом: широкие жесты, подарки, гордость за своего партнера. Вы не согласны на посредственные отношения.',
    marsMeaning: 'Действие с достоинством и уверенностью в триумфе. Отличный организаторский запал.',
    shadowSide: 'Уязвленное самолюбие, зависимость от внешней похвалы, склонность к драматизации.',
    superpower: 'Магнетическое влияние на аудиторию и умение вдохновлять людей на великие свершения.'
  },
  virgo: {
    essence: 'Архитектор совершенства, мастер аналитики и практической пользы.',
    sunMeaning: 'Ваш талант — наводить идеальный порядок в хаосе. Вы видите малейшие детали, стремитесь к безупречному мастерству и служению высшим стандартам.',
    moonMeaning: 'Эмоциональный комфорт наступает, когда все разложено по полочкам, здоровье под контролем и дела идут по четкому плану.',
    ascMeaning: 'Сдержанность, опрятность, интеллигентность и внимательный, сканирующий взгляд эксперта.',
    venusMeaning: 'Любовь через заботу в мелочах: приготовить полезный чай, помочь с проектом, решить бытовую проблему. Верность и надежность.',
    marsMeaning: 'Методичная, точная работа без лишней суеты. Вы побеждаете стратегией и филигранной подготовкой.',
    shadowSide: 'Самокритика, тревожность, излишний перфекционизм и придирчивость к близким.',
    superpower: 'Способность быстро находить критические уязвимости в любой системе и делать ее идеальной.'
  },
  libra: {
    essence: 'Дипломат гармонии, эстет и создатель безупречного партнерства.',
    sunMeaning: 'Вы стремитесь к красоте, справедливости и балансу. Ваша сила — в умении взвешивать все точки зрения и находить элегантный компромисс.',
    moonMeaning: 'Вам жизненно необходим гармоничный партнер рядом. В атмосфере конфликтов и грубости вы физически заболеваете.',
    ascMeaning: 'Обаяние, тонкие черты лица, вежливость и безупречное чувство стиля, обезоруживающее любого собеседника.',
    venusMeaning: 'Венера в обители: романтика высочайшей пробы, изысканные свидания, интеллектуальное родство и взаимное уважение.',
    marsMeaning: 'Мягкая сила: вы добиваетесь своего не напролом, а через переговоры, обаяние и дипломатические маневры.',
    shadowSide: 'Колебания, нерешительность, страх испортить отношения ценой подавления собственных желаний.',
    superpower: 'Дар разрешать неразрешимые конфликты и создавать вокруг себя пространство чистой эстетики.'
  },
  scorpio: {
    essence: 'Мистический феникс, мастер глубинной трансформации и психологического рентгена.',
    sunMeaning: 'Вы обладаете колоссальной внутренней силой, выдерживающей любые жизненные кризисы. Вы презираете фальшь и всегда докапываетесь до сути.',
    moonMeaning: 'Шквальные, страстные эмоции невероятной глубины. Вы чувствуете опасность за версту и храните преданность тем немногим, кого впустили в душу.',
    ascMeaning: 'Пронизывающий гипнотический взгляд, аура тайны и магнетическая привлекательность, которая интригует и немного пугает.',
    venusMeaning: 'Любовь на грани: всё или ничего, абсолютная преданность, жгучая страсть и глубочайшая душевная связь.',
    marsMeaning: 'Несгибаемая воля спецназовца: вы не сдаетесь никогда и становитесь только сильнее от любых ударов судьбы.',
    shadowSide: 'Ревность, подозрительность, злопамятность и склонность к саморазрушению.',
    superpower: 'Способность возрождаться из пепла и гипнотически влиять на подсознание других людей.'
  },
  sagittarius: {
    essence: 'Философ-первооткрыватель, вечный искатель истины и носитель глобального оптимизма.',
    sunMeaning: 'Ваша душа жаждет горизонтов: путешествий, высших знаний, масштабных проектов и духовного роста. Вы вдохновляете людей верить в невозможное.',
    moonMeaning: 'Оптимистичная, свободолюбивая душа. Любые ограничения и рутина вызывают удушье; вам нужен воздух, простор и вдохновляющие смыслы.',
    ascMeaning: 'Широкая улыбка, открытый взгляд, спортивная стать и аура дружелюбия, вызывающая ощущение «своего человека».',
    venusMeaning: 'В отношениях цените свободу, совместные приключения и духовное единомыслие. Партнер должен быть для вас учителем или соратником.',
    marsMeaning: 'Действие с размахом и энтузиазмом: вы стремитесь к масштабным целям и верите в свою удачу.',
    shadowSide: 'Догматизм, склонность поучать, необязательность в бытовых мелочах.',
    superpower: 'Умение притягивать счастливые шансы и заряжать энергией победы любого человека.'
  },
  capricorn: {
    essence: 'Вершина мастерства, хранитель времени и созидатель монументального успеха.',
    sunMeaning: 'Вы обладаете редким даром стратегического терпения. Вы ставите амбициозные вершины и методично восходите на них, невзирая на любые препятствия.',
    moonMeaning: 'Внутренняя броня: эмоции находятся под строгим контролем самообладания. Вы раскрываетесь только в атмосфере абсолютной надежности.',
    ascMeaning: 'Взрослый, авторитетный, надежный вид. Даже в юности вы производите впечатление опытного лидера, знающего цену вещам.',
    venusMeaning: 'Зрелая любовь: преданность, проверенная годами, уважение и совместное приумножение статуса и благосостояния.',
    marsMeaning: 'Стальной марафонец: вы не тратите силы на суету, а бьете точно в цель с максимальной отдачей.',
    shadowSide: 'Эмоциональная холодность, пессимизм, излишний трудоголизм в ущерб отдыху.',
    superpower: 'Способность выстроить несокрушимую империю или карьеру там, где остальные сдались от трудностей.'
  },
  aquarius: {
    essence: 'Гений будущего, визионер свободы и архитектор нового мира.',
    sunMeaning: 'Вы мыслите на десятилетия вперед, опережая свое время. Ваша ценность — абсолютная внутренняя свобода, оригинальность и прогрессивные идеалы.',
    moonMeaning: 'Нестандартная эмоциональная организация: вы способны смотреть на свои чувства объективно, с высоты птичьего полета.',
    ascMeaning: 'Необычный стиль, оригинальный взгляд, ореол дружелюбия и легкой инопланетности.',
    venusMeaning: 'Любовь начинается с дружбы: партнер должен быть интеллектуальным союзником, уважающим ваше право на личное пространство.',
    marsMeaning: 'Инновационное действие: вы разрушаете стереотипы и действуете через технологии, идеи и коллективную синергию.',
    shadowSide: 'Отстраненность, бунт ради бунта, эмоциональная холодность в близких отношениях.',
    superpower: 'Способность видеть будущее трендов и разрушать устаревшие ограничения.'
  },
  pisces: {
    essence: 'Мистический океан вдохновения, проводник божественной любви и сострадания.',
    sunMeaning: 'Ваша связь с тонким миром и искусством феноменальна. Вы мыслите образами, снами и метафорами, способны чувствовать вселенское единство.',
    moonMeaning: 'Предельная эмпатия: вы впитываете атмосферу помещений и переживания людей как губка. Необходимы периоды уединения у воды для восстановления.',
    ascMeaning: 'Загадочный, глубокий взгляд, плавность движений и аура поэтичности.',
    venusMeaning: 'Безусловная, самоотверженная любовь. Готовность прощать, вдохновлять и исцелять партнера своим теплом.',
    marsMeaning: 'Действие по наитию: вы плывете по течению возможностей и находите выход там, где логика бессильна.',
    shadowSide: 'Уход от реальности в иллюзии, позиция жертвы, отсутствие личных границ.',
    superpower: 'Колоссальная интуиция и творческий гений, черпающий образы напрямую из подсознания.'
  }
};

export const SIGN_INTERPRETATIONS_EN: Record<string, SignInterpretation> = {
  aries: {
    essence: 'Trailblazer, flame of dynamic initiative and unyielding drive to triumph.',
    sunMeaning: 'Your soul thrives on challenge and forward momentum. You are a natural leader who acts decisively and masters destiny through courage.',
    moonMeaning: 'Inside lies a volcano of genuine feeling: quick, honest, and direct. Physical movement is vital for releasing inner tension.',
    ascMeaning: 'The world sees you as brave, vibrant, and confident. The first impression is magnetic dynamism and instant authority.',
    venusMeaning: 'In love, you are an ardent pursuer: you prize raw chemistry, honesty, and passion. Routine and emotional aloofness push you away.',
    marsMeaning: 'Extraordinary breakthrough drive. When pressure mounts, you do not retreat; you charge obstacles directly.',
    shadowSide: 'Impatience, fiery temper, tendency to abandon projects once the initial rush fades.',
    superpower: 'The gift to ignite any team and take bold first steps where others hesitate.'
  },
  taurus: {
    essence: 'Guardian of abundance, architect of material security and sensual elegance.',
    sunMeaning: 'You treasure solid endurance, tactile comfort, and tangible mastery. Your power lies in calm patience and compounding lasting resources.',
    moonMeaning: 'Your soul finds peace in serenity, gourmet pleasures, financial stability, and emotional predictability.',
    ascMeaning: 'You project grounded composure, physical allure, and calm aesthetic refinement that immediately puts others at ease.',
    venusMeaning: 'Love is sensual devotion, loyalty, and savoring life together. You take your time, but when committed, it is unbreakable.',
    marsMeaning: 'Bulldozer perseverance. You build deliberate momentum and cannot be diverted once your course is set.',
    shadowSide: 'Stubbornness, fear of stepping outside comfort zones, material anxiety.',
    superpower: 'The ability to turn any chaotic idea into a lucrative, enduring enterprise.'
  },
  gemini: {
    essence: 'Courier of ideas, master of agile dialogue and intellectual versatility.',
    sunMeaning: 'Your intellect is voracious: you weave connections across diverse realms, capture core truths instantly, and articulate ideas brilliantly.',
    moonMeaning: 'Emotions are processed through mental clarity. To reset, you need stimulating conversation, insightful reading, or a fresh perspective.',
    ascMeaning: 'Visual lightness, youthful energy, animated expressions, and vibrant curiosity toward every person you meet.',
    venusMeaning: 'Attraction begins with wit, banter, and late-night philosophy. Intellectual stagnation quickly dissolves romantic interest.',
    marsMeaning: 'Swift cognitive response and multitasking agility. You navigate challenges through clever strategy and communication.',
    shadowSide: 'Restlessness, scattered focus, mental burnout from digital sensory overload.',
    superpower: 'Connecting with anyone in seconds and monetizing insights faster than anyone else.'
  },
  cancer: {
    essence: 'Guardian of lineage, intuitive empath, and beacon of protective devotion.',
    sunMeaning: 'Your strength stems from emotional depth, loyalty to your inner circle, and the instinct to nurture sacred spaces.',
    moonMeaning: 'Moon in its celestial home: immense emotional intelligence, feeling unspoken energy and subtext before words are spoken.',
    ascMeaning: 'Gentle, inviting gaze that radiates instant trust and emotional safety.',
    venusMeaning: 'You yearn for soulful bonding, romantic fairy tales, and building a loyal sanctuary with your partner.',
    marsMeaning: 'Protective tenacity: quiet in self-doubt, but an unstoppable force when shielding those you love.',
    shadowSide: 'Moodiness, retreating into defensive isolation, clinging to past memories.',
    superpower: 'Reading hidden human motives instinctively within the first heartbeat of meeting.'
  },
  leo: {
    essence: 'Solar creator, fountain of warmth, generosity, and sovereign charisma.',
    sunMeaning: 'You are destined to radiate inspiration and lead with nobility. Your generosity, pride, and visionary warmth draw natural respect.',
    moonMeaning: 'Deep need for heartfelt recognition and appreciation. When loved authentically, your generosity knows no bounds.',
    ascMeaning: 'Regal posture, captivating presence, and an aura that naturally commands the room upon entry.',
    venusMeaning: 'Grand romance: generous gestures, chivalry, and genuine pride in your chosen partner.',
    marsMeaning: 'Action fueled by honor and certainty of victory. Exceptional leadership and creative execution.',
    shadowSide: 'Vulnerable ego, over-reliance on external applause, dramatic reactions.',
    superpower: 'Magnetic stage presence and the gift to inspire people toward greatness.'
  },
  virgo: {
    essence: 'Architect of excellence, master of precision analysis and practical alchemy.',
    sunMeaning: 'Your gift is distilling supreme order from chaos. You detect nuanced details, refine craftsmanship, and elevate everyday life.',
    moonMeaning: 'Emotional peace arrives when details are organized, health is harmonious, and life proceeds with clear purpose.',
    ascMeaning: 'Poised, intelligent, well-dressed, with an observant gaze that notices every nuance.',
    venusMeaning: 'Love through thoughtful acts of service: practical care, attentive listening, solving real-life challenges.',
    marsMeaning: 'Calculated, precise action. You succeed through relentless preparation and flawless execution.',
    shadowSide: 'Excessive self-criticism, anxiety over minor imperfections, hypercritical outlook.',
    superpower: 'Spotting systemic bottlenecks in seconds and optimizing them into flawless perfection.'
  },
  libra: {
    essence: 'Diplomat of harmony, aesthetic visionary, and creator of balanced union.',
    sunMeaning: 'You strive for truth, justice, and symmetry. Your wisdom lies in synthesizing opposing views into elegant consensus.',
    moonMeaning: 'Peace requires harmony in partnerships and beauty in surroundings. Tension and discord physically drain your vitality.',
    ascMeaning: 'Charming symmetry, graceful composure, impeccable fashion sense, and disarming etiquette.',
    venusMeaning: 'Venus in her palace: refined romance, soulful dialogue, artistic companionship, and mutual respect.',
    marsMeaning: 'Strategic soft power: winning through negotiation, social grace, and brilliant tactical charm.',
    shadowSide: 'Indecision, people-pleasing at the expense of your own authentic desires.',
    superpower: 'Resolving unsolvable disputes and filling every space with radiant harmony.'
  },
  scorpio: {
    essence: 'Mystic phoenix, master of psychic depth and psychological alchemy.',
    sunMeaning: 'You possess formidable spiritual fortitude that transforms adversity into absolute power. You despise superficiality.',
    moonMeaning: 'Passionate emotional depths. You possess an instinct for authenticity and guard your inner sanctum fiercely.',
    ascMeaning: 'Hypnotic, piercing gaze, mysterious allure, and intense personal magnetism.',
    venusMeaning: 'All-or-nothing devotion: profound emotional intimacy, raw passion, and sacred loyalty.',
    marsMeaning: 'Iron resolve: you never yield to pressure and emerge stronger from every trial life presents.',
    shadowSide: 'Suspicion, emotional possessiveness, resistance to forgiving past betrayals.',
    superpower: 'Rebirth from any crisis and intuitive mastery over the subconscious mind.'
  },
  sagittarius: {
    essence: 'Philosopher voyager, seeker of universal truth, and herald of limitless horizon.',
    sunMeaning: 'Your soul is driven by expansion: philosophical wisdom, world exploration, and inspiring humanity toward freedom.',
    moonMeaning: 'Free-spirited, resilient soul. Routine feels suffocating; you thrive on wide vistas, discovery, and laughter.',
    ascMeaning: 'Broad radiant smile, athletic posture, expansive warmth, and an approachable spirit.',
    venusMeaning: 'Love as a shared grand quest: valuing mutual independence, shared philosophies, and thrilling adventures.',
    marsMeaning: 'Bold, optimistic action: aiming for grand visions with faith in serendipity and fortune.',
    shadowSide: 'Restlessness, blunt dogmatism, reluctance to handle mundane administrative duties.',
    superpower: 'Attracting auspicious destiny synchronicity and uplifting others with pure optimism.'
  },
  capricorn: {
    essence: 'Summit conqueror, master of temporal discipline, and builder of legacies.',
    sunMeaning: 'You possess monumental patience and strategic grit. You set sovereign goals and scale heights others deem impossible.',
    moonMeaning: 'Steadfast composure. Emotional vulnerability is revealed only in environments of established trust and respect.',
    ascMeaning: 'Authoritative, distinguished, capable presence. You naturally command respect and authority.',
    venusMeaning: 'Enduring devotion: loyalty proven through time, building mutual wealth, status, and lasting security.',
    marsMeaning: 'Relentless endurance: focused execution with zero wasted movement, guaranteeing ultimate victory.',
    shadowSide: 'Emotional aloofness, relentless workaholism, guarding against emotional vulnerability.',
    superpower: 'Building an enduring empire and achieving mastery where everyone else surrenders.'
  },
  aquarius: {
    essence: 'Visionary architect of tomorrow, pioneer of liberty and universal progress.',
    sunMeaning: 'You think decades ahead of your era. Your core drive is intellectual freedom, authentic originality, and progressive evolution.',
    moonMeaning: 'Cosmic emotional vantage: you observe feelings with panoramic clarity, balancing detached logic with universal empathy.',
    ascMeaning: 'Unconventional elegance, inventive eye, and an aura of avant-garde brilliance.',
    venusMeaning: 'Love rooted in deep intellectual friendship: honoring independence while exploring futuristic ideas together.',
    marsMeaning: 'Revolutionary disruption: transforming outdated paradigms through technology and collective synergy.',
    shadowSide: 'Emotional detachment, rebellion without clear cause, intellectual aloofness.',
    superpower: 'Foreseeing emerging cultural trends and breaking obsolete societal limits.'
  },
  pisces: {
    essence: 'Oceanic mystic, conduit of cosmic compassion and transcendent inspiration.',
    sunMeaning: 'Your connection to archetypes, dreams, and art is profound. You navigate life via intuitive flow and universal empathy.',
    moonMeaning: 'Sublime empathy: you absorb room energy and feelings effortlessly. Solitude near water is vital for recharging.',
    ascMeaning: 'Luminous, dreamy gaze, graceful movement, and an aura of poetic mystery.',
    venusMeaning: 'Unconditional love: healing, inspiring, and cherishing your partner through transcendent spiritual devotion.',
    marsMeaning: 'Intuitive action: trusting subtle signs, surrendering to divine timing, finding miracles where logic falters.',
    shadowSide: 'Escapism, weak personal boundaries, drifting into sacrificial tendencies.',
    superpower: 'Profound sixth sense and creative genius channeling directly from universal consciousness.'
  }
};

export const SIGN_INTERPRETATIONS_ES: Record<string, SignInterpretation> = {
  aries: {
    essence: 'Pionero indomable, llama de iniciativa y voluntad inquebrantable de victoria.',
    sunMeaning: 'Tu esencia se nutre del desafío y el avance constante. Eres un líder nato que no tolera la indecisión y aprende de sus propias decisiones audaces.',
    moonMeaning: 'Un volcán de emociones bulle en tu interior: reaccionas de forma instantánea, honesta y directa. Necesitas acción física para calmar la tensión interna.',
    ascMeaning: 'El mundo te percibe como una persona valiente, dinámica y magnética. Primera impresión: determinación, carisma y capacidad de liderazgo.',
    venusMeaning: 'En el amor eres cazador: valoras la pasión viva, la franqueza y el ritmo audaz. La frialdad o la rutina te desconectan de inmediato.',
    marsMeaning: 'Inmensa fuerza impulsora. Ante la adversidad no te rindes, atacas el problema de frente.',
    shadowSide: 'Impulsividad, impaciencia y tendencia a abandonar proyectos si se apaga el entusiasmo inicial.',
    superpower: 'Capacidad de encender a cualquier equipo y dar el primer paso donde otros temen.'
  },
  taurus: {
    essence: 'Guardián de la abundancia, creador de estabilidad material y armonía sensorial.',
    sunMeaning: 'Valoras la solidez, la comodidad y los resultados tangibles. Tu fortaleza radica en la paciencia, la lealtad y el don de acumular recursos.',
    moonMeaning: 'Tu alma encuentra paz en la serenidad, la buena mesa, la seguridad financiera y lo predecible. Los cambios bruscos generan resistencia.',
    ascMeaning: 'Transmites una presencia confiable, atractiva y equilibrada, irradiando elegancia natural y buen gusto estético.',
    venusMeaning: 'El amor para ti es contacto físico, lealtad y disfrute compartido. No tienes prisa, pero cuando amas, es para siempre.',
    marsMeaning: 'Determinación implacable. Avanzas a paso firme y nada puede detenerte cuando fijas un objetivo.',
    shadowSide: 'Terquedad, apego a la zona de confort y ansiedad ante la incertidumbre económica.',
    superpower: 'Convertir cualquier idea caótica en un sistema rentable, sólido y duradero.'
  },
  gemini: {
    essence: 'Canalizador de ideas, maestro de la comunicación y virtuoso de la versatilidad mental.',
    sunMeaning: 'Tu mente es insaciable: investigas múltiples temas a la vez, captas la esencia en segundos y conectas personas muy diversas.',
    moonMeaning: 'Procesas las emociones a través del intelecto. Para calmarte necesitas expresar tus ideas, leer o explorar un concepto nuevo.',
    ascMeaning: 'Frescura visual, espíritu juvenil, mirada curiosa y facilidad innata para iniciar conversaciones interesantes.',
    venusMeaning: 'Te estimula la inteligencia viva, el ingenio y las charlas que duran hasta el amanecer. Si no hay conexión mental, el interés decae.',
    marsMeaning: 'Agilidad mental y multitarea. Actúas a través de las palabras, las redes y la resolución creativa de problemas.',
    shadowSide: 'Dispersión, superficialidad y agotamiento mental por sobrecarga de información.',
    superpower: 'Conectar con cualquier persona al instante y monetizar la información antes que nadie.'
  },
  cancer: {
    essence: 'Protector intuitivo, alma empática y refugio de profunda contención emocional.',
    sunMeaning: 'Tu poder reside en la sensibilidad, la lealtad hacia tus seres queridos y la creación de espacios seguros. Tras una coraza suave hay una fuerza invencible.',
    moonMeaning: 'Luna en domicilio: intuición colosal, capacidad casi telepática para percibir los estados de ánimo y dolores no expresados.',
    ascMeaning: 'Mirada cálida y acogedora que genera confianza inmediata. Los demás buscan instintivamente tu consuelo y afecto.',
    venusMeaning: 'Buscas fusión emocional, romance sincero y un hogar sólido. Muy vulnerable a la indiferencia o frialdad.',
    marsMeaning: 'Energía protectora: por ti mismo puedes dudar, pero para defender a tu familia o proyecto arrasas con cualquier barrera.',
    shadowSide: 'Susceptibilidad, tendencia a encerrarte en tu caparazón y dramatizar el pasado.',
    superpower: 'Lectura intuitiva de las intenciones ajenas un segundo antes de que hablen.'
  },
  leo: {
    essence: 'Creador solar, fuente de calidez, generosidad y magnetismo natural.',
    sunMeaning: 'Naciste para brillar e inspirar. Tu dignidad, nobleza de espíritu y visión de grandeza atraen la atención dondequiera que vayas.',
    moonMeaning: 'Necesitas vitalmente admiración genuina y reconocimiento a tu valor. Cuando te aprecian, tu corazón se abre sin límites.',
    ascMeaning: 'Porte regio, presencia radiante y una energía que ilumina la habitación. Imposible pasar desapercibido en una multitud.',
    venusMeaning: 'Amor a lo grande: detalles espléndidos, devoción apasionada y orgullo por tu pareja. No aceptas relaciones tibias.',
    marsMeaning: 'Acción con seguridad y convicción de triunfo. Talento innato para liderar y organizar.',
    shadowSide: 'Orgullo herido, dependencia de la aprobación externa y tendencia al dramatismo.',
    superpower: 'Influencia magnética sobre los demás y capacidad de motivar a alcanzar grandes metas.'
  },
  virgo: {
    essence: 'Arquitecto de la excelencia, maestro analítico y artesano de la precisión práctica.',
    sunMeaning: 'Tu don es ordenar el caos con maestría. Detectas los detalles invisibles y aspiras a una calidad impecable.',
    moonMeaning: 'La serenidad llega cuando todo está en su lugar, tu bienestar bajo control y tus proyectos siguen un plan riguroso.',
    ascMeaning: 'Elegancia sobria, mirada observadora e inteligente que evalúa con precisión experta.',
    venusMeaning: 'Amor demostrado en actos concretos: preparar algo nutritivo, resolver un problema cotidiano, brindar lealtad incondicional.',
    marsMeaning: 'Trabajo meticuloso y estratégico sin desgaste innecesario. Vences con preparación y método.',
    shadowSide: 'Autocrítica severa, perfeccionismo excesivo y preocupación anticipatoria.',
    superpower: 'Localizar fallos críticos en cualquier sistema y transformarlo en una máquina perfecta.'
  },
  libra: {
    essence: 'Diplomático de la armonía, esteta refinado y creador de acuerdos impecables.',
    sunMeaning: 'Buscas belleza, equilibrio y justicia. Tu sabiduría está en sopesar todos los puntos de vista y hallar el consenso ideal.',
    moonMeaning: 'Necesitas un entorno armonioso y una relación cómplice. Los conflictos y la agresividad drenan tu bienestar físico.',
    ascMeaning: 'Encanto magnético, simetría facial, amabilidad natural y un sentido del estilo que desarma cualquier hostilidad.',
    venusMeaning: 'Venus en su templo: romance distinguido, conversaciones profundas y respeto mutuo de máxima calidad.',
    marsMeaning: 'Poder suave: alcanzas tus metas no con fuerza bruta, sino mediante negociación, diplomacia y seducción.',
    shadowSide: 'Indecisión crónica y postergar tus propios deseos por evitar confrontaciones.',
    superpower: 'Resolver disputas imposibles y elevar cualquier espacio a la belleza pura.'
  },
  scorpio: {
    essence: 'Fénix místico, maestro de la alquimia psicológica y la transformación total.',
    sunMeaning: 'Posees una fuerza interior titánica que resurge de cualquier crisis. Desprecias la falsedad y siempre llegas a la verdad oculta.',
    moonMeaning: 'Emociones profundas y apasionadas. Tienes un instinto agudo para detectar la traición y guardas lealtad sagrada a quien entra en tu círculo íntimo.',
    ascMeaning: 'Mirada hipnótica y penetrante, aura de misterio y una atracción magnética que intriga y fascina.',
    venusMeaning: 'Amor total o nada: devoción incondicional, pasión visceral y un pacto espiritual inquebrantable.',
    marsMeaning: 'Voluntad inquebrantable: nunca te rindes y cada golpe del destino te vuelve diez veces más fuerte.',
    shadowSide: 'Posesividad, desconfianza, resentimiento y tendencia al autocastigo emocional.',
    superpower: 'Renacer de las cenizas y dominio intuitivo sobre el subconsciente humano.'
  },
  sagittarius: {
    essence: 'Filósofo explorador, buscador de la verdad universal y heraldo del optimismo expansivo.',
    sunMeaning: 'Tu alma anhela horizontes: viajes, conocimiento superior, proyectos monumentales y libertad espiritual.',
    moonMeaning: 'Espíritu libre y resiliente. La rutina te asfixia; floreces con espacios amplios, descubrimientos y alegría vital.',
    ascMeaning: 'Sonrisa expansiva, porte atlético y un aura acogedora que te convierte en amigo entrañable de inmediato.',
    venusMeaning: 'El amor como aventura compartida: respeto a la libertad mutua, filosofías en común y viajes inolvidables.',
    marsMeaning: 'Acción entusiasta y audaz: apuntas a metas lejanas con fe inquebrantable en tu destino.',
    shadowSide: 'Inquietud, dogmatismo involuntario y resistencia a lidiar con tareas administrativas mundanas.',
    superpower: 'Atraer sincronicidades afortunadas y elevar el ánimo de todos con pura esperanza.'
  },
  capricorn: {
    essence: 'Conquistador de cumbres, maestro de la disciplina temporal y forjador de legados duraderos.',
    sunMeaning: 'Posees paciencia legendaria y tenacidad inquebrantable. Fijas metas elevadas y conquistas metas que otros abandonan.',
    moonMeaning: 'Compostura firme. Solo revelas tu vulnerabilidad emocional en entornos de respeto y confianza comprobada.',
    ascMeaning: 'Presencia distinguida, madura y autoritaria. Transmites respeto y solvencia sin necesidad de alzar la voz.',
    venusMeaning: 'Lealtad comprobada con los años: construir patrimonio compartido, estatus y seguridad para el futuro.',
    marsMeaning: 'Resistencia incansable: ejecución precisa sin movimientos en falso que garantiza la victoria a largo plazo.',
    shadowSide: 'Distancia emocional, autoexigencia implacable y dificultad para relajarse y disfrutar el presente.',
    superpower: 'Construir imperios sostenibles y perseverar con éxito donde todos los demás se rinden.'
  },
  aquarius: {
    essence: 'Arquitecto del mañana, pionero de la libertad y motor de la evolución colectiva.',
    sunMeaning: 'Piensas décadas por delante de tu tiempo. Tu motor es la originalidad auténtica, la libertad de criterio y el progreso humano.',
    moonMeaning: 'Claridad mental ante los sentimientos: observas las emociones con objetividad panorámica, combinando lógica y empatía.',
    ascMeaning: 'Estilo vanguardista, mirada visionaria y una singularidad magnética que no sigue ninguna moda.',
    venusMeaning: 'Amor basado en una complicidad intelectual profunda: respetar la independencia mutua mientras crean ideas futuristas.',
    marsMeaning: 'Disrupción innovadora: transformas paradigmas obsoletos mediante creatividad y tecnología.',
    shadowSide: 'Desapego frío, rebeldía sin causa y dificultad para conectar con la ternura cotidiana.',
    superpower: 'Anticipar tendencias culturales y abrir caminos donde antes no había senderos.'
  },
  pisces: {
    essence: 'Místico oceánico, canal de compasión cósmica e inspiración trascendente.',
    sunMeaning: 'Tu sintonía con los sueños, el arte y los arquetipos es profunda. Vives a través de la intuición y la empatía universal.',
    moonMeaning: 'Sensibilidad sublime: absorbes la energía del ambiente sin esfuerzo. Necesitas soledad y contacto con el agua para recargar tu alma.',
    ascMeaning: 'Mirada enigmática y luminosa, movimientos gráciles y una atmósfera de poesía viva.',
    venusMeaning: 'Amor incondicional: sanar, inspirar y entregarte a tu pareja desde una devoción espiritual pura.',
    marsMeaning: 'Acción guiada por la sincronicidad: confías en los tiempos invisibles y hallas milagros donde la lógica se detiene.',
    shadowSide: 'Evasión de la realidad, límites personales difusos y tendencia al sacrificio.',
    superpower: 'Intuición prodigiosa y genialidad artística que canaliza directo de la conciencia universal.'
  }
};

export function getSignInterpretation(signId: string, locale: Locale = 'ru'): SignInterpretation {
  const dict = locale === 'es' ? SIGN_INTERPRETATIONS_ES : locale === 'en' ? SIGN_INTERPRETATIONS_EN : SIGN_INTERPRETATIONS;
  return dict[signId] || dict.aries;
}

export interface TeaserInsight {
  headline: string;
  hook: string;
  revealedDetail: string;
  hiddenSecret: string;
  urgencyPrompt: string;
}

export function generateTeaserInsights(
  sunSignId: string,
  moonSignId: string,
  ascSignId: string,
  locale: Locale = 'ru'
): TeaserInsight {
  const isEs = locale === 'es';
  const isEn = locale === 'en';

  const sunSign = ZODIAC_SIGNS.find(s => s.id === sunSignId) || ZODIAC_SIGNS[0];
  const moonSign = ZODIAC_SIGNS.find(s => s.id === moonSignId) || ZODIAC_SIGNS[3];
  const ascSign = ZODIAC_SIGNS.find(s => s.id === ascSignId) || ZODIAC_SIGNS[4];

  const dict = isEs ? SIGN_INTERPRETATIONS_ES : isEn ? SIGN_INTERPRETATIONS_EN : SIGN_INTERPRETATIONS;
  const sun = dict[sunSignId] || dict.aries;
  const moon = dict[moonSignId] || dict.cancer;
  const asc = dict[ascSignId] || dict.leo;

  const sunName = isEs ? (sunSign.nameEs || sunSign.nameEn) : isEn ? sunSign.nameEn : sunSign.nameRu;
  const moonName = isEs ? (moonSign.nameEs || moonSign.nameEn) : isEn ? moonSign.nameEn : moonSign.nameRu;

  if (isEs) {
    return {
      headline: `Combinación Rara: Sol en ${sunName} con Luna en ${moonName}`,
      hook: `Tu personalidad exterior (${asc.essence}) oculta una profunda dualidad psicológica: tu mente consciente persigue un camino, mientras que tu alma subconsciente anhela una experiencia totalmente diferente.`,
      revealedDetail: `${sun.sunMeaning} Al mismo tiempo, la posición de tu Luna revela: ${moon.moonMeaning}`,
      hiddenSecret: `En tu carta natal se ha detectado una configuración celeste especial en las casas del amor y las finanzas, activando una transformación decisiva en los próximos meses.`,
      urgencyPrompt: `Solo el 4% de las personas poseen esta alineación exacta. Desbloquea tus nodos kármicos del destino y el código de tu verdadera abundancia.`
    };
  }

  if (isEn) {
    return {
      headline: `Rare Combination: Sun in ${sunName} with Moon in ${moonName}`,
      hook: `Your outer persona (${asc.essence}) conceals a profound psychological duality: your conscious mind pursues one path, while your subconscious core yearns for an entirely different experience.`,
      revealedDetail: `${sun.sunMeaning} Meanwhile, your Moon placement reveals: ${moon.moonMeaning}`,
      hiddenSecret: `Your natal chart highlights a rare celestial configuration across the houses of career and partnership, activating a life-defining transformation in the coming months.`,
      urgencyPrompt: `Only 4% of individuals possess this exact celestial harmony. Unlock your karmic destiny nodes and the code to your genuine abundance.`
    };
  }

  return {
    headline: `Редкая комбинация: Солнце в знаке ${sunName} при Луне в знаке ${moonName}`,
    hook: `Ваш внешний образ (${asc.essence}) скрывает мощный внутренний дуализм: разум требует одного, а глубинное подсознание жаждет совершенно иного опыта.`,
    revealedDetail: `${sun.sunMeaning} При этом ваше положение Луны указывает: ${moon.moonMeaning}`,
    hiddenSecret: `В вашей натальной карте обнаружена особая планетарная конфигурация в домах партнерства и финансов, активирующая судьбоносный поворот в ближайшие месяцы.`,
    urgencyPrompt: `Только 4% людей обладают такой связкой аспектов. Разблокируйте расшифровку кармического узла и вектор ваших истинных денег.`
  };
}
