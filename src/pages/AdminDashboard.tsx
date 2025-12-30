import Layout, { useNavigation } from '@components/Layout';
import Dashboard from '@pages/Dashboard';
import SiteConfiguration from '@pages/SiteConfiguration';
import BlogManagement from '@pages/BlogManagement';
import ChatDashboard from '@pages/ChatDashboard';
import '@styles/pages/AdminDashboard.css';
import '@styles/pages/Views.css';

const AdminDashboard = () => {
  const { activeView, Navigation } = useNavigation();

  // Render the appropriate view based on navigation selection
  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'site-config':
        return <SiteConfiguration />;
      case 'blog-management':
        return <BlogManagement />;
      case 'chat':
        // Chat dashboard has its own full-height layout
        return <ChatDashboard />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout>
      <Navigation />
      <main className="cs-content-area">
        {renderContent()}
      </main>
    </Layout>
  );
};

export default AdminDashboard;
