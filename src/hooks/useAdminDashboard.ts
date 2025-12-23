import { useState } from 'react';
import { ThemeColors, CompanyInfo } from '@types/index';

export const useAdminDashboard = () => {
  const [themeColors, setThemeColors] = useState<ThemeColors>({
    primary: '#ff6a3e',
    secondary: '#ffba43',
    headerColor: '#1a1a1a',
  });

  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: 'Your Company Name',
    phone: '(555) 123-4567',
    email: 'info@company.com',
    address: '123 Main St, City, ST 12345',
  });

  const [features, setFeatures] = useState([
    { id: 1, name: 'Project Estimator', enabled: true, status: 'active' as const, link: '/estimator/' },
    { id: 2, name: 'Client Portal', enabled: true, status: 'active' as const, link: '/portal/' },
    { id: 3, name: 'Job Management', enabled: true, status: 'active' as const, link: '/jobs/' },
    { id: 4, name: 'CRM System', enabled: true, status: 'active' as const, link: '/crm/' },
    { id: 5, name: 'Advanced Analytics', enabled: false, status: 'locked' as const },
    { id: 6, name: 'Email Marketing', enabled: false, status: 'locked' as const },
    { id: 7, name: 'Scheduling & Calendar', enabled: false, status: 'locked' as const },
    { id: 8, name: 'Invoice & Payments', enabled: false, status: 'locked' as const },
  ]);

  const updateThemeColor = (key: keyof ThemeColors, value: string) => {
    setThemeColors(prev => ({ ...prev, [key]: value }));
    document.documentElement.style.setProperty(`--${key}`, value);
  };

  const updateCompanyInfo = (key: keyof CompanyInfo, value: string) => {
    setCompanyInfo(prev => ({ ...prev, [key]: value }));
  };

  const toggleFeature = (id: number) => {
    setFeatures(prev =>
      prev.map(feature =>
        feature.id === id && feature.status === 'active'
          ? { ...feature, enabled: !feature.enabled }
          : feature
      )
    );
  };

  const unlockFeature = (id: number) => {
    // This would typically make an API call
    console.log('Unlock feature:', id);
    alert('Feature unlock functionality would go here');
  };

  const saveChanges = async () => {
    try {
      // This would typically make an API call to save settings
      const response = await fetch('/api/admin/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          themeColors,
          companyInfo,
          features,
        }),
      });
      
      if (response.ok) {
        alert('Changes saved successfully!');
      } else {
        alert('Failed to save changes');
      }
    } catch (error) {
      console.error('Error saving changes:', error);
      alert('Error saving changes');
    }
  };

  return {
    themeColors,
    companyInfo,
    features,
    updateThemeColor,
    updateCompanyInfo,
    toggleFeature,
    unlockFeature,
    saveChanges,
  };
};
