import { describe, test, expect } from 'vitest';
import { calculateBaselineCO2, DEFAULT_BASELINE, sanitizeInput } from './useCarbonState';
import { getBadgeName, getHighestCategory, getLocalResponse } from '../utils/helpers';

describe('Carbon Baseline Calculation Logic', () => {
  test('1. Default inputs baseline calculation', () => {
    const co2 = calculateBaselineCO2(DEFAULT_BASELINE);
    expect(co2).toBe(5.24);
  });

  test('2. EV fuel type and plant-based vegan diet calculation', () => {
    const ecoBaseline = {
      ...DEFAULT_BASELINE,
      carFuelType: 'ev', // 0.05 factor => 50 * 52 * 0.05 = 130 kg
      dietType: 'vegan', // 700 kg
      wasteRecycling: 'most', // 100 kg
      shoppingFrequency: 'low' // 150 kg
    };
    const co2 = calculateBaselineCO2(ecoBaseline);
    expect(co2).toBe(3.38);
  });

  test('3. Heavy meat diet and heavy diesel commute calculation', () => {
    const heavyBaseline = {
      ...DEFAULT_BASELINE,
      carKmPerWeek: 300, // 300 * 52 * 0.19 = 2964 kg
      carFuelType: 'diesel',
      flightsPerYear: 5, // 900 kg
      electricityKwhPerMonth: 300, // 2952 kg
      dietType: 'heavy-meat', // 2500 kg
      shoppingFrequency: 'high' // 800 kg
    };
    const co2 = calculateBaselineCO2(heavyBaseline);
    expect(co2).toBe(10.98);
  });

  test('4. Hybrid fuel type baseline calculation', () => {
    const hybridBaseline = {
      ...DEFAULT_BASELINE,
      carFuelType: 'hybrid' // 0.10 factor => 50 * 52 * 0.10 = 260 kg
    };
    const co2 = calculateBaselineCO2(hybridBaseline);
    expect(co2).toBe(5.06); // 5.24 - (442 - 260)/1000 = 5.06
  });

  test('5. Zero commute driving baseline calculation', () => {
    const zeroDriveBaseline = {
      ...DEFAULT_BASELINE,
      carKmPerWeek: 0
    };
    const co2 = calculateBaselineCO2(zeroDriveBaseline);
    expect(co2).toBe(4.80); // 5.24 - 442/1000 = 4.80
  });

  test('6. Multiple annual flights baseline calculation', () => {
    const flightsBaseline = {
      ...DEFAULT_BASELINE,
      flightsPerYear: 10 // 10 * 180 = 1800 kg
    };
    const co2 = calculateBaselineCO2(flightsBaseline);
    expect(co2).toBe(6.68); // 5.24 - 360/1000 + 1800/1000 = 6.68
  });

  test('7. Zero annual flights baseline calculation', () => {
    const zeroFlightsBaseline = {
      ...DEFAULT_BASELINE,
      flightsPerYear: 0
    };
    const co2 = calculateBaselineCO2(zeroFlightsBaseline);
    expect(co2).toBe(4.88); // 5.24 - 360/1000 = 4.88
  });

  test('8. Zero public transit baseline calculation', () => {
    const zeroTransitBaseline = {
      ...DEFAULT_BASELINE,
      publicTransitHoursPerWeek: 0
    };
    const co2 = calculateBaselineCO2(zeroTransitBaseline);
    expect(co2).toBe(5.03); // 5.24 - 208/1000 = 5.03
  });

  test('9. High transit hours usage baseline calculation', () => {
    const highTransitBaseline = {
      ...DEFAULT_BASELINE,
      publicTransitHoursPerWeek: 25 // 25 * 52 * 20 * 0.04 = 1040 kg
    };
    const co2 = calculateBaselineCO2(highTransitBaseline);
    expect(co2).toBe(6.07); // 5.24 - 0.208 + 1.040 = 6.072 -> 6.07
  });

  test('10. High electricity bill baseline calculation', () => {
    const highElectricityBaseline = {
      ...DEFAULT_BASELINE,
      electricityKwhPerMonth: 500 // 500 * 12 * 0.82 = 4920 kg
    };
    const co2 = calculateBaselineCO2(highElectricityBaseline);
    expect(co2).toBe(8.69);
  });

  test('11. Vegetarian diet profile baseline calculation', () => {
    const vegBaseline = {
      ...DEFAULT_BASELINE,
      dietType: 'vegetarian' // 1200 kg
    };
    const co2 = calculateBaselineCO2(vegBaseline);
    expect(co2).toBe(4.74); // 5.24 - (1700 - 1200)/1000 = 4.74
  });

  test('12. Waste recycling options (none, some, most) baseline calculation', () => {
    const noRecycling = { ...DEFAULT_BASELINE, wasteRecycling: 'none' }; // 800 kg
    const mostRecycling = { ...DEFAULT_BASELINE, wasteRecycling: 'most' }; // 100 kg
    
    expect(calculateBaselineCO2(noRecycling)).toBe(5.64); // +400 kg
    expect(calculateBaselineCO2(mostRecycling)).toBe(4.94); // -300 kg
  });

  test('13. Shopping frequency options (low, average, high) baseline calculation', () => {
    const lowShopping = { ...DEFAULT_BASELINE, shoppingFrequency: 'low' }; // 150 kg
    const highShopping = { ...DEFAULT_BASELINE, shoppingFrequency: 'high' }; // 800 kg

    expect(calculateBaselineCO2(lowShopping)).toBe(4.99); // -250 kg
    expect(calculateBaselineCO2(highShopping)).toBe(5.64); // +400 kg
  });
});

describe('Carbon Reduction Offsets Logic', () => {
  test('14. Daily savings to annual tons conversion calculation', () => {
    const dailySavingsKg = 8.5;
    const annualSavingsTons = Number(((dailySavingsKg * 365) / 1000).toFixed(2));
    expect(annualSavingsTons).toBe(3.10); // 8.5 * 365 = 3102.5 kg = 3.1025 tons -> 3.10
  });

  test('15. Zero daily savings offset calculations', () => {
    const dailySavingsKg = 0;
    const annualSavingsTons = Number(((dailySavingsKg * 365) / 1000).toFixed(2));
    expect(annualSavingsTons).toBe(0.00);
  });

  test('16. Current footprint floor limit of zero', () => {
    const baselineTons = 5.24;
    const excessiveAnnualSavings = 7.5; // Greater than baseline footprint
    const currentFootprint = Math.max(0, Number((baselineTons - excessiveAnnualSavings).toFixed(2)));
    expect(currentFootprint).toBe(0);
  });
});

describe('Security Input Sanitization', () => {
  test('17. HTML tags and scripts escaping', () => {
    const scriptTag = '<script>alert("hack")</script>';
    expect(sanitizeInput(scriptTag)).toBe('&lt;script&gt;alert(&quot;hack&quot;)&lt;/script&gt;');
  });

  test('18. Special symbols sanitization (ampersand and single quote)', () => {
    const rawStr = "Save energy & turn off 'AC'";
    expect(sanitizeInput(rawStr)).toBe('Save energy &amp; turn off &#x27;AC&#x27;');
  });

  test('19. Safe strings preservation', () => {
    const normalStr = "Commuted using public bus today.";
    expect(sanitizeInput(normalStr)).toBe(normalStr);
  });
});

describe('Leaderboard Streak Badges', () => {
  test('20. Badge names mapping for various streak ranges', () => {
    expect(getBadgeName(0)).toBe('Seedling');
    expect(getBadgeName(4)).toBe('Seedling');
    expect(getBadgeName(5)).toBe('Green Pioneer');
    expect(getBadgeName(9)).toBe('Green Pioneer');
    expect(getBadgeName(10)).toBe('Carbon Guardian');
    expect(getBadgeName(14)).toBe('Carbon Guardian');
    expect(getBadgeName(15)).toBe('Eco Champion');
    expect(getBadgeName(45)).toBe('Eco Champion');
  });
});

describe('Insights AI fallbacks & Category Identifiers', () => {
  test('21. transportation category identifier', () => {
    const b = {
      ...DEFAULT_BASELINE,
      carKmPerWeek: 500, // Very high driving
      flightsPerYear: 0,
      electricityKwhPerMonth: 0,
      dietType: 'vegan'
    };
    expect(getHighestCategory(b)).toBe('transportation (car driving)');
  });

  test('22. aviation category identifier', () => {
    const b = {
      ...DEFAULT_BASELINE,
      carKmPerWeek: 0,
      flightsPerYear: 20, // Very high flight emissions
      electricityKwhPerMonth: 0,
      dietType: 'vegan'
    };
    expect(getHighestCategory(b)).toBe('aviation (flights)');
  });

  test('23. home energy category identifier', () => {
    const b = {
      ...DEFAULT_BASELINE,
      carKmPerWeek: 0,
      flightsPerYear: 0,
      electricityKwhPerMonth: 1000, // Very high electricity usage
      dietType: 'vegan'
    };
    expect(getHighestCategory(b)).toBe('home energy (electricity)');
  });

  test('24. diet category identifier', () => {
    const b = {
      ...DEFAULT_BASELINE,
      carKmPerWeek: 0,
      flightsPerYear: 0,
      electricityKwhPerMonth: 0,
      dietType: 'heavy-meat' // Highest relative contributor
    };
    expect(getHighestCategory(b)).toBe('dietary choices (meat consumption)');
  });

  test('25. Chatbot responses for key topics', () => {
    const context = {
      baseline: DEFAULT_BASELINE,
      currentFootprint: 5.24,
      totalBaseline: 5.24,
      totalDailySavings: 0,
      ecoScore: 50
    };

    expect(getLocalResponse('hello bot', context)).toContain('Hello! I\'m here to help.');
    expect(getLocalResponse('how to reduce car driving emissions', context).toLowerCase()).toContain('commuting');
    expect(getLocalResponse('tell me about healthy diets', context)).toContain('diet profile');
    expect(getLocalResponse('explain electric bills', context)).toContain('electricity');
    expect(getLocalResponse('explain airplane travel', context)).toContain('flights');
  });

  test('26. Chatbot default analysis response when no matches found', () => {
    const context = {
      baseline: DEFAULT_BASELINE,
      currentFootprint: 5.24,
      totalBaseline: 5.24,
      totalDailySavings: 0,
      ecoScore: 50
    };
    const defaultReply = getLocalResponse('arbitrary text', context);
    expect(defaultReply).toContain('highest impact category');
    expect(defaultReply).toContain('5.24');
  });
});
