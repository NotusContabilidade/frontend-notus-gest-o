import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // Estado para saber se o token é válido
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const recuperarSessao = async () => {
      const token = localStorage.getItem('notus_token');
      const tenantId = localStorage.getItem('notus_tenant');

      if (token && tenantId) {
        api.defaults.headers.Authorization = `Bearer ${token}`;
        try {
          // Busca os dados atualizados do usuário (Nome, Role, etc)
          await carregarUsuarioAtual();
          setAuthenticated(true);
        } catch (error) {
          console.error("Sessão inválida:", error);
          logout();
        }
      }
      setLoading(false);
    };

    recuperarSessao();
  }, []);

  const carregarUsuarioAtual = async () => {
    try {
      // Chama o endpoint que retorna os dados do token (UserController)
      // Ajuste a rota se seu backend estiver '/users/me' ou '/usuarios/me'
      const response = await api.get('/usuarios/me'); 
      setUser(response.data);
    } catch (error) {
      console.error("Erro ao carregar usuário:", error);
      throw error;
    }
  };

  const login = async (email, password, tenantId) => {
    try {
      // 1. Autentica e pega o Token
      const response = await api.post('/auth/authenticate', {
        email,
        password,
        tenantId
      });

      const { token, tenantId: responseTenant } = response.data;

      // 2. Salva Token e Tenant
      localStorage.setItem('notus_token', token);
      localStorage.setItem('notus_tenant', responseTenant);
      api.defaults.headers.Authorization = `Bearer ${token}`;

      // 3. Busca os detalhes do usuário imediatamente
      await carregarUsuarioAtual();
      
      setAuthenticated(true);
      return { success: true };

    } catch (error) {
      console.error("Erro Login:", error);
      return { success: false, message: "Falha ao entrar. Verifique credenciais." };
    }
  };

  const logout = () => {
    localStorage.removeItem('notus_token');
    localStorage.removeItem('notus_tenant');
    localStorage.removeItem('notus_user'); // Limpa legado se houver
    api.defaults.headers.Authorization = undefined;
    setUser(null);
    setAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ authenticated, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};