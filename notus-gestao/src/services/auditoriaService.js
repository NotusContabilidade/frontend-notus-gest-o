import api from './api';

const auditoriaService = {
  // Busca os logs do sistema com opção de filtros
  listarLogs: async (filtros = {}) => {
    try {
      const response = await api.get('/audit-logs', { params: filtros });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar logs de auditoria:", error);
      throw error; // Repassa o erro para a tela tratar
    }
  },

  // Exportar os logs
  exportarRelatorio: async (filtros = {}) => {
    try {
      const response = await api.get('/audit-logs/export', { 
        params: filtros,
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao exportar logs:", error);
      throw error;
    }
  }
};

// ESSA LINHA É A QUE O ERRO ESTÁ RECLAMANDO
export default auditoriaService;