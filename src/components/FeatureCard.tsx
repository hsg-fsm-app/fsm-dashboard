import { FeatureCardProps } from '@types/index';
import '@styles/components/FeatureCard.css';

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  name, 
  description, 
  icon, 
  status, 
  enabled, 
  link, 
  onToggle,
  onUnlock 
}) => {
  return (
    <div className={`cs-feature-card ${status === 'locked' ? 'cs-locked' : 'cs-enabled'}`}>
      <div className="cs-feature-header">
        <div className="cs-feature-icon">
          {icon}
        </div>
        <span className={`cs-feature-status ${status === 'locked' ? 'cs-locked' : 'cs-active'}`}>
          {status === 'locked' ? 'Locked' : 'Active'}
        </span>
      </div>
      <h3 className="cs-feature-name">{name}</h3>
      <p className="cs-feature-description">{description}</p>
      <div className="cs-feature-footer">
        <button 
          className={`cs-toggle-button ${enabled ? 'cs-enabled' : 'cs-disabled'}`}
          onClick={onToggle}
          disabled={status === 'locked'}
        >
          <span className="cs-toggle-slider"></span>
        </button>
        {status === 'locked' ? (
          <button className="cs-unlock-button" onClick={onUnlock}>Unlock Feature</button>
        ) : (
          <a href={link} className="cs-feature-link">View Module</a>
        )}
      </div>
    </div>
  );
};

export default FeatureCard;
