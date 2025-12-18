import { useState, useEffect } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import auditoriaService from '../../services/auditoriaService'; // <--- IMPORT SEM CHAVES
import './Auditoria.css';

const Auditoria = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    dataInicio: '',
    dataFim: '',
    tipo: 'TODOS',
    termo: ''
  });

  useEffect(() => {
    const carregarLogs = async () => {
      try {
        setLoading(true);
        const dados = await auditoriaService.listarLogs(filtros);
        setLogs(dados);
      } catch (error) {
        console.error("Erro ao carregar auditoria");
        setLogs([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      carregarLogs();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [filtros]);

  const handleFiltroChange = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const getIcone = (tipo) => {
    switch(tipo) {
      case 'ENVIO_EMAIL': return '📧';
      case 'VISUALIZACAO': return '👁️';
      case 'DOWNLOAD': return '⬇️';
      case 'ALTERACAO': return '📝';
      case 'LOGIN': return '🔑';
      default: return '🔹';
    }
  };

  return (
    <MainLayout titulo="Rastro de Auditoria & Logs">
      <div className="auditoria-container">
        
        <div className="filtros-bar">
          <div className="filtro-group">
            <label>De:</label>
            <input type="date" name="dataInicio" value={filtros.dataInicio} onChange={handleFiltroChange} />
          </div>
          <div className="filtro-group">
            <label>Até:</label>
            <input type="date" name="dataFim" value={filtros.dataFim} onChange={handleFiltroChange} />
          </div>
          <div className="filtro-group">
            <label>Tipo:</label>
            <select name="tipo" value={filtros.tipo} onChange={handleFiltroChange}>
              <option value="TODOS">Todos</option>
              <option value="ENVIO_EMAIL">E-mail</option>
              <option value="VISUALIZACAO">Visualização</option>
              <option value="ALTERACAO">Alteração</option>
              <option value="LOGIN">Login</option>
            </select>
          </div>
          <div className="filtro-group search">
            <input type="text" name="termo" placeholder="Buscar..." value={filtros.termo} onChange={handleFiltroChange} />
          </div>
        </div>

        <div className="timeline-area">
          {loading ? (
            <p className="status-text">Carregando...</p>
          ) : logs.length === 0 ? (
            <div className="empty-state">
              <p>Nenhum registro encontrado.</p>
            </div>
          ) : (
            <div className="timeline">
              {logs.map((log) => (
                <div key={log.id} className={`timeline-item ${log.tipo}`}>
                  <div className="timeline-marker">
                    <span className="icon">{getIcone(log.tipo)}</span>
                  </div>
                  <div className="timeline-content">
                    <div className="header">
                      <span className="time">{log.dataHora ? new Date(log.dataHora).toLocaleString() : '-'}</span>
                      <span className="user">{log.usuarioResponsavel || 'Sistema'}</span>
                    </div>
                    <h4 className="action-title">{log.titulo || log.tipo}</h4>
                    <p className="description">
                      {log.descricao}
                      {log.clienteAfetado && <strong className="client-tag"> | {log.clienteAfetado}</strong>}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </MainLayout>
  );
};

export default Auditoria;