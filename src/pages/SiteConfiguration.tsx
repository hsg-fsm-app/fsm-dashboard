import { useAdminDashboard } from '@hooks/useAdminDashboard';
import ColorPicker from '@components/ColorPicker';
import FormInput from '@components/FormInput';
import FeatureCard from '@components/FeatureCard';

const SiteConfiguration = () => {
  const {
    themeColors,
    companyInfo,
    features,
    loading,
    updateThemeColor,
    updateCompanyInfo,
    toggleFeature,
    unlockFeature,
    saveChanges,
  } = useAdminDashboard();

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <h2>Loading Configuration...</h2>
        <p>Fetching configuration from server...</p>
      </div>
    );
  }

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

  const ProjectsIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
    </svg>
  );

  const UsersIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
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

  return (
    <div className="cs-site-config-view">
      <div className="cs-view-header">
        <div>
          <h1 className="cs-view-title">Site Configuration</h1>
          <p className="cs-view-subtitle">Customize your website's appearance and features</p>
        </div>
        <div className="cs-view-actions">
          <button className="cs-button-secondary" onClick={() => window.open('/', '_blank')}>
            View Site
          </button>
          <button className="cs-button" onClick={saveChanges}>
            Save Changes
          </button>
        </div>
      </div>

      <div className="cs-config-section">
        <div className="cs-section-header">
          <h2 className="cs-section-title">Brand Colors</h2>
          <span className="cs-section-badge cs-active">Active</span>
        </div>

        <div className="cs-customization-panel">
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
      </div>

      <div className="cs-config-section">
        <div className="cs-section-header">
          <h2 className="cs-section-title">Company Information</h2>
        </div>

        <div className="cs-customization-panel">
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
      </div>

      <div className="cs-config-section">
        <div className="cs-section-header">
          <h2 className="cs-section-title">Logo & Branding</h2>
        </div>

        <div className="cs-customization-panel">
          <div className="cs-upload-area">
            <UploadIcon />
            <p className="cs-upload-text">Drop your logo here or click to upload</p>
            <p className="cs-upload-hint">PNG, JPG or SVG (max. 2MB)</p>
            <button className="cs-button-secondary cs-upload-button">Choose File</button>
          </div>
        </div>
      </div>

      <div className="cs-config-section">
        <div className="cs-section-header">
          <h2 className="cs-section-title">Feature Modules</h2>
          <span className="cs-section-badge cs-info">
            {features.filter(f => f.enabled && !f.locked).length} Active
          </span>
        </div>

        <div className="cs-features-grid">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.id}
              name={feature.name}
              description={feature.description}
              icon={featureIcons[index] || <EstimatorIcon />}
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
  );
};

export default SiteConfiguration;
