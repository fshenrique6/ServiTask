import React, { useState } from 'react';
import './Kanban.css';

function Kanban() {
    // Estado para as colunas (iniciam vazias)
    const [columns, setColumns] = useState([
        { id: 1, title: 'A Fazer', cards: [] },
        { id: 2, title: 'Em Progresso', cards: [] },
        { id: 3, title: 'Revisão', cards: [] },
        { id: 4, title: 'Concluído', cards: [] }
    ]);

    // Estado para controlar o modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedColumnId, setSelectedColumnId] = useState(null);
    const [editingCard, setEditingCard] = useState(null); // Para controlar se estamos editando

    // Estado para controlar o modal de confirmação de exclusão
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [cardToDelete, setCardToDelete] = useState(null);

    // Estado para o formulário
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'media'
    });

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'alta': return '#ef4444';
            case 'media': return '#f59e0b';
            case 'baixa': return '#10b981';
            default: return '#6b7280';
        }
    };

    // Função para abrir o modal para adicionar novo cartão
    const openModal = (columnId) => {
        setSelectedColumnId(columnId);
        setEditingCard(null);
        setFormData({ title: '', description: '', priority: 'media' });
        setIsModalOpen(true);
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
        setIsModalOpen(true);
    };

    // Função para fechar o modal
    const closeModal = () => {
        setIsModalOpen(false);
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

        if (editingCard) {
            // editar cartão existente
            const updatedCard = {
                ...editingCard,
                title: formData.title,
                description: formData.description,
                priority: formData.priority
            };

            setColumns(prev => prev.map(column => 
                column.id === selectedColumnId
                    ? { 
                        ...column, 
                        cards: column.cards.map(card => 
                            card.id === editingCard.id ? updatedCard : card
                        ) 
                    }
                    : column
            ));
        } else {
            // Criando novoo cartão
            const newCard = {
                id: Date.now(), // ID simples baseado no timestamp
                title: formData.title,
                description: formData.description,
                priority: formData.priority
            };

            setColumns(prev => prev.map(column => 
                column.id === selectedColumnId
                    ? { ...column, cards: [...column.cards, newCard] }
                    : column
            ));
        }

        closeModal();
    };

    // Funçao para confirmar e executar a exclusão
    const confirmDelete = () => {
        if (cardToDelete) {
            setColumns(prev => prev.map(column => 
                column.id === cardToDelete.columnId
                    ? { ...column, cards: column.cards.filter(card => card.id !== cardToDelete.cardId) }
                    : column
            ));
        }
        closeDeleteModal();
    };

    return (
        <div className="kanban-container">
            <div className="kanban-header">
                <h1>Quadro Principal</h1>
                <div className="kanban-actions">
                    <button className="btn-primary">+ Adicionar Lista</button>
                    <button className="btn-secondary">Filtros</button>
                </div>
            </div>
            
            <div className="kanban-board">
                {columns.map(column => (
                    <div key={column.id} className="kanban-column">
                        <div className="column-header">
                            <h3>{column.title}</h3>
                            <span className="card-count">{column.cards.length}</span>
                        </div>
                        
                        <div className="cards-container">
                            {column.cards.map(card => (
                                <div key={card.id} className="kanban-card">
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
                                                onClick={() => openEditModal(column.id, card)}
                                                title="Editar cartão"
                                            >
                                                ✏️
                                            </button>
                                            <button 
                                                className="card-btn delete-btn"
                                                onClick={() => openDeleteModal(column.id, card.id, card.title)}
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
                                onClick={() => openModal(column.id)}
                            >
                                + Adicionar cartão
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal para adicionar/editar cartão */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingCard ? 'Editar Cartão' : 'Adicionar Novo Cartão'}</h2>
                            <button className="modal-close" onClick={closeModal}>×</button>
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
                                <button type="button" className="btn-cancel" onClick={closeModal}>
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

            {/* Modal de confirmação para exclusão */}
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