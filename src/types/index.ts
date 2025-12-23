export interface StatBoxProps {
  icon: React.ReactNode;
  number: string;
  label: string;
  variant: 'primary' | 'success' | 'warning' | 'info';
}

export interface ColorPickerProps {
  label: string;
  value: string;
  cssVar: string;
  onChange: (color: string) => void;
}

export interface FormInputProps {
  label: string;
  type: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}

export interface FeatureCardProps {
  name: string;
  description: string;
  icon: React.ReactNode;
  status: 'active' | 'locked';
  enabled: boolean;
  link?: string;
  onToggle: () => void;
  onUnlock?: () => void;
}

export interface ContentCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  lastUpdated: string;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  headerColor: string;
}

export interface CompanyInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
}
