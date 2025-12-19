import api from './api';

const processoService = {
  // Lista todos os modelos de processos configurados
  listarTodos: async () => {
    try {
      // CORREÇÃO: Aponta para o Controller de Gestão
      const response = await api.get('/gestao/processos');
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar processos:", error);
      throw error;
    }
  },

  // Cria um novo modelo de processo (Template)
  criar: async (dadosProcesso) => {
    try {
      // CORREÇÃO: Aponta para o Controller de Gestão
      // Payload esperado pelo Backend: NovoProcessoModeloDTO
      const response = await api.post('/gestao/processos', dadosProcesso);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar processo:", error);
      throw error;
    }
  },

  // Remove um modelo
  deletar: async (id) => {
    try {
      // CORREÇÃO: Aponta para o Controller de Gestão
      await api.delete(`/gestao/processos/${id}`);
    } catch (error) {
      console.error("Erro ao deletar processo:", error);
      throw error;
    }
  },

  // --- FUNCIONALIDADE EXTRA (Bônus) ---
  // Permite aplicar um modelo a um cliente específico (Gera as tarefas reais)
  aplicarAoCliente: async (modeloId, clienteId) => {
    try {
      const response = await api.post(`/gestao/processos/${modeloId}/aplicar/${clienteId}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao aplicar processo:", error);
      throw error;
    }
  }
};

export default processoService;