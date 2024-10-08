import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';

export default function Protected() {
  const { isAuthenticated } = useAuth();

  // Verifica si el usuario está autenticado antes de mostrar el contenido protegido
  return isAuthenticated ? <Outlet /> : <Navigate to="/" />; // Si no está autenticado, redirige al login
}
