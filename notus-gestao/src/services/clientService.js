import api from './api';

const clientService = {
  // --- LEITURA (Módulo Core) ---
  // Usa o ClienteController.java (@RequestMapping("/api/clientes"))
  
  listarTodos: async () => {
    try {
      // CORREÇÃO: De '/clients' para '/clientes'
      const response = await api.get('/clientes');
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
      throw error;
    }
  },

  buscarPorId: async (id) => {
    try {
      // CORREÇÃO: De '/clients' para '/clientes'
      const response = await api.get(`/clientes/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar cliente:", error);
      throw error;
    }
  },

  // --- ESCRITA (Módulo Gestão) ---
  // Usa o GestaoClienteController.java (@RequestMapping("/api/gestao/clientes"))
  // Isso é vital porque o ClienteController do Core é "Read-Only" (Apenas Leitura)

  criar: async (dadosCliente) => {
    try {
      // CORREÇÃO: Rota aponta para a API de Gestão
      const response = await api.post('/gestao/clientes', dadosCliente);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar cliente:", error);
      throw error;
    }
  },

  atualizar: async (id, dadosAtualizados) => {
    try {
      // CORREÇÃO: Rota aponta para a API de Gestão
      const response = await api.put(`/gestao/clientes/${id}`, dadosAtualizados);
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
      throw error;
    }
  },

  deletar: async (id) => {
    try {
      // CORREÇÃO: Rota aponta para a API de Gestão
      await api.delete(`/gestao/clientes/${id}`);
    } catch (error) {
      console.error("Erro ao deletar cliente:", error);
      throw error;
    }
  },

  // --- FUNCIONALIDADES EXTRAS DE GESTÃO ---
  
  transferirCarteira: async (contadorAntigoId, contadorNovoId) => {
    try {
      const response = await api.post('/gestao/clientes/transferir-carteira', {
        contadorAntigoId,
        contadorNovoId
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao transferir carteira:", error);
      throw error;
    }
  },

  alterarRegime: async (dadosAlteracao) => {
    try {
      const response = await api.post('/gestao/clientes/alterar-regime', dadosAlteracao);
      return response.data;
    } catch (error) {
      console.error("Erro ao alterar regime:", error);
      throw error;
    }
  }
};

export default clientService;