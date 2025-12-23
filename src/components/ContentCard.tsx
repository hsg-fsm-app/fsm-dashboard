import { ContentCardProps } from '@/types';
import '@styles/components/ContentCard.css';

const ContentCard: React.FC<ContentCardProps> = ({ title, description, icon, lastUpdated }) => {
  return (
    <div className="cs-content-card">
      <div className="cs-content-icon">
        {icon}
      </div>
      <div className="cs-content-info">
        <h3 className="cs-content-title">{title}</h3>
        <p className="cs-content-desc">{description}</p>
      </div>
      <span className="cs-content-status">Last updated: {lastUpdated}</span>
    </div>
  );
};

export default ContentCard;
