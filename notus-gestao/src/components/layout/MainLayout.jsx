import Sidebar from '../sidebar/Sidebar';
import './MainLayout.css';

const MainLayout = ({ children, titulo }) => {
  // Recupera o tenant salvo no login para mostrar no cabeçalho
  const tenantId = localStorage.getItem('notus_tenant') || 'Escritório';

  return (
    <div className="layout-container">
      <Sidebar />
      
      <main className="main-content">
        <header className="top-bar">
          <h1 className="page-title">{titulo}</h1>
          
          <div className="tenant-info">
             Ambiente: <strong>{tenantId}</strong>
          </div>
        </header>

        <div className="content-scrollable">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;