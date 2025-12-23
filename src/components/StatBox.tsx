import { StatBoxProps } from '@/types';
import '@styles/components/StatBox.css';

const StatBox: React.FC<StatBoxProps> = ({ icon, number, label, variant }) => {
  return (
    <div className="cs-stat-box">
      <div className={`cs-stat-icon cs-${variant}`}>
        {icon}
      </div>
      <div className="cs-stat-content">
        <span className="cs-stat-number">{number}</span>
        <span className="cs-stat-label">{label}</span>
      </div>
    </div>
  );
};

export default StatBox;
