import { useState, useEffect } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import processoService from '../../services/processoService'; // <--- SEM CHAVES AGORA
import './Processos.css';

const Processos = () => {
  const [processos, setProcessos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formAberto, setFormAberto] = useState(false);

  const [novoProcesso, setNovoProcesso] = useState({
    nome: '',
    descricao: '',
    periodicidade: 'MENSAL',
    departamento: 'FISCAL'
  });

  useEffect(() => {
    carregarProcessos();
  }, []);

  const carregarProcessos = async () => {
    try {
      setLoading(true);
      const dados = await processoService.listarTodos();
      setProcessos(dados);
    } catch (error) {
      console.error("Erro ao carregar processos");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNovoProcesso(prev => ({ ...prev, [name]: value }));
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    if (!novoProcesso.nome) return alert("O nome é obrigatório.");

    try {
      await processoService.criar(novoProcesso);
      setFormAberto(false);
      setNovoProcesso({ nome: '', descricao: '', periodicidade: 'MENSAL', departamento: 'FISCAL' });
      carregarProcessos();
    } catch (error) {
      alert("Erro ao salvar modelo de processo.");
    }
  };

  const handleExcluir = async (id) => {
    if (window.confirm("Deseja excluir este modelo? Tarefas criadas não serão afetadas.")) {
      try {
        await processoService.deletar(id);
        carregarProcessos();
      } catch (error) {
        alert("Erro ao excluir.");
      }
    }
  };

  return (
    <MainLayout titulo="Modelos de Processos">
      
      <div className="processos-container">
        
        <div className="top-action">
          <p className="description-text">
            Defina os padrões de tarefas recorrentes (Ex: Fechamento, Folha, DAS).
          </p>
          <button 
            className="btn-add-process"
            onClick={() => setFormAberto(!formAberto)}
          >
            {formAberto ? 'Fechar Painel' : '+ Novo Modelo'}
          </button>
        </div>

        {/* Formulário de Criação */}
        {formAberto && (
          <div className="form-panel">
            <h3>Criar Novo Modelo</h3>
            <form onSubmit={handleSalvar}>
              <div className="form-row">
                <div className="input-block">
                  <label>Nome do Processo</label>
                  <input 
                    name="nome" 
                    placeholder="Ex: Fechamento Simples Nacional" 
                    value={novoProcesso.nome}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="input-block">
                  <label>Departamento</label>
                  <select name="departamento" value={novoProcesso.departamento} onChange={handleChange}>
                    <option value="FISCAL">Fiscal</option>
                    <option value="CONTABIL">Contábil</option>
                    <option value="DP">Departamento Pessoal</option>
                    <option value="LEGAL">Legalização</option>
                  </select>
                </div>

                <div className="input-block">
                  <label>Periodicidade</label>
                  <select name="periodicidade" value={novoProcesso.periodicidade} onChange={handleChange}>
                    <option value="MENSAL">Mensal</option>
                    <option value="TRIMESTRAL">Trimestral</option>
                    <option value="ANUAL">Anual</option>
                    <option value="SEMANAL">Semanal</option>
                  </select>
                </div>
              </div>

              <div className="input-block">
                <label>Descrição / Instruções</label>
                <textarea 
                  name="descricao" 
                  rows="3"
                  placeholder="Descreva o que deve ser feito neste processo..."
                  value={novoProcesso.descricao}
                  onChange={handleChange}
                ></textarea>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-confirm">Criar Modelo</button>
              </div>
            </form>
          </div>
        )}

        {/* Grid de Cards */}
        <div className="process-grid">
          {loading ? (
            <p>Carregando modelos...</p>
          ) : processos.length === 0 ? (
            <div className="empty-box">Nenhum processo configurado.</div>
          ) : (
            processos.map((proc) => (
              <div className="process-card" key={proc.id}>
                <div className={`card-header ${proc.departamento}`}>
                  <span className="dept-tag">{proc.departamento}</span>
                  <button onClick={() => handleExcluir(proc.id)} className="btn-close">×</button>
                </div>
                
                <div className="card-body">
                  <h4>{proc.nome}</h4>
                  <p>{proc.descricao || 'Sem descrição definida.'}</p>
                </div>

                <div className="card-footer">
                  <span className="period-badge">
                    ⏱ {proc.periodicidade}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

      </div>

    </MainLayout>
  );
};

export default Processos;