export interface CityInfo {
  name: string;
  nameEn: string;
  region?: string;
  regionEn?: string;
  country: string;
  countryEn: string;
  latitude: number;
  longitude: number;
  timezoneOffset: number; // in hours from UTC
}

export const TOP_CIS_CITIES: CityInfo[] = [
  { name: 'Москва', nameEn: 'Moscow', region: 'Московская обл.', regionEn: 'Moscow Region', country: 'Россия', countryEn: 'Russia', latitude: 55.7558, longitude: 37.6173, timezoneOffset: 3 },
  { name: 'Санкт-Петербург', nameEn: 'Saint Petersburg', region: 'Ленинградская обл.', regionEn: 'Leningrad Region', country: 'Россия', countryEn: 'Russia', latitude: 59.9343, longitude: 30.3351, timezoneOffset: 3 },
  { name: 'Минск', nameEn: 'Minsk', region: 'Минская обл.', regionEn: 'Minsk Region', country: 'Беларусь', countryEn: 'Belarus', latitude: 53.9006, longitude: 27.5590, timezoneOffset: 3 },
  { name: 'Киев', nameEn: 'Kyiv', region: 'Киевская обл.', regionEn: 'Kyiv Region', country: 'Украина', countryEn: 'Ukraine', latitude: 50.4501, longitude: 30.5234, timezoneOffset: 2 },
  { name: 'Алматы', nameEn: 'Almaty', region: 'Алматинская обл.', regionEn: 'Almaty Region', country: 'Казахстан', countryEn: 'Kazakhstan', latitude: 43.2220, longitude: 76.8512, timezoneOffset: 5 },
  { name: 'Ташкент', nameEn: 'Tashkent', region: 'Ташкентская обл.', regionEn: 'Tashkent Region', country: 'Узбекистан', countryEn: 'Uzbekistan', latitude: 41.2995, longitude: 69.2401, timezoneOffset: 5 },
  { name: 'Тбилиси', nameEn: 'Tbilisi', country: 'Грузия', countryEn: 'Georgia', latitude: 41.7151, longitude: 44.8271, timezoneOffset: 4 },
  { name: 'Ереван', nameEn: 'Yerevan', country: 'Армения', countryEn: 'Armenia', latitude: 40.1792, longitude: 44.4991, timezoneOffset: 4 },
  { name: 'Баку', nameEn: 'Baku', country: 'Азербайджан', countryEn: 'Azerbaijan', latitude: 40.4093, longitude: 49.8671, timezoneOffset: 4 },
  { name: 'Астана', nameEn: 'Astana', region: 'Акмолинская обл.', regionEn: 'Akmola Region', country: 'Казахстан', countryEn: 'Kazakhstan', latitude: 51.1694, longitude: 71.4491, timezoneOffset: 5 },
];

export const TOP_GLOBAL_CITIES: CityInfo[] = [
  { name: 'Нью-Йорк', nameEn: 'New York', region: 'Нью-Йорк', regionEn: 'NY', country: 'США', countryEn: 'United States', latitude: 40.7128, longitude: -74.0060, timezoneOffset: -5 },
  { name: 'Лондон', nameEn: 'London', region: 'Англия', regionEn: 'England', country: 'Великобритания', countryEn: 'United Kingdom', latitude: 51.5074, longitude: -0.1278, timezoneOffset: 0 },
  { name: 'Лос-Анджелес', nameEn: 'Los Angeles', region: 'Калифорния', regionEn: 'CA', country: 'США', countryEn: 'United States', latitude: 34.0522, longitude: -118.2437, timezoneOffset: -8 },
  { name: 'Торонто', nameEn: 'Toronto', region: 'Онтарио', regionEn: 'ON', country: 'Канада', countryEn: 'Canada', latitude: 43.6532, longitude: -79.3832, timezoneOffset: -5 },
  { name: 'Сидней', nameEn: 'Sydney', region: 'Новый Южный Уэльс', regionEn: 'NSW', country: 'Австралия', countryEn: 'Australia', latitude: -33.8688, longitude: 151.2093, timezoneOffset: 10 },
  { name: 'Берлин', nameEn: 'Berlin', country: 'Германия', countryEn: 'Germany', latitude: 52.5200, longitude: 13.4050, timezoneOffset: 1 },
  { name: 'Париж', nameEn: 'Paris', region: 'Иль-де-Франс', regionEn: 'Ile-de-France', country: 'Франция', countryEn: 'France', latitude: 48.8566, longitude: 2.3522, timezoneOffset: 1 },
  { name: 'Токио', nameEn: 'Tokyo', country: 'Япония', countryEn: 'Japan', latitude: 35.6762, longitude: 139.6503, timezoneOffset: 9 },
  { name: 'Дубай', nameEn: 'Dubai', country: 'ОАЭ', countryEn: 'United Arab Emirates', latitude: 25.2048, longitude: 55.2708, timezoneOffset: 4 },
  { name: 'Сингапур', nameEn: 'Singapore', country: 'Сингапур', countryEn: 'Singapore', latitude: 1.3521, longitude: 103.8198, timezoneOffset: 8 },
];

export const POPULAR_CITIES: CityInfo[] = [
  ...TOP_CIS_CITIES,
  ...TOP_GLOBAL_CITIES,

  // Belarus
  { name: 'Барановичи', nameEn: 'Baranovichi', region: 'Брестская обл.', regionEn: 'Brest Region', country: 'Беларусь', countryEn: 'Belarus', latitude: 53.1327, longitude: 26.0139, timezoneOffset: 3 },
  { name: 'Брест', nameEn: 'Brest', region: 'Брестская обл.', regionEn: 'Brest Region', country: 'Беларусь', countryEn: 'Belarus', latitude: 52.0976, longitude: 23.7341, timezoneOffset: 3 },
  { name: 'Гродно', nameEn: 'Grodno', region: 'Гродненская обл.', regionEn: 'Grodno Region', country: 'Беларусь', countryEn: 'Belarus', latitude: 53.6884, longitude: 23.8258, timezoneOffset: 3 },
  { name: 'Гомель', nameEn: 'Gomel', region: 'Гомельская обл.', regionEn: 'Gomel Region', country: 'Беларусь', countryEn: 'Belarus', latitude: 52.4345, longitude: 30.9754, timezoneOffset: 3 },
  { name: 'Витебск', nameEn: 'Vitebsk', region: 'Витебская обл.', regionEn: 'Vitebsk Region', country: 'Беларусь', countryEn: 'Belarus', latitude: 55.1904, longitude: 30.2049, timezoneOffset: 3 },
  { name: 'Могилев', nameEn: 'Mogilev', region: 'Могилевская обл.', regionEn: 'Mogilev Region', country: 'Беларусь', countryEn: 'Belarus', latitude: 53.8981, longitude: 30.3325, timezoneOffset: 3 },
  { name: 'Бобруйск', nameEn: 'Bobruisk', region: 'Могилевская обл.', regionEn: 'Mogilev Region', country: 'Беларусь', countryEn: 'Belarus', latitude: 53.1444, longitude: 29.2244, timezoneOffset: 3 },
  { name: 'Пинск', nameEn: 'Pinsk', region: 'Брестская обл.', regionEn: 'Brest Region', country: 'Беларусь', countryEn: 'Belarus', latitude: 52.1153, longitude: 26.0945, timezoneOffset: 3 },

  // Russia
  { name: 'Новосибирск', nameEn: 'Novosibirsk', region: 'Новосибирская обл.', regionEn: 'Novosibirsk Region', country: 'Россия', countryEn: 'Russia', latitude: 55.0084, longitude: 82.9357, timezoneOffset: 7 },
  { name: 'Екатеринбург', nameEn: 'Yekaterinburg', region: 'Свердловская обл.', regionEn: 'Sverdlovsk Region', country: 'Россия', countryEn: 'Russia', latitude: 56.8389, longitude: 60.6057, timezoneOffset: 5 },
  { name: 'Казань', nameEn: 'Kazan', region: 'Татарстан', regionEn: 'Tatarstan', country: 'Россия', countryEn: 'Russia', latitude: 55.8304, longitude: 49.0661, timezoneOffset: 3 },
  { name: 'Нижний Новгород', nameEn: 'Nizhny Novgorod', region: 'Нижегородская обл.', regionEn: 'Nizhny Novgorod Region', country: 'Россия', countryEn: 'Russia', latitude: 56.2965, longitude: 43.9361, timezoneOffset: 3 },
  { name: 'Краснодар', nameEn: 'Krasnodar', region: 'Краснодарский край', regionEn: 'Krasnodar Krai', country: 'Россия', countryEn: 'Russia', latitude: 45.0393, longitude: 38.9872, timezoneOffset: 3 },
  { name: 'Сочи', nameEn: 'Sochi', region: 'Краснодарский край', regionEn: 'Krasnodar Krai', country: 'Россия', countryEn: 'Russia', latitude: 43.6028, longitude: 39.7342, timezoneOffset: 3 },
  { name: 'Самара', nameEn: 'Samara', region: 'Самарская обл.', regionEn: 'Samara Region', country: 'Россия', countryEn: 'Russia', latitude: 53.2415, longitude: 50.2212, timezoneOffset: 4 },
  { name: 'Владивосток', nameEn: 'Vladivostok', region: 'Приморский край', regionEn: 'Primorsky Krai', country: 'Россия', countryEn: 'Russia', latitude: 43.1155, longitude: 131.8855, timezoneOffset: 10 },
  { name: 'Калининград', nameEn: 'Kaliningrad', region: 'Калининградская обл.', regionEn: 'Kaliningrad Region', country: 'Россия', countryEn: 'Russia', latitude: 54.7104, longitude: 20.4522, timezoneOffset: 2 },

  // Kazakhstan & Central Asia
  { name: 'Шымкент', nameEn: 'Shymkent', country: 'Казахстан', countryEn: 'Kazakhstan', latitude: 42.3417, longitude: 69.5901, timezoneOffset: 5 },
  { name: 'Бишкек', nameEn: 'Bishkek', country: 'Кыргызстан', countryEn: 'Kyrgyzstan', latitude: 42.8746, longitude: 74.5698, timezoneOffset: 6 },

  // Europe & Americas & Worldwide
  { name: 'Варшава', nameEn: 'Warsaw', region: 'Мазовецкое', regionEn: 'Mazovia', country: 'Польша', countryEn: 'Poland', latitude: 52.2297, longitude: 21.0122, timezoneOffset: 1 },
  { name: 'Краков', nameEn: 'Krakow', region: 'Малопольское', regionEn: 'Lesser Poland', country: 'Польша', countryEn: 'Poland', latitude: 50.0647, longitude: 19.9450, timezoneOffset: 1 },
  { name: 'Вильнюс', nameEn: 'Vilnius', country: 'Литва', countryEn: 'Lithuania', latitude: 54.6872, longitude: 25.2797, timezoneOffset: 2 },
  { name: 'Рига', nameEn: 'Riga', country: 'Латвия', countryEn: 'Latvia', latitude: 56.9496, longitude: 24.1052, timezoneOffset: 2 },
  { name: 'Таллин', nameEn: 'Tallinn', country: 'Эстония', countryEn: 'Estonia', latitude: 59.4370, longitude: 24.7535, timezoneOffset: 2 },
  { name: 'Рим', nameEn: 'Rome', region: 'Лацио', regionEn: 'Lazio', country: 'Италия', countryEn: 'Italy', latitude: 41.9028, longitude: 12.4964, timezoneOffset: 1 },
  { name: 'Милан', nameEn: 'Milan', region: 'Ломбардия', regionEn: 'Lombardy', country: 'Италия', countryEn: 'Italy', latitude: 45.4642, longitude: 9.1900, timezoneOffset: 1 },
  { name: 'Мадрид', nameEn: 'Madrid', region: 'Мадрид', regionEn: 'Madrid', country: 'Испания', countryEn: 'Spain', latitude: 40.4168, longitude: -3.7038, timezoneOffset: 1 },
  { name: 'Барселона', nameEn: 'Barcelona', region: 'Каталония', regionEn: 'Catalonia', country: 'Испания', countryEn: 'Spain', latitude: 41.3851, longitude: 2.1734, timezoneOffset: 1 },
  { name: 'Прага', nameEn: 'Prague', country: 'Чехия', countryEn: 'Czech Republic', latitude: 50.0755, longitude: 14.4378, timezoneOffset: 1 },
  { name: 'Вена', nameEn: 'Vienna', country: 'Австрия', countryEn: 'Austria', latitude: 48.2082, longitude: 16.3738, timezoneOffset: 1 },
  { name: 'Амстердам', nameEn: 'Amsterdam', country: 'Нидерланды', countryEn: 'Netherlands', latitude: 52.3676, longitude: 4.9041, timezoneOffset: 1 },
  { name: 'Стамбул', nameEn: 'Istanbul', country: 'Турция', countryEn: 'Turkey', latitude: 41.0082, longitude: 28.9784, timezoneOffset: 3 },
  { name: 'Чикаго', nameEn: 'Chicago', region: 'Иллинойс', regionEn: 'IL', country: 'США', countryEn: 'United States', latitude: 41.8781, longitude: -87.6298, timezoneOffset: -6 },
  { name: 'Майами', nameEn: 'Miami', region: 'Флорида', regionEn: 'FL', country: 'США', countryEn: 'United States', latitude: 25.7617, longitude: -80.1918, timezoneOffset: -5 },
  { name: 'Сан-Франциско', nameEn: 'San Francisco', region: 'Калифорния', regionEn: 'CA', country: 'США', countryEn: 'United States', latitude: 37.7749, longitude: -122.4194, timezoneOffset: -8 },
  { name: 'Сеул', nameEn: 'Seoul', country: 'Южная Корея', countryEn: 'South Korea', latitude: 37.5665, longitude: 126.9780, timezoneOffset: 9 },
  { name: 'Бангкок', nameEn: 'Bangkok', country: 'Таиланд', countryEn: 'Thailand', latitude: 13.7563, longitude: 100.5018, timezoneOffset: 7 },
  { name: 'Лимасол', nameEn: 'Limassol', country: 'Кипр', countryEn: 'Cyprus', latitude: 34.7071, longitude: 33.0226, timezoneOffset: 2 },
  { name: 'Тель-Авив', nameEn: 'Tel Aviv', country: 'Израиль', countryEn: 'Israel', latitude: 32.0853, longitude: 34.7818, timezoneOffset: 2 },
];

export function searchCities(query: string, locale: 'ru' | 'en' = 'ru'): CityInfo[] {
  const q = query.trim().toLowerCase();
  if (!q) {
    return locale === 'en' ? TOP_GLOBAL_CITIES : TOP_CIS_CITIES;
  }

  // Exact prefix matches first, then contains matches
  const matches = POPULAR_CITIES.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.nameEn.toLowerCase().includes(q) ||
      (c.region && c.region.toLowerCase().includes(q)) ||
      (c.regionEn && c.regionEn.toLowerCase().includes(q)) ||
      c.country.toLowerCase().includes(q) ||
      c.countryEn.toLowerCase().includes(q)
  );

  matches.sort((a, b) => {
    const aStartsWith =
      a.name.toLowerCase().startsWith(q) || a.nameEn.toLowerCase().startsWith(q);
    const bStartsWith =
      b.name.toLowerCase().startsWith(q) || b.nameEn.toLowerCase().startsWith(q);
    if (aStartsWith && !bStartsWith) return -1;
    if (!aStartsWith && bStartsWith) return 1;
    return 0;
  });

  return matches.slice(0, 10);
}

// Online Geocoder for ANY city, village, or town in the world via OpenStreetMap Nominatim
export async function geocodeWorldwideCities(query: string): Promise<CityInfo[]> {
  const q = query.trim();
  if (!q || q.length < 2) return [];

  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5&addressdetails=1`;
    const res = await fetch(url, {
      headers: { 'Accept-Language': 'ru,en' }
    });
    if (!res.ok) return [];
    const data = await res.json();
    if (!data || !Array.isArray(data) || data.length === 0) return [];

    return data.map((item: any) => {
      const lat = parseFloat(item.lat);
      const lon = parseFloat(item.lon);

      // Estimate timezone offset from longitude (15 degrees per hour)
      let offset = Math.round(lon / 15);
      offset = Math.max(-12, Math.min(14, offset));

      const cityName =
        item.address?.city ||
        item.address?.town ||
        item.address?.village ||
        item.address?.municipality ||
        item.name ||
        q;
      const stateName = item.address?.state || item.address?.region || '';
      const countryName = item.address?.country || 'Мир';

      return {
        name: cityName,
        nameEn: cityName,
        region: stateName,
        regionEn: stateName,
        country: countryName,
        countryEn: countryName,
        latitude: lat,
        longitude: lon,
        timezoneOffset: offset,
      };
    });
  } catch (e) {
    return [];
  }
}

export async function geocodeWorldwideCity(query: string): Promise<CityInfo | null> {
  const localMatch = POPULAR_CITIES.find(
    (c) =>
      c.name.toLowerCase() === query.trim().toLowerCase() ||
      c.nameEn.toLowerCase() === query.trim().toLowerCase()
  );
  if (localMatch) return localMatch;

  const list = await geocodeWorldwideCities(query);
  return list.length > 0 ? list[0] : null;
}

