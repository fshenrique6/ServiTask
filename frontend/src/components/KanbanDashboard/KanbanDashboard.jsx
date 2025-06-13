import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../utils/iconMapping.jsx';
import apiService from '../../services/api';
import { nameToSlug } from '../../utils/urlUtils';
import '../Kanban/Kanban.css';

export default function KanbanDashboard() {
  const navigate = useNavigate();
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalBoards: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0
  });

  const [isCreatingBoard, setIsCreatingBoard] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');

  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const boardsData = await apiService.getBoards();
      setBoards(boardsData);
      
      calculateStats(boardsData);
    } catch (err) {
      console.error('Erro ao carregar dashboard:', err);
      setError('Erro ao carregar dados do dashboard. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (boardsData) => {
    let totalTasks = 0;
    let completedTasks = 0;

    boardsData.forEach(board => {
      if (board.columns) {
        board.columns.forEach(column => {
          if (column.cards) {
            totalTasks += column.cards.length;
            if (column.name.toLowerCase().includes('concluído') || 
                column.name.toLowerCase().includes('concluido') ||
                column.name.toLowerCase().includes('done') ||
                column.name.toLowerCase().includes('finalizado')) {
              completedTasks += column.cards.length;
            }
          }
        });
      }
    });

    setStats({
      totalBoards: boardsData.length,
      totalTasks,
      completedTasks,
      pendingTasks: totalTasks - completedTasks
    });
  };

  const goToBoard = (board) => {
    const slug = nameToSlug(board.name);
    navigate(`/kanban/${slug}`);
  };

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    
    if (!newBoardName.trim()) {
      alert('Por favor, digite um nome para o quadro.');
      return;
    }

    try {
      const newBoard = await apiService.createBoard(newBoardName.trim());
      setBoards(prev => [...prev, newBoard]);
      setNewBoardName('');
      setIsCreatingBoard(false);
      
      const slug = nameToSlug(newBoard.name);
      navigate(`/kanban/${slug}`);
    } catch (err) {
      console.error('Erro ao criar quadro:', err);
      alert('Erro ao criar quadro. Tente novamente.');
    }
  };

  const handleLogout = () => {
    apiService.logout();
    navigate('/');
  };

  const handleMyAccount = () => {
    setIsUserDropdownOpen(false);
    alert('Funcionalidade "Minha Conta" será implementada em breve!');
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdown = document.querySelector('.user-dropdown-container');
      if (dropdown && !dropdown.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (loading) {
    return (
      <div className="kanban-container">
        <div className="loading-state">
          <div className="loading-content">
            <div className="loading-spinner"><Icon emoji="⏳" size={32} /></div>
            <h2>Carregando dashboard...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="kanban-container">
        <div className="error-state">
          <div className="error-content">
            <div className="error-icon"><Icon emoji="❌" size={32} /></div>
            <h2>Erro ao carregar dados</h2>
            <p>{error}</p>
            <button 
              className="btn-primary"
              onClick={loadDashboardData}
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-info">
            <h1><Icon emoji="📊" /> Dashboard</h1>
            <p>Visão geral dos seus quadros e tarefas</p>
          </div>
          <div className="user-dropdown-container">
            <button className="user-profile-btn" onClick={toggleUserDropdown}>
              <div style={{ fontSize: '32px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon emoji="👤" size={32} color="white" />
              </div>
            </button>
            
            {isUserDropdownOpen && (
              <div className="user-dropdown-menu">
                <div className="dropdown-item" onClick={handleMyAccount}>
                  <span className="item-icon"><Icon emoji="⚙️" /></span>
                  <span>Minha Conta</span>
                </div>
                <div className="dropdown-separator"></div>
                <div className="dropdown-item logout-item" onClick={handleLogout}>
                  <span className="item-icon"><Icon emoji="🚪" /></span>
                  <span>Sair</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        
        <section className="stats-section">
          <h2><Icon emoji="📈" /> Estatísticas</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon"><Icon emoji="📋" size={24} /></div>
              <div className="stat-info">
                <div className="stat-number">{stats.totalBoards}</div>
                <div className="stat-label">Quadros</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon"><Icon emoji="📝" size={24} /></div>
              <div className="stat-info">
                <div className="stat-number">{stats.totalTasks}</div>
                <div className="stat-label">Total de Tarefas</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon"><Icon emoji="✅" size={24} /></div>
              <div className="stat-info">
                <div className="stat-number">{stats.completedTasks}</div>
                <div className="stat-label">Concluídas</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon"><Icon emoji="⏳" size={24} /></div>
              <div className="stat-info">
                <div className="stat-number">{stats.pendingTasks}</div>
                <div className="stat-label">Pendentes</div>
              </div>
            </div>
          </div>
        </section>

        <section className="boards-section">
          <div className="section-header">
            <h2><Icon emoji="📋" /> Meus Quadros</h2>
            <button 
              className="btn-create-board"
              onClick={() => setIsCreatingBoard(true)}
            >
              <span><Icon emoji="➕" /></span> Novo Quadro
            </button>
          </div>

          {isCreatingBoard && (
            <div className="create-board-form">
              <form onSubmit={handleCreateBoard}>
                <input
                  type="text"
                  placeholder="Nome do novo quadro..."
                  value={newBoardName}
                  onChange={(e) => setNewBoardName(e.target.value)}
                  autoFocus
                />
                <div className="form-actions">
                  <button type="submit" className="btn-confirm">Criar</button>
                  <button 
                    type="button" 
                    className="btn-cancel"
                    onClick={() => {
                      setIsCreatingBoard(false);
                      setNewBoardName('');
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          {boards.length === 0 ? (
            <div className="empty-boards">
              <div className="empty-icon"><Icon emoji="📋" size={48} /></div>
              <h3>Nenhum quadro criado</h3>
              <p>Crie seu primeiro quadro para começar a organizar suas tarefas!</p>
              <button 
                className="btn-primary"
                onClick={() => setIsCreatingBoard(true)}
              >
                <Icon emoji="➕" /> Criar Primeiro Quadro
              </button>
            </div>
          ) : (
            <div className="boards-grid">
              {boards.map(board => (
                <div key={board.id} className="board-card" onClick={() => goToBoard(board)}>
                  <div className="board-header">
                    <h3>{board.name}</h3>
                    <div className="board-stats">
                      {board.columns && (
                        <span className="column-count">
                          {board.columns.length} coluna{board.columns.length !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {board.columns && board.columns.length > 0 && (
                    <div className="board-preview">
                      {board.columns.slice(0, 3).map(column => (
                        <div key={column.id} className="column-preview">
                          <div className="column-name">{column.name}</div>
                          <div className="cards-count">
                            {column.cards ? column.cards.length : 0} tarefa{(column.cards ? column.cards.length : 0) !== 1 ? 's' : ''}
                          </div>
                        </div>
                      ))}
                      {board.columns.length > 3 && (
                        <div className="more-columns">
                          +{board.columns.length - 3} mais
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="board-footer">
                    <span className="board-action"><Icon emoji="🔗" /> Abrir quadro</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
} 