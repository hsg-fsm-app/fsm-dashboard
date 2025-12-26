import { useAdminDashboard } from '@hooks/useAdminDashboard';
import StatBox from '@components/StatBox';
import ContentCard from '@components/ContentCard';

const Dashboard = () => {
  const { features, loading } = useAdminDashboard();

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <h2>Loading Dashboard...</h2>
        <p>Fetching configuration from server...</p>
      </div>
    );
  }

  const UsersIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );

  const ProjectsIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
    </svg>
  );

  const ActivityIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  );

  const DollarIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="1" x2="12" y2="23"/>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  );

  const HomeIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  );

  const BookIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  );

  const ImageIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>
  );

  const StarIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  );

  return (
    <div className="cs-dashboard-view">
      <div className="cs-view-header">
        <h1 className="cs-view-title">Dashboard Overview</h1>
        <p className="cs-view-subtitle">Welcome back! Here's what's happening with your site.</p>
      </div>

      <div className="cs-stats-overview">
        <StatBox icon={<UsersIcon />} number="156" label="Total Customers" variant="primary" />
        <StatBox icon={<ProjectsIcon />} number="34" label="Active Projects" variant="success" />
        <StatBox icon={<ActivityIcon />} number="8" label="Active Features" variant="warning" />
        <StatBox icon={<DollarIcon />} number="$245K" label="Revenue This Year" variant="info" />
      </div>

      <div className="cs-dashboard-section">
        <div className="cs-section-header">
          <h2 className="cs-section-title">Quick Stats</h2>
          <span className="cs-section-badge cs-info">
            {features.filter(f => f.enabled && !f.locked).length} Active Features
          </span>
        </div>
      </div>

      <div className="cs-dashboard-section">
        <div className="cs-section-header">
          <h2 className="cs-section-title">Content Overview</h2>
          <button className="cs-button-secondary">View All</button>
        </div>

        <div className="cs-content-preview">
          <ContentCard
            title="Homepage Content"
            description="Hero section, services, testimonials"
            icon={<HomeIcon />}
            lastUpdated="2 days ago"
          />
          <ContentCard
            title="Blog Posts"
            description="3 published articles"
            icon={<BookIcon />}
            lastUpdated="5 days ago"
          />
          <ContentCard
            title="Project Gallery"
            description="9 project showcases"
            icon={<ImageIcon />}
            lastUpdated="1 week ago"
          />
          <ContentCard
            title="Customer Reviews"
            description="24 testimonials"
            icon={<StarIcon />}
            lastUpdated="3 days ago"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
