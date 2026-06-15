import { describe, test, expect, vi, beforeAll } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Leaderboard from './Leaderboard';
import EquivalencePanel from './EquivalencePanel';
import EcoSphere from './EcoSphere';
import ActionTracker from './ActionTracker';
import Calculator from './Calculator';
import InsightsPanel from './InsightsPanel';

// Mock JSDOM missing scrollIntoView
beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
});

// Mock Teams Data
const mockTeams = [
  { id: 'eng', name: 'Engineering Devs', members: 42, reduction: 2450, streak: 12 },
  { id: 'design', name: 'UX/UI Designers', members: 18, reduction: 1120, streak: 8 }
];

describe('Leaderboard Component Tests', () => {
  test('renders team names and reductions', () => {
    const handleSelectTeam = vi.fn();
    render(
      <Leaderboard
        teams={mockTeams}
        selectedTeam="eng"
        onSelectTeam={handleSelectTeam}
        streak={5}
      />
    );

    expect(screen.getByText('Engineering Devs')).toBeDefined();
    expect(screen.getByText('UX/UI Designers')).toBeDefined();
    expect(screen.getByText('2,450 kg')).toBeDefined();
  });

  test('calls onSelectTeam when a team option is clicked', () => {
    const handleSelectTeam = vi.fn();
    render(
      <Leaderboard
        teams={mockTeams}
        selectedTeam="eng"
        onSelectTeam={handleSelectTeam}
        streak={5}
      />
    );

    const designTeamRow = screen.getByText('UX/UI Designers').closest('[role="option"]');
    expect(designTeamRow).toBeDefined();
    fireEvent.click(designTeamRow);
    expect(handleSelectTeam).toHaveBeenCalledWith('design');
  });

  test('responds to keyboard Space/Enter on team option', () => {
    const handleSelectTeam = vi.fn();
    render(
      <Leaderboard
        teams={mockTeams}
        selectedTeam="eng"
        onSelectTeam={handleSelectTeam}
        streak={5}
      />
    );

    const designTeamRow = screen.getByText('UX/UI Designers').closest('[role="option"]');
    fireEvent.keyDown(designTeamRow, { key: 'Enter', code: 'Enter' });
    expect(handleSelectTeam).toHaveBeenCalledWith('design');

    fireEvent.keyDown(designTeamRow, { key: ' ', code: 'Space' });
    expect(handleSelectTeam).toHaveBeenCalledTimes(2);
  });
});

describe('EquivalencePanel Component Tests', () => {
  test('calculates correct equivalences for 5.0 Tons footprint', () => {
    render(<EquivalencePanel currentFootprint={5.0} />);
    
    // footprint = 5.0 Tons = 5000 kg.
    // electricity months = 5000 / 123 = 41 months
    // driving km = 5000 / 0.17 = 29412 km
    // trees needed = 5000 / 22 = 227 trees
    
    expect(screen.getByText('41 Months')).toBeDefined();
    expect(screen.getByText('29,412 km')).toBeDefined();
    expect(screen.getByText('227 Trees')).toBeDefined();
  });
});

describe('EcoSphere Component Tests', () => {
  test('renders healthy pristine world status when score is high', () => {
    render(<EcoSphere ecoScore={90} currentFootprint={1.5} />);
    expect(screen.getByText('Pristine World')).toBeDefined();
    expect(screen.getByText('Excellent! Your footprint is under the Indian urban average. Your world is thriving.')).toBeDefined();
  });

  test('renders strained world status when score is moderate', () => {
    render(<EcoSphere ecoScore={60} currentFootprint={2.5} />);
    expect(screen.getByText('Strained World')).toBeDefined();
    expect(screen.getByText(/Save/)).toBeDefined();
  });

  test('renders hazardous world status when score is low', () => {
    render(<EcoSphere ecoScore={30} currentFootprint={4.2} />);
    expect(screen.getByText('Hazardous World')).toBeDefined();
  });
});

describe('ActionTracker Component Tests', () => {
  const mockCustomActions = [
    { id: 'custom_1', category: 'Custom', text: 'Planted a sapling', savings: 4.5, checked: true }
  ];

  test('renders list of actions and handles tab clicks', () => {
    const toggleAction = vi.fn();
    const addCustomAction = vi.fn();
    const toggleCustomAction = vi.fn();
    const deleteCustomAction = vi.fn();

    render(
      <ActionTracker
        completedActions={['transit']}
        toggleAction={toggleAction}
        customActions={mockCustomActions}
        addCustomAction={addCustomAction}
        toggleCustomAction={toggleCustomAction}
        deleteCustomAction={deleteCustomAction}
        totalDailySavings={8.5}
      />
    );

    // Verify it renders the list headers
    expect(screen.getByText('Daily Action Center')).toBeDefined();
    expect(screen.getByText('-8.5 kg')).toBeDefined();
    expect(screen.getByText('Planted a sapling')).toBeDefined();

    // Verify we can filter by tab
    const transportTab = screen.getByRole('tab', { name: 'Transport' });
    fireEvent.click(transportTab);
    
    // Core transport action: "Took metro/bus instead of driving"
    expect(screen.getByText('Took metro/bus instead of driving')).toBeDefined();
  });
});

describe('Calculator Component Tests', () => {
  const mockBaseline = {
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

  test('walks through steps on Next/Back click', () => {
    const handleChange = vi.fn();
    const handleComplete = vi.fn();

    render(
      <Calculator
        baseline={mockBaseline}
        onChange={handleChange}
        onComplete={handleComplete}
      />
    );

    // Step 1 check
    expect(screen.getByText('Step 1 of 3: Transportation')).toBeDefined();
    
    // Advance to Step 2
    const nextBtn = screen.getByText('Next');
    fireEvent.click(nextBtn);
    expect(screen.getByText('Step 2 of 3: Home Energy')).toBeDefined();

    // Go back to Step 1
    const backBtn = screen.getByText('Back');
    fireEvent.click(backBtn);
    expect(screen.getByText('Step 1 of 3: Transportation')).toBeDefined();
  });
});

describe('InsightsPanel Component Tests', () => {
  const mockBaseline = {
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

  test('renders chatbot messages and handles query inputs', () => {
    render(
      <InsightsPanel
        baseline={mockBaseline}
        currentFootprint={5.24}
        totalBaseline={5.24}
        totalDailySavings={0.0}
        ecoScore={50}
      />
    );

    // Welcome message renders
    expect(screen.getByText(/your AI Carbon Concierge/)).toBeDefined();

    // Typing query and clicking send
    const input = screen.getByPlaceholderText('Ask Aura a carbon question...');
    fireEvent.change(input, { target: { value: 'explain carbon footprint of car' } });
    
    const sendBtn = screen.getByRole('button', { name: 'Send message' });
    fireEvent.click(sendBtn);

    // Message shows in chat
    expect(screen.getByText('explain carbon footprint of car')).toBeDefined();
  });

  test('configures API key inputs', () => {
    render(
      <InsightsPanel
        baseline={mockBaseline}
        currentFootprint={5.24}
        totalBaseline={5.24}
        totalDailySavings={0.0}
        ecoScore={50}
      />
    );

    const configBtn = screen.getByRole('button', { name: 'Configure Gemini Key' });
    fireEvent.click(configBtn);

    expect(screen.getByPlaceholderText('Paste Google Gemini API Key')).toBeDefined();
  });
});
