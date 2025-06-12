import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './KanbanDashboard.css';

function KanbanDashboard() {
  const [boards, setBoards] = useState([]);
  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);
  const [boardName, setBoardName] = useState('');
  const navigate = useNavigate();

  // Carregar quadros do localStorage
  useEffect(() => {
    const savedBoards = localStorage.getItem('kanban-boards');
    if (savedBoards) {
      setBoards(JSON.parse(savedBoards));
    }
  }, []);

  // Salvar quadros no localStorage
  useEffect(() => {
    localStorage.setItem('kanban-boards', JSON.stringify(boards));
  }, [boards]);

  // Função para criar slug a partir do nome do quadro
  const createSlug = (name) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
      .replace(/\s+/g, '-') // Substitui espaços por hífens
      .replace(/-+/g, '-') // Remove hífens duplicados
      .trim();
  };

  // Função para criar um novo quadro
  const createBoard = (e) => {
    e.preventDefault();
    
    if (!boardName.trim()) {
      alert('Por favor, digite um nome para o quadro.');
      return;
    }

    const slug = createSlug(boardName);
    
    // Verificar se já existe um quadro com o mesmo slug
    const existingBoard = boards.find(board => board.slug === slug);
    if (existingBoard) {
      alert('Já existe um quadro com esse nome. Escolha um nome diferente.');
      return;
    }

    const newBoard = {
      id: Date.now(),
      name: boardName,
      slug: slug,
      createdAt: new Date().toISOString(),
      columns: [
        { id: 1, title: 'A Fazer', cards: [] },
        { id: 2, title: 'Em Progresso', cards: [] },
        { id: 3, title: 'Revisão', cards: [] },
        { id: 4, title: 'Concluído', cards: [] }
      ]
    };

    setBoards(prev => [...prev, newBoard]);
    setBoardName('');
    setIsBoardModalOpen(false);
    
    // Navegar para o novo quadro
    navigate(`/kanban/${slug}`);
  };

  // Função para navegar para um quadro
  const openBoard = (board) => {
    navigate(`/kanban/${board.slug}`);
  };

  // Função para deletar um quadro
  const deleteBoard = (boardId, e) => {
    e.stopPropagation();
    if (window.confirm('Tem certeza que deseja excluir este quadro? Esta ação não pode ser desfeita.')) {
      setBoards(prev => prev.filter(board => board.id !== boardId));
    }
  };

  return (
    <div className="kanban-dashboard">
      {/* Header melhorado */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="logo-section" onClick={() => navigate('/')}>
            <span className="logo-icon">📋</span>
            <h1>ServiTask</h1>
          </div>
          
          <div className="header-actions">
            <div className="boards-count">
              <span className="count-number">{boards.length}</span>
              <span className="count-label">
                {boards.length === 1 ? 'Quadro' : 'Quadros'}
              </span>
            </div>
            
            <button 
              className="create-board-btn-header"
              onClick={() => setIsBoardModalOpen(true)}
              title="Criar novo quadro"
            >
              <span>➕</span>
              Novo Quadro
            </button>
            
            <button 
              className="home-btn"
              onClick={() => navigate('/')}
              title="Voltar à página inicial"
            >
              <span>🏠</span>
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="content-header">
          <div className="header-text">
            <h2>Meus Quadros Kanban</h2>
            <p className="header-subtitle">
              {boards.length === 0 
                ? 'Organize suas tarefas criando seu primeiro quadro'
                : `Gerencie seus ${boards.length} ${boards.length === 1 ? 'quadro' : 'quadros'} de forma eficiente`
              }
            </p>
          </div>
        </div>

        {boards.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>Nenhum quadro criado ainda</h3>
            <p>Crie seu primeiro quadro Kanban para começar a organizar suas tarefas de forma visual e eficiente</p>
            <div className="empty-actions">
              <button 
                className="create-first-board-btn"
                onClick={() => setIsBoardModalOpen(true)}
              >
                <span>🚀</span>
                Criar Primeiro Quadro
              </button>
              <button 
                className="demo-btn"
                onClick={() => {
                  // Criar quadro de demonstração
                  const demoBoard = {
                    id: Date.now(),
                    name: 'Quadro de Demonstração',
                    slug: 'quadro-de-demonstracao',
                    createdAt: new Date().toISOString(),
                    columns: [
                      { 
                        id: 1, 
                        title: 'A Fazer', 
                        cards: [
                          { id: 1, title: 'Tarefa de exemplo', description: 'Esta é uma tarefa de demonstração', priority: 'media' }
                        ] 
                      },
                      { 
                        id: 2, 
                        title: 'Em Progresso', 
                        cards: [
                          { id: 2, title: 'Tarefa em andamento', description: 'Exemplo de tarefa sendo executada', priority: 'alta' }
                        ] 
                      },
                      { id: 3, title: 'Revisão', cards: [] },
                      { 
                        id: 4, 
                        title: 'Concluído', 
                        cards: [
                          { id: 3, title: 'Tarefa finalizada', description: 'Exemplo de tarefa concluída', priority: 'baixa' }
                        ] 
                      }
                    ]
                  };
                  setBoards([demoBoard]);
                  navigate(`/kanban/${demoBoard.slug}`);
                }}
              >
                <span>👁️</span>
                Ver Demonstração
              </button>
            </div>
          </div>
        ) : (
          <div className="boards-grid">
            {boards.map(board => (
              <div 
                key={board.id} 
                className="board-card"
                onClick={() => openBoard(board)}
              >
                <div className="board-header">
                  <h3>{board.name}</h3>
                  <button 
                    className="delete-board-btn"
                    onClick={(e) => deleteBoard(board.id, e)}
                    title="Excluir quadro"
                  >
                    🗑️
                  </button>
                </div>
                <div className="board-info">
                  <p className="board-url">/kanban/{board.slug}</p>
                  <p className="board-date">
                    Criado em {new Date(board.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="board-stats">
                  <div className="stat">
                    <span className="stat-number">{board.columns.length}</span>
                    <span className="stat-label">Colunas</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">
                      {board.columns.reduce((total, col) => total + col.cards.length, 0)}
                    </span>
                    <span className="stat-label">Cartões</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal para criar quadro */}
      {isBoardModalOpen && (
        <div className="modal-overlay" onClick={() => setIsBoardModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Criar Novo Quadro</h2>
              <button 
                className="modal-close"
                onClick={() => setIsBoardModalOpen(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={createBoard} className="board-form">
              <div className="form-group">
                <label htmlFor="boardName">Nome do Quadro</label>
                <input
                  type="text"
                  id="boardName"
                  value={boardName}
                  onChange={(e) => setBoardName(e.target.value)}
                  placeholder="Ex: Projeto Website, Tarefas Pessoais..."
                  autoFocus
                />
                {boardName && (
                  <p className="url-preview">
                    URL: /kanban/{createSlug(boardName)}
                  </p>
                )}
              </div>
              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn-cancel"
                  onClick={() => setIsBoardModalOpen(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-create">
                  Criar Quadro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default KanbanDashboard; 