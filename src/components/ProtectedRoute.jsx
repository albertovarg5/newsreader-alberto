import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

// Not logged in -> /login. If adminOnly, non-admins -> home.
function ProtectedRoute({ children, adminOnly = false }) {
  const { user, isAdmin } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/" replace />;
  return children;
}

export default ProtectedRoute;
