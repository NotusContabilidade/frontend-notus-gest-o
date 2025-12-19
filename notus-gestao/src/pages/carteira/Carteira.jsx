import { useState, useEffect } from 'react';
import gestaoService from '../../services/gestaoService';
import './Carteira.css';

const Carteira = () => {
  const [colunas, setColunas] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estado temporário para saber quem está sendo arrastado
  const [dragItem, setDragItem] = useState(null);

  useEffect(() => {
    carregarPanorama();
  }, []);

  const carregarPanorama = async () => {
    try {
      const dados = await gestaoService.obterPanoramaCarteira();
      setColunas(dados);
    } catch (error) {
      console.error("Erro ao carregar carteira:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- EVENTOS DE DRAG & DROP ---

  const onDragStart = (e, cliente, origemId) => {
    // Guarda os dados do item que começou a ser arrastado
    setDragItem({ cliente, origemId });
    // Efeito visual (opcional)
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = (e) => {
    // Necessário para permitir que o item seja solto aqui
    e.preventDefault(); 
  };

  const onDrop = async (e, destinoId) => {
    e.preventDefault();

    // Se não tiver item ou se soltou na mesma coluna, não faz nada
    if (!dragItem || dragItem.origemId === destinoId) return;

    const { cliente, origemId } = dragItem;

    // 1. ATUALIZAÇÃO OTIMISTA (Muda na tela instantaneamente)
    const novoEstado = colunas.map(col => {
      // Remove da coluna antiga
      if (col.contadorId === origemId) {
        return {
          ...col,
          clientes: col.clientes.filter(c => c.id !== cliente.id),
          totalHonorarios: col.totalHonorarios - cliente.valorHonorarios
        };
      }
      // Adiciona na nova coluna
      if (col.contadorId === destinoId) {
        return {
          ...col,
          clientes: [...col.clientes, cliente],
          totalHonorarios: col.totalHonorarios + cliente.valorHonorarios
        };
      }
      return col;
    });

    setColunas(novoEstado); // Atualiza visual

    // 2. CHAMA O BACKEND (Persiste no banco)
    try {
      await gestaoService.transferirCliente(cliente.id, destinoId);
      // Sucesso silencioso
    } catch (error) {
      alert("Erro ao transferir cliente. As alterações serão desfeitas.");
      carregarPanorama(); // Reverte o estado visual buscando do servidor
    } finally {
      setDragItem(null);
    }
  };

  if (loading) return <div style={{padding:'40px', color:'#fff'}}>Carregando quadro...</div>;

  return (
    <div className="carteira-container anime-fade-in">
      
      <div className="carteira-header">
        <h2>Distribuição de Carteira</h2>
        <p>Arraste as empresas entre as colunas para redefinir o Contador Responsável.</p>
      </div>

      <div className="kanban-board">
        {colunas.map((col) => (
          <div 
            key={col.contadorId} 
            className="kanban-col"
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, col.contadorId)}
          >
            {/* Cabeçalho da Coluna */}
            <div className="col-header">
              <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                <div className="col-avatar">
                  {col.contadorNome.charAt(0)}
                </div>
                <div className="col-info">
                  <h3>{col.contadorNome}</h3>
                  <span>{col.clientes.length} Empresas</span>
                </div>
              </div>
              <div className="col-total">
                R$ {col.totalHonorarios.toLocaleString('pt-BR', {minimumFractionDigits:0})}
              </div>
            </div>

            {/* Lista de Clientes (Cards) */}
            <div className="col-body">
              {col.clientes.map((cli) => (
                <div
                  key={cli.id}
                  className="client-card"
                  draggable
                  onDragStart={(e) => onDragStart(e, cli, col.contadorId)}
                >
                  <div className="card-title">{cli.razaoSocial}</div>
                  <div className="card-footer">
                    <span>ID: {cli.id}</span>
                    <span className="card-price">
                      R$ {cli.valorHonorarios.toLocaleString('pt-BR', {minimumFractionDigits:2})}
                    </span>
                  </div>
                </div>
              ))}
              
              {col.clientes.length === 0 && (
                <div style={{textAlign:'center', padding:'20px', color:'#555', border:'2px dashed #333', borderRadius:'6px', margin:'10px'}}>
                  Solte aqui
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Carteira;