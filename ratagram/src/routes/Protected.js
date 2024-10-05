import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider'; // Asegúrate de que la ruta es correcta

export default function Protected() {
  const { isAuthenticated } = useAuth(); // Obtener el estado de autenticación

  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
}
