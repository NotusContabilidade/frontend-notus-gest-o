import { useState, useEffect } from 'react';
import clientService from '../../services/clientService';
import userService from '../../services/userService';
import auditoriaService from '../../services/auditoriaService';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalClientes: 0,
    totalEquipe: 0,
    logsRecentes: []
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDadosReais();
  }, []);

  const carregarDadosReais = async () => {
    try {
      // Busca dados reais de todos os serviços
      const [clientes, usuarios, logs] = await Promise.all([
        clientService.listarTodos(),
        userService.listarTodos(),
        auditoriaService.listarLogs()
      ]);

      setStats({
        totalClientes: clientes.length,
        totalEquipe: usuarios.length,
        // Pega apenas os 10 últimos para exibir
        logsRecentes: logs.slice(0, 10) 
      });

    } catch (error) {
      console.error("Erro ao carregar dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container anime-fade-in">
      
      {/* --- GRID DE INDICADORES (KPIs) --- */}
      <div className="kpi-grid">
        
        {/* Card 1: Carteira */}
        <div 
          className="kpi-card anime-slide-up" 
          style={{animationDelay: '0.1s'}}
        >
          <div className="icon">🏢</div>
          <div className="info">
            <h3>Carteira Ativa</h3>
            <p className="big-number">
              {loading ? '...' : stats.totalClientes}
            </p>
            <small>Empresas cadastradas</small>
          </div>
        </div>

        {/* Card 2: Equipe */}
        <div 
          className="kpi-card anime-slide-up" 
          style={{animationDelay: '0.2s'}}
        >
          <div className="icon">👥</div>
          <div className="info">
            <h3>Equipe</h3>
            <p className="big-number">
              {loading ? '...' : stats.totalEquipe}
            </p>
            <small>Colaboradores ativos</small>
          </div>
        </div>

        {/* Card 3: Status do Sistema */}
        <div 
          className="kpi-card anime-slide-up" 
          style={{animationDelay: '0.3s'}}
        >
          <div className="icon">⚡</div>
          <div className="info">
            <h3>Status do Sistema</h3>
            <p className="big-number" style={{color: 'var(--sucesso)', fontSize: '1.8rem'}}>
              ONLINE
            </p>
            <small>Serviços operando normalmente</small>
          </div>
        </div>
        
      </div>

      {/* --- LISTA DE ATIVIDADE RECENTE --- */}
      <div 
        className="section-recent anime-slide-up" 
        style={{animationDelay: '0.4s'}}
      >
        <h3>🔔 Últimas Atividades Registradas</h3>
        
        <div className="activity-list">
          {loading ? (
            <p style={{padding: '20px', textAlign: 'center'}}>Carregando dados...</p>
          ) : stats.logsRecentes.length === 0 ? (
            <p className="empty-msg">Nenhuma atividade registrada no sistema ainda.</p>
          ) : (
            stats.logsRecentes.map((log) => (
              <div key={log.id} className="activity-item">
                <div className="marker"></div>
                <div className="content">
                  <span className="time">
                    {new Date(log.dataHora).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
                  </span>
                  <strong>{log.usuarioResponsavel}</strong> 
                  {' '}- {log.titulo} 
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;