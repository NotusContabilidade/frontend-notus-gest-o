import { useState, useEffect } from 'react';
import MainLayout from '../../components/layout/MainLayout';

// CORREÇÃO AQUI: Importação sem chaves (Default Import)
import userService from '../../services/userService'; 

import './Usuarios.css';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [formVisivel, setFormVisivel] = useState(false);

  // Estado do formulário
  const [novoUsuario, setNovoUsuario] = useState({
    nome: '',
    email: '',
    password: '',
    role: 'USER',
    departamento: 'Geral',
    tenantId: localStorage.getItem('notus_tenant') 
  });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const dados = await userService.listarTodos();
      setUsuarios(dados);
    } catch (error) {
      setErro("Erro ao conectar com o servidor.");
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
      setFormVisivel(false);
      setNovoUsuario({ ...novoUsuario, nome: '', email: '', password: '' });
      carregarDados(); 
      alert("Usuário criado com sucesso!");
    } catch (error) {
      alert("Erro ao criar usuário. Verifique os dados.");
    }
  };

  const handleExcluir = async (id) => {
    if (window.confirm("Tem certeza que deseja remover este usuário?")) {
      try {
        await userService.deletar(id);
        carregarDados();
      } catch (error) {
        alert("Erro ao excluir.");
      }
    }
  };

  return (
    <MainLayout titulo="Gestão de Equipe">
      <div className="usuarios-container">
        <div className="actions-bar">
          <button className="btn-novo" onClick={() => setFormVisivel(!formVisivel)}>
            {formVisivel ? '✖ Cancelar' : '+ Novo Usuário'}
          </button>
        </div>

        {formVisivel && (
          <form className="form-novo-usuario" onSubmit={handleSalvar}>
            <h3>Cadastrar Colaborador</h3>
            <div className="form-grid">
              <input name="nome" placeholder="Nome" value={novoUsuario.nome} onChange={handleChange} required />
              <input name="email" placeholder="E-mail" value={novoUsuario.email} onChange={handleChange} required />
              <input name="password" type="password" placeholder="Senha" value={novoUsuario.password} onChange={handleChange} required />
              <select name="role" value={novoUsuario.role} onChange={handleChange}>
                <option value="USER">Usuário Comum</option>
                <option value="ADMIN">Administrador</option>
              </select>
            </div>
            <button type="submit" className="btn-salvar">Salvar Registro</button>
          </form>
        )}

        {!loading && !erro && (
          <table className="tabela-custom">
            <thead>
              <tr><th>Nome</th><th>E-mail</th><th>Ações</th></tr>
            </thead>
            <tbody>
              {usuarios.map((user) => (
                <tr key={user.id}>
                  <td>{user.nome}</td>
                  <td>{user.email}</td>
                  <td><button className="btn-delete" onClick={() => handleExcluir(user.id)}>Remover</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </MainLayout>
  );
};

export default Usuarios;