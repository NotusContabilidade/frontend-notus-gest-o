import { useState, useEffect } from 'react';
import clientService from '../../services/clientService';
import './Clientes.css';

const SISTEMAS = [
  { id: 'NENHUM', label: 'Sem Integração (Apenas Cadastro Interno)' },
  { id: 'OMIE', label: 'Omie ERP (Integração via API)' },
  { id: 'DOMINIO', label: 'Domínio Sistemas (Troca de Arquivos)' },
  { id: 'CONTA_AZUL', label: 'Conta Azul' },
  { id: 'QYON', label: 'Qyon' }
];

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modoCadastro, setModoCadastro] = useState(false);
  
  const [novoCliente, setNovoCliente] = useState({
    // Identificação Básica
    cnpj: '',
    razaoSocial: '',
    nomeFantasia: '',
    
    // Contato
    emailContato: '',
    emailNfe: '',
    telefone: '',
    site: '',

    // Fiscal
    regimeTributario: 'SIMPLES_NACIONAL',
    inscricaoEstadual: '',
    indicadorInscricaoEstadual: '9', // 9=Não Contribuinte
    inscricaoMunicipal: '',
    cnaePrincipal: '',
    suframa: '',
    
    // Endereço
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: 'SP',
    codigoIbgeCidade: '',

    // Integração
    sistemaIntegracao: 'NENHUM',
    apiKey1: '', 
    apiKey2: '' 
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
      console.error("Erro ao listar", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNovoCliente(prev => ({ ...prev, [name]: value }));
  };

  const selecionarSistema = (id) => {
    setNovoCliente(prev => ({ 
      ...prev, 
      sistemaIntegracao: id,
      apiKey1: '', apiKey2: '' // Reseta chaves ao trocar
    }));
  };

  // Função simples para buscar CEP
  const buscarCep = async () => {
    if (novoCliente.cep.length === 8) {
      try {
        const resp = await fetch(`https://viacep.com.br/ws/${novoCliente.cep}/json/`);
        const data = await resp.json();
        if (!data.erro) {
          setNovoCliente(prev => ({
            ...prev,
            logradouro: data.logradouro,
            bairro: data.bairro,
            cidade: data.localidade,
            estado: data.uf,
            codigoIbgeCidade: data.ibge
          }));
        }
      } catch (e) {
        console.error("Erro CEP", e);
      }
    }
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    try {
      await clientService.criar(novoCliente);
      alert("Cadastro realizado com sucesso!");
      setModoCadastro(false);
      carregarClientes();
    } catch (error) {
      alert("Erro ao salvar. Verifique se o CNPJ já existe ou campos obrigatórios.");
    }
  };

  return (
    <div className="clientes-container anime-fade-in">

      {/* LISTAGEM */}
      {!modoCadastro && (
        <>
          <div className="toolbar">
            <input type="text" placeholder="Buscar por Razão Social ou CNPJ..." className="search-input"/>
            <button className="btn-novo-cliente" onClick={() => setModoCadastro(true)}>
              + Nova Empresa
            </button>
          </div>

          <div className="table-responsive">
            <table className="tabela-clientes">
              <thead>
                <tr>
                  <th style={{width: '150px'}}>CNPJ</th>
                  <th>Empresa</th>
                  <th>Cidade/UF</th>
                  <th>Regime</th>
                  <th>Integração</th>
                </tr>
              </thead>
              <tbody>
                {clientes.length === 0 && !loading ? (
                   <tr><td colSpan="5" style={{padding:'20px', textAlign:'center'}}>Nenhum cliente cadastrado.</td></tr>
                ) : (
                  clientes.map(c => (
                    <tr key={c.id}>
                      <td>{c.cnpj}</td>
                      <td>
                        <div style={{fontWeight:'bold', color:'white'}}>{c.razaoSocial}</div>
                        <div style={{fontSize:'0.8rem', color:'#888'}}>{c.nomeFantasia || '-'}</div>
                      </td>
                      <td>{c.cidade} / {c.estado}</td>
                      <td>{c.regimeTributario?.replace('_', ' ')}</td>
                      <td>
                        <span className={`badge-sistema ${c.sistemaIntegracao}`}>
                          {c.sistemaIntegracao?.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* FORMULÁRIO DE CADASTRO */}
      {modoCadastro && (
        <div className="cadastro-wizard">
          <div className="wizard-header">
            <button className="btn-voltar" onClick={() => setModoCadastro(false)}>
              &larr; Voltar para a lista
            </button>
            <h2>Nova Empresa</h2>
          </div>

          <form onSubmit={handleSalvar}>
            
            {/* BLOCO 1: SELEÇÃO DE SISTEMA (RADIO BUTTONS) */}
            <div className="section-title">1. Integração e Sincronização</div>
            <div className="selecao-sistemas-container">
              {SISTEMAS.map(sis => (
                <div 
                  key={sis.id} 
                  className={`sistema-option ${novoCliente.sistemaIntegracao === sis.id ? 'selected' : ''}`}
                  onClick={() => selecionarSistema(sis.id)}
                >
                  <div className="radio-circle"></div>
                  <div className="sistema-info">
                    <span className="sistema-nome">{sis.label}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* CAMPOS ESPECÍFICOS DE INTEGRAÇÃO */}
            {novoCliente.sistemaIntegracao !== 'NENHUM' && (
              <div className="integration-box">
                <h4>Configuração {novoCliente.sistemaIntegracao}</h4>
                <div className="form-row">
                  <div className="field-group col-6">
                    <label>App Key (Chave de API) <span className="required">*</span></label>
                    <input name="apiKey1" value={novoCliente.apiKey1} onChange={handleChange} required />
                  </div>
                  {novoCliente.sistemaIntegracao === 'OMIE' && (
                    <div className="field-group col-6">
                      <label>App Secret (Chave Secreta) <span className="required">*</span></label>
                      <input name="apiKey2" value={novoCliente.apiKey2} onChange={handleChange} required />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* BLOCO 2: DADOS CADASTRAIS */}
            <div className="section-title">2. Dados Cadastrais</div>
            
            <div className="form-row">
              <div className="field-group col-4">
                <label>CNPJ <span className="required">*</span></label>
                <input name="cnpj" value={novoCliente.cnpj} onChange={handleChange} placeholder="00.000.000/0000-00" required />
              </div>
              <div className="field-group col-8">
                <label>Razão Social <span className="required">*</span></label>
                <input name="razaoSocial" value={novoCliente.razaoSocial} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-row">
              <div className="field-group col-6">
                <label>Nome Fantasia</label>
                <input name="nomeFantasia" value={novoCliente.nomeFantasia} onChange={handleChange} />
              </div>
              <div className="field-group col-6">
                <label>Site</label>
                <input name="site" value={novoCliente.site} onChange={handleChange} placeholder="www.empresa.com.br" />
              </div>
            </div>

            <div className="form-row">
              <div className="field-group col-6">
                <label>E-mail Principal <span className="required">*</span></label>
                <input name="emailContato" type="email" value={novoCliente.emailContato} onChange={handleChange} required />
              </div>
              <div className="field-group col-6">
                <label>E-mail NF-e (Opcional)</label>
                <input name="emailNfe" type="email" value={novoCliente.emailNfe} onChange={handleChange} />
              </div>
            </div>

            {/* BLOCO 3: FISCAL */}
            <div className="section-title">3. Informações Fiscais</div>

            <div className="form-row">
              <div className="field-group col-4">
                <label>Regime Tributário</label>
                <select name="regimeTributario" value={novoCliente.regimeTributario} onChange={handleChange}>
                  <option value="SIMPLES_NACIONAL">Simples Nacional</option>
                  <option value="LUCRO_PRESUMIDO">Lucro Presumido</option>
                  <option value="LUCRO_REAL">Lucro Real</option>
                  <option value="MEI">MEI</option>
                </select>
              </div>
              <div className="field-group col-4">
                <label>CNAE Principal</label>
                <input name="cnaePrincipal" value={novoCliente.cnaePrincipal} onChange={handleChange} placeholder="0000-0/00" />
              </div>
              <div className="field-group col-4">
                <label>Inscrição SUFRAMA</label>
                <input name="suframa" value={novoCliente.suframa} onChange={handleChange} />
              </div>
            </div>

            <div className="form-row">
              <div className="field-group col-3">
                <label>Indicador IE</label>
                <select name="indicadorInscricaoEstadual" value={novoCliente.indicadorInscricaoEstadual} onChange={handleChange}>
                  <option value="1">1 - Contribuinte</option>
                  <option value="2">2 - Isento</option>
                  <option value="9">9 - Não Contribuinte</option>
                </select>
              </div>
              <div className="field-group col-5">
                <label>Inscrição Estadual</label>
                <input 
                  name="inscricaoEstadual" 
                  value={novoCliente.inscricaoEstadual} 
                  onChange={handleChange} 
                  disabled={novoCliente.indicadorInscricaoEstadual === '2' || novoCliente.indicadorInscricaoEstadual === '9'}
                />
              </div>
              <div className="field-group col-4">
                <label>Inscrição Municipal</label>
                <input name="inscricaoMunicipal" value={novoCliente.inscricaoMunicipal} onChange={handleChange} />
              </div>
            </div>

            {/* BLOCO 4: ENDEREÇO */}
            <div className="section-title">4. Endereço Completo</div>

            <div className="form-row">
              <div className="field-group col-3">
                <label>CEP</label>
                <input name="cep" value={novoCliente.cep} onChange={handleChange} onBlur={buscarCep} placeholder="00000-000" />
              </div>
              <div className="field-group col-7">
                <label>Logradouro</label>
                <input name="logradouro" value={novoCliente.logradouro} onChange={handleChange} />
              </div>
              <div className="field-group col-2">
                <label>Número</label>
                <input name="numero" value={novoCliente.numero} onChange={handleChange} />
              </div>
            </div>

            <div className="form-row">
              <div className="field-group col-4">
                <label>Bairro</label>
                <input name="bairro" value={novoCliente.bairro} onChange={handleChange} />
              </div>
              <div className="field-group col-4">
                <label>Cidade</label>
                <input name="cidade" value={novoCliente.cidade} onChange={handleChange} />
              </div>
              <div className="field-group col-2">
                <label>Estado</label>
                <input name="estado" value={novoCliente.estado} onChange={handleChange} maxLength={2} />
              </div>
              <div className="field-group col-2">
                <label>Cód. IBGE</label>
                <input name="codigoIbgeCidade" value={novoCliente.codigoIbgeCidade} onChange={handleChange} />
              </div>
            </div>

            {/* RODAPÉ E BOTÃO */}
            <div className="form-actions-bottom">
              <button type="submit" className="btn-save-big">
                Salvar Cliente e Sincronizar
              </button>
            </div>

          </form>
        </div>
      )}
    </div>
  );
};

export default Clientes;