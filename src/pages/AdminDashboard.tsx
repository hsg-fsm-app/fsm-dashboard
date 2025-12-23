import { useAdminDashboard } from '@hooks/useAdminDashboard';
import StatBox from '@components/StatBox';
import ColorPicker from '@components/ColorPicker';
import FormInput from '@components/FormInput';
import FeatureCard from '@components/FeatureCard';
import ContentCard from '@components/ContentCard';
import '@styles/pages/AdminDashboard.css';

const AdminDashboard = () => {
  const {
    themeColors,
    companyInfo,
    features,
    updateThemeColor,
    updateCompanyInfo,
    toggleFeature,
    unlockFeature,
    saveChanges,
  } = useAdminDashboard();

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

  const EstimatorIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
      <line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  );

  const MessageIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  );

  const LockIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );

  const MailIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  );

  const ClockIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  );

  const InvoiceIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
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

  const UploadIcon = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="17 8 12 3 7 8"/>
      <line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  );

  const featureIcons = [
    <EstimatorIcon />,
    <MessageIcon />,
    <ProjectsIcon />,
    <UsersIcon />,
    <LockIcon />,
    <MailIcon />,
    <ClockIcon />,
    <InvoiceIcon />,
  ];

  const featureDescriptions = [
    'Interactive tool for customers to estimate project costs and requirements.',
    'Secure messaging system for customer communication and support.',
    'Complete project tracking system with timelines and progress monitoring.',
    'Customer relationship management with interaction tracking and follow-ups.',
    'Comprehensive business insights, reports, and performance dashboards.',
    'Automated email campaigns and customer engagement tools.',
    'Integrated calendar system for appointments and team scheduling.',
    'Automated invoicing and online payment processing system.',
  ];

  return (
    <main id="main">
      <section id="admin-dashboard">
        <div className="cs-container">
          <div className="cs-admin-header">
            <div className="cs-admin-header-content">
              <h1 className="cs-admin-title">Admin Dashboard</h1>
              <p className="cs-admin-subtitle">Manage your website settings, features, and content</p>
            </div>
            <div className="cs-admin-actions">
              <button className="cs-button-secondary" onClick={() => window.open('/', '_blank')}>
                View Site
              </button>
              <button className="cs-button" onClick={saveChanges}>
                Save Changes
              </button>
            </div>
          </div>

          <div className="cs-stats-overview">
            <StatBox icon={<UsersIcon />} number="156" label="Total Customers" variant="primary" />
            <StatBox icon={<ProjectsIcon />} number="34" label="Active Projects" variant="success" />
            <StatBox icon={<ActivityIcon />} number="8" label="Active Features" variant="warning" />
            <StatBox icon={<DollarIcon />} number="$245K" label="Revenue This Year" variant="info" />
          </div>

          <div className="cs-admin-grid">
            <div className="cs-admin-section">
              <div className="cs-section-header">
                <h2 className="cs-section-title">Site Customization</h2>
                <span className="cs-section-badge cs-active">Active</span>
              </div>

              <div className="cs-customization-panel">
                <div className="cs-customize-group">
                  <h3 className="cs-customize-subtitle">Brand Colors</h3>
                  <div className="cs-color-grid">
                    <ColorPicker
                      label="Primary Color"
                      value={themeColors.primary}
                      cssVar="--primary"
                      onChange={(value) => updateThemeColor('primary', value)}
                    />
                    <ColorPicker
                      label="Secondary Color"
                      value={themeColors.secondary}
                      cssVar="--secondary"
                      onChange={(value) => updateThemeColor('secondary', value)}
                    />
                    <ColorPicker
                      label="Accent Color"
                      value={themeColors.headerColor}
                      cssVar="--headerColor"
                      onChange={(value) => updateThemeColor('headerColor', value)}
                    />
                  </div>
                </div>

                <div className="cs-customize-group">
                  <h3 className="cs-customize-subtitle">Company Information</h3>
                  <div className="cs-form-grid">
                    <FormInput
                      label="Company Name"
                      type="text"
                      value={companyInfo.name}
                      placeholder="Enter company name"
                      onChange={(value) => updateCompanyInfo('name', value)}
                    />
                    <FormInput
                      label="Phone Number"
                      type="tel"
                      value={companyInfo.phone}
                      placeholder="Enter phone number"
                      onChange={(value) => updateCompanyInfo('phone', value)}
                    />
                    <FormInput
                      label="Email Address"
                      type="email"
                      value={companyInfo.email}
                      placeholder="Enter email"
                      onChange={(value) => updateCompanyInfo('email', value)}
                    />
                    <FormInput
                      label="Business Address"
                      type="text"
                      value={companyInfo.address}
                      placeholder="Enter address"
                      onChange={(value) => updateCompanyInfo('address', value)}
                    />
                  </div>
                </div>

                <div className="cs-customize-group">
                  <h3 className="cs-customize-subtitle">Logo & Branding</h3>
                  <div className="cs-upload-area">
                    <UploadIcon />
                    <p className="cs-upload-text">Drop your logo here or click to upload</p>
                    <p className="cs-upload-hint">PNG, JPG or SVG (max. 2MB)</p>
                    <button className="cs-button-secondary cs-upload-button">Choose File</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="cs-admin-section">
              <div className="cs-section-header">
                <h2 className="cs-section-title">Feature Modules</h2>
                <span className="cs-section-badge cs-info">8 Active</span>
              </div>

              <div className="cs-features-grid">
                {features.map((feature, index) => (
                  <FeatureCard
                    key={feature.id}
                    name={feature.name}
                    description={featureDescriptions[index]}
                    icon={featureIcons[index]}
                    status={feature.status}
                    enabled={feature.enabled}
                    link={feature.link}
                    onToggle={() => toggleFeature(feature.id)}
                    onUnlock={() => unlockFeature(feature.id)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="cs-admin-footer-section">
            <div className="cs-section-header">
              <h2 className="cs-section-title">Content Management</h2>
              <button className="cs-button-secondary">Edit Content</button>
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
      </section>
    </main>
  );
};

export default AdminDashboard;
