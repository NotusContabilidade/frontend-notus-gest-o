import api from './api';

 const processoService = {
  // Lista todos os modelos de processos configurados
  listarTodos: async () => {
    try {
      // Endpoint esperado: GET /processos
      const response = await api.get('/processos');
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar processos:", error);
      throw error;
    }
  },

  // Cria um novo modelo de processo (Template)
  criar: async (dadosProcesso) => {
    try {
      // Endpoint esperado: POST /processos
      // Payload: nome, descricao, periodicidade (MENSAL, ANUAL), departamento
      const response = await api.post('/processos', dadosProcesso);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar processo:", error);
      throw error;
    }
  },

  // Remove um modelo
  deletar: async (id) => {
    try {
      await api.delete(`/processos/${id}`);
    } catch (error) {
      console.error("Erro ao deletar processo:", error);
      throw error;
    }
  }
};
export default processoService;