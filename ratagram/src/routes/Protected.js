/**
 * En protected definimos las condiciones que se tienen que cumplir para acceder a determinadas rutas protegidas.
 */
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';

export default function Protected() {
  const { isAuthenticated } = useAuth(); // Aquí vamos a manejar la autenticación del usuario, es decir, si ya existe en la db

  // Verifica si el usuario está autenticado antes de mostrar el contenido de las rutas protegidas
  return isAuthenticated ? <Outlet /> : <Navigate to="/" />; // Si no está autenticado, redirige al login. Si está autenticado, con <Outlet/> permite que el usuario acceda los componentes hijos de Protected, es decir, las rutas protegidas.
}
