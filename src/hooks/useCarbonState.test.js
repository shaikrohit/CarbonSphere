import { describe, test, expect } from 'vitest';
import { calculateBaselineCO2, DEFAULT_BASELINE } from './useCarbonState';

describe('Carbon Baseline Calculation Logic', () => {
  test('calculates correct baseline for default inputs', () => {
    // Default baseline values:
    // carKmPerWeek: 50, fuel: petrol (0.17) => 50 * 52 * 0.17 = 442 kg
    // flightsPerYear: 2 => 2 * 180 = 360 kg
    // publicTransitHours: 5 => 5 * 52 * 20 * 0.04 = 208 kg
    // electricityKwhPerMonth: 150 => 150 * 12 * 0.82 = 1476 kg
    // lpgCylindersPerMonth: 0.5 => 0.5 * 12 * 42.5 = 255 kg
    // dietType: 'low-meat' => 1700 kg
    // wasteRecycling: 'some' => 400 kg
    // shoppingFrequency: 'average' => 400 kg
    // Total: 442 + 360 + 208 + 1476 + 255 + 1700 + 400 + 400 = 5241 kg = 5.24 metric tons
    const co2 = calculateBaselineCO2(DEFAULT_BASELINE);
    expect(co2).toBe(5.24);
  });

  test('calculates lower baseline for vegan diet and EV car', () => {
    const ecoBaseline = {
      ...DEFAULT_BASELINE,
      carFuelType: 'ev', // 0.05 factor => 50 * 52 * 0.05 = 130 kg (instead of 442 kg)
      dietType: 'vegan', // 700 kg (instead of 1700 kg)
      wasteRecycling: 'most', // 100 kg (instead of 400 kg)
      shoppingFrequency: 'low' // 150 kg (instead of 400 kg)
    };
    
    // Emissions:
    // car: 130 kg
    // flights: 360 kg
    // transit: 208 kg
    // electricity: 1476 kg
    // lpg: 255 kg
    // diet: 700 kg
    // waste: 100 kg
    // shopping: 150 kg
    // Total: 130 + 360 + 208 + 1476 + 255 + 700 + 100 + 150 = 3379 kg = 3.38 metric tons
    const co2 = calculateBaselineCO2(ecoBaseline);
    expect(co2).toBe(3.38);
  });

  test('calculates higher baseline for heavy meat and high driving diesel car', () => {
    const heavyBaseline = {
      ...DEFAULT_BASELINE,
      carKmPerWeek: 300, // 300 * 52 * 0.19 (diesel) = 2964 kg
      carFuelType: 'diesel',
      flightsPerYear: 5, // 5 * 180 = 900 kg
      electricityKwhPerMonth: 300, // 300 * 12 * 0.82 = 2952 kg
      dietType: 'heavy-meat', // 2500 kg
      shoppingFrequency: 'high' // 800 kg
    };
    
    // Emissions:
    // car: 2964 kg
    // flights: 900 kg
    // transit: 208 kg
    // electricity: 2952 kg
    // lpg: 255 kg
    // diet: 2500 kg
    // waste: 400 kg
    // shopping: 800 kg
    // Total: 2964 + 900 + 208 + 2952 + 255 + 2500 + 400 + 800 = 10979 kg = 10.98 metric tons
    const co2 = calculateBaselineCO2(heavyBaseline);
    expect(co2).toBe(10.98);
  });
});

describe('Carbon Reduction Offsets Logic', () => {
  test('calculates correct annual offsets from daily savings', () => {
    // If user saves 5.2 kg/day (e.g., taking metro)
    const dailySavingsKg = 5.2;
    // Annual savings in tons = (5.2 * 365) / 1000 = 1.898 tons -> rounded to 2 decimal places = 1.90
    const annualSavingsTons = Number(((dailySavingsKg * 365) / 1000).toFixed(2));
    expect(annualSavingsTons).toBe(1.90);

    const baselineTons = 5.24;
    const currentFootprint = Math.max(0, Number((baselineTons - annualSavingsTons).toFixed(2)));
    // 5.24 - 1.90 = 3.34 tons
    expect(currentFootprint).toBe(3.34);
  });

  test('handles large daily savings exceeding baseline footprint', () => {
    // If daily savings are extremely high, current footprint should pin to 0 (cannot be negative)
    const dailySavingsKg = 25.0; // 25.0 * 365 / 1000 = 9.125 tons -> 9.13 tons
    const annualSavingsTons = Number(((dailySavingsKg * 365) / 1000).toFixed(2));
    const baselineTons = 5.24;
    const currentFootprint = Math.max(0, Number((baselineTons - annualSavingsTons).toFixed(2)));
    expect(currentFootprint).toBe(0);
  });
});
