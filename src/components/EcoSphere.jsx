import { Sparkles, Smile, AlertTriangle } from 'lucide-react';
import PropTypes from 'prop-types';

export default function EcoSphere({ ecoScore, currentFootprint }) {
  // Determine color states based on EcoScore
  const isHealthy = ecoScore >= 80;
  const isAverage = ecoScore >= 50 && ecoScore < 80;
  
  // Sky gradient color definitions based on score
  const getSkyGradients = () => {
    if (isHealthy) {
      return { start: '#7de2fc', end: '#b9f6ca', text: 'Pristine' }; // Blue to Mint
    }
    if (isAverage) {
      return { start: '#ffa726', end: '#ffd54f', text: 'Strained' }; // Orange to Yellow
    }
    return { start: '#546e7a', end: '#37474f', text: 'Hazardous' }; // Dark Charcoal/Grey
  };

  const sky = getSkyGradients();

  // Number of trees to render
  const treeCount = isHealthy ? 5 : isAverage ? 3 : 1;
  const leavesColor = isHealthy ? '#00e676' : isAverage ? '#ffd54f' : '#8d6e63';

  // Calculate wind turbine speed (animation duration)
  const spinSpeed = isHealthy ? '2s' : isAverage ? '6s' : '0s'; // faster spin when healthy/green energy active

  // Smoke opacity
  const smokeOpacity = isHealthy ? 0 : isAverage ? 0.3 : 0.8;

  return (
    <div className="card glass-panel ecosphere-card animate-fade-in">
      <div className="ecosphere-header">
        <h3 className="section-title">Your EcoSphere</h3>
        <div className="badge-score" style={{ backgroundColor: isHealthy ? 'rgba(0, 230, 118, 0.15)' : isAverage ? 'rgba(255, 167, 38, 0.15)' : 'rgba(239, 83, 80, 0.15)' }}>
          <span className="bullet" style={{ backgroundColor: isHealthy ? '#00e676' : isAverage ? '#ffa726' : '#ef5350' }}></span>
          {sky.text} World
        </div>
      </div>

      <div className="ecosphere-visual-container">
        <svg
          viewBox="0 0 400 320"
          className="ecosphere-svg"
          width="100%"
          height="100%"
          role="img"
          aria-label="Interactive EcoSphere visual landscape showing ecosystem health"
        >
          <title>EcoSphere Landscape</title>
          <desc>A dynamic mini-island that changes its colors, trees, and wind turbine speed based on your carbon score.</desc>
          <defs>
            {/* Dynamic Sky Gradient */}
            <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={sky.start} />
              <stop offset="100%" stopColor={sky.end} />
            </linearGradient>

            {/* Hill Gradient */}
            <linearGradient id="hillGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={isHealthy ? '#4caf50' : isAverage ? '#8bc34a' : '#795548'} />
              <stop offset="100%" stopColor={isHealthy ? '#2e7d32' : isAverage ? '#558b2f' : '#4e342e'} />
            </linearGradient>

            {/* Water Gradient */}
            <linearGradient id="waterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={isHealthy ? '#00e5ff' : isAverage ? '#29b6f6' : '#90a4ae'} />
              <stop offset="100%" stopColor={isHealthy ? '#00838f' : isAverage ? '#0277bd' : '#455a64'} />
            </linearGradient>
          </defs>

          {/* Sky background */}
          <rect width="400" height="240" fill="url(#skyGrad)" rx="8" />

          {/* Clouds (animated via CSS in index.css) */}
          <g className={`clouds-group ${!isHealthy ? 'stormy-clouds' : ''}`}>
            {/* Cloud 1 */}
            <path d="M 50 80 a 20 20 0 0 1 30 -10 a 25 25 0 0 1 40 5 a 20 20 0 0 1 15 25 l -85 0 z" fill="#ffffff" opacity={isHealthy ? 0.9 : 0.6} />
            {/* Cloud 2 */}
            <path d="M 260 60 a 15 15 0 0 1 20 -5 a 20 20 0 0 1 30 5 a 15 15 0 0 1 10 15 l -60 0 z" fill="#ffffff" opacity={isHealthy ? 0.8 : 0.5} />
            {/* Gray industrial clouds if strained or hazardous */}
            {!isHealthy && (
              <g fill="#90a4ae" opacity={smokeOpacity}>
                <path d="M 160 50 a 20 20 0 0 1 25 -10 a 25 25 0 0 1 35 10 a 20 20 0 0 1 10 15 l -70 0 z" />
                <path d="M 80 40 a 15 15 0 0 1 15 -5 a 20 20 0 0 1 25 5 a 15 15 0 0 1 5 10 l -45 0 z" />
              </g>
            )}
          </g>

          {/* Sun / Moon */}
          {isHealthy ? (
            <circle cx="340" cy="60" r="24" fill="#ffeb3b" opacity="0.9" filter="drop-shadow(0px 0px 8px #ffeb3b)" />
          ) : isAverage ? (
            <circle cx="340" cy="60" r="22" fill="#ffb74d" opacity="0.75" />
          ) : (
            <circle cx="340" cy="60" r="20" fill="#e0e0e0" opacity="0.4" />
          )}

          {/* Water */}
          <rect x="0" y="220" width="400" height="100" fill="url(#waterGrad)" rx="8" />

          {/* Island Hill */}
          <path d="M -20 240 Q 200 140 420 240 Z" fill="url(#hillGrad)" />

          {/* Small Factory Pipe (Shows if emissions are high) */}
          {!isHealthy && (
            <g transform="translate(70, 150)">
              {/* Smoke puff */}
              <circle className="smoke-puff-1" cx="30" cy="-20" r="8" fill="#78909c" opacity={smokeOpacity} />
              <circle className="smoke-puff-2" cx="35" cy="-35" r="12" fill="#546e7a" opacity={smokeOpacity} />
              {/* Chimney structure */}
              <rect x="20" y="-10" width="15" height="50" fill="#37474f" />
              <rect x="18" y="-14" width="19" height="5" fill="#ef5350" />
            </g>
          )}

          {/* Trees on the island */}
          <g className="trees-group">
            {/* Tree 1 (Left) */}
            {treeCount >= 1 && (
              <g transform="translate(130, 160)">
                <rect x="-3" y="10" width="6" height="20" fill="#5d4037" />
                <circle cx="0" cy="0" r="14" fill={leavesColor} />
                <circle cx="-8" cy="-6" r="10" fill={leavesColor} />
                <circle cx="8" cy="-6" r="10" fill={leavesColor} />
              </g>
            )}
            {/* Tree 2 (Mid-Left) */}
            {treeCount >= 3 && (
              <g transform="translate(170, 150)">
                <rect x="-2" y="12" width="5" height="22" fill="#5d4037" />
                <circle cx="0" cy="0" r="15" fill={leavesColor} />
                <circle cx="-7" cy="-7" r="11" fill={leavesColor} />
                <circle cx="7" cy="-7" r="11" fill={leavesColor} />
              </g>
            )}
            {/* Tree 3 (Mid-Right) */}
            {treeCount >= 3 && (
              <g transform="translate(230, 155)">
                <rect x="-3" y="10" width="6" height="20" fill="#5d4037" />
                <circle cx="0" cy="0" r="13" fill={leavesColor} />
                <circle cx="-6" cy="-5" r="9" fill={leavesColor} />
                <circle cx="6" cy="-5" r="9" fill={leavesColor} />
              </g>
            )}
            {/* Tree 4 & 5 (Healthy only) */}
            {treeCount >= 5 && (
              <>
                <g transform="translate(200, 140)">
                  <rect x="-2" y="10" width="5" height="20" fill="#5d4037" />
                  <circle cx="0" cy="0" r="14" fill="#00c853" />
                  <circle cx="-7" cy="-6" r="10" fill="#00c853" />
                </g>
                <g transform="translate(270, 170)">
                  <rect x="-2" y="8" width="5" height="16" fill="#5d4037" />
                  <circle cx="0" cy="0" r="12" fill="#00c853" />
                </g>
              </>
            )}
          </g>

          {/* Wind Turbine (Green Energy Symbol) */}
          <g transform="translate(300, 130)">
            {/* Pole */}
            <line x1="0" y1="0" x2="0" y2="60" stroke="#cfd8dc" strokeWidth="4" strokeLinecap="round" />
            <polygon points="-5,60 5,60 3,55 -3,55" fill="#b0bec5" />
            {/* Rotating Hub & Blades */}
            <g className="turbine-blades" style={{ animationDuration: spinSpeed }}>
              <circle cx="0" cy="0" r="4" fill="#eceff1" />
              {/* Blade 1 */}
              <path d="M 0 0 Q -4 -20 0 -35 Q 4 -20 0 0 Z" fill="#ffffff" stroke="#cfd8dc" strokeWidth="0.5" />
              {/* Blade 2 */}
              <g transform="rotate(120)">
                <path d="M 0 0 Q -4 -20 0 -35 Q 4 -20 0 0 Z" fill="#ffffff" stroke="#cfd8dc" strokeWidth="0.5" />
              </g>
              {/* Blade 3 */}
              <g transform="rotate(240)">
                <path d="M 0 0 Q -4 -20 0 -35 Q 4 -20 0 0 Z" fill="#ffffff" stroke="#cfd8dc" strokeWidth="0.5" />
              </g>
            </g>
          </g>

          {/* Cute Wildlife - Little bird (Flying) if Pristine */}
          {isHealthy && (
            <g className="wildlife-bird">
              <path d="M 80 120 Q 90 115 100 120 Q 110 115 120 120 Q 110 125 100 123 Q 90 125 80 120 Z" fill="#37474f" />
            </g>
          )}
        </svg>

        {/* Dynamic Glass Overlay Metrics */}
        <div className="ecosphere-stats-overlay">
          <div className="stat-item">
            <span className="label">EcoScore</span>
            <span className={`value font-bold ${isHealthy ? 'green' : isAverage ? 'yellow' : 'red'}`}>
              {ecoScore}
            </span>
          </div>
          <div className="stat-separator"></div>
          <div className="stat-item">
            <span className="label">Annual Footprint</span>
            <span className="value font-bold">{currentFootprint} Tons CO₂e</span>
          </div>
        </div>
      </div>

      <div className="ecosphere-footer">
        {isHealthy ? (
          <div className="tip-box text-green bg-green-light">
            <Smile size={16} className="margin-right-xs" />
            <span>Excellent! Your footprint is under the Indian urban average. Your world is thriving.</span>
          </div>
        ) : isAverage ? (
          <div className="tip-box text-yellow bg-yellow-light">
            <Sparkles size={16} className="margin-right-xs" />
            <span>Moderate state. Save <strong>{(currentFootprint - 1.8).toFixed(1)} tons</strong> more to restore full ecosystem health!</span>
          </div>
        ) : (
          <div className="tip-box text-red bg-red-light">
            <AlertTriangle size={16} className="margin-right-xs" />
            <span>High emissions are deteriorating the environment. Check off daily habits below to clean the atmosphere!</span>
          </div>
        )}
      </div>
    </div>
  );
}

EcoSphere.propTypes = {
  ecoScore: PropTypes.number.isRequired,
  currentFootprint: PropTypes.number.isRequired
};
