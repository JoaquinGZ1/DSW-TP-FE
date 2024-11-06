// src/context/AuthContext.js
import React, { createContext, useState } from 'react';

// Creamos el contexto
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // `null` cuando no está autenticado
  const [role, setRole] = useState(null); // 'organizador' o 'usuario'

  const login = (userData, role) => {
    setUser(userData);
    setRole(role);
  };

  const logout = () => {
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
