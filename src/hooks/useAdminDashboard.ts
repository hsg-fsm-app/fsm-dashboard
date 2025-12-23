import { useState, useEffect } from 'react';
import { ThemeColors, CompanyInfo } from '@types/index';

interface SiteConfig {
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    logoUrl: string;
    logoDarkUrl: string;
    faviconUrl: string;
  };
  company: {
    name: string;
    phone: string;
    email: string;
    address: string;
  };
  modules: Record<string, {
    enabled: boolean;
    locked: boolean;
    path: string;
    name: string;
    description: string;
  }>;
}

const API_URL = 'http://localhost:3000';

export const useAdminDashboard = () => {
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch initial config from server
  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await fetch(`${API_URL}/api/site-config`);
      if (response.ok) {
        const config = await response.json();
        setSiteConfig(config);
      }
    } catch (error) {
      console.error('Error fetching config:', error);
    } finally {
      setLoading(false);
    }
  };

  // Derive state from siteConfig
  const themeColors: ThemeColors = siteConfig ? {
    primary: siteConfig.theme.primaryColor,
    secondary: siteConfig.theme.secondaryColor,
    headerColor: siteConfig.theme.accentColor,
  } : {
    primary: '#ff6a3e',
    secondary: '#ffba43',
    headerColor: '#1a1a1a',
  };

  const companyInfo: CompanyInfo = siteConfig?.company || {
    name: 'Your Company Name',
    phone: '(555) 123-4567',
    email: 'info@company.com',
    address: '123 Main St, City, ST 12345',
  };

  // Convert modules object to array format
  const features = siteConfig ? Object.entries(siteConfig.modules).map(([key, module], index) => ({
    id: index + 1,
    key,
    name: module.name,
    description: module.description,
    enabled: module.enabled,
    status: module.locked ? 'locked' as const : 'active' as const,
    link: module.path,
    locked: module.locked,
  })) : [];

  const updateThemeColor = (key: keyof ThemeColors, value: string) => {
    if (!siteConfig) return;
    
    const colorMap: Record<keyof ThemeColors, string> = {
      primary: 'primaryColor',
      secondary: 'secondaryColor',
      headerColor: 'accentColor',
    };
    
    setSiteConfig({
      ...siteConfig,
      theme: {
        ...siteConfig.theme,
        [colorMap[key]]: value,
      },
    });
    document.documentElement.style.setProperty(`--${key}`, value);
  };

  const updateCompanyInfo = (key: keyof CompanyInfo, value: string) => {
    if (!siteConfig) return;
    
    setSiteConfig({
      ...siteConfig,
      company: {
        ...siteConfig.company,
        [key]: value,
      },
    });
  };

  const toggleFeature = (id: number) => {
    if (!siteConfig) return;
    
    const feature = features.find(f => f.id === id);
    if (!feature || feature.locked) return;
    
    setSiteConfig({
      ...siteConfig,
      modules: {
        ...siteConfig.modules,
        [feature.key]: {
          ...siteConfig.modules[feature.key],
          enabled: !siteConfig.modules[feature.key].enabled,
        },
      },
    });
  };

  const unlockFeature = (id: number) => {
    const feature = features.find(f => f.id === id);
    if (!feature) return;
    
    alert(`Unlock ${feature.name}? This would typically process payment and unlock the feature.`);
    // TODO: Implement unlock logic with payment processing
  };

  const saveChanges = async () => {
    if (!siteConfig) return;
    
    try {
      const response = await fetch(`${API_URL}/api/site-config/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(siteConfig),
      });
      
      if (response.ok) {
        const result = await response.json();
        alert('✓ Changes saved successfully!\n\nYour webapp will now use the updated configuration.');
        console.log('CSS Variables generated:', result.css);
      } else {
        alert('Failed to save changes');
      }
    } catch (error) {
      console.error('Error saving changes:', error);
      alert('Error saving changes. Make sure the server is running on port 3000.');
    }
  };

  return {
    themeColors,
    companyInfo,
    features,
    loading,
    updateThemeColor,
    updateCompanyInfo,
    toggleFeature,
    unlockFeature,
    saveChanges,
  };
};
