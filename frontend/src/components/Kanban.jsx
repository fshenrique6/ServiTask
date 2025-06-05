import React, { useState } from 'react';
import './Kanban.css';

function Kanban() {
    // Estado para todos os quadros
    const [boards, setBoards] = useState([]);
    const [activeBoardId, setActiveBoardId] = useState(null);

    // Estado para controlar o modal de criar quadro
    const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);
    const [boardName, setBoardName] = useState('');

    // Estado para controlar o modal de cartão
    const [isCardModalOpen, setIsCardModalOpen] = useState(false);
    const [selectedColumnId, setSelectedColumnId] = useState(null);
    const [editingCard, setEditingCard] = useState(null);

    // Estado para controlar o modal de confirmação de exclusão de cartão
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [cardToDelete, setCardToDelete] = useState(null);

    // Estado para controlar o modal de confirmação de exclusão de quadro
    const [isDeleteBoardModalOpen, setIsDeleteBoardModalOpen] = useState(false);
    const [boardToDelete, setBoardToDelete] = useState(null);

    // Estados para drag and drop
    const [draggedCard, setDraggedCard] = useState(null);
    const [draggedFromColumn, setDraggedFromColumn] = useState(null);
    const [dragOverColumn, setDragOverColumn] = useState(null);

    // Estado para o formulário de cartão
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'media'
    });

    // Função para obter o quadro ativo
    const getActiveBoard = () => {
        return boards.find(board => board.id === activeBoardId);
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'alta': return '#ef4444';
            case 'media': return '#f59e0b';
            case 'baixa': return '#10b981';
            default: return '#6b7280';
        }
    };

    // Função para criar um novo quadro
    const createBoard = (e) => {
        e.preventDefault();
        
        if (!boardName.trim()) {
            alert('Por favor, digite um nome para o quadro.');
            return;
        }

        const newBoard = {
            id: Date.now(),
            name: boardName,
            columns: [
                { id: 1, title: 'A Fazer', cards: [] },
                { id: 2, title: 'Em Progresso', cards: [] },
                { id: 3, title: 'Revisão', cards: [] },
                { id: 4, title: 'Concluído', cards: [] }
            ]
        };

        setBoards(prev => [...prev, newBoard]);
        setActiveBoardId(newBoard.id);
        setBoardName('');
        setIsBoardModalOpen(false);
    };

    // Função para selecionar um quadro
    const selectBoard = (boardId) => {
        setActiveBoardId(boardId);
    };

    // Função para abrir modal de confirmação de exclusão de quadro
    const openDeleteBoardModal = (e, board) => {
        e.stopPropagation(); // Evita selecionar o quadro ao clicar no botão de excluir
        setBoardToDelete(board);
        setIsDeleteBoardModalOpen(true);
    };

    // Função para fechar modal de confirmação de exclusão de quadro
    const closeDeleteBoardModal = () => {
        setIsDeleteBoardModalOpen(false);
        setBoardToDelete(null);
    };

    // Função para confirmar e executar a exclusão do quadro
    const confirmDeleteBoard = () => {
        if (boardToDelete) {
            // Remove o quadro da lista
            setBoards(prev => prev.filter(board => board.id !== boardToDelete.id));
            
            // Se o quadro excluído era o ativo, seleciona outro ou limpa
            if (activeBoardId === boardToDelete.id) {
                const remainingBoards = boards.filter(board => board.id !== boardToDelete.id);
                if (remainingBoards.length > 0) {
                    setActiveBoardId(remainingBoards[0].id);
                } else {
                    setActiveBoardId(null);
                }
            }
        }
        closeDeleteBoardModal();
    };

    // Função para abrir o modal para adicionar novo cartão
    const openCardModal = (columnId) => {
        setSelectedColumnId(columnId);
        setEditingCard(null);
        setFormData({ title: '', description: '', priority: 'media' });
        setIsCardModalOpen(true);
    };

    // Função para abrir o modal para editar cartão
    const openEditModal = (columnId, card) => {
        setSelectedColumnId(columnId);
        setEditingCard(card);
        setFormData({
            title: card.title,
            description: card.description,
            priority: card.priority
        });
        setIsCardModalOpen(true);
    };

    // Função para fechar o modal de cartão
    const closeCardModal = () => {
        setIsCardModalOpen(false);
        setSelectedColumnId(null);
        setEditingCard(null);
        setFormData({ title: '', description: '', priority: 'media' });
    };

    // Função para abrir modal de confirmação de exclusão
    const openDeleteModal = (columnId, cardId, cardTitle) => {
        setCardToDelete({ columnId, cardId, cardTitle });
        setIsDeleteModalOpen(true);
    };

    // Função para fechar modal de confirmação
    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setCardToDelete(null);
    };

    // Função para lidar com mudanças no formulário
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Função para salvar cartão (criar ou editar)
    const saveCard = (e) => {
        e.preventDefault();
        
        if (!formData.title.trim()) {
            alert('Por favor, adicione um título ao cartão.');
            return;
        }

        setBoards(prev => prev.map(board => {
            if (board.id === activeBoardId) {
                const updatedColumns = board.columns.map(column => {
                    if (column.id === selectedColumnId) {
                        if (editingCard) {
                            // Editando cartão existente
                            const updatedCard = {
                                ...editingCard,
                                title: formData.title,
                                description: formData.description,
                                priority: formData.priority
                            };
                            return {
                                ...column,
                                cards: column.cards.map(card => 
                                    card.id === editingCard.id ? updatedCard : card
                                )
                            };
                        } else {
                            // Criando novo cartão
                            const newCard = {
                                id: Date.now(),
                                title: formData.title,
                                description: formData.description,
                                priority: formData.priority
                            };
                            return {
                                ...column,
                                cards: [...column.cards, newCard]
                            };
                        }
                    }
                    return column;
                });
                return { ...board, columns: updatedColumns };
            }
            return board;
        }));

        closeCardModal();
    };

    // Função para confirmar e executar a exclusão
    const confirmDelete = () => {
        if (cardToDelete) {
            setBoards(prev => prev.map(board => {
                if (board.id === activeBoardId) {
                    const updatedColumns = board.columns.map(column => {
                        if (column.id === cardToDelete.columnId) {
                            return {
                                ...column,
                                cards: column.cards.filter(card => card.id !== cardToDelete.cardId)
                            };
                        }
                        return column;
                    });
                    return { ...board, columns: updatedColumns };
                }
                return board;
            }));
        }
        closeDeleteModal();
    };

    // Funções de Drag and Drop
    const handleDragStart = (e, card, columnId) => {
        setDraggedCard(card);
        setDraggedFromColumn(columnId);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', e.target.outerHTML);
    };

    const handleDragEnd = () => {
        setDraggedCard(null);
        setDraggedFromColumn(null);
        setDragOverColumn(null);
    };

    const handleDragOver = (e, columnId) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDragOverColumn(columnId);
    };

    const handleDragLeave = (e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
            setDragOverColumn(null);
        }
    };

    const handleDrop = (e, targetColumnId) => {
        e.preventDefault();
        
        if (draggedCard && draggedFromColumn !== null && draggedFromColumn !== targetColumnId) {
            setBoards(prev => prev.map(board => {
                if (board.id === activeBoardId) {
                    const updatedColumns = board.columns.map(column => {
                        if (column.id === draggedFromColumn) {
                            return {
                                ...column,
                                cards: column.cards.filter(card => card.id !== draggedCard.id)
                            };
                        } else if (column.id === targetColumnId) {
                            return {
                                ...column,
                                cards: [...column.cards, draggedCard]
                            };
                        }
                        return column;
                    });
                    return { ...board, columns: updatedColumns };
                }
                return board;
            }));
        }
        
        handleDragEnd();
    };

    const activeBoard = getActiveBoard();

    return (
        <div className="kanban-container">
            {/* Sidebar integrado */}
            <div className="kanban-sidebar">
                <div className="sidebar-header">
                    <span className="sidebar-logo">✔</span>
                    <span className="sidebar-title">ServiTask</span>
                </div>
                
                <div className="boards-section">
                    <p className="section-title">Meus quadros:</p>
                    {boards.length === 0 ? (
                        <p className="no-boards">Nenhum quadro criado</p>
                    ) : (
                        boards.map(board => (
                            <div key={board.id} className="board-item">
                                <button 
                                    className={`board-btn ${activeBoardId === board.id ? 'active' : ''}`}
                                    onClick={() => selectBoard(board.id)}
                                >
                                    {board.name}
                                </button>
                                <button 
                                    className="delete-board-btn"
                                    onClick={(e) => openDeleteBoardModal(e, board)}
                                    title="Excluir quadro"
                                >
                                    🗑️
                                </button>
                            </div>
                        ))
                    )}
                    <button 
                        className="add-board-btn"
                        onClick={() => setIsBoardModalOpen(true)}
                    >
                        + Adicionar Quadro
                    </button>
                </div>
            </div>

            {/* Área principal do kanban */}
            <div className="kanban-main">
                {!activeBoard ? (
                    <div className="empty-state">
                        <div className="empty-content">
                            <div className="empty-icon">📋</div>
                            <h2>Bem-vindo ao ServiTask!</h2>
                            <p>Crie seu primeiro quadro para começar a organizar suas tarefas.</p>
                            <button 
                                className="btn-primary large"
                                onClick={() => setIsBoardModalOpen(true)}
                            >
                                + Criar Primeiro Quadro
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="kanban-header">
                            <h1>{activeBoard.name}</h1>
                            <div className="kanban-actions">
                                <button className="btn-secondary">Filtros</button>
                            </div>
                        </div>
                        
                        <div className="kanban-board">
                            {activeBoard.columns.map(column => (
                                <div 
                                    key={column.id} 
                                    className={`kanban-column ${dragOverColumn === column.id ? 'drag-over' : ''}`}
                                    onDragOver={(e) => handleDragOver(e, column.id)}
                                    onDragLeave={handleDragLeave}
                                    onDrop={(e) => handleDrop(e, column.id)}
                                >
                                    <div className="column-header">
                                        <h3>{column.title}</h3>
                                        <span className="card-count">{column.cards.length}</span>
                                    </div>
                                    
                                    <div className="cards-container">
                                        {column.cards.map(card => (
                                            <div 
                                                key={card.id} 
                                                className={`kanban-card ${draggedCard?.id === card.id ? 'dragging' : ''}`}
                                                draggable={true}
                                                onDragStart={(e) => handleDragStart(e, card, column.id)}
                                                onDragEnd={handleDragEnd}
                                            >
                                                <div className="card-header">
                                                    <h4>{card.title}</h4>
                                                    <div 
                                                        className="priority-indicator"
                                                        style={{ backgroundColor: getPriorityColor(card.priority) }}
                                                    ></div>
                                                </div>
                                                <p className="card-description">{card.description}</p>
                                                <div className="card-footer">
                                                    <span className="priority-tag" style={{ color: getPriorityColor(card.priority) }}>
                                                        {card.priority.charAt(0).toUpperCase() + card.priority.slice(1)}
                                                    </span>
                                                    <div className="card-actions">
                                                        <button 
                                                            className="card-btn edit-btn"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                openEditModal(column.id, card);
                                                            }}
                                                            title="Editar cartão"
                                                        >
                                                            ✏️
                                                        </button>
                                                        <button 
                                                            className="card-btn delete-btn"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                openDeleteModal(column.id, card.id, card.title);
                                                            }}
                                                            title="Excluir cartão"
                                                        >
                                                            🗑️
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <button 
                                            className="add-card-btn"
                                            onClick={() => openCardModal(column.id)}
                                        >
                                            + Adicionar cartão
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Modal para criar quadro */}
            {isBoardModalOpen && (
                <div className="modal-overlay" onClick={() => setIsBoardModalOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Criar Novo Quadro</h2>
                            <button className="modal-close" onClick={() => setIsBoardModalOpen(false)}>×</button>
                        </div>
                        
                        <form onSubmit={createBoard} className="card-form">
                            <div className="form-group">
                                <label htmlFor="boardName">Nome do Quadro *</label>
                                <input
                                    type="text"
                                    id="boardName"
                                    value={boardName}
                                    onChange={(e) => setBoardName(e.target.value)}
                                    placeholder="Digite o nome do quadro"
                                    required
                                />
                            </div>

                            <div className="form-actions">
                                <button type="button" className="btn-cancel" onClick={() => setIsBoardModalOpen(false)}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-submit">
                                    Criar Quadro
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal de confirmação para exclusão de quadro */}
            {isDeleteBoardModalOpen && boardToDelete && (
                <div className="modal-overlay" onClick={closeDeleteBoardModal}>
                    <div className="delete-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="delete-modal-header">
                            <div className="delete-icon">🗑️</div>
                            <h2>Confirmar Exclusão do Quadro</h2>
                        </div>
                        
                        <div className="delete-modal-body">
                            <p>Tem certeza que deseja excluir o quadro:</p>
                            <div className="card-to-delete">
                                <strong>"{boardToDelete.name}"</strong>
                            </div>
                            <p className="warning-text">
                                Esta ação irá excluir permanentemente o quadro e todos os seus cartões. 
                                Esta ação não pode ser desfeita.
                            </p>
                        </div>

                        <div className="delete-modal-actions">
                            <button 
                                type="button" 
                                className="btn-cancel-delete" 
                                onClick={closeDeleteBoardModal}
                            >
                                Cancelar
                            </button>
                            <button 
                                type="button" 
                                className="btn-confirm-delete" 
                                onClick={confirmDeleteBoard}
                            >
                                Excluir Quadro
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal para adicionar/editar cartão */}
            {isCardModalOpen && (
                <div className="modal-overlay" onClick={closeCardModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingCard ? 'Editar Cartão' : 'Adicionar Novo Cartão'}</h2>
                            <button className="modal-close" onClick={closeCardModal}>×</button>
                        </div>
                        
                        <form onSubmit={saveCard} className="card-form">
                            <div className="form-group">
                                <label htmlFor="title">Título *</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="Digite o título do cartão"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="description">Descrição</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Digite a descrição do cartão"
                                    rows="4"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="priority">Prioridade</label>
                                <div className="priority-select-container">
                                    <select
                                        id="priority"
                                        name="priority"
                                        value={formData.priority}
                                        onChange={handleInputChange}
                                        className="priority-select"
                                    >
                                        <option value="baixa">Baixa</option>
                                        <option value="media">Média</option>
                                        <option value="alta">Alta</option>
                                    </select>
                                    <div className={`priority-preview ${formData.priority}`}>
                                        {formData.priority === 'alta' && 'A'}
                                        {formData.priority === 'media' && 'M'}
                                        {formData.priority === 'baixa' && 'B'}
                                    </div>
                                </div>
                            </div>

                            <div className="form-actions">
                                <button type="button" className="btn-cancel" onClick={closeCardModal}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-submit">
                                    {editingCard ? 'Salvar Alterações' : 'Adicionar Cartão'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal de confirmação para exclusão de cartão */}
            {isDeleteModalOpen && cardToDelete && (
                <div className="modal-overlay" onClick={closeDeleteModal}>
                    <div className="delete-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="delete-modal-header">
                            <div className="delete-icon">🗑️</div>
                            <h2>Confirmar Exclusão</h2>
                        </div>
                        
                        <div className="delete-modal-body">
                            <p>Tem certeza que deseja excluir o cartão:</p>
                            <div className="card-to-delete">
                                <strong>"{cardToDelete.cardTitle}"</strong>
                            </div>
                            <p className="warning-text">Esta ação não pode ser desfeita.</p>
                        </div>

                        <div className="delete-modal-actions">
                            <button 
                                type="button" 
                                className="btn-cancel-delete" 
                                onClick={closeDeleteModal}
                            >
                                Cancelar
                            </button>
                            <button 
                                type="button" 
                                className="btn-confirm-delete" 
                                onClick={confirmDelete}
                            >
                                Excluir Cartão
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Kanban; 