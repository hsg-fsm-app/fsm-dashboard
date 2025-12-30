import { ReactNode, useState } from 'react';
import '@styles/components/Layout.css';

interface LayoutProps {
  children: ReactNode;
}

// Added 'chat' to support new chat dashboard navigation
export type NavItem = 'dashboard' | 'site-config' | 'blog-management' | 'chat';

interface NavigationProps {
  activeView: NavItem;
  onNavigate: (view: NavItem) => void;
}

const DashboardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7"/>
    <rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/>
  </svg>
);

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3"/>
    <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24"/>
  </svg>
);

const BlogIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <line x1="10" y1="9" x2="8" y2="9"/>
  </svg>
);

// Chat icon for customer messaging feature
const ChatIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

const Navigation = ({ activeView, onNavigate }: NavigationProps) => {
  const navItems = [
    { id: 'dashboard' as NavItem, label: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'site-config' as NavItem, label: 'Site Configuration', icon: <SettingsIcon /> },
    { id: 'blog-management' as NavItem, label: 'Blog Management', icon: <BlogIcon /> },
    { id: 'chat' as NavItem, label: 'Customer Chat', icon: <ChatIcon /> },
  ];

  return (
    <nav className="cs-sidebar">
      <div className="cs-sidebar-header">
        <h2 className="cs-sidebar-title">Admin Panel</h2>
      </div>
      <ul className="cs-nav-list">
        {navItems.map((item) => (
          <li key={item.id}>
            <button
              className={`cs-nav-item ${activeView === item.id ? 'cs-nav-item--active' : ''}`}
              onClick={() => onNavigate(item.id)}
            >
              <span className="cs-nav-icon">{item.icon}</span>
              <span className="cs-nav-label">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="cs-layout">
      {children}
    </div>
  );
};

export const useNavigation = () => {
  const [activeView, setActiveView] = useState<NavItem>('dashboard');

  return {
    activeView,
    setActiveView,
    Navigation: (props: Omit<NavigationProps, 'activeView' | 'onNavigate'>) => (
      <Navigation activeView={activeView} onNavigate={setActiveView} {...props} />
    ),
  };
};

export default Layout;
