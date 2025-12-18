import { Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  // Função auxiliar para marcar o link ativo (destaque visual)
  const isActive = (path) => {
    return location.pathname === path ? 'menu-item active' : 'menu-item';
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Nótus <span>Gestão</span></h2>
      </div>

      <div className="user-profile">
        <div className="avatar-circle">
          {/* Mostra a primeira letra do nome ou do email */}
          {user?.nome ? user.nome.charAt(0).toUpperCase() : 'U'}
        </div>
        <div className="user-details">
          <p className="name">{user?.nome || user?.email || 'Usuário'}</p>
          <span className="role">{user?.role || 'Admin'}</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <p className="section-title">PRINCIPAL</p>
        
        <Link to="/dashboard" className={isActive('/dashboard')}>
          📊 Visão Geral
        </Link>
        
        <Link to="/clientes" className={isActive('/clientes')}>
          🏢 Carteira de Clientes
        </Link>

        <Link to="/usuarios" className={isActive('/usuarios')}>
          👥 Equipe & Usuários
        </Link>

        <p className="section-title">ESTRATÉGIA</p>

        <Link to="/processos" className={isActive('/processos')}>
          ⚙️ Processos
        </Link>

        <Link to="/auditoria" className={isActive('/auditoria')}>
          👁️ Auditoria
        </Link>
      </nav>

      <div className="sidebar-footer">
        <button onClick={logout} className="btn-logout">
          🚪 Sair
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;