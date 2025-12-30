import { Routes, Route } from 'react-router-dom';
import AdminDashboard from '@pages/AdminDashboard';
import ChatDashboard from '@pages/ChatDashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/chat" element={<ChatDashboard />} />
    </Routes>
  );
}

export default App;
