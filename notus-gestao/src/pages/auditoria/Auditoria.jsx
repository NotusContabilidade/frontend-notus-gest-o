import { useState, useEffect } from 'react';
import auditoriaService from '../../services/auditoriaService';
import './Auditoria.css';

const Auditoria = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estado para filtros simples no frontend
  const [filtroTipo, setFiltroTipo] = useState('TODOS');

  useEffect(() => {
    carregarLogs();
  }, []);

  const carregarLogs = async () => {
    setLoading(true);
    try {
      // Busca todos os logs do backend
      const dados = await auditoriaService.listarLogs();
      setLogs(dados);
    } catch (error) {
      console.error("Erro ao carregar auditoria:", error);
    } finally {
      setLoading(false);
    }
  };

  // Aplica o filtro localmente na lista
  const logsFiltrados = logs.filter(log => {
    if (filtroTipo === 'TODOS') return true;
    // Verifica se o tipo do log (ex: CRIAR_CLIENTE) contém o texto do filtro
    return log.tipo && log.tipo.includes(filtroTipo);
  });

  return (
    <div className="auditoria-container anime-fade-in">
      
      {/* BARRA DE FERRAMENTAS */}
      <div className="audit-toolbar">
        <select 
          value={filtroTipo} 
          onChange={(e) => setFiltroTipo(e.target.value)}
        >
          <option value="TODOS">Todos os Eventos</option>
          <option value="LOGIN">Logins / Acessos</option>
          <option value="CRIAR">Cadastros (Criação)</option>
          <option value="ALTERAR">Edições / Alterações</option>
          <option value="ERRO">Erros / Falhas</option>
        </select>

        <input 
          type="text" 
          placeholder="Buscar por usuário..." 
          disabled 
          style={{cursor: 'not-allowed', opacity: 0.6}} 
          title="Filtro de texto em breve"
        />

        <button className="btn-refresh" onClick={carregarLogs} title="Atualizar Lista">
          ↻
        </button>
      </div>

      {/* TIMELINE (LINHA DO TEMPO) */}
      <div className="timeline">
        {loading ? (
          <p style={{padding: '20px', color: '#888'}}>Carregando registros...</p>
        ) : logsFiltrados.length === 0 ? (
          <p style={{padding: '20px', color: '#888'}}>Nenhum registro encontrado para este filtro.</p>
        ) : (
          logsFiltrados.map((log) => (
            <div 
              key={log.id} 
              className={`timeline-item ${obterClassePorTipo(log.tipo)}`}
            >
              <div className="timeline-marker"></div>
              
              <div className="timeline-content">
                <div className="timeline-header">
                  <span className="timeline-time">
                    {new Date(log.dataHora).toLocaleString('pt-BR')}
                  </span>
                  <span className="timeline-user">
                    {log.usuarioResponsavel || 'Sistema'}
                  </span>
                </div>
                
                <span className="timeline-title">
                  {formatarTitulo(log.titulo || log.tipo)}
                </span>
                
                <div className="timeline-desc">
                  {log.descricao}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

// --- Funções Auxiliares de Visualização ---

// Define a cor da bolinha baseada no texto do tipo
function obterClassePorTipo(tipo) {
  if (!tipo) return '';
  if (tipo.includes('LOGIN')) return 'LOGIN';
  if (tipo.includes('ERRO')) return 'ERRO';
  if (tipo.includes('CRIAR')) return 'CRIAR_CLIENTE';
  if (tipo.includes('ALTERAR') || tipo.includes('EDITAR')) return 'ALTERACAO';
  return '';
}

// Deixa o título mais legível (Remove underlines)
function formatarTitulo(texto) {
  if (!texto) return '';
  return texto.replace(/_/g, ' ');
}

export default Auditoria;