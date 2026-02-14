import React, { Suspense, lazy } from 'react'; // AJOUTÉ
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import ProtectedRoute from './components/ProtectedRoute';

// CHARGEMENT LAZY (On ne télécharge que si on en a besoin)
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ProfileForm = lazy(() => import('./pages/ProfileForm'));
const PublicProfile = lazy(() => import('./pages/PublicProfile'));
const SuspendedService = lazy(() => import('./pages/SuspendedService'));
const AuthCallback = lazy(() => import('./pages/AuthCallback'));

function AppRouter() {
  const location = useLocation();
  
  if (location.hash?.includes('session_id=')) {
    return <AuthCallback />;
  }
  
  return (
    /* Suspense affiche un petit truc pendant que le code de la page arrive */
    <Suspense fallback={<div className="h-screen bg-[#0a0a0b]" />}>
      <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/profiles/new" element={<ProtectedRoute><ProfileForm /></ProtectedRoute>} />
          <Route path="/profiles/edit/:profileId" element={<ProtectedRoute><ProfileForm /></ProtectedRoute>} />
          <Route path="/suspended" element={<SuspendedService />} />
          
          <Route path="/p/:uniqueLink" element={<PublicProfile />} />
          
          <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
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