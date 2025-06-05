import React, { useState } from 'react';
import './Kanban.css';
import BoardSidebar from '../BoardSidebar/BoardSidebar';
import KanbanHeader from '../KanbanHeader/KanbanHeader';
import KanbanColumn from '../KanbanColumn/KanbanColumn';
import DeleteModal from '../DeleteModal/DeleteModal';
import EditColumnModal from '../EditColumnModal/EditColumnModal';
import EditBoardModal from '../EditBoardModal/EditBoardModal';
import CardModal from '../CardModal/CardModal';

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

    // Estado para controlar o modal de edição de coluna
    const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
    const [editingColumn, setEditingColumn] = useState(null);
    const [columnName, setColumnName] = useState('');
    const [isDeleteColumnModalOpen, setIsDeleteColumnModalOpen] = useState(false);
    const [columnToDelete, setColumnToDelete] = useState(null);

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

    // Função para adicionar nova coluna
    const addColumn = () => {
        if (!activeBoard) return;

        setBoards(prev => prev.map(board => {
            if (board.id === activeBoardId) {
                const newColumnId = Math.max(...board.columns.map(col => col.id), 0) + 1;
                return {
                    ...board,
                    columns: [...board.columns, {
                        id: newColumnId,
                        title: 'Nova Coluna',
                        cards: []
                    }]
                };
            }
            return board;
        }));
    };

    // Função para abrir modal de edição de coluna
    const openEditColumnModal = (column) => {
        setEditingColumn(column);
        setColumnName(column.title);
        setIsColumnModalOpen(true);
    };

    // Função para fechar modal de edição de coluna
    const closeColumnModal = () => {
        setIsColumnModalOpen(false);
        setEditingColumn(null);
        setColumnName('');
    };

    // Função para salvar alterações na coluna
    const saveColumn = (e) => {
        e.preventDefault();
        
        if (!columnName.trim()) {
            alert('Por favor, digite um nome para a coluna.');
            return;
        }

        setBoards(prev => prev.map(board => {
            if (board.id === activeBoardId) {
                const updatedColumns = board.columns.map(column => {
                    if (column.id === editingColumn.id) {
                        return { ...column, title: columnName };
                    }
                    return column;
                });
                return { ...board, columns: updatedColumns };
            }
            return board;
        }));

        closeColumnModal();
    };

    // Função para remover coluna
    const removeColumn = (columnId) => {
        setColumnToDelete(columnId);
        setIsDeleteColumnModalOpen(true);
    };

    const confirmDeleteColumn = () => {
        if (columnToDelete) {
            const updatedBoards = boards.map(board => {
                if (board.id === activeBoardId) {
                    return {
                        ...board,
                        columns: board.columns.filter(col => col.id !== columnToDelete)
                    };
                }
                return board;
            });
            setBoards(updatedBoards);
            setIsDeleteColumnModalOpen(false);
            setColumnToDelete(null);
        }
    };

    const activeBoard = getActiveBoard();

    return (
        <div className="kanban-container">
            {/* Sidebar integrado */}
            <BoardSidebar
                boards={boards}
                activeBoardId={activeBoardId}
                selectBoard={selectBoard}
                openDeleteBoardModal={openDeleteBoardModal}
                setIsBoardModalOpen={setIsBoardModalOpen}
            />

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
                        <KanbanHeader boardName={activeBoard.name} onAddColumn={addColumn} />
                        
                        <div className="kanban-board">
                            {activeBoard.columns.map(column => (
                                <KanbanColumn
                                    key={column.id}
                                    column={column}
                                    onEditColumn={openEditColumnModal}
                                    onRemoveColumn={removeColumn}
                                    onAddCard={openCardModal}
                                    onEditCard={openEditModal}
                                    onDeleteCard={openDeleteModal}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    dragOverColumn={dragOverColumn}
                                    getPriorityColor={getPriorityColor}
                                    handleDragStart={handleDragStart}
                                    handleDragEnd={handleDragEnd}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Modais */}
            <EditBoardModal
                isOpen={isBoardModalOpen}
                boardName={boardName}
                setBoardName={setBoardName}
                onClose={() => setIsBoardModalOpen(false)}
                onSave={createBoard}
            />
            <EditColumnModal
                isOpen={isColumnModalOpen}
                columnName={columnName}
                setColumnName={setColumnName}
                onClose={closeColumnModal}
                onSave={saveColumn}
            />
            <CardModal
                isOpen={isCardModalOpen}
                formData={formData}
                setFormData={setFormData}
                onClose={closeCardModal}
                onSave={saveCard}
                editingCard={editingCard}
            />
            <DeleteModal
                isOpen={isDeleteBoardModalOpen && !!boardToDelete}
                onClose={closeDeleteBoardModal}
                onConfirm={confirmDeleteBoard}
                title="Confirmar Exclusão do Quadro"
                itemName={boardToDelete?.name}
                warning="Esta ação irá excluir permanentemente o quadro e todos os seus cartões. Esta ação não pode ser desfeita."
                confirmLabel="Excluir Quadro"
                icon="🗑️"
            />
            <DeleteModal
                isOpen={isDeleteColumnModalOpen && columnToDelete !== null}
                onClose={() => { setIsDeleteColumnModalOpen(false); setColumnToDelete(null); }}
                onConfirm={confirmDeleteColumn}
                title="Confirmar Exclusão da Coluna"
                itemName={activeBoard?.columns.find(col => col.id === columnToDelete)?.title || ''}
                warning="Esta ação irá excluir permanentemente a coluna e todos os seus cartões. Esta ação não pode ser desfeita."
                confirmLabel="Excluir Coluna"
                icon="🗑️"
            />
            <DeleteModal
                isOpen={isDeleteModalOpen && !!cardToDelete}
                onClose={closeDeleteModal}
                onConfirm={confirmDelete}
                title="Confirmar Exclusão"
                itemName={cardToDelete?.cardTitle}
                warning="Esta ação não pode ser desfeita."
                confirmLabel="Excluir Cartão"
                icon="🗑️"
            />
        </div>
    );
}

export default Kanban; 