import { useState, useEffect } from 'react';
import MainLayout from '../../components/Layout/MainLayout';
// Importação corrigida para default (sem chaves)
import clientService from '../../services/clientService'; 
import './Clientes.css';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formVisivel, setFormVisivel] = useState(false);
  
  const [novoCliente, setNovoCliente] = useState({
    cnpj: '',
    razaoSocial: '',
    nomeFantasia: '',
    regimeTributario: 'SIMPLES_NACIONAL',
    status: 'ATIVO',
    emailContato: ''
  });

  useEffect(() => {
    carregarClientes();
  }, []);

  const carregarClientes = async () => {
    try {
      setLoading(true);
      const dados = await clientService.listarTodos();
      setClientes(dados);
    } catch (error) {
      console.error("Falha ao carregar lista de clientes");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNovoCliente(prev => ({ ...prev, [name]: value }));
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    try {
      await clientService.criar(novoCliente);
      alert("Cliente cadastrado com sucesso!");
      setFormVisivel(false);
      setNovoCliente({ 
        cnpj: '', razaoSocial: '', nomeFantasia: '', 
        regimeTributario: 'SIMPLES_NACIONAL', status: 'ATIVO', emailContato: '' 
      });
      carregarClientes();
    } catch (error) {
      alert("Erro ao cadastrar cliente. Verifique o CNPJ.");
    }
  };

  const handleExcluir = async (id) => {
    if (window.confirm("Deseja remover este cliente da base?")) {
      try {
        await clientService.deletar(id);
        carregarClientes();
      } catch (error) {
        alert("Erro ao excluir cliente.");
      }
    }
  };

  return (
    <MainLayout titulo="Carteira de Clientes">
      <div className="clientes-container">
        <div className="toolbar">
          <input type="text" placeholder="Busca..." className="search-input"/>
          <button className="btn-novo-cliente" onClick={() => setFormVisivel(!formVisivel)}>
            {formVisivel ? 'Cancelar' : '+ Cadastrar Empresa'}
          </button>
        </div>

        {formVisivel && (
          <form className="form-card" onSubmit={handleSalvar}>
            <h3>Nova Empresa</h3>
            <div className="grid-inputs">
              <div className="field-group">
                <label>CNPJ</label>
                <input name="cnpj" value={novoCliente.cnpj} onChange={handleChange} required />
              </div>
              <div className="field-group">
                <label>Razão Social</label>
                <input name="razaoSocial" value={novoCliente.razaoSocial} onChange={handleChange} required />
              </div>
              <div className="field-group">
                <label>Regime Tributário</label>
                <select name="regimeTributario" value={novoCliente.regimeTributario} onChange={handleChange}>
                  <option value="SIMPLES_NACIONAL">Simples Nacional</option>
                  <option value="LUCRO_PRESUMIDO">Lucro Presumido</option>
                  <option value="LUCRO_REAL">Lucro Real</option>
                  <option value="MEI">MEI</option>
                </select>
              </div>
            </div>
            <div className="form-footer">
               <button type="submit" className="btn-save">Salvar Empresa</button>
            </div>
          </form>
        )}

        <div className="table-responsive">
          <table className="tabela-clientes">
            <thead>
              <tr><th>CNPJ</th><th>Razão Social</th><th>Status</th><th>Ações</th></tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan="4">Carregando...</td></tr> : 
                clientes.map((c) => (
                  <tr key={c.id}>
                    <td>{c.cnpj}</td>
                    <td>{c.razaoSocial}</td>
                    <td>{c.status}</td>
                    <td><button onClick={() => handleExcluir(c.id)}>🗑️</button></td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
};

export default Clientes;