import { Routes, Route } from 'react-router-dom';
import AdminDashboard from '@pages/AdminDashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;
