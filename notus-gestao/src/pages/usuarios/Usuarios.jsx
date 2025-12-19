import { useState, useEffect } from 'react';
import userService from '../../services/userService';
import './Usuarios.css';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formVisivel, setFormVisivel] = useState(false);

  // Estado do Formulário
  const [novoUsuario, setNovoUsuario] = useState({
    nome: '',
    email: '',
    password: '',
    role: 'CONTADOR', // Valor padrão
    departamento: 'FISCAL' // Valor padrão
  });

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    try {
      setLoading(true);
      const dados = await userService.listarTodos();
      console.log("Usuários recebidos:", dados);
      setUsuarios(dados);
    } catch (error) {
      console.error("Erro ao listar usuários:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNovoUsuario(prev => ({ ...prev, [name]: value }));
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    try {
      await userService.criar(novoUsuario);
      alert("Colaborador cadastrado com sucesso!");
      
      // Limpa e fecha
      setNovoUsuario({ nome: '', email: '', password: '', role: 'CONTADOR', departamento: 'FISCAL' });
      setFormVisivel(false);
      
      // Atualiza a lista
      carregarUsuarios();
    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar. Verifique se o e-mail já existe.");
    }
  };

  const handleExcluir = async (id) => {
    if (window.confirm("Tem certeza que deseja remover este acesso?")) {
      try {
        await userService.deletar(id);
        carregarUsuarios();
      } catch (error) {
        alert("Erro ao excluir usuário.");
      }
    }
  };

  return (
    <div className="usuarios-container anime-fade-in">
      
      {/* CABEÇALHO DE AÇÃO */}
      <div className="header-actions">
         <div className="search-bar">
           <input 
             type="text" 
             placeholder="🔍 Buscar por nome ou e-mail..." 
             className="search-input"
           />
         </div>
         
         {!formVisivel && (
           <button className="btn-novo-usuario" onClick={() => setFormVisivel(true)}>
             + Novo Colaborador
           </button>
         )}
      </div>

      {/* FORMULÁRIO (CARD) */}
      {formVisivel && (
        <div className="cadastro-card">
           <h3>Cadastrar Novo Membro</h3>
           <form onSubmit={handleSalvar}>
             
             <div className="form-row">
               <div className="field-group col-6">
                 <label>Nome Completo</label>
                 <input 
                   name="nome"
                   value={novoUsuario.nome} 
                   onChange={handleChange} 
                   required 
                 />
               </div>
               <div className="field-group col-6">
                 <label>E-mail Corporativo</label>
                 <input 
                   name="email"
                   type="email"
                   value={novoUsuario.email} 
                   onChange={handleChange} 
                   required 
                 />
               </div>
             </div>

             <div className="form-row">
               <div className="field-group col-4">
                 <label>Perfil de Acesso</label>
                 <select name="role" value={novoUsuario.role} onChange={handleChange}>
                   <option value="CONTADOR">Contador (Operacional)</option>
                   <option value="ADMIN">Administrador (Gestor)</option>
                 </select>
               </div>
               
               <div className="field-group col-4">
                 <label>Departamento</label>
                 <select name="departamento" value={novoUsuario.departamento} onChange={handleChange}>
                   <option value="FISCAL">Fiscal</option>
                   <option value="CONTABIL">Contábil</option>
                   <option value="PESSOAL">Pessoal / RH</option>
                   <option value="FINANCEIRO">Financeiro</option>
                   <option value="TI">TI / Suporte</option>
                   <option value="LEGAL">Legal / Societário</option>
                 </select>
               </div>

               <div className="field-group col-4">
                 <label>Senha Inicial</label>
                 <input 
                   name="password"
                   type="password"
                   value={novoUsuario.password} 
                   onChange={handleChange} 
                   placeholder="Mínimo 6 caracteres"
                   required 
                 />
               </div>
             </div>

             <div className="form-actions-bottom">
               <button type="button" className="btn-cancelar" onClick={() => setFormVisivel(false)}>
                 Cancelar
               </button>
               <button type="submit" className="btn-salvar">
                 Confirmar Cadastro
               </button>
             </div>
           </form>
        </div>
      )}

      {/* LISTAGEM DE USUÁRIOS */}
      <div className="table-responsive">
        <table className="tabela-users">
          <thead>
            <tr>
              <th style={{width: '30%'}}>Nome</th>
              <th style={{width: '30%'}}>E-mail</th>
              <th style={{width: '15%'}}>Departamento</th>
              <th style={{width: '15%'}}>Perfil</th>
              <th style={{textAlign: 'right'}}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{textAlign: 'center', padding: '20px'}}>Carregando equipe...</td></tr>
            ) : usuarios.length === 0 ? (
              <tr><td colSpan="5" style={{textAlign: 'center', padding: '30px', color: '#888'}}>Nenhum usuário encontrado.</td></tr>
            ) : (
              usuarios.map(user => (
                <tr key={user.id}>
                  <td>
                    <strong>{user.nome}</strong>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    {user.departamento || '-'}
                  </td>
                  <td>
                    <span className={`badge-role ${user.role}`}>
                      {user.role === 'ADMIN' ? 'Gestor' : 'Equipe'}
                    </span>
                  </td>
                  <td style={{textAlign: 'right'}}>
                    <button 
                      className="btn-delete" 
                      title="Remover Acesso"
                      onClick={() => handleExcluir(user.id)}
                    >
                      Remover
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

export default Usuarios;