import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import { useContext } from 'react';

// Importação das Páginas
import Login from './pages/Login/Login';
import Dashboard from './pages/dashboard/Dashboard';
import Usuarios from './pages/usuarios/Usuarios';
import Clientes from './pages/clientes/Clientes';
import Processos from './pages/processos/Processos';
import Auditoria from './pages/auditoria/Auditoria'; // <--- NOVA IMPORTAÇÃO

import './global.css';

const RotaPrivada = ({ children }) => {
  const { authenticated, loading } = useContext(AuthContext);

  if (loading) return <div className="loading-screen">Carregando Hub-Nótus...</div>;
  if (!authenticated) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/dashboard" element={<RotaPrivada><Dashboard /></RotaPrivada>} />
          <Route path="/usuarios" element={<RotaPrivada><Usuarios /></RotaPrivada>} />
          <Route path="/clientes" element={<RotaPrivada><Clientes /></RotaPrivada>} />
          <Route path="/processos" element={<RotaPrivada><Processos /></RotaPrivada>} />
          
          {/* Nova Rota de Auditoria */}
          <Route path="/auditoria" element={<RotaPrivada><Auditoria /></RotaPrivada>} />

          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;