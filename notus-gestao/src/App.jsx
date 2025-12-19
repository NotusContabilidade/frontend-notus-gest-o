import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import { useContext } from 'react';

// Importação das Páginas Existentes
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Clientes from './pages/clientes/Clientes';
import Processos from './pages/processos/Processos';
import Usuarios from './pages/usuarios/Usuarios';
import Auditoria from './pages/Auditoria/Auditoria';

// --- NOVAS PÁGINAS (Módulo Gestão) ---
import Financeiro from './pages/Financeiro/Financeiro';
import Carteira from './pages/Carteira/Carteira';

// Layout Principal (A estrutura fixa)
import MainLayout from './components/Layout/MainLayout';

// Componente para Proteger Rotas (Só entra se estiver logado)
const PrivateRoute = ({ children, titulo }) => {
  const { authenticated, loading } = useContext(AuthContext);

  if (loading) {
    return <div style={{display:'flex', justifyContent:'center', marginTop:'50px', color:'#fff'}}>Carregando sistema...</div>;
  }

  if (!authenticated) {
    return <Navigate to="/login" />;
  }

  // O Layout envolve o filho (Página)
  return (
    <MainLayout titulo={titulo}>
      {children}
    </MainLayout>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rota Pública */}
          <Route path="/login" element={<Login />} />

          {/* --- ROTAS PRINCIPAIS --- */}
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute titulo="Visão Geral">
                <Dashboard />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/clientes" 
            element={
              <PrivateRoute titulo="Carteira de Clientes">
                <Clientes />
              </PrivateRoute>
            } 
          />

          <Route 
            path="/usuarios" 
            element={
              <PrivateRoute titulo="Gestão de Equipe">
                <Usuarios />
              </PrivateRoute>
            } 
          />

          {/* --- NOVAS ROTAS (MÓDULO GESTÃO) --- */}
          
          <Route 
            path="/financeiro" 
            element={
              <PrivateRoute titulo="Painel Financeiro">
                <Financeiro />
              </PrivateRoute>
            } 
          />

          <Route 
            path="/carteira" 
            element={
              <PrivateRoute titulo="Distribuição de Carteira">
                <Carteira />
              </PrivateRoute>
            } 
          />

          {/* --- ROTAS ESTRATÉGICAS --- */}

          <Route 
            path="/processos" 
            element={
              <PrivateRoute titulo="Processos & Tarefas">
                <Processos />
              </PrivateRoute>
            } 
          />

          <Route 
            path="/auditoria" 
            element={
              <PrivateRoute titulo="Auditoria do Sistema">
                 <Auditoria /> 
              </PrivateRoute>
            } 
          />

          {/* Rota Padrão: Se entrar na raiz, joga pro Dashboard ou Login */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
          
          {/* Rota 404: Qualquer outra coisa volta pro inicio */}
          <Route path="*" element={<Navigate to="/" />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;