import Layout, { useNavigation } from '@components/Layout';
import Dashboard from '@pages/Dashboard';
import SiteConfiguration from '@pages/SiteConfiguration';
import BlogManagement from '@pages/BlogManagement';
import '@styles/pages/AdminDashboard.css';
import '@styles/pages/Views.css';

const AdminDashboard = () => {
  const { activeView, Navigation } = useNavigation();

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'site-config':
        return <SiteConfiguration />;
      case 'blog-management':
        return <BlogManagement />;
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
