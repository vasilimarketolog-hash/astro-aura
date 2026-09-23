import {
  Body,
  Ecliptic,
  GeoVector,
  SiderealTime,
  MakeTime,
  e_tilt
} from 'astronomy-engine';
import {
  BirthData,
  ZodiacSign,
  PlanetPosition,
  HouseCusp,
  Aspect,
  NatalChartData,
  SynastryData,
  SynastryCompatibilityScore,
  HumanDesignData,
  Locale
} from '@/types/astro';

export const ZODIAC_SIGNS: ZodiacSign[] = [
  { id: 'aries', nameRu: 'Овен', nameEn: 'Aries', nameEs: 'Aries', symbol: '♈', element: 'Огонь', quality: 'Кардинальный', ruler: 'Марс' },
  { id: 'taurus', nameRu: 'Телец', nameEn: 'Taurus', nameEs: 'Tauro', symbol: '♉', element: 'Земля', quality: 'Фиксированный', ruler: 'Венера' },
  { id: 'gemini', nameRu: 'Близнецы', nameEn: 'Gemini', nameEs: 'Géminis', symbol: '♊', element: 'Воздух', quality: 'Мутабельный', ruler: 'Меркурий' },
  { id: 'cancer', nameRu: 'Рак', nameEn: 'Cancer', nameEs: 'Cáncer', symbol: '♋', element: 'Вода', quality: 'Кардинальный', ruler: 'Луна' },
  { id: 'leo', nameRu: 'Лев', nameEn: 'Leo', nameEs: 'Leo', symbol: '♌', element: 'Огонь', quality: 'Фиксированный', ruler: 'Солнце' },
  { id: 'virgo', nameRu: 'Дева', nameEn: 'Virgo', nameEs: 'Virgo', symbol: '♍', element: 'Земля', quality: 'Мутабельный', ruler: 'Меркурий' },
  { id: 'libra', nameRu: 'Весы', nameEn: 'Libra', nameEs: 'Libra', symbol: '♎', element: 'Воздух', quality: 'Кардинальный', ruler: 'Венера' },
  { id: 'scorpio', nameRu: 'Скорпион', nameEn: 'Scorpio', nameEs: 'Escorpio', symbol: '♏', element: 'Вода', quality: 'Фиксированный', ruler: 'Плутон' },
  { id: 'sagittarius', nameRu: 'Стрелец', nameEn: 'Sagittarius', nameEs: 'Sagitario', symbol: '♐', element: 'Огонь', quality: 'Мутабельный', ruler: 'Юпитер' },
  { id: 'capricorn', nameRu: 'Козерог', nameEn: 'Capricorn', nameEs: 'Capricornio', symbol: '♑', element: 'Земля', quality: 'Кардинальный', ruler: 'Сатурн' },
  { id: 'aquarius', nameRu: 'Водолей', nameEn: 'Aquarius', nameEs: 'Acuario', symbol: '♒', element: 'Воздух', quality: 'Фиксированный', ruler: 'Уран' },
  { id: 'pisces', nameRu: 'Рыбы', nameEn: 'Pisces', nameEs: 'Piscis', symbol: '♓', element: 'Вода', quality: 'Мутабельный', ruler: 'Нептун' },
];

export function getZodiacSign(longitude: number): {
  sign: ZodiacSign;
  degreeInSign: number;
  minuteInSign: number;
} {
  const normDeg = ((longitude % 360) + 360) % 360;
  const signIndex = Math.floor(normDeg / 30);
  const remaining = normDeg - signIndex * 30;
  const degreeInSign = Math.floor(remaining);
  const minuteInSign = Math.floor((remaining - degreeInSign) * 60);

  return {
    sign: ZODIAC_SIGNS[signIndex % 12],
    degreeInSign,
    minuteInSign
  };
}

export function calculateNatalChart(birth: BirthData, locale: Locale = 'ru'): NatalChartData {
  // Convert local birth time to UTC
  const effectiveHour = birth.unknownTime ? 12 : (birth.hour ?? 12);
  const effectiveMinute = birth.unknownTime ? 0 : (birth.minute ?? 0);
  const tzOffset = typeof birth.timezoneOffset === 'number' && !isNaN(birth.timezoneOffset)
    ? birth.timezoneOffset
    : (typeof birth.longitude === 'number' ? Math.round(birth.longitude / 15) : 0);
  
  // Date in UTC
  const utcDate = new Date(Date.UTC(
    birth.year,
    birth.month - 1,
    birth.day,
    effectiveHour - tzOffset,
    effectiveMinute,
    0
  ));

  const astroTime = MakeTime(utcDate);

  // Calculate Angles (Ascendant and MC)
  const gst = SiderealTime(astroTime); // Greenwich sidereal time in hours
  const lstHours = ((gst + birth.longitude / 15) % 24 + 24) % 24;
  const ramcRad = lstHours * 15 * (Math.PI / 180);
  const epsRad = e_tilt(astroTime).mobl * (Math.PI / 180);
  const latRad = birth.latitude * (Math.PI / 180);

  // Midheaven (MC)
  let mcDeg = Math.atan2(Math.sin(ramcRad), Math.cos(ramcRad) * Math.cos(epsRad)) * (180 / Math.PI);
  mcDeg = ((mcDeg % 360) + 360) % 360;

  // Ascendant (ASC)
  const ascY = Math.cos(ramcRad);
  const ascX = -(Math.sin(ramcRad) * Math.cos(epsRad) + Math.tan(latRad) * Math.sin(epsRad));
  let ascDeg = Math.atan2(ascY, ascX) * (180 / Math.PI);
  ascDeg = ((ascDeg % 360) + 360) % 360;

  // House System Calculation
  const houseSystem = birth.houseSystem || 'placidus';
  const houses: HouseCusp[] = [];

  if (houseSystem === 'wholesign') {
    const ascSignIndex = Math.floor(ascDeg / 30);
    for (let i = 0; i < 12; i++) {
      const signIdx = (ascSignIndex + i) % 12;
      const cuspLon = signIdx * 30;
      houses.push({
        house: i + 1,
        longitude: cuspLon,
        sign: ZODIAC_SIGNS[signIdx],
        degreeInSign: 0
      });
    }
  } else if (houseSystem === 'equal') {
    for (let i = 0; i < 12; i++) {
      const cuspLon = (ascDeg + i * 30) % 360;
      const { sign, degreeInSign } = getZodiacSign(cuspLon);
      houses.push({
        house: i + 1,
        longitude: cuspLon,
        sign,
        degreeInSign
      });
    }
  } else {
    // Placidus / Porphyry Quadrant System
    const icDeg = (mcDeg + 180) % 360;
    const dscDeg = (ascDeg + 180) % 360;

    const arc10to1 = (ascDeg - mcDeg + 360) % 360;
    const h11 = (mcDeg + arc10to1 / 3) % 360;
    const h12 = (mcDeg + (2 * arc10to1) / 3) % 360;

    const arc1to4 = (icDeg - ascDeg + 360) % 360;
    const h2 = (ascDeg + arc1to4 / 3) % 360;
    const h3 = (ascDeg + (2 * arc1to4) / 3) % 360;

    const cuspsDeg = [
      ascDeg,
      h2,
      h3,
      icDeg,
      (h11 + 180) % 360,
      (h12 + 180) % 360,
      dscDeg,
      (h2 + 180) % 360,
      (h3 + 180) % 360,
      mcDeg,
      h11,
      h12
    ];

    for (let i = 0; i < 12; i++) {
      const cuspLon = ((cuspsDeg[i] % 360) + 360) % 360;
      const { sign, degreeInSign } = getZodiacSign(cuspLon);
      houses.push({
        house: i + 1,
        longitude: cuspLon,
        sign,
        degreeInSign
      });
    }
  }

  // Helper to determine house for any longitude
  function determineHouse(planetLon: number): number {
    for (let h = 0; h < 12; h++) {
      const currentCusp = houses[h].longitude;
      const nextCusp = houses[(h + 1) % 12].longitude;
      if (currentCusp < nextCusp) {
        if (planetLon >= currentCusp && planetLon < nextCusp) return h + 1;
      } else {
        if (planetLon >= currentCusp || planetLon < nextCusp) return h + 1;
      }
    }
    return 1;
  }

  // Planetary list configuration
  const planetConfig: { body: Body; id: string; nameRu: string; nameEn: string; nameEs: string; symbol: string }[] = [
    { body: Body.Sun, id: 'sun', nameRu: 'Солнце', nameEn: 'Sun', nameEs: 'Sol', symbol: '☉' },
    { body: Body.Moon, id: 'moon', nameRu: 'Луна', nameEn: 'Moon', nameEs: 'Luna', symbol: '☽' },
    { body: Body.Mercury, id: 'mercury', nameRu: 'Меркурий', nameEn: 'Mercury', nameEs: 'Mercurio', symbol: '☿' },
    { body: Body.Venus, id: 'venus', nameRu: 'Венера', nameEn: 'Venus', nameEs: 'Venus', symbol: '♀' },
    { body: Body.Mars, id: 'mars', nameRu: 'Марс', nameEn: 'Mars', nameEs: 'Marte', symbol: '♂' },
    { body: Body.Jupiter, id: 'jupiter', nameRu: 'Юпитер', nameEn: 'Jupiter', nameEs: 'Júpiter', symbol: '♃' },
    { body: Body.Saturn, id: 'saturn', nameRu: 'Сатурн', nameEn: 'Saturn', nameEs: 'Saturno', symbol: '♄' },
    { body: Body.Uranus, id: 'uranus', nameRu: 'Уран', nameEn: 'Uranus', nameEs: 'Urano', symbol: '♅' },
    { body: Body.Neptune, id: 'neptune', nameRu: 'Нептун', nameEn: 'Neptune', nameEs: 'Neptuno', symbol: '♆' },
    { body: Body.Pluto, id: 'pluto', nameRu: 'Плутон', nameEn: 'Pluto', nameEs: 'Plutón', symbol: '♇' },
  ];

  // Calculate Planets + Retrograde velocity check
  const planets: PlanetPosition[] = planetConfig.map((item) => {
    const vec = GeoVector(item.body, astroTime, false);
    const ecl = Ecliptic(vec);
    const lon = ((ecl.elon % 360) + 360) % 360;
    const { sign, degreeInSign, minuteInSign } = getZodiacSign(lon);
    const house = determineHouse(lon);

    let isRetrograde = false;
    let speed = 0;

    if (item.body !== Body.Sun && item.body !== Body.Moon) {
      const nextDate = new Date(utcDate.getTime() + 86400000);
      const nextAstroTime = MakeTime(nextDate);
      const nextVec = GeoVector(item.body, nextAstroTime, false);
      const nextEcl = Ecliptic(nextVec);
      const nextLon = ((nextEcl.elon % 360) + 360) % 360;

      let diff = nextLon - lon;
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;
      speed = diff;
      isRetrograde = speed < 0;
    }

    return {
      id: item.id,
      nameRu: item.nameRu,
      nameEn: item.nameEn,
      nameEs: item.nameEs,
      symbol: item.symbol,
      longitude: lon,
      sign,
      degreeInSign,
      minuteInSign,
      house,
      isRetrograde,
      speed: Math.round(speed * 100) / 100
    };
  });

  // Calculate Lunar Node (North Node / Rahu)
  const t = (astroTime.tt - 2451545.0) / 36525;
  const nodeLon = ((125.04452 - 1934.136261 * t) % 360 + 360) % 360;
  const nodeInfo = getZodiacSign(nodeLon);
  planets.push({
    id: 'northnode',
    nameRu: 'Северный Узел (Раху)',
    nameEn: 'North Node',
    nameEs: 'Nodo Norte (Rahu)',
    symbol: '☊',
    longitude: nodeLon,
    sign: nodeInfo.sign,
    degreeInSign: nodeInfo.degreeInSign,
    minuteInSign: nodeInfo.minuteInSign,
    house: determineHouse(nodeLon),
    isRetrograde: true
  });

  // Lilith (Black Moon)
  const lilithLon = ((40.66 + 40.69 * t) % 360 + 360) % 360;
  const lilithInfo = getZodiacSign(lilithLon);
  planets.push({
    id: 'lilith',
    nameRu: 'Черная Луна (Лилит)',
    nameEn: 'Lilith',
    nameEs: 'Luna Negra (Lilit)',
    symbol: '⚸',
    longitude: lilithLon,
    sign: lilithInfo.sign,
    degreeInSign: lilithInfo.degreeInSign,
    minuteInSign: lilithInfo.minuteInSign,
    house: determineHouse(lilithLon),
    isRetrograde: false
  });

  // Ascendant object
  const ascInfo = getZodiacSign(ascDeg);
  const ascendant: PlanetPosition = {
    id: 'ascendant',
    nameRu: 'Асцендент (ASC)',
    nameEn: 'Ascendant',
    nameEs: 'Ascendente (ASC)',
    symbol: 'Asc',
    longitude: ascDeg,
    sign: ascInfo.sign,
    degreeInSign: ascInfo.degreeInSign,
    minuteInSign: ascInfo.minuteInSign,
    house: 1,
    isRetrograde: false
  };

  // Midheaven object
  const mcInfo = getZodiacSign(mcDeg);
  const midheaven: PlanetPosition = {
    id: 'midheaven',
    nameRu: 'Середина Неба (MC)',
    nameEn: 'Midheaven',
    nameEs: 'Medio Cielo (MC)',
    symbol: 'MC',
    longitude: mcDeg,
    sign: mcInfo.sign,
    degreeInSign: mcInfo.degreeInSign,
    minuteInSign: mcInfo.minuteInSign,
    house: 10,
    isRetrograde: false
  };

  // Calculate Aspects between major planets
  const majorPlanets = planets.filter((p) =>
    ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'].includes(p.id)
  );

  const aspects: Aspect[] = [];
  const aspectDefs = [
    { type: 'conjunction' as const, angle: 0, orb: 7, isHarmonious: true, nameRu: 'Соединение', nameEn: 'Conjunction', nameEs: 'Conjunción' },
    { type: 'sextile' as const, angle: 60, orb: 5, isHarmonious: true, nameRu: 'Секстиль', nameEn: 'Sextile', nameEs: 'Sextil' },
    { type: 'square' as const, angle: 90, orb: 6, isHarmonious: false, nameRu: 'Квадратура', nameEn: 'Square', nameEs: 'Cuadratura' },
    { type: 'trine' as const, angle: 120, orb: 7, isHarmonious: true, nameRu: 'Трин', nameEn: 'Trine', nameEs: 'Trígono' },
    { type: 'opposition' as const, angle: 180, orb: 7, isHarmonious: false, nameRu: 'Оппозиция', nameEn: 'Opposition', nameEs: 'Oposición' },
  ];

  for (let i = 0; i < majorPlanets.length; i++) {
    for (let j = i + 1; j < majorPlanets.length; j++) {
      const p1 = majorPlanets[i];
      const p2 = majorPlanets[j];
      const diff = Math.abs(p1.longitude - p2.longitude);
      const angle = diff > 180 ? 360 - diff : diff;

      for (const def of aspectDefs) {
        const delta = Math.abs(angle - def.angle);
        if (delta <= def.orb) {
          aspects.push({
            planet1: p1,
            planet2: p2,
            aspectType: def.type,
            angle: def.angle,
            actualAngle: Math.round(angle * 10) / 10,
            orb: Math.round(delta * 10) / 10,
            isHarmonious: def.isHarmonious,
            nameRu: def.nameRu,
            nameEn: def.nameEn,
            nameEs: def.nameEs,
            description: `${p1.nameRu} ${def.nameRu.toLowerCase()} ${p2.nameRu}`
          });
          break;
        }
      }
    }
  }

  // Calculate Part of Fortune (Точка Фортуны / Колесо Удачи)
  const sunPos = planets.find(p => p.id === 'sun')!;
  const moonPos = planets.find(p => p.id === 'moon')!;
  const isDayChart = sunPos.house >= 7 && sunPos.house <= 12;
  const pfLon = isDayChart
    ? ((ascDeg + moonPos.longitude - sunPos.longitude + 720) % 360)
    : ((ascDeg + sunPos.longitude - moonPos.longitude + 720) % 360);

  const pfInfo = getZodiacSign(pfLon);
  const partOfFortune: PlanetPosition = {
    id: 'partoffortune',
    nameRu: 'Точка Фортуны (Колесо Удачи)',
    nameEn: 'Part of Fortune',
    nameEs: 'Punto de la Fortuna (Rueda de la Fortuna)',
    symbol: '⊗',
    longitude: pfLon,
    sign: pfInfo.sign,
    degreeInSign: pfInfo.degreeInSign,
    minuteInSign: pfInfo.minuteInSign,
    house: determineHouse(pfLon),
    isRetrograde: false
  };

  // Dignity Map for Astrodynes
  const DIGNITIES: Record<string, { domicile: string[]; exaltation: string[]; detriment: string[]; fall: string[] }> = {
    sun: { domicile: ['leo'], exaltation: ['aries'], detriment: ['aquarius'], fall: ['libra'] },
    moon: { domicile: ['cancer'], exaltation: ['taurus'], detriment: ['capricorn'], fall: ['scorpio'] },
    mercury: { domicile: ['gemini', 'virgo'], exaltation: ['virgo'], detriment: ['sagittarius', 'pisces'], fall: ['pisces'] },
    venus: { domicile: ['taurus', 'libra'], exaltation: ['pisces'], detriment: ['scorpio', 'aries'], fall: ['virgo'] },
    mars: { domicile: ['aries', 'scorpio'], exaltation: ['capricorn'], detriment: ['libra', 'taurus'], fall: ['cancer'] },
    jupiter: { domicile: ['sagittarius', 'pisces'], exaltation: ['cancer'], detriment: ['gemini', 'virgo'], fall: ['capricorn'] },
    saturn: { domicile: ['capricorn', 'aquarius'], exaltation: ['libra'], detriment: ['cancer', 'leo'], fall: ['aries'] },
    uranus: { domicile: ['aquarius'], exaltation: ['scorpio'], detriment: ['leo'], fall: ['taurus'] },
    neptune: { domicile: ['pisces'], exaltation: ['cancer'], detriment: ['virgo'], fall: ['capricorn'] },
    pluto: { domicile: ['scorpio'], exaltation: ['aries'], detriment: ['taurus'], fall: ['libra'] }
  };

  // Calculate Astrodynes for each major planet
  majorPlanets.forEach((p) => {
    const dignity = DIGNITIES[p.id] || { domicile: [], exaltation: [], detriment: [], fall: [] };
    let dignityScore = 0;
    let statusText = 'Пилигрим (Нейтральный)';

    if (dignity.domicile.includes(p.sign.id)) {
      dignityScore = 26;
      statusText = 'В обители (Максимальная сила)';
    } else if (dignity.exaltation.includes(p.sign.id)) {
      dignityScore = 20;
      statusText = 'В экзальтации (Яркое проявление)';
    } else if (dignity.detriment.includes(p.sign.id)) {
      dignityScore = -10;
      statusText = 'В изгнании (Кармический вызов)';
    } else if (dignity.fall.includes(p.sign.id)) {
      dignityScore = -8;
      statusText = 'В падении (Скрытый потенциал)';
    }

    // House power weighting
    const houseScore = [1, 4, 7, 10].includes(p.house)
      ? 24
      : [2, 5, 8, 11].includes(p.house)
      ? 15
      : 8;

    // Aspect count and harmony
    const planetAspects = aspects.filter((a) => a.planet1.id === p.id || a.planet2.id === p.id);
    const aspectPower = planetAspects.length * 6;

    let harmonyScore = 50;
    planetAspects.forEach((a) => {
      if (a.isHarmonious) harmonyScore += 10;
      else harmonyScore -= 12;
    });
    if (dignityScore > 0) harmonyScore += 8;
    if (dignityScore < 0) harmonyScore -= 8;

    const totalPower = Math.min(99, Math.max(15, 30 + dignityScore + houseScore + aspectPower));
    const totalHarmony = Math.min(99, Math.max(10, harmonyScore));

    p.astrodynes = {
      power: totalPower,
      harmony: totalHarmony,
      status: statusText
    };
  });

  // Calculate Dominant Planet (highest Astrodynes power)
  const sortedPlanets = [...majorPlanets].sort(
    (a, b) => (b.astrodynes?.power ?? 0) - (a.astrodynes?.power ?? 0)
  );
  const topPlanet = sortedPlanets[0] || majorPlanets[0];

  const dominantPlanet = {
    id: topPlanet.id,
    nameRu: topPlanet.nameRu,
    nameEn: topPlanet.nameEn,
    nameEs: topPlanet.nameEs || topPlanet.nameEn,
    symbol: topPlanet.symbol,
    powerScore: topPlanet.astrodynes?.power ?? 85,
    reasonRu: `Сильнейшая планета натальной карты (${topPlanet.astrodynes?.status}, в ${topPlanet.house} доме). Управляет вашим ключевым энергетическим ресурсом, харизмой и вектором жизненных побед.`,
    reasonEn: `Dominant planetary ruler of the natal chart (${topPlanet.astrodynes?.status}, in house ${topPlanet.house}). Dictates your personal magnetism, driving energy, and success trajectory.`,
    reasonEs: `Planeta dominante de la carta natal (${topPlanet.astrodynes?.status}, en la Casa ${topPlanet.house}). Rige tu magnetismo personal, energía vital y trayectoria de éxito.`
  };

  // Talismans Map
  const TALISMAN_MAP: Record<string, { stoneRu: string; stoneEn: string; stoneEs: string; color: string; purposeRu: string; purposeEn: string; purposeEs: string }> = {
    sun: {
      stoneRu: 'Рубин и Солнечный янтарь',
      stoneEn: 'Ruby & Solar Amber',
      stoneEs: 'Rubí y Ámbar Solar',
      color: '#E11D48',
      purposeRu: 'Активация солнечной витальности, лидерской харизмы, защита от выгорания и уверенность в себе.',
      purposeEn: 'Activates solar vitality, leadership charisma, protects against burnout, and bolsters confidence.',
      purposeEs: 'Activación de la vitalidad solar, carisma de líder, protección contra el agotamiento y autoconfianza.'
    },
    moon: {
      stoneRu: 'Лунный камень и Натуральный жемчуг',
      stoneEn: 'Moonstone & Natural Pearl',
      stoneEs: 'Piedra Luna y Perla Natural',
      color: '#E2E8F0',
      purposeRu: 'Эмоциональный баланс, глубокая интуиция, гармонизация отношений и внутренний покой.',
      purposeEn: 'Emotional equilibrium, profound intuition, harmonizes intimate bonds, and inner stillness.',
      purposeEs: 'Equilibrio emocional, intuición profunda, armonización de los vínculos íntimos y serenidad interior.'
    },
    mercury: {
      stoneRu: 'Изумруд и Зеленый агат',
      stoneEn: 'Emerald & Green Agate',
      stoneEs: 'Esmeralda y Ágata Verde',
      color: '#059669',
      purposeRu: 'Острый интеллект, красноречие в переговорах, финансовая смекалка и защита в поездках.',
      purposeEn: 'Keen analytical mind, negotiation eloquence, commercial luck, and safe journeys.',
      purposeEs: 'Intelecto agudo, elocuencia en negociaciones, astucia financiera y protección en viajes.'
    },
    venus: {
      stoneRu: 'Розовый кварц и Родонит',
      stoneEn: 'Rose Quartz & Rhodonite',
      stoneEs: 'Cuarzo Rosa y Rodonita',
      color: '#F43F5E',
      purposeRu: 'Привлечение любви, женственность/чувственность, эстетика и денежный магнетизм.',
      purposeEn: 'Attracts true love, magnetic sensuality, refined elegance, and gentle abundance.',
      purposeEs: 'Atracción del amor, sensualidad magnética, elegancia refinada y abundancia fluida.'
    },
    mars: {
      stoneRu: 'Красный гранат и Яшма',
      stoneEn: 'Red Garnet & Red Jasper',
      stoneEs: 'Granate Rojo y Jaspe',
      color: '#DC2626',
      purposeRu: 'Пробуждение решимости, физическая выносливость, защита от конкурентов и смелость в делах.',
      purposeEn: 'Ignites unwavering decisiveness, stamina, competitive edge, and bold enterprise.',
      purposeEs: 'Despertar de la determinación, resistencia física, ventaja competitiva y audacia en los negocios.'
    },
    jupiter: {
      stoneRu: 'Золотистый цитрин и Сапфир',
      stoneEn: 'Golden Citrine & Yellow Sapphire',
      stoneEs: 'Citrino Dorado y Zafiro Amarillo',
      color: '#F59E0B',
      purposeRu: 'Магнит для крупного капитала, покровительство влиятельных персон и постоянная удача.',
      purposeEn: 'Expansive wealth magnet, high-status mentorship, and continuous serendipity.',
      purposeEs: 'Imán para el gran capital, mentoría de personas influyentes y sincronía afortunada constante.'
    },
    saturn: {
      stoneRu: 'Черный оникс и Морион',
      stoneEn: 'Black Onyx & Morion',
      stoneEs: 'Ónix Negro y Morión',
      color: '#1E293B',
      purposeRu: 'Крепкая дисциплина, защита личных границ, преодоление кризисов и построение долговечных активов.',
      purposeEn: 'Steely focus, iron boundary defense, resilience under pressure, and legacy building.',
      purposeEs: 'Firme disciplina, defensa de límites personales, resiliencia en crisis y construcción de patrimonio.'
    },
    uranus: {
      stoneRu: 'Лазурит и Лабрадорит',
      stoneEn: 'Lapis Lazuli & Labradorite',
      stoneEs: 'Lapislázuli y Labradorita',
      color: '#2563EB',
      purposeRu: 'Инсайты и нестандартное мышление, свобода от шаблонов и квантовые прорывы в карьере.',
      purposeEn: 'Flashes of visionary genius, freedom from constraints, and quantum career leaps.',
      purposeEs: 'Destellos de genialidad visionaria, libertad de pensamiento y saltos cuánticos en tu profesión.'
    },
    neptune: {
      stoneRu: 'Аквамарин и Аметист',
      stoneEn: 'Aquamarine & Deep Amethyst',
      stoneEs: 'Aguamarina y Amatista Profunda',
      color: '#06B6D4',
      purposeRu: 'Творческое вдохновение, очищение ауры от тревог и духовная сонастройка с высшим Я.',
      purposeEn: 'Creative inspiration, spiritual serenity, aura cleansing, and higher guidance.',
      purposeEs: 'Inspiración creativa, serenidad espiritual, limpieza del aura y sintonía con tu Ser Superior.'
    },
    pluto: {
      stoneRu: 'Обсидиан и Черная шпинель',
      stoneEn: 'Black Obsidian & Spinel',
      stoneEs: 'Obsidiana Negra y Espinela',
      color: '#4B5563',
      purposeRu: 'Энергетическая трансформация, непробиваемый щит от сглаза и мощное влияние на окружение.',
      purposeEn: 'Metabolic transformation of hardship into personal authority and psychic invulnerability.',
      purposeEs: 'Transformación energética, escudo protector impenetrable y autoridad personal magnética.'
    }
  };

  const talismanPlanetIds = [topPlanet.id, sunPos.id, moonPos.id];
  const uniquePlanetIds = Array.from(new Set(talismanPlanetIds));
  const talismans = uniquePlanetIds.map((pId) => {
    const planetObj = majorPlanets.find((p) => p.id === pId) || topPlanet;
    const tData = TALISMAN_MAP[pId] || TALISMAN_MAP['sun'];
    return {
      stoneRu: tData.stoneRu,
      stoneEn: tData.stoneEn,
      stoneEs: tData.stoneEs,
      color: tData.color,
      planetId: pId,
      planetNameRu: planetObj.nameRu,
      planetNameEn: planetObj.nameEn,
      planetNameEs: planetObj.nameEs || planetObj.nameEn,
      purposeRu: tData.purposeRu,
      purposeEn: tData.purposeEn,
      purposeEs: tData.purposeEs
    };
  });

  // Dominant Elements count
  let fire = 0, earth = 0, air = 0, water = 0;
  for (const p of majorPlanets) {
    const weight = p.id === 'sun' || p.id === 'moon' ? 2 : 1;
    switch (p.sign.element) {
      case 'Огонь': fire += weight; break;
      case 'Земля': earth += weight; break;
      case 'Воздух': air += weight; break;
      case 'Вода': water += weight; break;
    }
  }
  const totalWeight = fire + earth + air + water || 1;
  const dominantElement = {
    fire: Math.round((fire / totalWeight) * 100),
    earth: Math.round((earth / totalWeight) * 100),
    air: Math.round((air / totalWeight) * 100),
    water: Math.round((water / totalWeight) * 100),
    primaryRu:
      fire >= earth && fire >= air && fire >= water ? 'Огонь (Энергия и Страсть)' :
      earth >= fire && earth >= air && earth >= water ? 'Земля (Практичность и Стабильность)' :
      air >= fire && air >= earth && air >= water ? 'Воздух (Интеллект и Общение)' :
      'Вода (Интуиция и Эмоции)',
    primaryEn:
      fire >= earth && fire >= air && fire >= water ? 'Fire (Energy & Passion)' :
      earth >= fire && earth >= air && earth >= water ? 'Earth (Practicality & Stability)' :
      air >= fire && air >= earth && air >= water ? 'Air (Intellect & Communication)' :
      'Water (Intuition & Emotion)',
    primaryEs:
      fire >= earth && fire >= air && fire >= water ? 'Fuego (Energía y Pasión)' :
      earth >= fire && earth >= air && earth >= water ? 'Tierra (Practicidad y Estabilidad)' :
      air >= fire && air >= earth && air >= water ? 'Aire (Intelecto y Comunicación)' :
      'Agua (Intuición y Emoción)',
    primary:
      fire >= earth && fire >= air && fire >= water ? 'Огонь (Энергия и Страсть)' :
      earth >= fire && earth >= air && earth >= water ? 'Земля (Практичность и Стабильность)' :
      air >= fire && air >= earth && air >= water ? 'Воздух (Интеллект и Общение)' :
      'Вода (Интуиция и Эмоции)'
  };

  return {
    birthData: birth,
    planets,
    houses,
    aspects,
    ascendant,
    midheaven,
    partOfFortune,
    dominantPlanet,
    talismans,
    dominantElement
  };
}

// Synastry Compatibility Calculator
export function calculateSynastry(
  chart1: NatalChartData,
  chart2: NatalChartData,
  locale: Locale = 'ru'
): SynastryData {
  let romancePoints = 50;
  let emotionalPoints = 50;
  let intellectualPoints = 50;
  let longTermPoints = 50;
  let conflictRisk = 20;

  const isEs = locale === 'es';
  const isEn = locale === 'en';

  const synastryAspects: SynastryData['synastryAspects'] = [];

  const p1Sun = chart1.planets.find(p => p.id === 'sun')!;
  const p1Moon = chart1.planets.find(p => p.id === 'moon')!;
  const p1Venus = chart1.planets.find(p => p.id === 'venus')!;
  const p1Mars = chart1.planets.find(p => p.id === 'mars')!;

  const p2Sun = chart2.planets.find(p => p.id === 'sun')!;
  const p2Moon = chart2.planets.find(p => p.id === 'moon')!;
  const p2Venus = chart2.planets.find(p => p.id === 'venus')!;
  const p2Mars = chart2.planets.find(p => p.id === 'mars')!;

  const sunName = isEs ? 'Sol' : isEn ? 'Sun' : 'Солнце';
  const moonName = isEs ? 'Luna' : isEn ? 'Moon' : 'Луна';
  const venusName = isEs ? 'Venus' : isEn ? 'Venus' : 'Венера';
  const marsName = isEs ? 'Marte' : isEn ? 'Mars' : 'Марс';

  // Check Sun-Moon synergy
  const sunMoonDiff = Math.abs(p1Sun.longitude - p2Moon.longitude);
  const smAngle = sunMoonDiff > 180 ? 360 - sunMoonDiff : sunMoonDiff;
  if (smAngle < 10 || Math.abs(smAngle - 120) < 8 || Math.abs(smAngle - 60) < 6) {
    emotionalPoints += 25;
    longTermPoints += 20;
    synastryAspects.push({
      planet1Name: `${chart1.birthData.name} (${sunName})`,
      planet2Name: `${chart2.birthData.name} (${moonName})`,
      aspectName: isEs ? 'Aspecto Armonioso del Alma' : isEn ? 'Harmonious Soul Aspect' : 'Гармоничный аспект Души',
      meaning: isEs
        ? 'Profunda sintonía subconsciente, sensación de almas gemelas (conexión Soulmate).'
        : isEn
        ? 'Deep subconscious resonance, undeniable soulmate connection.'
        : 'Глубокое подсознательное взаимопонимание, ощущение родственной души (Soulmate connection).',
      isHarmonious: true
    });
  }

  // Check Venus-Mars synergy (Passion)
  const vmDiff = Math.abs(p1Venus.longitude - p2Mars.longitude);
  const vmAngle = vmDiff > 180 ? 360 - vmDiff : vmDiff;
  if (vmAngle < 10 || Math.abs(vmAngle - 120) < 8 || Math.abs(vmAngle - 60) < 6) {
    romancePoints += 30;
    synastryAspects.push({
      planet1Name: `${chart1.birthData.name} (${venusName})`,
      planet2Name: `${chart2.birthData.name} (${marsName})`,
      aspectName: isEs ? 'Aspecto de Magnetismo y Pasión' : isEn ? 'Magnetism & Passion Aspect' : 'Аспект Магнетизма и Страсти',
      meaning: isEs
        ? 'Atracción física y química instantánea a primera vista.'
        : isEn
        ? 'Intense reciprocal physical magnetism and chemistry at first sight.'
        : 'Мощное взаимное физическое и сексуальное притяжение с первого взгляда.',
      isHarmonious: true
    });
  } else if (Math.abs(vmAngle - 90) < 6 || Math.abs(vmAngle - 180) < 8) {
    romancePoints += 20;
    conflictRisk += 25;
    synastryAspects.push({
      planet1Name: `${chart1.birthData.name} (${venusName})`,
      planet2Name: `${chart2.birthData.name} (${marsName})`,
      aspectName: isEs ? 'Aspecto Tenso de Pasión' : isEn ? 'Friction Passion Aspect' : 'Напряженный аспект Страсти',
      meaning: isEs
        ? 'Chispas intensas y celos: reconciliaciones apasionadas alternadas con lucha por el liderazgo.'
        : isEn
        ? 'Fierce sparks and jealousy: passionate reconciliations cycling with struggles for dominance.'
        : 'Яркая искра и ревность: страстные примирения сменяются периодами борьбы за лидерство.',
      isHarmonious: false
    });
  }

  // Element Compatibility
  if (chart1.ascendant.sign.element === chart2.ascendant.sign.element) {
    longTermPoints += 15;
    emotionalPoints += 10;
  }

  // Cap scores
  const love = Math.min(99, Math.max(35, romancePoints));
  const emotion = Math.min(99, Math.max(40, emotionalPoints));
  const intellect = Math.min(99, Math.max(45, intellectualPoints + 15));
  const longTerm = Math.min(99, Math.max(38, longTermPoints));
  const conflict = Math.min(85, Math.max(15, conflictRisk));
  const totalScore = Math.round((love * 0.3 + emotion * 0.25 + intellect * 0.2 + longTerm * 0.25) * (1 - conflict * 0.002));

  let verdict = '';
  if (isEs) {
    if (totalScore >= 85) verdict = 'Compatibilidad excepcional: unión de almas gemelas con inmenso potencial de felicidad.';
    else if (totalScore >= 70) verdict = 'Unión armoniosa: fuerte atracción y complementariedad mutua en metas y convivencia.';
    else if (totalScore >= 55) verdict = 'Relación con áreas de crecimiento: atracción magnética que requiere diálogo y madurez.';
    else verdict = 'Desafío kármico: relación transformadora para aprender a comprenderse profundamente.';
  } else if (isEn) {
    if (totalScore >= 85) verdict = 'Exceptional compatibility: soulmate bond with extraordinary fulfillment potential.';
    else if (totalScore >= 70) verdict = 'Harmonious union: vibrant attraction and mutual synergy in daily life.';
    else if (totalScore >= 55) verdict = 'Partnership with growth edges: magnetic attraction requiring conscious communication.';
    else verdict = 'Karmic challenge: transformative bond teaching profound self-mastery.';
  } else {
    if (totalScore >= 85) verdict = 'Исключительная совместимость: союз родственных душ с огромным потенциалом счастья.';
    else if (totalScore >= 70) verdict = 'Гармоничный союз: яркое влечение и взаимное дополнение в быту и целях.';
    else if (totalScore >= 55) verdict = 'Партнерство с зонами роста: сильное притяжение требует осознанности и диалога.';
    else verdict = 'Кармический вызов: отношения-трансформация, которые научат глубокому пониманию себя.';
  }

  const strengths = isEs
    ? [
        'Inspiración mutua y desarrollo del potencial oculto',
        'Lectura intuitiva del estado de ánimo de la pareja sin palabras',
        'Rápida reconciliación y calidez tras los malentendidos'
      ]
    : isEn
    ? [
        'Mutual inspiration unlocking latent creative potentials',
        'Intuitive non-verbal resonance with partner moods',
        'Rapid restoration of intimacy and warmth after conflict'
      ]
    : [
        'Взаимное вдохновение и раскрытие скрытого потенциала',
        'Интуитивное считывание настроения партнера без лишних слов',
        'Быстрое восстановление тепла после недопониманий'
      ];

  const challenges = isEs
    ? [
        'Diferencias en el ritmo de decisiones financieras clave',
        'Necesidad de espacio personal sin culpa'
      ]
    : isEn
    ? [
        'Discrepancies in the pacing of major financial commitments',
        'Honoring individual personal space without guilt'
      ]
    : [
        'Разница в темпе принятия ключевых финансовых решений',
        'Необходимость личного пространства без чувства вины'
      ];

  const compatibility: SynastryCompatibilityScore = {
    totalScore,
    loveAndPassion: love,
    emotionalHarmony: emotion,
    intellectualMatch: intellect,
    longTermPotential: longTerm,
    conflictRisk: conflict,
    verdict,
    strengths,
    challenges
  };

  return {
    person1: chart1,
    person2: chart2,
    compatibility,
    synastryAspects
  };
}

// Human Design Calculator
export function calculateHumanDesign(birth: BirthData, locale: Locale = 'ru'): HumanDesignData {
  const isEs = locale === 'es';
  const isEn = locale === 'en';

  const seed = (birth.day * 13 + birth.month * 7 + birth.year + birth.hour) % 100;

  let type = '';
  let strategy = '';
  let innerAuthority = '';
  let notSelfTheme = '';
  let definition = isEs ? 'Definición Simple' : isEn ? 'Single Definition' : 'Одинарная определенность';
  let definedCenters: string[] = [];
  let openCenters: string[] = [];

  if (seed < 37) {
    type = isEs ? 'Generador' : isEn ? 'Generator' : 'Генератор';
    strategy = isEs ? 'Responder a la vida y no iniciar desde la mente' : isEn ? 'To respond to life rather than initiating from the mind' : 'Откликаться на жизнь и не инициировать из ума';
    innerAuthority = isEs ? 'Autoridad Sacral (sonidos viscerales)' : isEn ? 'Sacral Authority (gut response)' : 'Сакральный авторитет (звуки угу / не-а)';
    notSelfTheme = isEs ? 'Frustración y estancamiento' : isEn ? 'Frustration & dissatisfaction' : 'Фрустрация и неудовлетворенность';
    definedCenters = isEs ? ['Centro Sacral', 'Centro Raíz', 'Centro del Bazo'] : isEn ? ['Sacral Center', 'Root Center', 'Spleen Center'] : ['Сакральный Центр', 'Корневой Центр', 'Центр Селезенки'];
    openCenters = isEs ? ['Centro Corona', 'Ajna', 'Centro Garganta', 'Plexo Solar', 'Centro G', 'Centro Ego/Corazón'] : isEn ? ['Head Center', 'Ajna', 'Throat Center', 'Solar Plexus', 'G-Center', 'Heart/Ego Center'] : ['Теменной Центр', 'Аджна', 'Горловой Центр', 'Центр Солнечного Сплетения', 'G-Центр', 'Эго/Сердечный Центр'];
  } else if (seed < 70) {
    type = isEs ? 'Generador Manifestante' : isEn ? 'Manifesting Generator' : 'Манифестирующий Генератор';
    strategy = isEs ? 'Responder, informar antes de actuar y probar el camino' : isEn ? 'To respond, inform before acting, and calibrate trajectory' : 'Откликаться, информировать перед действием и тестировать путь';
    innerAuthority = isEs ? 'Autoridad Emocional (claridad tras la ola)' : isEn ? 'Emotional Authority (clarity over time)' : 'Эмоциональный авторитет (ясность после сна)';
    notSelfTheme = isEs ? 'Ira y frustración impaciente' : isEn ? 'Anger & impatient frustration' : 'Гнев и нетерпеливая фрустрация';
    definedCenters = isEs ? ['Centro Sacral', 'Centro Garganta', 'Centro G'] : isEn ? ['Sacral Center', 'Throat Center', 'G-Center'] : ['Сакральный Центр', 'Горловой Центр', 'G-Центр'];
    openCenters = isEs ? ['Centro Corona', 'Ajna', 'Centro Corazón', 'Bazo', 'Raíz'] : isEn ? ['Head Center', 'Ajna', 'Heart Center', 'Spleen', 'Root'] : ['Теменной Центр', 'Аджна', 'Сердечный Центр', 'Селезенка', 'Корень'];
  } else if (seed < 90) {
    type = isEs ? 'Proyector' : isEn ? 'Projector' : 'Проектор';
    strategy = isEs ? 'Esperar el reconocimiento genuino y la invitación' : isEn ? 'Wait for genuine recognition and formal invitation' : 'Ждать искреннего признания и приглашения';
    innerAuthority = isEs ? 'Autoridad del Bazo (intuición espontánea)' : isEn ? 'Splenic Authority (instantaneous body intuition)' : 'Авторитет Селезенки (мгновенная интуиция безопасности)';
    notSelfTheme = isEs ? 'Amargura y falta de reconocimiento' : isEn ? 'Bitterness & feeling unrecognized' : 'Горечь и непризнанность';
    definedCenters = isEs ? ['Ajna', 'Centro Corona', 'Centro G'] : isEn ? ['Ajna', 'Head Center', 'G-Center'] : ['Аджна', 'Теменной Центр', 'G-Центр'];
    openCenters = isEs ? ['Centro Sacral', 'Centro Garganta', 'Centro Ego', 'Centro Raíz', 'Plexo Solar'] : isEn ? ['Sacral Center', 'Throat Center', 'Ego Center', 'Root Center', 'Solar Plexus'] : ['Сакральный Центр', 'Горловой Центр', 'Эго Центр', 'Корневой Центр', 'Центр Солнечного Сплетения'];
  } else if (seed < 98) {
    type = isEs ? 'Manifestador' : isEn ? 'Manifestor' : 'Манифестор';
    strategy = isEs ? 'Informar a los demás antes de iniciar' : isEn ? 'To inform those impacted before initiating action' : 'Информировать близких до начала действия';
    innerAuthority = isEs ? 'Ola Emocional (no hay verdad en el momento)' : isEn ? 'Emotional Wave (no absolute truth in the moment)' : 'Эмоциональная волна (нет истины в моменте)';
    notSelfTheme = isEs ? 'Ira y resistencia del entorno' : isEn ? 'Anger & external resistance' : 'Гнев и сопротивление окружающих';
    definedCenters = isEs ? ['Centro Garganta', 'Plexo Solar', 'Ego/Corazón'] : isEn ? ['Throat Center', 'Solar Plexus', 'Ego/Heart'] : ['Горловой Центр', 'Центр Солнечного Сплетения', 'Эго/Сердце'];
    openCenters = isEs ? ['Centro Sacral', 'Ajna', 'Centro Corona', 'Bazo', 'Raíz'] : isEn ? ['Sacral Center', 'Ajna', 'Head Center', 'Spleen', 'Root'] : ['Сакральный Центр', 'Аджна', 'Теменной Центр', 'Селезенка', 'Корень'];
  } else {
    type = isEs ? 'Reflector' : isEn ? 'Reflector' : 'Рефлектор';
    strategy = isEs ? 'Esperar un ciclo lunar completo de 28 días' : isEn ? 'Wait a full 28-day lunar cycle for major decisions' : 'Ждать полный 28-дневный лунный цикл для ключевых решений';
    innerAuthority = isEs ? 'Autoridad Lunar (ciclo lunar)' : isEn ? 'Lunar Authority (lunar cycle progression)' : 'Лунный авторитет (лунный цикл)';
    notSelfTheme = isEs ? 'Desilusión con el mundo' : isEn ? 'Disappointment & disillusionment' : 'Разочарование в людях';
    definition = isEs ? 'Sin definición fija (espejo del entorno)' : isEn ? 'No consistent definition (sampling mirror)' : 'Нет постоянной определенности (зеркало мира)';
    definedCenters = [];
    openCenters = isEs ? ['Corona', 'Ajna', 'Garganta', 'Centro G', 'Ego', 'Sacral', 'Bazo', 'Plexo Solar', 'Raíz'] : isEn ? ['Head', 'Ajna', 'Throat', 'G-Center', 'Ego', 'Sacral', 'Spleen', 'Solar Plexus', 'Root'] : ['Теменной', 'Аджна', 'Горло', 'G-центр', 'Эго', 'Сакрал', 'Селезенка', 'Солнечное сплетение', 'Корень'];
  }

  const profilesEs = ['1/3 Investigador - Mártir', '2/4 Ermitaño - Oportunista', '3/5 Mártir - Hereje', '4/6 Oportunista - Modelo de rol', '5/1 Hereje - Investigador', '6/2 Modelo de rol - Ermitaño'];
  const profilesEn = ['1/3 Investigator - Martyr', '2/4 Hermit - Opportunist', '3/5 Martyr - Heretic', '4/6 Opportunist - Role Model', '5/1 Heretic - Investigator', '6/2 Role Model - Hermit'];
  const profilesRu = ['1/3 Исследователь - Мученик', '2/4 Отшельник - Оппортунист', '3/5 Мученик - Еретик', '4/6 Оппортунист - Ролевая модель', '5/1 Еретик - Исследователь', '6/2 Ролевая модель - Отшельник'];
  const profiles = isEs ? profilesEs : isEn ? profilesEn : profilesRu;
  const profile = profiles[seed % profiles.length];

  const keyStrengths = isEs
    ? [
        'Capacidad innata para atraer a las personas adecuadas a tu círculo',
        'Inmenso caudal de energía personal al dedicarte a lo que amas',
        'Detección intuitiva de falsedades e intenciones ocultas'
      ]
    : isEn
    ? [
        'Innate magnetic ability to attract aligned allies into your circle',
        'Vast reserve of personal vitality when devoted to resonant work',
        'Intuitive discernment of pretense and hidden motives'
      ]
    : [
        'Врожденная способность притягивать нужных людей в свой круг',
        'Огромный потенциал личной энергии при занятии любимым делом',
        'Интуитивное распознавание фальши и скрытых мотивов собеседника'
      ];

  const growthZone = isEs
    ? 'Aprender a decir un «no» firme sin culpa y confiar en las señales de tu cuerpo por encima de las dudas lógicas de la mente.'
    : isEn
    ? 'Learning to deliver a calm, unapologetic "no" and trusting somatic intelligence over mental over-rationalization.'
    : 'Научиться говорить твердое «нет» без чувства вины и доверять сигналам тела, а не логическим сомнениям ума.';

  return {
    type,
    profile,
    strategy,
    innerAuthority,
    notSelfTheme,
    definition,
    definedCenters,
    openCenters,
    keyStrengths,
    growthZone
  };
}
