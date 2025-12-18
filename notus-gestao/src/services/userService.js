import api from './api';

const userService = {
  // Busca todos os usuários do Tenant atual
  listarTodos: async () => {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      throw error;
    }
  },

  // Cria um novo usuário
  criar: async (dadosUsuario) => {
    try {
      const response = await api.post('/auth/register', dadosUsuario);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      throw error;
    }
  },

  // Remove um usuário pelo ID
  deletar: async (id) => {
    try {
      await api.delete(`/users/${id}`);
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
      throw error;
    }
  }
};

// A CORREÇÃO ESTÁ AQUI:
export default userService;