// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import { useContext } from 'react';
import Login from './pages/Login/Login';
import './global.css'; // Importante: Carrega as variáveis de cor

const RotaPrivada = ({ children }) => {
  const { authenticated, loading } = useContext(AuthContext);

  if (loading) return <div className="loading">Carregando Nótus...</div>;
  if (!authenticated) return <Navigate to="/login" />;

  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route 
            path="/dashboard" 
            element={
              <RotaPrivada>
                {/* Placeholder temporário */}
                <div style={{padding: '50px'}}>
                    <h1>Bem-vindo ao Sistema Interno</h1>
                    <p>Login realizado com sucesso.</p>
                </div>
              </RotaPrivada>
            } 
          />
          
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;