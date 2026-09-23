import { GoogleGenAI } from '@google/genai';
import { NatalChartData, Locale } from '@/types/astro';

export async function askAIAstrologer(
  question: string,
  chart: NatalChartData,
  chatHistory: { role: 'user' | 'model'; text: string }[],
  locale: Locale = 'ru'
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  const sun = chart.planets?.find(p => p.id === 'sun');
  const moon = chart.planets?.find(p => p.id === 'moon');
  const asc = chart.ascendant;
  const venus = chart.planets?.find(p => p.id === 'venus');
  const mars = chart.planets?.find(p => p.id === 'mars');

  const clientName = chart.birthData?.name || (locale === 'es' ? 'Invitado' : locale === 'ru' ? 'Гость' : 'Guest');

  const getSignName = (sign?: { nameRu: string; nameEn: string; nameEs?: string }) => {
    if (!sign) return '';
    if (locale === 'es') return sign.nameEs || sign.nameEn;
    if (locale === 'ru') return sign.nameRu;
    return sign.nameEn;
  };

  const sunSign = getSignName(sun?.sign) || 'Aries';
  const moonSign = getSignName(moon?.sign) || 'Cancer';
  const ascSign = getSignName(asc?.sign) || 'Leo';
  const venusSign = getSignName(venus?.sign) || 'Taurus';
  const marsSign = getSignName(mars?.sign) || 'Scorpio';
  const primaryElement = (locale === 'es' ? chart.dominantElement?.primaryEs : locale === 'ru' ? chart.dominantElement?.primary : chart.dominantElement?.primaryEn) || 'Fire';

  const langInstruction =
    locale === 'es'
      ? 'Responde SIEMPRE en Español impecable, cálido y natural (Español neutro / latinoamericano). Extensión: 2-3 párrafos concisos y profundos.'
      : locale === 'en'
      ? 'Always respond in natural, warm, and insightful English. Length: 2-3 concise, profound paragraphs.'
      : 'Отвечай на русском языке. Объем: 2-3 емких, глубоких абзаца.';

  const contextPrompt = `
You are Astra — an empathetic, world-class psychological astrologer and personal guide.
Client Profile:
- Name: ${clientName}
- Sun: ${sunSign} (${sun?.degreeInSign || 0}°, House ${sun?.house || 1})
- Moon: ${moonSign} (${moon?.degreeInSign || 0}°, House ${moon?.house || 4})
- Ascendant: ${ascSign} (${asc?.degreeInSign || 0}°)
- Venus: ${venusSign} (${venus?.degreeInSign || 0}°, House ${venus?.house || 7})
- Mars: ${marsSign} (${mars?.degreeInSign || 0}°, House ${mars?.house || 1})
- Dominant Element: ${primaryElement}

Rules:
1. Provide a warm, deep, empowering psychological astrology interpretation (archetypes, inner resources, growth points).
2. Reference the client's specific planetary placements.
3. Keep it practical, inspiring, and actionable.
4. ${langInstruction}
`;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const contents = [
        { role: 'user', parts: [{ text: `${contextPrompt}\n\nClient Question: ${question}` }] }
      ];

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents,
      });

      if (response.text) {
        return response.text;
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to local engine:', err);
    }
  }

  // Local fallback engine
  const qLower = question.toLowerCase();

  // Spanish fallbacks
  if (locale === 'es') {
    if (qLower.includes('amor') || qLower.includes('pareja') || qLower.includes('relaci') || qLower.includes('casam') || qLower.includes('matrimoni')) {
      return `${clientName}, en tu carta natal el área del amor y los vínculos está regida por Venus en ${venusSign} en la casa ${venus?.house || 7}, mientras que tu energía de conquista e iniciativa proviene de Marte en ${marsSign}.\n\nPara ti es fundamental una pareja que combine honestidad profunda con complicidad emocional y respeto por tus espacios. Tu mayor aprendizaje evolutivo es expresar tus necesidades con claridad sin esperar que la otra persona las adivine. Tu Casa 7 muestra un gran potencial para una unión sólida y duradera cuando no comprometes tu autenticidad.`;
    }

    if (qLower.includes('diner') || qLower.includes('financ') || qLower.includes('trabaj') || qLower.includes('negoci') || qLower.includes('carrer') || qLower.includes('riquez')) {
      return `${clientName}, tu potencial financiero se canaliza a través de las casas 2 y 10. Tu Sol en ${sunSign} te otorga la capacidad de liderar y destacar por tu propia visión sin depender de mandatos ajenos.\n\nEl dinero y la abundancia fluyen hacia ti con mayor fuerza cuando te alineas con tu elemento dominante (${primaryElement}). Este es un ciclo favorable para confiar en tus talentos únicos y no rebajar el valor de lo que ofreces al mundo.`;
    }

    if (qLower.includes('karm') || qLower.includes('propósit') || qLower.includes('misi') || qLower.includes('destino') || qLower.includes('sentid')) {
      return `Tu misión kármica principal está estrechamente ligada a la combinación de tu Ascendente en ${ascSign} y tu Sol en ${sunSign}. Tu alma eligió este camino para transformar viejas dudas en una seguridad interna inquebrantable.\n\nEl gran aprendizaje consiste en escuchar la intuición genuina de tu Luna en ${moonSign} en lugar de las exigencias del entorno. Cuando actúas desde tu verdad interna, las oportunidades y las personas indicadas llegan con perfecta sincronía.`;
    }

    return `${clientName}, al observar tu carta astral con el Sol en ${sunSign} y Ascendente en ${ascSign}, se hace evidente que las respuestas que buscas requieren equilibrar tu lógica con tu sabiduría intuitiva.\n\nTu gran fortaleza radica en tu capacidad de enfoque y resiliencia. Confía en el ritmo natural de tus procesos y no apresures decisiones trascendentales: las configuraciones planetarias apoyan pasos firmes y conscientes.`;
  }

  // English fallbacks
  if (locale === 'en') {
    if (qLower.includes('love') || qLower.includes('partner') || qLower.includes('relation') || qLower.includes('marri') || qLower.includes('soulmate')) {
      return `${clientName}, in your chart, romantic bonding is guided by Venus in ${venusSign} in House ${venus?.house || 7}, with your primal drive shaped by Mars in ${marsSign}.\n\nYou thrive with a partner who offers genuine loyalty, intellectual stimulation, and deep emotional presence. Your key growth milestone is vocalizing vulnerabilities openly rather than retreating. Your 7th House indicates immense promise for a long-term, supportive union when healthy boundaries are maintained.`;
    }

    if (qLower.includes('money') || qLower.includes('financ') || qLower.includes('career') || qLower.includes('job') || qLower.includes('wealth') || qLower.includes('business')) {
      return `${clientName}, your wealth blueprint centers around the axis of your 2nd and 10th Houses. With your Sun in ${sunSign}, you are built to establish authority and manifest tangible prosperity through authentic self-direction.\n\nAbundance expands whenever you lean into your dominant element (${primaryElement}). Focus on scaling your core unique strengths rather than trying to fit traditional molds.`;
    }

    if (qLower.includes('karm') || qLower.includes('purpose') || qLower.includes('destin') || qLower.includes('meaning') || qLower.includes('path')) {
      return `Your soul’s primary mission is deeply mirrored in your Ascendant in ${ascSign} alongside your Sun in ${sunSign}. You incarnated to transmute inherited self-doubt into grounded spiritual resilience.\n\nYour essential lesson is honoring the emotional truth of your Moon in ${moonSign} rather than living by societal expectations. Living aligned with your genuine essence magnetically draws the right opportunities into your orbit.`;
    }

    return `${clientName}, analyzing your natal placements with Sun in ${sunSign} and Ascendant in ${ascSign}, the present phase calls for harmonizing intellect with inner gut wisdom.\n\nYour greatest advantage is your natural determination and resilience. Trust your inner compass and take deliberate, grounded steps forward.`;
  }

  // Russian fallbacks (default)
  if (qLower.includes('любов') || qLower.includes('отношен') || qLower.includes('брак') || qLower.includes('муж') || qLower.includes('жен')) {
    return `${clientName}, в вашей карте за сферу любви и привязанности отвечает Венера в знаке ${venusSign} в ${venus?.house || 7} доме, а за сексуальную энергию и инициативу — Марс в ${marsSign}.\n\nДля вас критически важно, чтобы партнер сочетал в себе надежность, преданность и чуткость. Главная точка роста — перестать додумывать за партнера и прямо говорить о своих чувствах. Ваш 7 дом указывает на возможность крепкого союза, если вы не будете жертвовать личными границами.`;
  }

  if (qLower.includes('деньг') || qLower.includes('финанс') || qLower.includes('работ') || qLower.includes('бизнес') || qLower.includes('карьер')) {
    return `${clientName}, финансовый потенциал вашей карты раскрывается через ось 2-го и 10-го домов. Ваше Солнце в ${sunSign} дает мощный импульс для личного бренда или экспертности, где вы сами контролируете результат.\n\nДеньги приходят к вам не через монотонное подчинение, а когда вы подключаете свою ведущую стихию — ${primaryElement}. Ближайший период благоприятен для монетизации ваших уникальных навыков и масштабирования дохода. Не бойтесь повышать планку притязаний.`;
  }

  if (qLower.includes('карм') || qLower.includes('предназнач') || qLower.includes('смысл') || qLower.includes('путь')) {
    return `Ваша кармическая задача напрямую связана с положением Асцендента в знаке ${ascSign} и Солнца в ${sunSign}. Ваша душа пришла в это воплощение, чтобы трансформировать сомнения в безусловную внутреннюю силу.\n\nУрок заключается в том, чтобы научиться слышать истинные желания вашей Луны в ${moonSign}, а не навязанные ожидания социума. Когда вы действуете в согласии со своим внутренним авторитетом, синхронистичности и нужные люди начинают появляться сами собой.`;
  }

  return `${clientName}, рассматривая вашу натальную карту с Солнцем в ${sunSign} и Асцендентом в ${ascSign}, можно увидеть, что текущие вопросы требуют баланса между разумом и интуицией.\n\nВаша сильная сторона — способность концентрировать энергию в ключевой точке. Обратите внимание на сигналы тела и не торопите события: планетарные аспекты сейчас благоволят осознанным, взвешенным решениям.`;
}
