import { GoogleGenAI } from '@google/genai';
import { NatalChartData } from '@/types/astro';

export async function askAIAstrologer(
  question: string,
  chart: NatalChartData,
  chatHistory: { role: 'user' | 'model'; text: string }[]
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  const sun = chart.planets?.find(p => p.id === 'sun');
  const moon = chart.planets?.find(p => p.id === 'moon');
  const asc = chart.ascendant;
  const venus = chart.planets?.find(p => p.id === 'venus');
  const mars = chart.planets?.find(p => p.id === 'mars');

  const clientName = chart.birthData?.name || 'Гость';
  const sunSign = sun?.sign?.nameRu || 'Овен';
  const moonSign = moon?.sign?.nameRu || 'Рак';
  const ascSign = asc?.sign?.nameRu || 'Лев';
  const venusSign = venus?.sign?.nameRu || 'Телец';
  const marsSign = mars?.sign?.nameRu || 'Скорпион';
  const primaryElement = chart.dominantElement?.primary || 'Огонь';

  const contextPrompt = `
Ты — эмпатичный, профессиональный астролог и психолог «Астра».
Данные клиента:
- Имя: ${clientName}
- Солнце: ${sunSign} (${sun?.degreeInSign || 0}°, Дом ${sun?.house || 1})
- Луна: ${moonSign} (${moon?.degreeInSign || 0}°, Дом ${moon?.house || 4})
- Асцендент: ${ascSign} (${asc?.degreeInSign || 0}°)
- Венера: ${venusSign} (${venus?.degreeInSign || 0}°, Дом ${venus?.house || 7})
- Марс: ${marsSign} (${mars?.degreeInSign || 0}°, Дом ${mars?.house || 1})
- Доминирующая стихия: ${primaryElement}

Правила ответа:
1. Отвечай тепло, глубоко, без банальных гороскопов из газет — используй термины психологической астрологии (архетипы, скрытые ресурсы, точки роста).
2. Опирайся на точные положения планет клиента в знаках и домах.
3. Ответ должен быть практичным, вдохновляющим и давать четкий фокус действий.
4. Отвечай на русском языке. Объем: 2-3 емких абзаца.
`;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const contents = [
        { role: 'user', parts: [{ text: `${contextPrompt}\n\nВопрос клиента: ${question}` }] }
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

  // Smart fallback when no key is set yet
  const qLower = question.toLowerCase();
  if (qLower.includes('любов') || qLower.includes('отношен') || qLower.includes('брак') || qLower.includes('муж') || qLower.includes('жен')) {
    return `${clientName}, в вашей карте за сферу любви и привязанности отвечает Венера в знаке ${venusSign} в ${venus?.house || 7} доме, а за сексуальную энергию и инициативу — Марс в ${marsSign}.\n\nДля вас критически важно, чтобы партнер сочетал в себе ${venus?.sign?.element === 'Огонь' ? 'яркость и смелость' : venus?.sign?.element === 'Вода' ? 'глубокую эмоциональную преданность и чуткость' : venus?.sign?.element === 'Земля' ? 'надежность и заботу о материальном' : 'интеллект и способность говорить обо всем'}. Главная точка роста — перестать додумывать за партнера и прямо говорить о своих чувствах. Ваш 7 дом указывает на возможность крепкого союза, если вы не будете жертвовать личными границами.`;
  }

  if (qLower.includes('деньг') || qLower.includes('финанс') || qLower.includes('работ') || qLower.includes('бизнес') || qLower.includes('карьер')) {
    return `${clientName}, финансовый потенциал вашей карты раскрывается через ось 2-го и 10-го домов. Ваше Солнце в ${sunSign} дает мощный импульс для личного бренда или экспертности, где вы сами контролируете результат.\n\nДеньги приходят к вам не через монотонное подчинение, а когда вы подключаете свою ведущую стихию — ${primaryElement}. Ближайший период благоприятен для монетизации ваших уникальных навыков и масштабирования дохода. Не бойтесь повышать планку притязаний.`;
  }

  if (qLower.includes('карм') || qLower.includes('предназнач') || qLower.includes('смысл') || qLower.includes('путь')) {
    return `Ваша кармическая задача напрямую связана с положением Асцендента в знаке ${ascSign} и Солнца в ${sunSign}. Ваша душа пришла в это воплощение, чтобы трансформировать сомнения в безусловную внутреннюю силу.\n\nУрок заключается в том, чтобы научиться слышать истинные желания вашей Луны в ${moonSign}, а не навязанные ожидания социума. Когда вы действуете в согласии со своим внутренним авторитетом, синхронистичности и нужные люди начинают появляться сами собой.`;
  }

  return `${clientName}, рассматривая вашу натальную карту с Солнцем в ${sunSign} и Асцендентом в ${ascSign}, можно увидеть, что текущие вопросы требуют баланса между разумом и интуицией.\n\nВаша сильная сторона — способность концентрировать энергию в ключевой точке. Обратите внимание на сигналы тела и не торопите события: планетарные аспекты сейчас благоволят осознанным, взвешенным решениям.`;
}
