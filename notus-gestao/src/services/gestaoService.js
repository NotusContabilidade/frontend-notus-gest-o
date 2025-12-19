import api from './api';

const gestaoService = {
  
  // --- FINANCEIRO (Minha Remuneração) ---
  // Chama o GestaoFinanceiraController
  obterResumoFinanceiro: async () => {
    try {
      const response = await api.get('/gestao/financeiro/meu-resumo');
      return response.data;
    } catch (error) {
      console.error("Erro ao carregar resumo financeiro:", error);
      throw error;
    }
  },

  // --- CARTEIRA (Kanban de Clientes) ---
  // Chama o GestaoCarteiraController
  
  obterPanoramaCarteira: async () => {
    try {
      const response = await api.get('/gestao/carteira/panorama');
      return response.data;
    } catch (error) {
      console.error("Erro ao carregar panorama da carteira:", error);
      throw error;
    }
  },

  transferirCliente: async (clienteId, novoContadorId) => {
    try {
      // O backend espera um objeto { novoResponsavelId: 123 }
      await api.post(`/gestao/carteira/transferir/${clienteId}`, {
        novoResponsavelId: novoContadorId
      });
    } catch (error) {
      console.error("Erro ao transferir cliente:", error);
      throw error;
    }
  }
};

export default gestaoService;