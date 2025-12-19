import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import './Login.css';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Estados do formulário
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Limpa erros anteriores
    setLoading(true);

    try {
      // Tenta logar usando o Contexto (que chama a API real)
      await login(email, password);
      
      // Se der certo, redireciona para o Dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error("Erro no login:", err);
      setError('Credenciais inválidas. Verifique seu e-mail e senha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      
      <div className="login-card">
        {/* CABEÇALHO DO CARD */}
        <div className="login-header">
          <img 
            src="/assets/logo_notus.jpg" 
            alt="Nótus Contábil" 
            className="login-logo"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML += '<h2 style="color:#fff">Nótus</h2>';
            }}
          />
          <h2>Acesso Restrito</h2>
          <p>Informe suas credenciais para continuar</p>
        </div>

        {/* MENSAGEM DE ERRO (Só aparece se houver erro) */}
        {error && (
          <div className="error-msg">
            ⚠️ {error}
          </div>
        )}

        {/* FORMULÁRIO */}
        <form onSubmit={handleSubmit} className="login-form">
          
          <div className="form-group">
            <label htmlFor="email">E-mail Corporativo</label>
            <div className="input-wrapper">
              <span className="input-icon">✉️</span>
              <input 
                id="email"
                type="email" 
                placeholder="nome@notus.com.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input 
                id="password"
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? 'Autenticando...' : 'Entrar no Sistema'}
          </button>
        </form>

        {/* RODAPÉ DO CARD */}
        <div className="login-footer">
          <p>Esqueceu sua senha? <a href="#">Contate o TI</a></p>
          <p style={{marginTop: '10px', fontSize: '0.75rem', opacity: 0.5}}>
            &copy; {new Date().getFullYear()} Hub-Nótus v2.0
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;