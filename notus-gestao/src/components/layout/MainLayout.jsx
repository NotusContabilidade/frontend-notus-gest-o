import { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import './MainLayout.css'; 

const MainLayout = ({ children, titulo }) => {
  const { logout, user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/dashboard', label: 'Visão Geral', icon: '📊' },
    { path: '/clientes', label: 'Carteira de Clientes', icon: '🏢' },
    { path: '/processos', label: 'Processos & Tarefas', icon: '⚡' },
    { path: '/usuarios', label: 'Gestão de Equipe', icon: '👥' },
    { path: '/auditoria', label: 'Auditoria & Logs', icon: '🛡️' },
  ];

  return (
    <div className="main-layout">
      
      {/* --- SIDEBAR --- */}
      <aside className="sidebar">
        <div className="sidebar-header">
          {/* AQUI ESTÁ A MÁGICA: Link envolve a imagem e aplica a classe de borda */}
          <Link to="/dashboard" className="logo-wrapper" title="Voltar para o Início">
            <img 
              src="/assets/logo_notus.jpg" 
              alt="Nótus Contábil" 
              className="sidebar-logo"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = '<span style="color:#fff; font-weight:bold;">NÓTUS</span>';
              }}
            />
          </Link>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <span className="icon">{item.icon}</span>
                <span className="label">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div style={{marginBottom: '10px', color: '#666', fontSize: '0.8rem', textAlign: 'center'}}>
            <small>Logado como:</small><br/>
            <strong style={{color: '#fff'}}>{user?.nome || 'Usuário'}</strong>
          </div>
          <button onClick={handleLogout} className="btn-logout">
            <span>Sair do Sistema</span> 🚪
          </button>
        </div>
      </aside>

      {/* --- ÁREA DE CONTEÚDO --- */}
      <main className="content-area">
        <header className="top-bar">
          <h1>{titulo}</h1>
          
          <div className="status-badge">
            <div className="dot"></div>
            Sistema Online
          </div>
        </header>
        
        <div className="page-content">
          {children}
        </div>
      </main>

    </div>
  );
};

export default MainLayout;