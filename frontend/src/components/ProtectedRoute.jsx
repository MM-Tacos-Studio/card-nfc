import { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const API = "https://jamaney-backend.onrender.com/api";

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(
    location.state?.user ? true : null
  );
  const [user, setUser] = useState(location.state?.user || null);

  useEffect(() => {
    // Si on vient de se connecter, l'utilisateur est déjà dans le state
    if (location.state?.user) {
        setIsAuthenticated(true);
        return;
    }

    const checkAuth = async () => {
      try {
        // 1. Récupérer le token sauvegardé au login
        const token = localStorage.getItem('token');
        
        // 2. L'envoyer dans les headers
        const response = await axios.get(`${API}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        });
        
        setUser(response.data);
        setIsAuthenticated(true);
      } catch (error) {
        // Si le token est invalide ou absent, on déconnecte
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, [location.state]);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-jpm-black flex items-center justify-center">
        <div className="text-jpm-gold-light text-lg">Chargement...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}