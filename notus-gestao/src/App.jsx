import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import { useContext } from 'react';

// Importação das Páginas
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Clientes from './pages/Clientes/Clientes';
import Processos from './pages/Processos/Processos';
import Usuarios from './pages/Usuarios/Usuarios';
import Auditoria from './pages/Auditoria/Auditoria'; // Se tiver essa página

// Layout Principal (A estrutura fixa)
import MainLayout from './components/Layout/MainLayout';

// Componente para Proteger Rotas (Só entra se estiver logado)
const PrivateRoute = ({ children, titulo }) => {
  const { authenticated, loading } = useContext(AuthContext);

  if (loading) {
    return <div style={{display:'flex', justifyContent:'center', marginTop:'50px'}}>Carregando...</div>;
  }

  if (!authenticated) {
    return <Navigate to="/login" />;
  }

  // AQUI ESTÁ O SEGREDO: O Layout envolve o filho (Página)
  // Isso mantém a sidebar fixa enquanto o miolo muda.
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

          {/* Rotas Privadas (Protegidas) */}
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
            path="/processos" 
            element={
              <PrivateRoute titulo="Processos & Tarefas">
                <Processos />
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

          {/* Se você tiver a página de Auditoria criada */}
          <Route 
            path="/auditoria" 
            element={
              <PrivateRoute titulo="Auditoria do Sistema">
                {/* Se ainda não criou o arquivo Auditoria.jsx, comente a linha abaixo */}
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