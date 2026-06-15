import { lazy, Suspense } from 'react';
import useCarbonState from './hooks/useCarbonState';
import { Leaf, RefreshCw, Heart } from 'lucide-react';
import './App.css';

// Lazy-load dashboard and onboarding widgets to improve initial page load speed
const Calculator = lazy(() => import('./components/Calculator'));
const EcoSphere = lazy(() => import('./components/EcoSphere'));
const ActionTracker = lazy(() => import('./components/ActionTracker'));
const EquivalencePanel = lazy(() => import('./components/EquivalencePanel'));
const Leaderboard = lazy(() => import('./components/Leaderboard'));
const InsightsPanel = lazy(() => import('./components/InsightsPanel'));

function App() {
  const {
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
    hasOnboarded,
    setHasOnboarded,
    totalBaseline,
    totalDailySavings,
    currentFootprint,
    ecoScore,
    teams,
    resetAll
  } = useCarbonState();

  const handleOnboardingComplete = () => {
    setHasOnboarded(true);
  };

  const handleReevaluate = () => {
    setHasOnboarded(false);
  };

  return (
    <div className="app-container">
      {/* Premium Header */}
      <header className="app-header glass-panel">
        <div className="header-brand">
          <div className="brand-logo-wrapper">
            <Leaf className="brand-logo text-green animate-pulse" size={28} />
          </div>
          <div>
            <h1 className="brand-title gradient-text">CarbonSphere</h1>
            <p className="brand-tagline">Understand. Track. Transform.</p>
          </div>
        </div>
        
        {hasOnboarded && (
          <div className="header-actions">
            <button
              type="button"
              className="btn btn-secondary btn-icon"
              onClick={handleReevaluate}
              aria-label="Re-evaluate Baseline"
            >
              <RefreshCw size={15} />
              <span>Update Baseline</span>
            </button>
            <button
              type="button"
              className="btn btn-danger btn-icon"
              onClick={resetAll}
              aria-label="Reset All Data"
            >
              Reset Data
            </button>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="app-main-content">
        {!hasOnboarded ? (
          <div className="onboarding-container">
            <div className="onboarding-hero animate-fade-in">
              <span className="badge-promo bg-accent-light text-accent">EcoSphere Simulator</span>
              <h2 className="hero-headline font-bold">
                Make the Invisible <span className="gradient-text">Visible</span>
              </h2>
              <p className="hero-subtext">
                Your actions shape the world. Take 60 seconds to calculate your carbon baseline footprint, and watch your virtual EcoSphere react in real-time to your habits.
              </p>
            </div>
            
            <div className="calculator-wrapper">
              <Suspense fallback={<div className="loading-fallback glass-panel"><div className="spinner"></div><p>Initializing Eco-Calculator...</p></div>}>
                <Calculator
                  baseline={baseline}
                  onChange={setBaseline}
                  onComplete={handleOnboardingComplete}
                />
              </Suspense>
            </div>
            
            <div className="features-preview-grid">
              <div className="preview-card glass-panel">
                <h3>Living EcoSphere</h3>
                <p>An interactive digital island that shifts color, vegetation, and atmosphere based on your choices.</p>
              </div>
              <div className="preview-card glass-panel">
                <h3>Daily Micro-Actions</h3>
                <p>Simple checkpoints and custom actions to reduce carbon day-by-day with instant feedback.</p>
              </div>
              <div className="preview-card glass-panel">
                <h3>Social Accountability</h3>
                <p>Form friendly alliances across organizational teams, complete streaks, and lead the scoreboard.</p>
              </div>
            </div>
          </div>
        ) : (
          <Suspense fallback={<div className="loading-fallback glass-panel"><div className="spinner"></div><p>Synchronizing your virtual EcoSphere...</p></div>}>
            <div className="dashboard-grid animate-fade-in">
              {/* Left Column: Visuals & Cognition */}
              <div className="dashboard-col left-col">
                <EcoSphere
                  ecoScore={ecoScore}
                  currentFootprint={currentFootprint}
                />
                <EquivalencePanel
                  currentFootprint={currentFootprint}
                />
              </div>

              {/* Right Column: Activities, Insights & Teams */}
              <div className="dashboard-col right-col">
                <ActionTracker
                  completedActions={completedActions}
                  toggleAction={toggleAction}
                  customActions={customActions}
                  addCustomAction={addCustomAction}
                  toggleCustomAction={toggleCustomAction}
                  deleteCustomAction={deleteCustomAction}
                  totalDailySavings={totalDailySavings}
                />
                
                <InsightsPanel
                  baseline={baseline}
                  currentFootprint={currentFootprint}
                  totalBaseline={totalBaseline}
                  totalDailySavings={totalDailySavings}
                  ecoScore={ecoScore}
                />

                <Leaderboard
                  teams={teams}
                  selectedTeam={selectedTeam}
                  onSelectTeam={setSelectedTeam}
                  streak={streak}
                />
              </div>
            </div>
          </Suspense>
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer text-secondary text-xs">
        <div className="footer-content">
          <p>© {new Date().getFullYear()} CarbonSphere. A Professional Carbon Footprint Awareness Platform.</p>
          <div className="footer-links">
            <span className="flex-center gap-xs">
              Made with <Heart size={12} className="text-red" /> for sustainability
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
