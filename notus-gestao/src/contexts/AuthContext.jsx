// src/contexts/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const recoveredToken = localStorage.getItem('notus_token');
    const recoveredUser = localStorage.getItem('notus_user');

    if (recoveredToken && recoveredUser) {
      api.defaults.headers.Authorization = `Bearer ${recoveredToken}`;
      setUser(JSON.parse(recoveredUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password, tenantId) => {
    try {
      // Bate no AuthController.java do Backend
      const response = await api.post('/auth/authenticate', {
        email,
        password,
        tenantId // Necessário para o Multi-Tenant
      });

      const { token, tenantId: responseTenant } = response.data;

      // Salva dados
      localStorage.setItem('notus_token', token);
      localStorage.setItem('notus_tenant', responseTenant);
      
      const userData = { email, tenantId: responseTenant };
      localStorage.setItem('notus_user', JSON.stringify(userData));

      api.defaults.headers.Authorization = `Bearer ${token}`;
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      console.error("Erro Login:", error);
      return { success: false, message: "Falha ao entrar. Verifique tenant e credenciais." };
    }
  };

  const logout = () => {
    localStorage.removeItem('notus_token');
    localStorage.removeItem('notus_user');
    localStorage.removeItem('notus_tenant');
    api.defaults.headers.Authorization = null;
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ authenticated: !!user, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};