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
        <h2>Hub <span>Nótus</span></h2>
      </div>

      <div className="user-profile">
        <div className="avatar-circle">
          {/* Mostra a primeira letra do nome ou do email */}
          {user?.nome ? user.nome.charAt(0).toUpperCase() : 'U'}
        </div>
        <div className="user-details">
          <p className="name">{user?.nome || 'Usuário'}</p>
          <span className="role">{user?.role === 'ADMIN' ? 'Sócio / Admin' : 'Contador'}</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <p className="section-title">PRINCIPAL</p>
        
        <Link to="/dashboard" className={isActive('/dashboard')}>
          <span className="icon">📊</span> Visão Geral
        </Link>
        
        <Link to="/clientes" className={isActive('/clientes')}>
          <span className="icon">🏢</span> Carteira de Clientes
        </Link>

        {/* Exibe gestão de equipe apenas para Admins, se quiser bloquear visualmente */}
        <Link to="/usuarios" className={isActive('/usuarios')}>
          <span className="icon">👥</span> Equipe & Usuários
        </Link>

        <p className="section-title">FINANCEIRO</p>

        <Link to="/financeiro" className={isActive('/financeiro')}>
          <span className="icon">💰</span> Minha Remuneração
        </Link>

        <Link to="/carteira" className={isActive('/carteira')}>
          <span className="icon">🔀</span> Gestão de Carteira
        </Link>

        <p className="section-title">ESTRATÉGIA</p>

        <Link to="/processos" className={isActive('/processos')}>
          <span className="icon">⚙️</span> Processos
        </Link>

        <Link to="/auditoria" className={isActive('/auditoria')}>
          <span className="icon">👁️</span> Auditoria
        </Link>
      </nav>

      <div className="sidebar-footer">
        <button onClick={logout} className="btn-logout">
          <span>Sair do Sistema</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;