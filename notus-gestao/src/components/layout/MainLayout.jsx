import { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import './MainLayout.css'; // Importa o CSS que acabamos de criar

const MainLayout = ({ children, titulo }) => {
  const { logout, user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Itens do Menu (Adicione novas rotas aqui se precisar)
  const menuItems = [
    { path: '/dashboard', label: 'Visão Geral', icon: '📊' },
    { path: '/clientes', label: 'Carteira de Clientes', icon: '🏢' },
    { path: '/processos', label: 'Processos & Tarefas', icon: '⚡' },
    { path: '/usuarios', label: 'Gestão de Equipe', icon: '👥' },
    { path: '/auditoria', label: 'Auditoria & Logs', icon: '🛡️' },
  ];

  return (
    <div className="main-layout">
      
      {/* --- BARRA LATERAL (SIDEBAR) --- */}
      <aside className="sidebar">
        <div className="sidebar-header">
          {/* Tenta carregar a logo. Se não achar, o alt text aparece. */}
          <img 
            src="/assets/logo_notus.jpg" 
            alt="Nótus Contábil" 
            className="sidebar-logo"
            onError={(e) => {
              e.target.style.display = 'none'; // Esconde imagem quebrada
              e.target.parentElement.innerText = 'NÓTUS (Sem Logo)'; // Mostra texto fallback
            }}
          />
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
          <button onClick={handleLogout} className="btn-logout">
            <span>Sair do Sistema</span> 🚪
          </button>
        </div>
      </aside>

      {/* --- ÁREA DE CONTEÚDO --- */}
      <main className="content-area">
        {/* Barra Superior Fixa */}
        <header className="top-bar">
          <h1>{titulo}</h1>
          
          <div className="status-badge">
            <div className="dot"></div>
            Sistema Online
          </div>
        </header>
        
        {/* Onde o conteúdo da página rola (Scroll) */}
        <div className="page-content">
          {children}
        </div>
      </main>

    </div>
  );
};

export default MainLayout;