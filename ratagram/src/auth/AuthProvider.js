/**
 * AuthProvider se encargará de proveer la autenticación de los usuarios, es decir, 
determinar si un usuario está autenticado una vez hecho el login.
Para esto, de manera general, AuthProvider se encarga de guardar el token del usuario en el 
localStorage y setea a ese usuario como autenticado.
Utilizamos el Hook de useContext ya que, al momento de investigar cómo podíamos iniciar el proyecto, 
nos pareció una buena herramienta a utilizar y mantener a lo largo de las diferentes versiones que fuimos construyendo.
Fuentes que utilizamos para entender el funcionamiento de este Hook:https://medium.com/@diego.coder/contextos-en-react-js-hook-usecontext-440b948226e6
https://es.react.dev/reference/react/useContext 
 */

import { useState, createContext, useContext, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';

//Creamos el objeto AuthContext
const AuthContext = createContext();


// Este sería nuestro proveedor del contexto de autenticación
export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => { //Creamos este useState para guardar el estado de un usuario autenticado
    const token = localStorage.getItem('token'); //Tomamos el token del localStorage
    return !!token; // Los simbolos "!!" nos van a decir si el token existe o no, ya que "token" puede ser ya sea true o false.
  });
  const [user, setUser] = useState(null);

  //Aquí es donde se setea el valor de isAuthenticated, dependiendo de si se encontró o no el token en el localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setUser(decodedToken);
      setIsAuthenticated(true); // Autenticado si hay token
    } else {
      setIsAuthenticated(false); // No autenticado si no hay token
    }
  }, []);

  console.log("AuthUser", user);

  const logout = () =>{
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated,user, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para acceder al contexto de autenticación
export function useAuth() {
  return useContext(AuthContext);
}
