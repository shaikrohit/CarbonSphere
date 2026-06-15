import { useState, useEffect, useCallback, useMemo } from 'react';

/**
 * Escapes HTML characters to prevent potential XSS injection in user custom actions.
 * @param {string} str - Unsanitized user string input.
 * @returns {string} Sanitized string.
 */
export const sanitizeInput = (str) => {
  return str.replace(/[&<>"']/g, (m) => {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;'
    };
    return map[m];
  });
};

export const DEFAULT_BASELINE = {
  carKmPerWeek: 50,
  carFuelType: 'petrol',
  flightsPerYear: 2,
  publicTransitHoursPerWeek: 5,
  electricityKwhPerMonth: 150,
  lpgCylindersPerMonth: 0.5,
  dietType: 'low-meat',
  wasteRecycling: 'some',
  shoppingFrequency: 'average'
};

export const ACTIONS = [
  { id: 'transit', category: 'Transport', text: 'Took metro/bus instead of driving', savings: 5.2, icon: 'Train' },
  { id: 'cycle', category: 'Transport', text: 'Cycled or walked for short trip (<5km)', savings: 2.1, icon: 'Bike' },
  { id: 'carpool', category: 'Transport', text: 'Carpooled with colleagues', savings: 3.5, icon: 'Users' },
  { id: 'ac-off', category: 'Energy', text: 'Turned off AC & fans when leaving', savings: 2.5, icon: 'Wind' },
  { id: 'led', category: 'Energy', text: 'Used energy-saving LED lighting', savings: 0.8, icon: 'Lightbulb' },
  { id: 'unplug', category: 'Energy', text: 'Unplugged idle charger & TV standby', savings: 0.6, icon: 'Plug' },
  { id: 'vegan-day', category: 'Diet', text: 'Ate strictly plant-based/vegan meals today', savings: 6.8, icon: 'Leaf' },
  { id: 'no-waste', category: 'Diet', text: 'Zero food wastage / finished all leftovers', savings: 1.8, icon: 'Utensils' },
  { id: 'local-food', category: 'Diet', text: 'Bought locally sourced groceries', savings: 1.2, icon: 'ShoppingBag' },
  { id: 'reusable', category: 'Waste', text: 'Used reusable water bottle and bags', savings: 0.9, icon: 'RefreshCw' },
  { id: 'recycled', category: 'Waste', text: 'Separated and recycled plastic/paper/metal', savings: 1.5, icon: 'Trash2' }
];

export const TEAMS_INITIAL = [
  { id: 'eng', name: 'Engineering Devs', members: 42, reduction: 2450, streak: 12 },
  { id: 'design', name: 'UX/UI Designers', members: 18, reduction: 1120, streak: 8 },
  { id: 'marketing', name: 'Growth Marketing', members: 25, reduction: 1540, streak: 15 },
  { id: 'ops', name: 'Operations & HR', members: 30, reduction: 1820, streak: 9 }
];

export function calculateBaselineCO2(baseline) {
  // 1. Car Emissions
  let carFactor = 0.17; // petrol default
  if (baseline.carFuelType === 'diesel') carFactor = 0.19;
  else if (baseline.carFuelType === 'hybrid') carFactor = 0.10;
  else if (baseline.carFuelType === 'ev') carFactor = 0.05; // Indian grid mix average
  const carCO2 = (Number(baseline.carKmPerWeek) || 0) * 52 * carFactor;

  // 2. Flights Emissions
  // Domestic short/medium flights average ~180 kg CO2
  const flightCO2 = (Number(baseline.flightsPerYear) || 0) * 180;

  // 3. Public Transit
  // Average bus/metro: ~0.04 kg CO2 per km. Assuming average transit speed is 20 km/h.
  const transitCO2 = (Number(baseline.publicTransitHoursPerWeek) || 0) * 52 * 20 * 0.04;

  // 4. Electricity
  // Indian grid average factor: ~0.82 kg CO2 per kWh
  const electricityCO2 = (Number(baseline.electricityKwhPerMonth) || 0) * 12 * 0.82;

  // 5. LPG Cylinders
  // 14.2 kg LPG cylinder creates ~42.5 kg CO2
  const lpgCO2 = (Number(baseline.lpgCylindersPerMonth) || 0) * 12 * 42.5;

  // 6. Diet Type
  let dietCO2 = 1200; // vegetarian baseline
  if (baseline.dietType === 'heavy-meat') dietCO2 = 2500;
  else if (baseline.dietType === 'low-meat') dietCO2 = 1700;
  else if (baseline.dietType === 'vegan') dietCO2 = 700;

  // 7. Consumption & Waste
  let wasteCO2 = 400; // average/some
  if (baseline.wasteRecycling === 'none') wasteCO2 = 800;
  else if (baseline.wasteRecycling === 'most') wasteCO2 = 100;

  let shoppingCO2 = 400; // average
  if (baseline.shoppingFrequency === 'high') shoppingCO2 = 800;
  else if (baseline.shoppingFrequency === 'low') shoppingCO2 = 150;

  const totalKg = carCO2 + flightCO2 + transitCO2 + electricityCO2 + lpgCO2 + dietCO2 + wasteCO2 + shoppingCO2;
  return Number((totalKg / 1000).toFixed(2)); // in metric tons CO2 per year
}

export default function useCarbonState() {
  const [baseline, setBaseline] = useState(() => {
    const saved = localStorage.getItem('cs_baseline');
    return saved ? JSON.parse(saved) : DEFAULT_BASELINE;
  });

  const [completedActions, setCompletedActions] = useState(() => {
    const saved = localStorage.getItem('cs_completed_actions');
    return saved ? JSON.parse(saved) : [];
  });

  const [customActions, setCustomActions] = useState(() => {
    const saved = localStorage.getItem('cs_custom_actions');
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedTeam, setSelectedTeam] = useState(() => {
    return localStorage.getItem('cs_selected_team') || 'eng';
  });

  const [streak, setStreak] = useState(() => {
    return Number(localStorage.getItem('cs_streak')) || 3;
  });

  const [hasOnboarded, setHasOnboarded] = useState(() => {
    return localStorage.getItem('cs_has_onboarded') === 'true';
  });

  const [teams, setTeams] = useState(() => {
    const saved = localStorage.getItem('cs_teams');
    return saved ? JSON.parse(saved) : TEAMS_INITIAL;
  });

  // Calculate base values
  const totalBaseline = useMemo(() => calculateBaselineCO2(baseline), [baseline]);

  // Calculate dynamic savings
  const regularSavings = useMemo(() => {
    return completedActions.reduce((acc, actionId) => {
      const action = ACTIONS.find(a => a.id === actionId);
      return acc + (action ? action.savings : 0);
    }, 0);
  }, [completedActions]);

  const customSavings = useMemo(() => {
    return customActions.reduce((acc, action) => {
      return acc + (action.checked ? action.savings : 0);
    }, 0);
  }, [customActions]);

  const totalDailySavings = useMemo(() => regularSavings + customSavings, [regularSavings, customSavings]);

  // Simulated annual savings if daily actions are sustained
  const annualSavingsTons = useMemo(() => Number(((totalDailySavings * 365) / 1000).toFixed(2)), [totalDailySavings]);
  
  // Real-time adjusted annual carbon footprint
  const currentFootprint = useMemo(() => Math.max(0, Number((totalBaseline - annualSavingsTons).toFixed(2))), [totalBaseline, annualSavingsTons]);

  // Eco Score (0 - 100)
  // Average Indian urban resident is ~1.8 tons/year. Global target is ~2.0 tons/year.
  // Score starts from 100 and drops as footprint exceeds 1.8 tons, but climbs as user completes savings.
  const ecoScore = useMemo(() => {
    let score;
    if (currentFootprint > 1.8) {
      // scale score down based on how much they exceed target
      const excess = currentFootprint - 1.8;
      score = Math.max(10, Math.round(100 - excess * 8));
    } else {
      // scale up score towards 100
      const ratio = currentFootprint / 1.8;
      score = Math.min(100, Math.round(50 + (1 - ratio) * 50));
    }
    // Add direct bonus for doing daily actions
    return Math.min(100, score + completedActions.length * 3);
  }, [currentFootprint, completedActions.length]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('cs_baseline', JSON.stringify(baseline));
    localStorage.setItem('cs_has_onboarded', String(hasOnboarded));
  }, [baseline, hasOnboarded]);

  useEffect(() => {
    localStorage.setItem('cs_completed_actions', JSON.stringify(completedActions));
  }, [completedActions]);

  useEffect(() => {
    localStorage.setItem('cs_custom_actions', JSON.stringify(customActions));
  }, [customActions]);

  useEffect(() => {
    localStorage.setItem('cs_selected_team', selectedTeam);
  }, [selectedTeam]);

  useEffect(() => {
    localStorage.setItem('cs_streak', String(streak));
  }, [streak]);

  useEffect(() => {
    localStorage.setItem('cs_teams', JSON.stringify(teams));
  }, [teams]);

  const updateTeamReduction = useCallback((teamId, amount) => {
    setTeams(prev => prev.map(t => {
      if (t.id === teamId) {
        return { ...t, reduction: Math.max(0, Math.round(t.reduction + amount)) };
      }
      return t;
    }));
  }, []);

  const toggleAction = useCallback((id) => {
    setCompletedActions(prev => {
      const exists = prev.includes(id);
      let updated;
      if (exists) {
        updated = prev.filter(item => item !== id);
      } else {
        updated = [...prev, id];
      }
      
      // Update team reduction dynamically
      const actionObj = ACTIONS.find(a => a.id === id);
      if (actionObj) {
        const change = exists ? -actionObj.savings : actionObj.savings;
        updateTeamReduction(selectedTeam, change);
      }

      return updated;
    });
  }, [selectedTeam, updateTeamReduction]);

  const addCustomAction = useCallback((text, savings) => {
    const sanitizedText = sanitizeInput(text);
    const newAction = {
      id: `custom_${Date.now()}`,
      category: 'Custom',
      text: sanitizedText,
      savings: Number(savings) || 1.0,
      checked: true
    };
    setCustomActions(prev => [...prev, newAction]);
    updateTeamReduction(selectedTeam, newAction.savings);
  }, [selectedTeam, updateTeamReduction]);

  const toggleCustomAction = useCallback((id) => {
    setCustomActions(prev => prev.map(action => {
      if (action.id === id) {
        const nextChecked = !action.checked;
        const change = nextChecked ? action.savings : -action.savings;
        updateTeamReduction(selectedTeam, change);
        return { ...action, checked: nextChecked };
      }
      return action;
    }));
  }, [selectedTeam, updateTeamReduction]);

  const deleteCustomAction = useCallback((id) => {
    setCustomActions(prev => {
      const action = prev.find(a => a.id === id);
      if (action && action.checked) {
        updateTeamReduction(selectedTeam, -action.savings);
      }
      return prev.filter(a => a.id !== id);
    });
  }, [selectedTeam, updateTeamReduction]);

  const resetAll = useCallback(() => {
    localStorage.clear();
    setBaseline(DEFAULT_BASELINE);
    setCompletedActions([]);
    setCustomActions([]);
    setSelectedTeam('eng');
    setStreak(3);
    setHasOnboarded(false);
    setTeams(TEAMS_INITIAL);
  }, []);

  return {
    baseline,
    setBaseline,
    completedActions,
    toggleAction,
    customActions,
    addCustomAction,
    toggleCustomAction,
    deleteCustomAction,
    selectedTeam,
    setSelectedTeam,
    streak,
    setStreak,
    hasOnboarded,
    setHasOnboarded,
    totalBaseline,
    totalDailySavings,
    annualSavingsTons,
    currentFootprint,
    ecoScore,
    teams,
    resetAll
  };
}
