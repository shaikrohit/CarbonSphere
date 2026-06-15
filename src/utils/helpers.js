/**
 * Global carbon emission factors and constants used for footprint calculations.
 * Centralizing these values prevents duplicated magic numbers across hook calculations
 * and AI contextual components.
 */
export const CARBON_CONSTANTS = {
  car: {
    petrol: 0.17,
    diesel: 0.19,
    hybrid: 0.10,
    ev: 0.05,
    weeksPerYear: 52
  },
  flight: {
    kgPerFlight: 180
  },
  transit: {
    speedKmH: 20,
    factor: 0.04,
    weeksPerYear: 52
  },
  electricity: {
    kgPerKwh: 0.82, // Indian grid average factor
    monthsPerYear: 12
  },
  lpg: {
    kgPerCylinder: 42.5,
    monthsPerYear: 12
  },
  diet: {
    vegetarian: 1200,
    'heavy-meat': 2500,
    'low-meat': 1700,
    vegan: 700
  },
  waste: {
    none: 800,
    some: 400,
    most: 100
  },
  shopping: {
    high: 800,
    average: 400,
    low: 150
  }
};

/**
 * Determines the sustainability rank badge based on the user's active streak.
 * @param {number} streakDays - The consecutive number of active habit tracking days.
 * @returns {string} The name of the rank badge.
 */
export const getBadgeName = (streakDays) => {
  if (streakDays >= 15) return 'Eco Champion';
  if (streakDays >= 10) return 'Carbon Guardian';
  if (streakDays >= 5) return 'Green Pioneer';
  return 'Seedling';
};

/**
 * Identifies the category with the highest carbon footprint in the user's baseline.
 * @param {Object} b - The user's baseline carbon parameters.
 * @param {number} b.carKmPerWeek - Weekly km driven.
 * @param {string} b.carFuelType - Vehicle fuel type ('petrol', 'diesel', 'hybrid', 'ev').
 * @param {number} b.flightsPerYear - Number of round-trip flights per year.
 * @param {number} b.electricityKwhPerMonth - Monthly electricity bill in kWh.
 * @param {string} b.dietType - Dietary profile.
 * @returns {string} The name of the highest carbon emission category.
 */
export const getHighestCategory = (b) => {
  const carEmissions = b.carKmPerWeek * CARBON_CONSTANTS.car.weeksPerYear * (CARBON_CONSTANTS.car[b.carFuelType] || CARBON_CONSTANTS.car.petrol);
  const flightEmissions = b.flightsPerYear * CARBON_CONSTANTS.flight.kgPerFlight;
  const electricityEmissions = b.electricityKwhPerMonth * CARBON_CONSTANTS.electricity.monthsPerYear * CARBON_CONSTANTS.electricity.kgPerKwh;
  const dietEmissions = CARBON_CONSTANTS.diet[b.dietType] || CARBON_CONSTANTS.diet.vegetarian;

  const max = Math.max(carEmissions, flightEmissions, electricityEmissions, dietEmissions);
  if (max === carEmissions) return 'transportation (car driving)';
  if (max === flightEmissions) return 'aviation (flights)';
  if (max === electricityEmissions) return 'home energy (electricity)';
  return 'dietary choices (meat consumption)';
};

/**
 * Local rule-based fallback response engine for Aura chatbot assistant.
 * Generates smart, contextual sustainability insights based on user query and profile.
 * @param {string} query - The user's typed chat query.
 * @param {Object} context - The current state context containing baseline and footprints.
 * @param {Object} context.baseline - The user's baseline habits.
 * @param {number} context.currentFootprint - The calculated current carbon footprint in tons.
 * @param {number} context.totalBaseline - The calculated baseline carbon footprint in tons.
 * @param {number} context.totalDailySavings - Current daily carbon savings in kilograms.
 * @param {number} context.ecoScore - Calculated EcoScore (0 to 100).
 * @returns {string} Contextual bot message response.
 */
export const getLocalResponse = (query, context) => {
  const q = query.toLowerCase();
  const highestEmissionCategory = getHighestCategory(context.baseline);

  if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
    return "Hello! I'm here to help. What aspect of your carbon footprint would you like to discuss today? (e.g., commute, food, energy)";
  }

  if (q.includes('commute') || q.includes('car') || q.includes('drive') || q.includes('fuel')) {
    return `I see you commute about ${context.baseline.carKmPerWeek} km/week using a ${context.baseline.carFuelType} vehicle. Commuting is a major contributor to your footprint. Toggling to public transit or cycling for short trips (under 5km) saves substantial CO₂. Switching to hybrid or EV can reduce driving emissions by 40-70%.`;
  }

  if (q.includes('meat') || q.includes('diet') || q.includes('food') || q.includes('eat')) {
    return `Your diet profile is "${context.baseline.dietType}". Reducing meat intake by just one meal a week reduces food-related emissions by up to 15%. Did you know eating meat once a week for a year produces more carbon than driving a car for 3,000 km? Let's try adding more plant-based days!`;
  }

  if (q.includes('electricity') || q.includes('energy') || q.includes('bill') || q.includes('ac')) {
    return `Your household uses about ${context.baseline.electricityKwhPerMonth} kWh of electricity per month. Turning off ACs/fans when not in the room and upgrading to 5-star BEE rated appliances can save up to 20% on power. Unplugging idle chargers also prevents "vampire load" energy wastage.`;
  }

  if (q.includes('flight') || q.includes('plane') || q.includes('travel')) {
    return `You take about ${context.baseline.flightsPerYear} flights a year. A single domestic flight (e.g., Delhi to Mumbai) emits ~90 kg CO₂ per passenger, which equals 4 months of typical household electricity usage. Consider direct flights (takeoffs/landings use the most fuel) or train travel for routes under 10 hours.`;
  }

  // Default contextual analysis based on their data
  return `Based on your lifestyle survey, your highest impact category is ${highestEmissionCategory.toUpperCase()}. Your current footprint of ${context.currentFootprint} Tons is ${context.currentFootprint > 1.8 ? 'above' : 'below'} the urban Indian average of 1.8 Tons. I recommend focusing on reducing your ${highestEmissionCategory} output through our daily Action Center to heal your EcoSphere.`;
};
