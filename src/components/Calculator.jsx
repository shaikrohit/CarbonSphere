import { useState } from 'react';
import { Plane, Car, Flame, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import PropTypes from 'prop-types';

export default function Calculator({ baseline, onChange, onComplete }) {
  const [step, setStep] = useState(1);
  const [localData, setLocalData] = useState(baseline);

  const handleFieldChange = (field, value) => {
    const updated = { ...localData, [field]: value };
    setLocalData(updated);
    onChange(updated);
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else onComplete();
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="card glass-panel calculator-card animate-fade-in">
      <div className="calculator-header">
        <h2 className="gradient-text">Assess Your Footprint</h2>
        <p className="text-secondary text-sm">
          Step {step} of 3: {step === 1 ? 'Transportation' : step === 2 ? 'Home Energy' : 'Lifestyle & Food'}
        </p>
        <div className="progress-bar-container">
          <div className="progress-bar-fill" style={{ width: `${(step / 3) * 100}%` }}></div>
        </div>
      </div>

      <div className="calculator-body">
        {step === 1 && (
          <div className="form-step animate-slide-in">
            <div className="step-title">
              <Car className="icon-accent" size={20} />
              <h3>How do you commute?</h3>
            </div>
            
            <div className="form-group">
              <label htmlFor="carKm">Weekly Driving Distance (in km)</label>
              <input
                id="carKm"
                type="number"
                min="0"
                max="10000"
                value={localData.carKmPerWeek}
                onChange={(e) => handleFieldChange('carKmPerWeek', Math.min(10000, Math.max(0, parseInt(e.target.value) || 0)))}
                placeholder="e.g. 50"
              />
            </div>

            <div className="form-group">
              <span className="radio-group-label" id="fuel-type-label">Vehicle Fuel Type</span>
              <div className="radio-group" role="radiogroup" aria-labelledby="fuel-type-label">
                {['petrol', 'diesel', 'hybrid', 'ev'].map((type, idx) => {
                  const isChecked = localData.carFuelType === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      role="radio"
                      aria-checked={isChecked}
                      tabIndex={isChecked ? 0 : -1}
                      className={`btn-radio ${isChecked ? 'active' : ''}`}
                      onClick={() => handleFieldChange('carFuelType', type)}
                      onKeyDown={(e) => {
                        const fuelTypes = ['petrol', 'diesel', 'hybrid', 'ev'];
                        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                          e.preventDefault();
                          const nextIdx = (idx + 1) % fuelTypes.length;
                          handleFieldChange('carFuelType', fuelTypes[nextIdx]);
                          setTimeout(() => e.target.parentElement.children[nextIdx]?.focus(), 0);
                        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                          e.preventDefault();
                          const prevIdx = (idx - 1 + fuelTypes.length) % fuelTypes.length;
                          handleFieldChange('carFuelType', fuelTypes[prevIdx]);
                          setTimeout(() => e.target.parentElement.children[prevIdx]?.focus(), 0);
                        }
                      }}
                    >
                      {type.toUpperCase()}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="form-group">
              <div className="step-title">
                <Plane className="icon-accent" size={20} />
                <h3>Flights & Public Transit</h3>
              </div>
              <label htmlFor="flights">Round-trip Flights per Year</label>
              <input
                id="flights"
                type="number"
                min="0"
                max="365"
                value={localData.flightsPerYear}
                onChange={(e) => handleFieldChange('flightsPerYear', Math.min(365, Math.max(0, parseInt(e.target.value) || 0)))}
                placeholder="e.g. 2"
              />
            </div>

            <div className="form-group">
              <label htmlFor="transit">Public Transit Usage (hours per week)</label>
              <input
                id="transit"
                type="number"
                min="0"
                max="168"
                value={localData.publicTransitHoursPerWeek}
                onChange={(e) => handleFieldChange('publicTransitHoursPerWeek', Math.min(168, Math.max(0, parseInt(e.target.value) || 0)))}
                placeholder="e.g. 5"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="form-step animate-slide-in">
            <div className="step-title">
              <Flame className="icon-accent" size={20} />
              <h3>Utility Consumption</h3>
            </div>

            <div className="form-group">
              <label htmlFor="electricity">Monthly Electricity Bill (in kWh)</label>
              <input
                id="electricity"
                type="number"
                min="0"
                max="50000"
                value={localData.electricityKwhPerMonth}
                onChange={(e) => handleFieldChange('electricityKwhPerMonth', Math.min(50000, Math.max(0, parseInt(e.target.value) || 0)))}
                placeholder="e.g. 150"
              />
              <span className="field-hint">Average Indian household uses ~100–250 kWh/month.</span>
            </div>

            <div className="form-group">
              <label htmlFor="lpg">LPG Gas Cylinders per Month (14.2kg cylinders)</label>
              <input
                id="lpg"
                type="number"
                step="0.1"
                min="0"
                max="30"
                value={localData.lpgCylindersPerMonth}
                onChange={(e) => handleFieldChange('lpgCylindersPerMonth', Math.min(30, Math.max(0, parseFloat(e.target.value) || 0)))}
                placeholder="e.g. 0.5"
              />
              <span className="field-hint">Usually one cylinder lasts about 1.5 to 2 months.</span>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="form-step animate-slide-in">
            <div className="step-title">
              <Sparkles className="icon-accent" size={20} />
              <h3>Lifestyle, Diet & Waste</h3>
            </div>

            <div className="form-group">
              <span className="radio-group-label" id="diet-profile-label">Dietary Profile</span>
              <div className="radio-group-vertical" role="radiogroup" aria-labelledby="diet-profile-label">
                {[
                  { value: 'heavy-meat', label: 'Meat-Intense (Daily meat consumption)' },
                  { value: 'low-meat', label: 'Balanced (Meat occasionally / low-meat)' },
                  { value: 'vegetarian', label: 'Vegetarian (No meat, eggs/dairy ok)' },
                  { value: 'vegan', label: 'Strictly Vegan (100% plant-based)' }
                ].map((option, idx) => {
                  const isChecked = localData.dietType === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      role="radio"
                      aria-checked={isChecked}
                      tabIndex={isChecked ? 0 : -1}
                      className={`btn-radio btn-radio-wide ${isChecked ? 'active' : ''}`}
                      onClick={() => handleFieldChange('dietType', option.value)}
                      onKeyDown={(e) => {
                        const optionsList = ['heavy-meat', 'low-meat', 'vegetarian', 'vegan'];
                        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                          e.preventDefault();
                          const nextIdx = (idx + 1) % optionsList.length;
                          handleFieldChange('dietType', optionsList[nextIdx]);
                          setTimeout(() => e.target.parentElement.children[nextIdx]?.focus(), 0);
                        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                          e.preventDefault();
                          const prevIdx = (idx - 1 + optionsList.length) % optionsList.length;
                          handleFieldChange('dietType', optionsList[prevIdx]);
                          setTimeout(() => e.target.parentElement.children[prevIdx]?.focus(), 0);
                        }
                      }}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="form-group">
              <span className="radio-group-label" id="shopping-habits-label">Shopping & Buying Habits</span>
              <div className="radio-group" role="radiogroup" aria-labelledby="shopping-habits-label">
                {[
                  { value: 'high', label: 'Frequent' },
                  { value: 'average', label: 'Moderate' },
                  { value: 'low', label: 'Minimalist' }
                ].map((option, idx) => {
                  const isChecked = localData.shoppingFrequency === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      role="radio"
                      aria-checked={isChecked}
                      tabIndex={isChecked ? 0 : -1}
                      className={`btn-radio ${isChecked ? 'active' : ''}`}
                      onClick={() => handleFieldChange('shoppingFrequency', option.value)}
                      onKeyDown={(e) => {
                        const optionsList = ['high', 'average', 'low'];
                        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                          e.preventDefault();
                          const nextIdx = (idx + 1) % optionsList.length;
                          handleFieldChange('shoppingFrequency', optionsList[nextIdx]);
                          setTimeout(() => e.target.parentElement.children[nextIdx]?.focus(), 0);
                        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                          e.preventDefault();
                          const prevIdx = (idx - 1 + optionsList.length) % optionsList.length;
                          handleFieldChange('shoppingFrequency', optionsList[prevIdx]);
                          setTimeout(() => e.target.parentElement.children[prevIdx]?.focus(), 0);
                        }
                      }}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="form-group">
              <span className="radio-group-label" id="recycling-habits-label">Waste Recycling Habits</span>
              <div className="radio-group" role="radiogroup" aria-labelledby="recycling-habits-label">
                {[
                  { value: 'none', label: 'No Recycling' },
                  { value: 'some', label: 'Partial' },
                  { value: 'most', label: 'Thorough' }
                ].map((option, idx) => {
                  const isChecked = localData.wasteRecycling === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      role="radio"
                      aria-checked={isChecked}
                      tabIndex={isChecked ? 0 : -1}
                      className={`btn-radio ${isChecked ? 'active' : ''}`}
                      onClick={() => handleFieldChange('wasteRecycling', option.value)}
                      onKeyDown={(e) => {
                        const optionsList = ['none', 'some', 'most'];
                        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                          e.preventDefault();
                          const nextIdx = (idx + 1) % optionsList.length;
                          handleFieldChange('wasteRecycling', optionsList[nextIdx]);
                          setTimeout(() => e.target.parentElement.children[nextIdx]?.focus(), 0);
                        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                          e.preventDefault();
                          const prevIdx = (idx - 1 + optionsList.length) % optionsList.length;
                          handleFieldChange('wasteRecycling', optionsList[prevIdx]);
                          setTimeout(() => e.target.parentElement.children[prevIdx]?.focus(), 0);
                        }
                      }}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="calculator-footer">
        {step > 1 && (
          <button type="button" className="btn btn-secondary btn-icon" onClick={handlePrev}>
            <ArrowLeft size={16} />
            Back
          </button>
        )}
        <button type="button" className="btn btn-primary btn-icon margin-left-auto" onClick={handleNext}>
          {step === 3 ? 'Finish & Create EcoSphere' : 'Next'}
          {step !== 3 && <ArrowRight size={16} />}
        </button>
      </div>
    </div>
  );
}

Calculator.propTypes = {
  baseline: PropTypes.shape({
    carKmPerWeek: PropTypes.number.isRequired,
    carFuelType: PropTypes.string.isRequired,
    flightsPerYear: PropTypes.number.isRequired,
    publicTransitHoursPerWeek: PropTypes.number.isRequired,
    electricityKwhPerMonth: PropTypes.number.isRequired,
    lpgCylindersPerMonth: PropTypes.number.isRequired,
    dietType: PropTypes.string.isRequired,
    wasteRecycling: PropTypes.string.isRequired,
    shoppingFrequency: PropTypes.string.isRequired
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onComplete: PropTypes.func.isRequired
};
