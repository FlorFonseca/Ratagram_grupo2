// auth/AuthProvider.js
import { useState, createContext, useContext, useEffect } from 'react';

// Crear el contexto de autenticación
const AuthContext = createContext();

// Proveedor del contexto de autenticación
export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificar si hay un token en el localStorage cuando se monta el componente
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true); // Autenticado si hay token
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para acceder al contexto de autenticación
export function useAuth() {
  return useContext(AuthContext);
}
