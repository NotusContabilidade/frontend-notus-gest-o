import { useState, useEffect } from 'react';
import processoService from '../../services/processoService';
import './Processos.css';

const Processos = () => {
  const [modelos, setModelos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formVisivel, setFormVisivel] = useState(false);

  // Estado do Formulário
  const [novoProcesso, setNovoProcesso] = useState({
    nome: '', 
    descricao: '', 
    departamento: 'FISCAL' // Valor padrão
  });

  useEffect(() => {
    carregarModelos();
  }, []);

  const carregarModelos = async () => {
    try {
      setLoading(true);
      const dados = await processoService.listarTodos();
      setModelos(dados);
    } catch (error) {
      console.error("Erro ao carregar processos:", error);
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
    try {
      await processoService.criar(novoProcesso);
      alert("Modelo de processo criado com sucesso!");
      
      // Limpa e fecha o form
      setNovoProcesso({ nome: '', descricao: '', departamento: 'FISCAL' });
      setFormVisivel(false);
      
      // Recarrega a lista
      carregarModelos();
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar. Verifique se o backend está rodando.");
    }
  };

  const handleExcluir = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este modelo?")) {
      try {
        await processoService.deletar(id);
        carregarModelos();
      } catch (error) {
        alert("Erro ao excluir o modelo.");
      }
    }
  };

  return (
    <div className="processos-container anime-fade-in">
      
      {/* CABEÇALHO COM AÇÕES */}
      <div className="header-actions">
         <div className="search-bar">
           <input 
             type="text" 
             placeholder="🔍 Buscar modelos de tarefas..." 
             className="search-input"
           />
         </div>
         
         {!formVisivel && (
           <button className="btn-novo-processo" onClick={() => setFormVisivel(true)}>
             + Novo Modelo
           </button>
         )}
      </div>

      {/* FORMULÁRIO DE CADASTRO (WIZARD) */}
      {formVisivel && (
        <div className="cadastro-card">
           <h3>Criar Novo Modelo de Tarefa</h3>
           <form onSubmit={handleSalvar}>
             
             <div className="form-row">
               <div className="field-group col-6">
                 <label>Título do Processo</label>
                 <input 
                   name="nome"
                   value={novoProcesso.nome} 
                   onChange={handleChange} 
                   placeholder="Ex: Admissão de Funcionário"
                   required 
                 />
               </div>
               <div className="field-group col-6">
                 <label>Departamento Responsável</label>
                 <select 
                   name="departamento"
                   value={novoProcesso.departamento} 
                   onChange={handleChange}
                 >
                   <option value="FISCAL">Fiscal</option>
                   <option value="CONTABIL">Contábil</option>
                   <option value="PESSOAL">Pessoal (DP)</option>
                   <option value="FINANCEIRO">Financeiro</option>
                   <option value="LEGAL">Legal / Societário</option>
                   <option value="TI">TI / Tecnologia</option>
                 </select>
               </div>
             </div>

             <div className="form-row">
               <div className="field-group col-12">
                 <label>Descrição Detalhada</label>
                 <textarea 
                    name="descricao"
                    value={novoProcesso.descricao} 
                    onChange={handleChange}
                    placeholder="Descreva o objetivo deste processo..."
                 />
               </div>
             </div>

             <div className="form-actions-bottom">
               <button type="button" className="btn-cancelar" onClick={() => setFormVisivel(false)}>
                 Cancelar
               </button>
               <button type="submit" className="btn-salvar">
                 Salvar Modelo
               </button>
             </div>
           </form>
        </div>
      )}

      {/* TABELA DE LISTAGEM */}
      <div className="table-responsive">
        <table className="tabela-custom">
          <thead>
            <tr>
              <th style={{width: '30%'}}>Título</th>
              <th style={{width: '15%'}}>Departamento</th>
              <th style={{width: '40%'}}>Descrição</th>
              <th style={{textAlign: 'right'}}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" style={{textAlign: 'center', padding: '20px'}}>Carregando...</td></tr>
            ) : modelos.length === 0 ? (
              <tr><td colSpan="4" style={{textAlign: 'center', padding: '30px', color: '#888'}}>Nenhum modelo cadastrado.</td></tr>
            ) : (
              modelos.map(proc => (
                <tr key={proc.id}>
                  <td><strong>{proc.titulo}</strong></td>
                  <td>
                    <span className="badge-dept">{proc.departamentoResponsavel}</span>
                  </td>
                  <td>{proc.descricao || <span style={{color:'#666', fontStyle:'italic'}}>Sem descrição</span>}</td>
                  <td style={{textAlign: 'right'}}>
                    <button 
                      className="btn-icon-delete" 
                      title="Excluir Modelo"
                      onClick={() => handleExcluir(proc.id)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default Processos;