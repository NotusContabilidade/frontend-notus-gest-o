import api from './api';

const clientService = {
  listarTodos: async () => {
    try {
      const response = await api.get('/clients');
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
      throw error;
    }
  },

  buscarPorId: async (id) => {
    try {
      const response = await api.get(`/clients/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar cliente:", error);
      throw error;
    }
  },

  criar: async (dadosCliente) => {
    try {
      const response = await api.post('/clients', dadosCliente);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar cliente:", error);
      throw error;
    }
  },

  atualizar: async (id, dadosAtualizados) => {
    try {
      const response = await api.put(`/clients/${id}`, dadosAtualizados);
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
      throw error;
    }
  },

  deletar: async (id) => {
    try {
      await api.delete(`/clients/${id}`);
    } catch (error) {
      console.error("Erro ao remover cliente:", error);
      throw error;
    }
  }
};

export default clientService;