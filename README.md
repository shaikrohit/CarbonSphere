# CarbonSphere: Interactive Carbon Footprint Awareness Platform

CarbonSphere is a premium, gamified web application designed to help individuals understand, track, and reduce their carbon footprint through responsive visual feedback, relatable everyday comparisons, and a context-aware smart assistant.

Instead of presenting abstract metric tons of carbon on dry reports, CarbonSphere brings the user's ecological impact to life inside a dynamic virtual world called the **EcoSphere**, connects weight measurements to cognitive physical equivalents, and drives engagement through organization-wide team competition.

---

## 1. Target Audience & Persona
- **Platform Category**: Carbon Footprint Awareness Platform.
- **System Persona**: **Aura, the Carbon Concierge** — an encouraging, professional, and context-aware AI assistant who analyzes the user's specific lifestyle profile and guides them towards high-impact reductions.

---

## 2. Approach & Architecture
We have architected a lightweight, secure, and accessible Single Page Application using **React**, **Vite**, and **custom CSS styling**. The system is split into distinct architectural layers:

1. **State & Analytics Layer (`useCarbonState.js`)**:
   - Manages baseline lifestyle selections (commutes, flight history, utility bills, dietary profile, consumption habits).
   - Computes yearly baseline carbon emissions in metric tons using localized, research-backed carbon factors.
   - Computes daily checked action savings and translates them into real-time offsets.
   - Manages organizational team statistics, habit streaks, and badge levels.

2. **Visual Feedback Layer (`EcoSphere.jsx`)**:
   - Renders a responsive, interactive SVG landscape representing the user's virtual world.
   - Sky colors, cloud density, smoke particle emissions, forest greenery, and wind turbine spin speeds shift in real-time as carbon levels fluctuate.

3. **Cognitive Equivalence Layer (`EquivalencePanel.jsx`)**:
   - Translates abstract carbon weights (e.g. 5.2 Tons of CO₂e) into relatable everyday terms:
     - Equivalent months of household electricity usage.
     - Equivalent driving distance in a petrol car.
     - Total mature trees required to absorb this volume of gas.
     - Equivalent domestic round-trip flights.

4. **Interactive Habits & Custom Actions (`ActionTracker.jsx`)**:
   - Daily checklist grouped by category (Transport, Energy, Diet, Waste).
   - Dynamic form allowing users to add custom actions with specified savings, instantly updating the global state.

5. **Aura: AI Carbon Assistant (`InsightsPanel.jsx`)**:
   - Context-aware chatbot. Aura is provided with the user's current baseline data, daily savings, and EcoScore.
   - Supports **Google Gemini API Key** configuration stored securely in-browser (in `localStorage`).
   - Automatically falls back to a **Local Rule-Based Inference Engine** if no API key is provided, ensuring a fully functional, smart evaluation experience out-of-the-box.

---

## 3. Carbon Calculation Formulas & Coefficients
Calculations are optimized for an urban resident:
- **Private Vehicle**: 
  - Petrol: $0.17$ kg $CO_2$/km
  - Diesel: $0.19$ kg $CO_2$/km
  - Hybrid: $0.10$ kg $CO_2$/km
  - Electric Vehicle: $0.05$ kg $CO_2$/km (adjusted for average Indian grid charging emissions)
- **Domestic Aviation**: $180$ kg $CO_2$ per round-trip flight.
- **Public Transit**: $0.04$ kg $CO_2$ per km (assuming metro/bus averages $20$ km/h).
- **Home Grid Power**: $0.82$ kg $CO_2$ per kWh.
- **LPG Cooking Gas**: $42.5$ kg $CO_2$ per $14.2$ kg cylinder.
- **Dietary Footprints**:
  - Meat-Intense: $2,500$ kg $CO_2$/year
  - Low-Meat: $1,700$ kg $CO_2$/year
  - Vegetarian: $1,200$ kg $CO_2$/year
  - Vegan: $700$ kg $CO_2$/year
- **Consumption & Waste**:
  - High Shopping & Zero Recycling: $+1,600$ kg $CO_2$/year
  - Average Shopping & Partial Recycling: $+800$ kg $CO_2$/year
  - Minimalist Shopping & Thorough Recycling: $+250$ kg $CO_2$/year

---

## 4. Key Rules Compliance
- **Repository Size**: Under **10 MB** (actual codebase size is $<200$ KB without `node_modules`).
- **Single Branch**: All commits are made directly on the primary main branch.
- **Public & Deployable**: Built strictly using public web APIs and is ready for static deployment (Vercel, Netlify, or Google Cloud Run) requiring zero backend services or database overhead.

---

## 5. Setup & Running Locally

### Development Server
Run the local Vite server:
```bash
npm install
npm run dev
```

### Run Unit Tests
Execute the Vitest suite to verify math formulas and state engine correctness:
```bash
npm run test
```

### Production Build
Compile and bundle the production files:
```bash
npm run build
```
The optimized bundle compiles in under $500$ ms with a total bundle size of $<250$ kB, providing excellent performance, resource efficiency, and lightning-fast load times.
