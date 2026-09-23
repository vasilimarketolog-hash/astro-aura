export type Gender = 'female' | 'male' | 'other';

export type CalculationType = 'natal' | 'synastry' | 'humandesign' | 'all';

export type Locale = 'ru' | 'en' | 'es';

export interface BirthData {
  name: string;
  lastName?: string;
  country?: string;
  countryEn?: string;
  countryEs?: string;
  gender: Gender;
  day: number;
  month: number;
  year: number;
  hour: number;
  minute: number;
  unknownTime?: boolean;
  cityName: string;
  cityEn?: string;
  cityEs?: string;
  latitude: number;
  longitude: number;
  timezoneOffset: number; // in hours relative to UTC
  houseSystem?: 'placidus' | 'equal' | 'wholesign';
}

export interface ZodiacSign {
  id: string;
  nameRu: string;
  nameEn: string;
  nameEs?: string;
  symbol: string;
  element: 'Огонь' | 'Земля' | 'Воздух' | 'Вода';
  quality: 'Кардинальный' | 'Фиксированный' | 'Мутабельный';
  ruler: string;
}

export interface PlanetPosition {
  id: string;
  nameRu: string;
  nameEn: string;
  nameEs?: string;
  symbol: string;
  longitude: number; // 0..360
  sign: ZodiacSign;
  degreeInSign: number; // 0..30
  minuteInSign: number;
  house: number; // 1..12
  isRetrograde: boolean;
  speed?: number;
  astrodynes?: {
    power: number; // 0..100
    harmony: number; // 0..100
    status: string;
  };
}

export interface HouseCusp {
  house: number;
  longitude: number;
  sign: ZodiacSign;
  degreeInSign: number;
}

export interface Aspect {
  planet1: PlanetPosition;
  planet2: PlanetPosition;
  aspectType: 'conjunction' | 'sextile' | 'square' | 'trine' | 'opposition';
  angle: number; // 0, 60, 90, 120, 180
  actualAngle: number;
  orb: number;
  isHarmonious: boolean;
  nameRu: string;
  nameEn?: string;
  nameEs?: string;
  description: string;
}

export interface Talisman {
  stoneRu: string;
  stoneEn: string;
  stoneEs?: string;
  color: string;
  planetId: string;
  planetNameRu: string;
  planetNameEn: string;
  planetNameEs?: string;
  purposeRu: string;
  purposeEn: string;
  purposeEs?: string;
}

export interface NatalChartData {
  birthData: BirthData;
  planets: PlanetPosition[];
  houses: HouseCusp[];
  aspects: Aspect[];
  ascendant: PlanetPosition;
  midheaven: PlanetPosition;
  partOfFortune: PlanetPosition;
  dominantPlanet: {
    id: string;
    nameRu: string;
    nameEn: string;
    nameEs?: string;
    symbol: string;
    powerScore: number;
    reasonRu: string;
    reasonEn: string;
    reasonEs?: string;
  };
  talismans: Talisman[];
  dominantElement: {
    fire: number;
    earth: number;
    air: number;
    water: number;
    primary: string;
    primaryRu?: string;
    primaryEn?: string;
    primaryEs?: string;
  };
}

export interface SynastryCompatibilityScore {
  totalScore: number; // 0..100
  loveAndPassion: number; // 0..100
  emotionalHarmony: number; // 0..100
  intellectualMatch: number; // 0..100
  longTermPotential: number; // 0..100
  conflictRisk: number; // 0..100
  verdict: string;
  strengths: string[];
  challenges: string[];
}

export interface SynastryData {
  person1: NatalChartData;
  person2: NatalChartData;
  compatibility: SynastryCompatibilityScore;
  synastryAspects: {
    planet1Name: string;
    planet2Name: string;
    aspectName: string;
    meaning: string;
    isHarmonious: boolean;
  }[];
}

export interface HumanDesignData {
  type: string;
  profile: string; // e.g., '1/3', '2/4', '4/6'
  strategy: string;
  innerAuthority: string;
  notSelfTheme: string;
  definition: string;
  definedCenters: string[];
  openCenters: string[];
  keyStrengths: string[];
  growthZone: string;
}

export interface TariffPlan {
  id: string;
  title: string;
  badge?: string;
  price: number;
  oldPrice: number;
  currency: string;
  periodText: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  type: 'onetime' | 'subscription' | 'vip';
}
