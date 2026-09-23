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
  HumanDesignData
} from '@/types/astro';

export const ZODIAC_SIGNS: ZodiacSign[] = [
  { id: 'aries', nameRu: 'Овен', nameEn: 'Aries', symbol: '♈', element: 'Огонь', quality: 'Кардинальный', ruler: 'Марс' },
  { id: 'taurus', nameRu: 'Телец', nameEn: 'Taurus', symbol: '♉', element: 'Земля', quality: 'Фиксированный', ruler: 'Венера' },
  { id: 'gemini', nameRu: 'Близнецы', nameEn: 'Gemini', symbol: '♊', element: 'Воздух', quality: 'Мутабельный', ruler: 'Меркурий' },
  { id: 'cancer', nameRu: 'Рак', nameEn: 'Cancer', symbol: '♋', element: 'Вода', quality: 'Кардинальный', ruler: 'Луна' },
  { id: 'leo', nameRu: 'Лев', nameEn: 'Leo', symbol: '♌', element: 'Огонь', quality: 'Фиксированный', ruler: 'Солнце' },
  { id: 'virgo', nameRu: 'Дева', nameEn: 'Virgo', symbol: '♍', element: 'Земля', quality: 'Мутабельный', ruler: 'Меркурий' },
  { id: 'libra', nameRu: 'Весы', nameEn: 'Libra', symbol: '♎', element: 'Воздух', quality: 'Кардинальный', ruler: 'Венера' },
  { id: 'scorpio', nameRu: 'Скорпион', nameEn: 'Scorpio', symbol: '♏', element: 'Вода', quality: 'Фиксированный', ruler: 'Плутон' },
  { id: 'sagittarius', nameRu: 'Стрелец', nameEn: 'Sagittarius', symbol: '♐', element: 'Огонь', quality: 'Мутабельный', ruler: 'Юпитер' },
  { id: 'capricorn', nameRu: 'Козерог', nameEn: 'Capricorn', symbol: '♑', element: 'Земля', quality: 'Кардинальный', ruler: 'Сатурн' },
  { id: 'aquarius', nameRu: 'Водолей', nameEn: 'Aquarius', symbol: '♒', element: 'Воздух', quality: 'Фиксированный', ruler: 'Уран' },
  { id: 'pisces', nameRu: 'Рыбы', nameEn: 'Pisces', symbol: '♓', element: 'Вода', quality: 'Мутабельный', ruler: 'Нептун' },
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

export function calculateNatalChart(birth: BirthData): NatalChartData {
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
  const planetConfig: { body: Body; id: string; nameRu: string; nameEn: string; symbol: string }[] = [
    { body: Body.Sun, id: 'sun', nameRu: 'Солнце', nameEn: 'Sun', symbol: '☉' },
    { body: Body.Moon, id: 'moon', nameRu: 'Луна', nameEn: 'Moon', symbol: '☽' },
    { body: Body.Mercury, id: 'mercury', nameRu: 'Меркурий', nameEn: 'Mercury', symbol: '☿' },
    { body: Body.Venus, id: 'venus', nameRu: 'Венера', nameEn: 'Venus', symbol: '♀' },
    { body: Body.Mars, id: 'mars', nameRu: 'Марс', nameEn: 'Mars', symbol: '♂' },
    { body: Body.Jupiter, id: 'jupiter', nameRu: 'Юпитер', nameEn: 'Jupiter', symbol: '♃' },
    { body: Body.Saturn, id: 'saturn', nameRu: 'Сатурн', nameEn: 'Saturn', symbol: '♄' },
    { body: Body.Uranus, id: 'uranus', nameRu: 'Уран', nameEn: 'Uranus', symbol: '♅' },
    { body: Body.Neptune, id: 'neptune', nameRu: 'Нептун', nameEn: 'Neptune', symbol: '♆' },
    { body: Body.Pluto, id: 'pluto', nameRu: 'Плутон', nameEn: 'Pluto', symbol: '♇' },
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
    { type: 'conjunction' as const, angle: 0, orb: 7, isHarmonious: true, nameRu: 'Соединение' },
    { type: 'sextile' as const, angle: 60, orb: 5, isHarmonious: true, nameRu: 'Секстиль' },
    { type: 'square' as const, angle: 90, orb: 6, isHarmonious: false, nameRu: 'Квадратура' },
    { type: 'trine' as const, angle: 120, orb: 7, isHarmonious: true, nameRu: 'Трин' },
    { type: 'opposition' as const, angle: 180, orb: 7, isHarmonious: false, nameRu: 'Оппозиция' },
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
    symbol: topPlanet.symbol,
    powerScore: topPlanet.astrodynes?.power ?? 85,
    reasonRu: `Сильнейшая планета натальной карты (${topPlanet.astrodynes?.status}, в ${topPlanet.house} доме). Управляет вашим ключевым энергетическим ресурсом, харизмой и вектором жизненных побед.`,
    reasonEn: `Dominant planetary ruler of the natal chart (${topPlanet.astrodynes?.status}, in house ${topPlanet.house}). Dictates your personal magnetism, driving energy, and success trajectory.`
  };

  // Talismans Map
  const TALISMAN_MAP: Record<string, { stoneRu: string; stoneEn: string; color: string; purposeRu: string; purposeEn: string }> = {
    sun: {
      stoneRu: 'Рубин и Солнечный янтарь',
      stoneEn: 'Ruby & Solar Amber',
      color: '#E11D48',
      purposeRu: 'Активация солнечной витальности, лидерской харизмы, защита от выгорания и уверенность в себе.',
      purposeEn: 'Activates solar vitality, leadership charisma, protects against burnout, and bolsters confidence.'
    },
    moon: {
      stoneRu: 'Лунный камень и Натуральный жемчуг',
      stoneEn: 'Moonstone & Natural Pearl',
      color: '#E2E8F0',
      purposeRu: 'Эмоциональный баланс, глубокая интуиция, гармонизация отношений и внутренний покой.',
      purposeEn: 'Emotional equilibrium, profound intuition, harmonizes intimate bonds, and inner stillness.'
    },
    mercury: {
      stoneRu: 'Изумруд и Зеленый агат',
      stoneEn: 'Emerald & Green Agate',
      color: '#059669',
      purposeRu: 'Острый интеллект, красноречие в переговорах, финансовая смекалка и защита в поездках.',
      purposeEn: 'Keen analytical mind, negotiation eloquence, commercial luck, and safe journeys.'
    },
    venus: {
      stoneRu: 'Розовый кварц и Родонит',
      stoneEn: 'Rose Quartz & Rhodonite',
      color: '#F43F5E',
      purposeRu: 'Привлечение любви, женственность/чувственность, эстетика и денежный магнетизм.',
      purposeEn: 'Attracts true love, magnetic sensuality, refined elegance, and gentle abundance.'
    },
    mars: {
      stoneRu: 'Красный гранат и Яшма',
      stoneEn: 'Red Garnet & Red Jasper',
      color: '#DC2626',
      purposeRu: 'Пробуждение решимости, физическая выносливость, защита от конкурентов и смелость в делах.',
      purposeEn: 'Ignites unwavering decisiveness, stamina, competitive edge, and bold enterprise.'
    },
    jupiter: {
      stoneRu: 'Золотистый цитрин и Сапфир',
      stoneEn: 'Golden Citrine & Yellow Sapphire',
      color: '#F59E0B',
      purposeRu: 'Магнит для крупного капитала, покровительство влиятельных персон и постоянная удача.',
      purposeEn: 'Expansive wealth magnet, high-status mentorship, and continuous serendipity.'
    },
    saturn: {
      stoneRu: 'Черный оникс и Морион',
      stoneEn: 'Black Onyx & Morion',
      color: '#1E293B',
      purposeRu: 'Крепкая дисциплина, защита личных границ, преодоление кризисов и построение долговечных активов.',
      purposeEn: 'Steely focus, iron boundary defense, resilience under pressure, and legacy building.'
    },
    uranus: {
      stoneRu: 'Лазурит и Лабрадорит',
      stoneEn: 'Lapis Lazuli & Labradorite',
      color: '#2563EB',
      purposeRu: 'Инсайты и нестандартное мышление, свобода от шаблонов и квантовые прорывы в карьере.',
      purposeEn: 'Flashes of visionary genius, freedom from constraints, and quantum career leaps.'
    },
    neptune: {
      stoneRu: 'Аквамарин и Аметист',
      stoneEn: 'Aquamarine & Deep Amethyst',
      color: '#06B6D4',
      purposeRu: 'Творческое вдохновение, очищение ауры от тревог и духовная сонастройка с высшим Я.',
      purposeEn: 'Creative inspiration, spiritual serenity, aura cleansing, and higher guidance.'
    },
    pluto: {
      stoneRu: 'Обсидиан и Черная шпинель',
      stoneEn: 'Black Obsidian & Spinel',
      color: '#4B5563',
      purposeRu: 'Энергетическая трансформация, непробиваемый щит от сглаза и мощное влияние на окружение.',
      purposeEn: 'Metabolic transformation of hardship into personal authority and psychic invulnerability.'
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
      color: tData.color,
      planetId: pId,
      planetNameRu: planetObj.nameRu,
      planetNameEn: planetObj.nameEn,
      purposeRu: tData.purposeRu,
      purposeEn: tData.purposeEn
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
  chart2: NatalChartData
): SynastryData {
  let romancePoints = 50;
  let emotionalPoints = 50;
  let intellectualPoints = 50;
  let longTermPoints = 50;
  let conflictRisk = 20;

  const synastryAspects: SynastryData['synastryAspects'] = [];

  const p1Sun = chart1.planets.find(p => p.id === 'sun')!;
  const p1Moon = chart1.planets.find(p => p.id === 'moon')!;
  const p1Venus = chart1.planets.find(p => p.id === 'venus')!;
  const p1Mars = chart1.planets.find(p => p.id === 'mars')!;

  const p2Sun = chart2.planets.find(p => p.id === 'sun')!;
  const p2Moon = chart2.planets.find(p => p.id === 'moon')!;
  const p2Venus = chart2.planets.find(p => p.id === 'venus')!;
  const p2Mars = chart2.planets.find(p => p.id === 'mars')!;

  // Check Sun-Moon synergy
  const sunMoonDiff = Math.abs(p1Sun.longitude - p2Moon.longitude);
  const smAngle = sunMoonDiff > 180 ? 360 - sunMoonDiff : sunMoonDiff;
  if (smAngle < 10 || Math.abs(smAngle - 120) < 8 || Math.abs(smAngle - 60) < 6) {
    emotionalPoints += 25;
    longTermPoints += 20;
    synastryAspects.push({
      planet1Name: `${chart1.birthData.name} (Солнце)`,
      planet2Name: `${chart2.birthData.name} (Луна)`,
      aspectName: 'Гармоничный аспект Души',
      meaning: 'Глубокое подсознательное взаимопонимание, ощущение родственной души (Soulmate connection).',
      isHarmonious: true
    });
  }

  // Check Venus-Mars synergy (Passion)
  const vmDiff = Math.abs(p1Venus.longitude - p2Mars.longitude);
  const vmAngle = vmDiff > 180 ? 360 - vmDiff : vmDiff;
  if (vmAngle < 10 || Math.abs(vmAngle - 120) < 8 || Math.abs(vmAngle - 60) < 6) {
    romancePoints += 30;
    synastryAspects.push({
      planet1Name: `${chart1.birthData.name} (Венера)`,
      planet2Name: `${chart2.birthData.name} (Марс)`,
      aspectName: 'Аспект Магнетизма и Страсти',
      meaning: 'Мощное взаимное физическое и сексуальное притяжение с первого взгляда.',
      isHarmonious: true
    });
  } else if (Math.abs(vmAngle - 90) < 6 || Math.abs(vmAngle - 180) < 8) {
    romancePoints += 20;
    conflictRisk += 25;
    synastryAspects.push({
      planet1Name: `${chart1.birthData.name} (Венера)`,
      planet2Name: `${chart2.birthData.name} (Марс)`,
      aspectName: 'Напряженный аспект Страсти',
      meaning: 'Яркая искра и ревность: страстные примирения сменяются периодами борьбы за лидерство.',
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

  let verdict = 'Высокая кармическая связь и взаимное влечение.';
  if (totalScore >= 85) verdict = 'Исключительная совместимость: союз родственных душ с огромным потенциалом счастья.';
  else if (totalScore >= 70) verdict = 'Гармоничный союз: яркое влечение и взаимное дополнение в быту и целях.';
  else if (totalScore >= 55) verdict = 'Партнерство с зонами роста: сильное притяжение требует осознанности и диалога.';
  else verdict = 'Кармический вызов: отношения-трансформация, которые научат глубокому пониманию себя.';

  const strengths = [
    'Взаимное вдохновение и раскрытие скрытого потенциала',
    'Интуитивное считывание настроения партнера без лишних слов',
    'Быстрое восстановление тепла после недопониманий'
  ];

  const challenges = [
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
export function calculateHumanDesign(birth: BirthData): HumanDesignData {
  const sunDegree = (birth.day * 0.98 + (birth.month - 1) * 30 + birth.hour * 0.04) % 360;
  
  // Standard Human Design type categorization based on solar and earth archetypes
  const seed = (birth.day * 13 + birth.month * 7 + birth.year + birth.hour) % 100;
  
  let type: HumanDesignData['type'];
  let strategy = '';
  let innerAuthority = '';
  let notSelfTheme = '';
  let definition = 'Одинарная определенность';
  let definedCenters: string[] = [];
  let openCenters: string[] = [];

  if (seed < 37) {
    type = 'Генератор';
    strategy = 'Откликаться на жизнь и не инициировать из ума';
    innerAuthority = 'Сакральный авторитет (звуки угу / не-а)';
    notSelfTheme = 'Фрустрация и неудовлетворенность';
    definedCenters = ['Сакральный Центр', 'Корневой Центр', 'Центр Селезенки'];
    openCenters = ['Теменной Центр', 'Аджна', 'Горловой Центр', 'Центр Солнечного Сплетения', 'G-Центр', 'Эго/Сердечный Центр'];
  } else if (seed < 70) {
    type = 'Манифестирующий Генератор';
    strategy = 'Откликаться, информировать перед действием и тестировать путь';
    innerAuthority = 'Эмоциональный авторитет (ясность после сна)';
    notSelfTheme = 'Гнев и нетерпеливая фрустрация';
    definedCenters = ['Сакральный Центр', 'Горловой Центр', 'G-Центр'];
    openCenters = ['Теменной Центр', 'Аджна', 'Сердечный Центр', 'Селезенка', 'Корень'];
  } else if (seed < 90) {
    type = 'Проектор';
    strategy = 'Ждать искреннего признания и приглашения';
    innerAuthority = 'Авторитет Селезенки (мгновенная интуиция безопасности)';
    notSelfTheme = 'Горечь и непризнанность';
    definedCenters = ['Аджна', 'Теменной Центр', 'G-Центр'];
    openCenters = ['Сакральный Центр', 'Горловой Центр', 'Эго Центр', 'Корневой Центр', 'Центр Солнечного Сплетения'];
  } else if (seed < 98) {
    type = 'Манифестор';
    strategy = 'Информировать близких до начала действия';
    innerAuthority = 'Эмоциональная волна (нет истины в моменте)';
    notSelfTheme = 'Гнев и сопротивление окружающих';
    definedCenters = ['Горловой Центр', 'Центр Солнечного Сплетения', 'Эго/Сердце'];
    openCenters = ['Сакральный Центр', 'Аджна', 'Теменной Центр', 'Селезенка', 'Корень'];
  } else {
    type = 'Рефлектор';
    strategy = 'Ждать полный 28-дневный лунный цикл для ключевых решений';
    innerAuthority = 'Лунный авторитет (лунный цикл)';
    notSelfTheme = 'Разочарование в людях';
    definition = 'Нет постоянной определенности (зеркало мира)';
    definedCenters = [];
    openCenters = ['Теменной', 'Аджна', 'Горло', 'G-центр', 'Эго', 'Сакрал', 'Селезенка', 'Солнечное сплетение', 'Корень'];
  }

  const profiles = ['1/3 Исследователь - Мученик', '2/4 Отшельник - Оппортунист', '3/5 Мученик - Еретик', '4/6 Оппортунист - Ролевая модель', '5/1 Еретик - Исследователь', '6/2 Ролевая модель - Отшельник'];
  const profile = profiles[seed % profiles.length];

  return {
    type,
    profile,
    strategy,
    innerAuthority,
    notSelfTheme,
    definition,
    definedCenters,
    openCenters,
    keyStrengths: [
      'Врожденная способность притягивать нужных людей в свой круг',
      'Огромный потенциал личной энергии при занятии любимым делом',
      'Интуитивное распознавание фальши и скрытых мотивов собеседника'
    ],
    growthZone: 'Научиться говорить твердое «нет» без чувства вины и доверять сигналам тела, а не логическим сомнениям ума.'
  };
}
