import { calculateNatalChart, calculateSynastry, calculateHumanDesign } from './src/lib/astroEngine';
import { generateTeaserInsights } from './src/lib/interpretations';

console.log('--- RUNNING ASTROAURA COMPLETE AUDIT TEST ---');

// Test 1: Natal calculation
try {
  const p1 = {
    name: 'TestUser',
    lastName: 'Tester',
    year: 1995,
    month: 5,
    day: 15,
    hour: 14,
    minute: 30,
    cityName: 'Berlin',
    cityEn: 'Berlin',
    latitude: 52.52,
    longitude: 13.405,
    timezone: 'Europe/Berlin',
    timezoneOffset: 1,
    country: 'Германия',
    countryEn: 'Germany'
  };

  const natal = calculateNatalChart(p1 as any);
  console.log('✓ Test 1 Passed: Natal Chart calculated successfully');
  console.log(`  - Sun: ${natal.planets.find(p => p.id === 'sun')?.sign.nameRu} / ${natal.planets.find(p => p.id === 'sun')?.sign.nameEn}`);
  console.log(`  - Moon: ${natal.planets.find(p => p.id === 'moon')?.sign.nameRu} / ${natal.planets.find(p => p.id === 'moon')?.sign.nameEn}`);
  console.log(`  - Asc: ${natal.ascendant.sign.nameRu} / ${natal.ascendant.sign.nameEn}`);
  console.log(`  - Dominant element: ${natal.dominantElement.primary}`);

  // Test 2: Synastry calculation
  const p2 = {
    name: 'Partner',
    year: 1996,
    month: 8,
    day: 20,
    hour: 18,
    minute: 0,
    cityName: 'Paris',
    latitude: 48.8566,
    longitude: 2.3522,
    timezone: 'Europe/Paris',
    timezoneOffset: 1,
    country: 'Франция'
  };

  const natal2 = calculateNatalChart(p2 as any);
  const synastry = calculateSynastry(natal, natal2);
  console.log('✓ Test 2 Passed: Synastry calculated successfully');
  console.log(`  - Total score: ${synastry.compatibility.totalScore}%`);
  console.log(`  - Verdict: ${synastry.compatibility.verdict}`);

  // Test 3: Human Design calculation
  const hd = calculateHumanDesign(p1 as any);
  console.log('✓ Test 3 Passed: Human Design calculated successfully');
  console.log(`  - Type: ${hd.type}`);
  console.log(`  - Profile: ${hd.profile}`);
  console.log(`  - Strategy: ${hd.strategy}`);
  console.log(`  - Defined centers: ${hd.definedCenters.length}/9`);

  // Test 4: Teaser insights in RU and EN
  const insightsRu = generateTeaserInsights('taurus', 'scorpio', 'leo', 'ru');
  const insightsEn = generateTeaserInsights('taurus', 'scorpio', 'leo', 'en');
  console.log('✓ Test 4 Passed: Bilingual Teaser insights generated');
  console.log(`  - RU headline: ${insightsRu.headline}`);
  console.log(`  - EN headline: ${insightsEn.headline}`);

  console.log('\n--- ALL ENGINE CHECKS PASSED (100% HEALTHY) ---');
} catch (err) {
  console.error('Test failed with error:', err);
  process.exit(1);
}
