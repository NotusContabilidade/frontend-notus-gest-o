import MainLayout from '../../components/layout/MainLayout';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <MainLayout titulo="Painel de Controle">
      
      {/* Grid de Indicadores (KPIs) */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <h3>Clientes Ativos</h3>
          <div className="value">142</div>
          <span className="sub">+3 novos este mês</span>
        </div>

        <div className="kpi-card">
          <h3>Processos em Andamento</h3>
          <div className="value">28</div>
          <span className="sub">5 vencendo hoje</span>
        </div>

        <div className="kpi-card">
          <h3>Equipe Online</h3>
          <div className="value">
            8<span className="total">/12</span>
          </div>
          <span className="sub">Status em tempo real</span>
        </div>

        <div className="kpi-card alert">
          <h3>Erros de Integração</h3>
          <div className="value">2</div>
          <span className="sub">Verificar logs urgentemente</span>
        </div>
      </div>

      {/* Caixa de Boas-vindas */}
      <div className="welcome-box">
        <h2>👋 Bem-vindo ao Hub-Nótus Gestão</h2>
        <p>Utilize o menu lateral para gerenciar clientes, usuários e processos do escritório.</p>
      </div>

    </MainLayout>
  );
};

export default Dashboard;