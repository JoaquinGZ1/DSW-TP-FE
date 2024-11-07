import { useState, useEffect } from 'react';

// Custom hook para manejar la autenticación
function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Función para verificar si el token existe en localStorage
    const checkAuth = () => {
      const token = localStorage.getItem('Token');
      if (token) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    };

    // Verificar autenticación cuando se monte el componente
    checkAuth();

    // Escuchar cambios en el localStorage
    window.addEventListener('storage', checkAuth);

    // Cleanup listener cuando el componente se desmonte
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  return isAuthenticated;
}

export default useAuth;
