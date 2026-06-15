import { useState } from 'react';
import { ACTIONS } from '../hooks/useCarbonState';
import PropTypes from 'prop-types';
import { Leaf, Train, Bike, Users, Wind, Lightbulb, Plug, Utensils, ShoppingBag, RefreshCw, Trash2, Plus, Check } from 'lucide-react';

const iconMap = {
  Train,
  Bike,
  Users,
  Wind,
  Lightbulb,
  Plug,
  Leaf,
  Utensils,
  ShoppingBag,
  RefreshCw,
  Trash2
};

export default function ActionTracker({
  completedActions,
  toggleAction,
  customActions,
  addCustomAction,
  toggleCustomAction,
  deleteCustomAction,
  totalDailySavings
}) {
  const [activeTab, setActiveTab] = useState('All');
  const [customText, setCustomText] = useState('');
  const [customSavings, setCustomSavings] = useState(1.5);
  const [showAddCustom, setShowAddCustom] = useState(false);

  const categories = ['All', 'Transport', 'Energy', 'Diet', 'Waste', 'Custom'];

  const handleAddCustom = (e) => {
    e.preventDefault();
    if (!customText.trim()) return;
    addCustomAction(customText, customSavings);
    setCustomText('');
    setCustomSavings(1.5);
    setShowAddCustom(false);
  };

  const filteredActions = ACTIONS.filter(action => {
    if (activeTab === 'All') return true;
    return action.category === activeTab;
  });

  return (
    <div className="card glass-panel action-tracker-card animate-fade-in">
      <div className="action-tracker-header">
        <div>
          <h3 className="section-title">Daily Action Center</h3>
          <p className="text-secondary text-sm">Check off activities you did today to immediately reduce your footprint.</p>
        </div>
        <div className="daily-savings-badge">
          <span className="savings-val font-bold">-{totalDailySavings.toFixed(1)} kg</span>
          <span className="savings-lbl">CO₂e Today</span>
        </div>
      </div>

      <div className="tabs-container" role="tablist" aria-label="Action Categories">
        {categories.map((cat, index) => (
          <button
            id={`tab-${cat}`}
            key={cat}
            type="button"
            role="tab"
            aria-selected={activeTab === cat}
            aria-controls={`panel-${cat}`}
            tabIndex={activeTab === cat ? 0 : -1}
            className={`tab-btn ${activeTab === cat ? 'active' : ''}`}
            onClick={() => setActiveTab(cat)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') {
                e.preventDefault();
                const nextIdx = (index + 1) % categories.length;
                setActiveTab(categories[nextIdx]);
                setTimeout(() => document.getElementById(`tab-${categories[nextIdx]}`)?.focus(), 0);
              } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                const prevIdx = (index - 1 + categories.length) % categories.length;
                setActiveTab(categories[prevIdx]);
                setTimeout(() => document.getElementById(`tab-${categories[prevIdx]}`)?.focus(), 0);
              }
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="actions-list" id={`panel-${activeTab}`} role="tabpanel" aria-labelledby={`tab-${activeTab}`}>
        {/* Core Actions */}
        {activeTab !== 'Custom' && filteredActions.map((action) => {
          const IconComponent = iconMap[action.icon] || Leaf;
          const isChecked = completedActions.includes(action.id);
          return (
            <div
              key={action.id}
              className={`action-item ${isChecked ? 'checked' : ''}`}
              onClick={() => toggleAction(action.id)}
              role="checkbox"
              aria-checked={isChecked}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault();
                  toggleAction(action.id);
                }
              }}
              aria-label={`${action.text} (${action.category}) - saves ${action.savings} kg of CO2`}
            >
              <div className="action-checkbox">
                {isChecked && <Check size={14} className="check-icon" />}
              </div>
              <div className="action-icon-wrapper">
                <IconComponent size={18} className="action-icon" />
              </div>
              <div className="action-text-content">
                <span className="action-text">{action.text}</span>
                <span className="action-category-label">{action.category}</span>
              </div>
              <span className="action-savings font-bold">-{action.savings} kg</span>
            </div>
          );
        })}

        {/* Custom Actions */}
        {(activeTab === 'All' || activeTab === 'Custom') && (
          <>
            {customActions.map((action) => (
              <div
                key={action.id}
                className={`action-item custom-action-item ${action.checked ? 'checked' : ''}`}
              >
                <div
                  className="custom-action-main-click"
                  role="checkbox"
                  aria-checked={action.checked}
                  tabIndex={0}
                  onClick={() => toggleCustomAction(action.id)}
                  onKeyDown={(e) => {
                    if (e.key === ' ' || e.key === 'Enter') {
                      e.preventDefault();
                      toggleCustomAction(action.id);
                    }
                  }}
                  aria-label={`${action.text} (Custom Action) - saves ${action.savings} kg of CO2`}
                  style={{ display: 'flex', alignItems: 'center', flexGrow: 1, gap: '12px', cursor: 'pointer' }}
                >
                  <div className="action-checkbox">
                    {action.checked && <Check size={14} className="check-icon" />}
                  </div>
                  <div className="action-icon-wrapper">
                    <Leaf size={18} className="action-icon text-custom" />
                  </div>
                  <div className="action-text-content">
                    <span className="action-text">{action.text}</span>
                    <span className="action-category-label">Custom Action</span>
                  </div>
                </div>
                <div className="action-custom-right">
                  <span className="action-savings font-bold">-{action.savings} kg</span>
                  <button
                    type="button"
                    className="btn-delete-action"
                    onClick={() => deleteCustomAction(action.id)}
                    aria-label={`Delete custom action: ${action.text}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}

            {showAddCustom ? (
              <form onSubmit={handleAddCustom} className="add-custom-form animate-slide-in">
                <div className="form-group-inline">
                  <input
                    type="text"
                    required
                    maxLength={100}
                    aria-label="Describe your custom action"
                    placeholder="Describe your action (e.g. Switched off router at night)"
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                  />
                  <div className="savings-input-wrapper">
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      max="100"
                      required
                      aria-label="Custom action carbon savings in kilograms"
                      placeholder="Savings"
                      value={customSavings}
                      onChange={(e) => setCustomSavings(Math.min(100, Math.max(0.1, parseFloat(e.target.value) || 0.1)))}
                    />
                    <span className="input-unit">kg CO₂</span>
                  </div>
                </div>
                <div className="form-actions">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setShowAddCustom(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm">
                    Add Action
                  </button>
                </div>
              </form>
            ) : (
              <button
                type="button"
                className="btn-add-dashed"
                onClick={() => setShowAddCustom(true)}
              >
                <Plus size={16} className="margin-right-xs" />
                Add Custom Sustainable Action
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

ActionTracker.propTypes = {
  completedActions: PropTypes.arrayOf(PropTypes.string).isRequired,
  toggleAction: PropTypes.func.isRequired,
  customActions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      savings: PropTypes.number.isRequired,
      checked: PropTypes.bool.isRequired
    })
  ).isRequired,
  addCustomAction: PropTypes.func.isRequired,
  toggleCustomAction: PropTypes.func.isRequired,
  deleteCustomAction: PropTypes.func.isRequired,
  totalDailySavings: PropTypes.number.isRequired
};
