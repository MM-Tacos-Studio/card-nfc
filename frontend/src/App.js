import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProfileForm from './pages/ProfileForm';
import PublicProfile from './pages/PublicProfile';
import SuspendedService from './pages/SuspendedService';
import AuthCallback from './pages/AuthCallback';
import ProtectedRoute from './components/ProtectedRoute';

function AppRouter() {
  const location = useLocation();
  
  if (location.hash?.includes('session_id=')) {
    return <AuthCallback />;
  }
  
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/profiles/new" element={<ProtectedRoute><ProfileForm /></ProtectedRoute>} />
      <Route path="/profiles/edit/:profileId" element={<ProtectedRoute><ProfileForm /></ProtectedRoute>} />
      <Route path="/suspended" element={<SuspendedService />} />
      <Route path="/:uniqueLink" element={<PublicProfile />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AppRouter />
        <Toaster position="top-center" />
      </BrowserRouter>
    </div>
  );
}

export default App;