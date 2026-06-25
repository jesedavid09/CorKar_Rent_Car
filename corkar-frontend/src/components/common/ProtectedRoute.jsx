// ============================================================
// components/common/ProtectedRoute.jsx — Rutas protegidas
// ------------------------------------------------------------
// Componente que envuelve rutas que requieren autenticación.
// Si el usuario no está logueado, lo redirige al login.
// Si requireAdmin=true y el usuario no es admin, lo redirige
// al catálogo con un mensaje de acceso denegado.
// ============================================================

import { Navigate } from 'react-router-dom';
import { useAuth }  from '../../context/AuthContext';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin } = useAuth();

  // Si no está autenticado, redirige al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si requiere admin y el usuario no lo es, redirige al catálogo
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/catalogo" replace />;
  }

  // Todo bien, renderiza el contenido de la ruta
  return children;
};

export default ProtectedRoute;