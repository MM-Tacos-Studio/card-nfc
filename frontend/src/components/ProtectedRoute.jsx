import { Navigate } from 'react-router-dom';

/**
 * PROTECTED ROUTE CORRIGÉE
 * Cette version vérifie le token localement pour une redirection instantanée.
 * La validité réelle du token est gérée par les appels API dans les pages (Dashboard/Form).
 */
export default function ProtectedRoute({ children }) {
  // 1. On vérifie immédiatement si le token est stocké dans le téléphone/navigateur
  const token = localStorage.getItem('token');

  // 2. Si le token n'existe pas, on renvoie DIRECTEMENT vers le login
  // Le "replace" évite que l'utilisateur puisse revenir en arrière sur une page protégée
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 3. Si le token est présent, on affiche le contenu (Dashboard ou Formulaire)
  // Plus besoin de "Chargement..." ou de "useState" qui ralentissent l'entrée
  return children;
}