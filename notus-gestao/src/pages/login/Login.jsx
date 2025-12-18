import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import './Login.css';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tenantId, setTenantId] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if(!email || !password || !tenantId) {
        setError("Preencha todos os campos.");
        return;
    }

    const result = await login(email, password, tenantId);
    
    if (result.success) {
      navigate('/dashboard'); 
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Hub-Nótus</h1>
          <p>Sistema de Inteligência Fiscal</p>
        </div>

        <form onSubmit={handleSubmit}>
          
          <div className="input-group">
            <label>Código do Escritório (Tenant)</label>
            <input 
              type="text" 
              placeholder="Ex: escritorio_sp"
              value={tenantId}
              onChange={(e) => setTenantId(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>E-mail</label>
            <input 
              type="email" 
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Senha</label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn-entrar">
            ACESSAR PAINEL
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;