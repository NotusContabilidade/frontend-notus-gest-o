import api from './api';

const userService = {
  // --- LEITURA (Core) ---
  // Busca todos os usuários do escritório via UserController
  listarTodos: async () => {
    try {
      // CORREÇÃO: Endpoint em português para bater com o Java (/api/usuarios)
      // Se seu UserController estiver mapeado como /users, mude aqui, mas o padrão do projeto é PT.
      const response = await api.get('/usuarios');
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      throw error;
    }
  },

  // --- ESCRITA (Módulo Gestão) ---
  // A criação de usuários agora é uma tarefa administrativa, não pública.
  
  criar: async (dadosUsuario) => {
    try {
      // CORREÇÃO CRÍTICA:
      // De: api.post('/auth/register', ...)  <-- Isso não existe mais
      // Para: api.post('/gestao/usuarios', ...) <-- Controller Administrativo
      const response = await api.post('/gestao/usuarios', dadosUsuario);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      throw error;
    }
  },

  resetarSenha: async (usuarioId) => {
    try {
      // Endpoint administrativo para resetar senha
      const response = await api.post('/gestao/usuarios/reset-senha', { usuarioId });
      return response.data;
    } catch (error) {
      console.error("Erro ao resetar senha:", error);
      throw error;
    }
  },

  // --- DELEÇÃO ---
  deletar: async (id) => {
    try {
      // Chama o endpoint de deleção (Geralmente no Core UserController ou Gestão)
      await api.delete(`/usuarios/${id}`);
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
      throw error;
    }
  }
};

export default userService;