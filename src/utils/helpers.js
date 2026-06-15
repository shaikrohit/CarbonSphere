export const getBadgeName = (streakDays) => {
  if (streakDays >= 15) return 'Eco Champion';
  if (streakDays >= 10) return 'Carbon Guardian';
  if (streakDays >= 5) return 'Green Pioneer';
  return 'Seedling';
};

export const getHighestCategory = (b) => {
  const carEmissions = b.carKmPerWeek * 52 * (b.carFuelType === 'diesel' ? 0.19 : b.carFuelType === 'ev' ? 0.05 : 0.17);
  const flightEmissions = b.flightsPerYear * 180;
  const electricityEmissions = b.electricityKwhPerMonth * 12 * 0.82;
  const dietEmissions = b.dietType === 'heavy-meat' ? 2500 : b.dietType === 'low-meat' ? 1700 : 1200;

  const max = Math.max(carEmissions, flightEmissions, electricityEmissions, dietEmissions);
  if (max === carEmissions) return 'transportation (car driving)';
  if (max === flightEmissions) return 'aviation (flights)';
  if (max === electricityEmissions) return 'home energy (electricity)';
  return 'dietary choices (meat consumption)';
};

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
