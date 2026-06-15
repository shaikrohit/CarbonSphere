import { Lightbulb, Car, TreePine, HelpCircle, ArrowRightLeft } from 'lucide-react';
import PropTypes from 'prop-types';

export default function EquivalencePanel({ currentFootprint }) {
  // Conversions:
  // 1. Household Electricity: Average Indian household uses ~150 kWh/month.
  //    At 0.82 kg CO2/kWh, one month of electricity = 150 * 0.82 = 123 kg CO2.
  //    Footprint in kg = currentFootprint * 1000.
  //    Months of electricity = (currentFootprint * 1000) / 123.
  const footprintKg = currentFootprint * 1000;
  const electricityMonths = Math.round(footprintKg / 123);

  // 2. Car Driving equivalent: Petrol car averages 0.17 kg CO2 per km.
  //    Car km = footprintKg / 0.17.
  const drivingKm = Math.round(footprintKg / 0.17);

  // 3. Trees offset: A mature tree absorbs ~22 kg CO2 per year.
  //    Trees needed = footprintKg / 22.
  const treesNeeded = Math.round(footprintKg / 22);

  // 4. Comparison Nudges (Delhi-Mumbai flight comparison)
  //    1 flight from Delhi to Mumbai = 90 kg CO2.
  const flightsEquivalent = Math.round(footprintKg / 90);

  return (
    <div className="card glass-panel equivalence-card animate-fade-in">
      <div className="card-header-icon">
        <ArrowRightLeft className="icon-accent" size={22} />
        <h3 className="section-title">Cognitive Context: What does this mean?</h3>
      </div>
      <p className="text-secondary text-sm margin-bottom-md">
        Abstract numbers like "Tons of CO₂e" are hard to visualize. Here is what your current annual footprint of <strong>{currentFootprint} Tons ({footprintKg.toLocaleString()} kg)</strong> represents in terms of everyday actions:
      </p>

      <div className="equivalence-grid">
        <div className="eq-item">
          <div className="eq-icon-wrapper bg-yellow-light">
            <Lightbulb className="eq-icon text-yellow" size={24} />
          </div>
          <div className="eq-details">
            <h4 className="eq-value">{electricityMonths.toLocaleString()} Months</h4>
            <p className="eq-label">Electricity Usage</p>
            <p className="eq-desc">of power consumption for an average Indian household (~150 kWh/month).</p>
          </div>
        </div>

        <div className="eq-item">
          <div className="eq-icon-wrapper bg-blue-light">
            <Car className="eq-icon text-blue" size={24} />
          </div>
          <div className="eq-details">
            <h4 className="eq-value">{drivingKm.toLocaleString()} km</h4>
            <p className="eq-label">Driving Distance</p>
            <p className="eq-desc">driven in an average petrol passenger car (emitting 0.17 kg CO₂/km).</p>
          </div>
        </div>

        <div className="eq-item">
          <div className="eq-icon-wrapper bg-green-light">
            <TreePine className="eq-icon text-green" size={24} />
          </div>
          <div className="eq-details">
            <h4 className="eq-value">{treesNeeded.toLocaleString()} Trees</h4>
            <p className="eq-label">Offset Capacity Required</p>
            <p className="eq-desc">mature trees growing for a full year to completely sequester your emissions.</p>
          </div>
        </div>
      </div>

      <div className="equivalence-alert-box bg-accent-light text-accent">
        <HelpCircle size={16} className="margin-right-xs flex-shrink-0" />
        <span>
          <strong>Eye-Opening Comparison:</strong> Your footprint is equivalent to taking <strong>{flightsEquivalent} round-trip flights</strong> between Delhi and Mumbai (which generates ~90 kg CO₂ per passenger).
        </span>
      </div>
    </div>
  );
}

EquivalencePanel.propTypes = {
  currentFootprint: PropTypes.number.isRequired
};
