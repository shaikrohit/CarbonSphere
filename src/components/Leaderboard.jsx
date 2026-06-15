import { Trophy, Flame, Users, Sparkles } from 'lucide-react';
import PropTypes from 'prop-types';
import { getBadgeName } from '../utils/helpers';

/**
 * Leaderboard Component - Displays the department competition standings, user streaks,
 * and ranking badges. Includes keyboard option selectability.
 * 
 * @component
 */
export default function Leaderboard({ teams, selectedTeam, onSelectTeam, streak }) {
  // Sort teams by total reduction descending
  const sortedTeams = [...teams].sort((a, b) => b.reduction - a.reduction);

  return (
    <div className="card glass-panel leaderboard-card animate-fade-in">
      <div className="card-header-icon">
        <Trophy className="icon-accent" size={22} />
        <h3 className="section-title">Collective Accountability</h3>
      </div>
      <p className="text-secondary text-sm margin-bottom-md">
        Reducing footprint is a collective effort. Compare progress against other organizational teams. Join a team and compete!
      </p>

      {/* User Streak & Badge */}
      <div className="user-streak-banner">
        <div className="streak-stat">
          <Flame className="text-orange animate-pulse" size={24} />
          <div>
            <span className="streak-num font-bold">{streak} Days</span>
            <span className="streak-lbl">Active Habit Streak</span>
          </div>
        </div>
        <div className="badge-stat">
          <Sparkles className="text-accent" size={20} />
          <div>
            <span className="badge-name font-bold">{getBadgeName(streak)}</span>
            <span className="badge-lbl">Rank Badge</span>
          </div>
        </div>
      </div>

      <div className="teams-list" role="listbox" aria-label="Department Leaderboard Selection">
        {sortedTeams.map((team, index) => {
          const isSelected = team.id === selectedTeam;
          const maxReduction = sortedTeams[0].reduction || 1;
          const percentage = (team.reduction / maxReduction) * 100;

          return (
            <div
              key={team.id}
              className={`team-row-item ${isSelected ? 'selected-team' : ''}`}
              onClick={() => onSelectTeam(team.id)}
              role="option"
              aria-selected={isSelected}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault();
                  onSelectTeam(team.id);
                }
              }}
              aria-label={`${team.name}, Rank ${index + 1}, ${team.members} members, ${team.streak} days average streak. Saved ${team.reduction.toLocaleString()} kilograms of CO2. ${isSelected ? 'Your selected team.' : 'Click to select.'}`}
            >
              <div className="team-rank">{index + 1}</div>
              <div className="team-info">
                <div className="team-name-row">
                  <span className="team-name font-bold">{team.name}</span>
                  {isSelected && <span className="your-team-badge">You</span>}
                </div>
                <div className="team-stats-row text-xs text-secondary">
                  <span><Users size={12} className="inline-icon" /> {team.members} members</span>
                  <span>•</span>
                  <span><Flame size={12} className="inline-icon text-orange" /> {team.streak}d avg streak</span>
                </div>
                {/* Visual Progress Bar */}
                <div className="team-progress-bar-container">
                  <div className="team-progress-bar-fill" style={{ width: `${percentage}%` }}></div>
                </div>
              </div>
              <div className="team-reduction font-bold">
                {team.reduction.toLocaleString()} kg
                <span className="reduction-lbl">saved</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

Leaderboard.propTypes = {
  teams: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      members: PropTypes.number.isRequired,
      reduction: PropTypes.number.isRequired,
      streak: PropTypes.number.isRequired
    })
  ).isRequired,
  selectedTeam: PropTypes.string.isRequired,
  onSelectTeam: PropTypes.func.isRequired,
  streak: PropTypes.number.isRequired
};
