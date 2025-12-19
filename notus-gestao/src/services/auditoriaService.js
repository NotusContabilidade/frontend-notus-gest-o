import api from './api';

const auditoriaService = {
  listarLogs: async (filtros = {}) => {
    try {
      // 1. Chama a rota EXATA do seu GestaoAuditoriaController
      const response = await api.get('/gestao/auditoria/atividades');
      
      // 2. Faz o "De/Para" dos campos para a tela não quebrar
      // Backend (LogAtividade) -> Frontend (Timeline)
      const logsFormatados = response.data.map(log => ({
        id: log.id,
        // Backend manda 'dataHora', Frontend usa 'dataHora' (OK)
        dataHora: log.dataHora,
        
        // Backend manda 'acao' (ex: CRIAR_USUARIO), Frontend usa 'tipo' para escolher o ícone
        tipo: log.acao, 
        
        // Backend manda 'acao' como resumo, usamos como título
        titulo: log.acao,
        
        // Backend manda 'detalhe', Frontend exibe na descrição
        descricao: log.detalhe,
        
        // Backend manda objeto User completo, pegamos só o nome
        usuarioResponsavel: log.usuarioResponsavel ? log.usuarioResponsavel.nome : 'Sistema',
        
        // Backend não tem campo específico 'clienteAfetado' no LogAtividade (pelo código que vi),
        // então deixamos null ou extraímos do detalhe se necessário.
        clienteAfetado: null 
      }));

      return logsFormatados;
    } catch (error) {
      console.error("Erro ao buscar logs:", error);
      return [];
    }
  }
};

export default auditoriaService;