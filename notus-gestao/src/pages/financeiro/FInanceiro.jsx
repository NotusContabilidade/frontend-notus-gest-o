import { useState, useEffect } from 'react';
import gestaoService from '../../services/gestaoService';
import './Financeiro.css';
import '../../pages/Dashboard/Dashboard.css'; // Reusa estilos de Grid do Dashboard

const Financeiro = () => {
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarResumo();
  }, []);

  const carregarResumo = async () => {
    try {
      setLoading(true);
      const resultado = await gestaoService.obterResumoFinanceiro();
      setDados(resultado);
    } catch (error) {
      console.error("Erro ao carregar financeiro", error);
    } finally {
      setLoading(false);
    }
  };

  // Função auxiliar para formatar dinheiro (R$)
  const fmt = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor || 0);
  };

  // Função auxiliar para formatar porcentagem (%)
  const fmtPct = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'percent',
      minimumFractionDigits: 2
    }).format(valor || 0);
  };

  if (loading) {
    return <div style={{padding:'40px', textAlign:'center', color:'#fff'}}>Carregando dados financeiros...</div>;
  }

  if (!dados) {
    return <div style={{padding:'40px', textAlign:'center', color:'#f44336'}}>Erro ao carregar dados. Tente novamente.</div>;
  }

  return (
    <div className="financeiro-container anime-fade-in">
      
      <div style={{marginBottom: '30px'}}>
        <h2 style={{color: '#fff', fontSize: '1.5rem'}}>Painel de Remuneração</h2>
        <p style={{color: '#888'}}>Acompanhamento em tempo real da sua performance e fechamentos.</p>
      </div>

      {/* --- GRID DE CARDS (KPIs) --- */}
      <div className="kpi-grid">
        
        {/* Card 1: Carteira */}
        <div className="kpi-card" style={{borderLeft: '4px solid #2196f3'}}>
          <div className="kpi-content">
            <span className="valor-secundario">Carteira sob Gestão (MRR)</span>
            <div className="valor-destaque dinheiro-base">
              {fmt(dados.totalCarteira)}
            </div>
            <small style={{color: '#666'}}>
              Sua comissão: <strong>{fmtPct(dados.percentualComissao)}</strong>
            </small>
          </div>
        </div>

        {/* Card 2: Comissão Estimada */}
        <div className="kpi-card" style={{borderLeft: '4px solid #4caf50'}}>
          <div className="kpi-content">
            <span className="valor-secundario">Comissão Variável (Estimada)</span>
            <div className="valor-destaque dinheiro-positivo">
              + {fmt(dados.comissaoEstimada)}
            </div>
            <small style={{color: '#666'}}>Baseado na carteira ativa hoje</small>
          </div>
        </div>

        {/* Card 3: Total Geral */}
        <div className="kpi-card" style={{borderLeft: '4px solid #9c27b0', background: 'linear-gradient(145deg, #1a1a1a 0%, #251015 100%)'}}>
          <div className="kpi-content">
            <span className="valor-secundario">Salário Total Estimado</span>
            <div className="valor-destaque dinheiro-neutro">
              {fmt(dados.salarioTotalEstimado)}
            </div>
            <small style={{color: '#aaa'}}>
              Fixo ({fmt(dados.salarioBase)}) + Variável
            </small>
          </div>
        </div>

      </div>

      {/* --- TABELA DE HISTÓRICO --- */}
      <div className="historico-section">
        <div className="historico-header">
          <span style={{fontSize: '1.5rem'}}>📜</span>
          <h3>Histórico de Fechamentos (Folha)</h3>
        </div>

        <table className="tabela-financeira">
          <thead>
            <tr>
              <th>Competência</th>
              <th>Carteira Processada</th>
              <th>Comissão (%)</th>
              <th>Variável Gerada</th>
              <th>Total Recebido</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {dados.historico && dados.historico.length > 0 ? (
              dados.historico.map((item) => (
                <tr key={item.id}>
                  <td>
                    <strong>{item.mesReferencia}/{item.anoReferencia}</strong>
                  </td>
                  <td>{fmt(item.totalCarteiraSnapshot)}</td>
                  <td>{fmtPct(item.percentualComissaoSnapshot)}</td>
                  <td className="dinheiro-positivo">+ {fmt(item.valorComissaoCalculado)}</td>
                  <td style={{fontWeight: 'bold', color: '#fff'}}>{fmt(item.salarioFinalTotal)}</td>
                  <td><span className="status-fechado">Fechado</span></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{textAlign: 'center', padding: '40px', color: '#666'}}>
                  Nenhum fechamento de folha encontrado no histórico.
                  <br/><small>O sistema gera o fechamento automaticamente todo dia 01.</small>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default Financeiro;