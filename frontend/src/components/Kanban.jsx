import React from 'react';
import './Kanban.css';

function Kanban() {
    // Dados de exemplo para as colunas e cards
    const columns = [
        {
            id: 1,
            title: 'A Fazer',
            cards: [
                { id: 1, title: 'Implementar autenticação', description: 'Criar sistema de login e registro', priority: 'alta' },
                { id: 2, title: 'Configurar banco de dados', description: 'Configurar conexão com PostgreSQL', priority: 'media' },
                { id: 3, title: 'Criar documentação', description: 'Documentar API endpoints', priority: 'baixa' }
            ]
        },
        {
            id: 2,
            title: 'Em Progresso',
            cards: [
                { id: 4, title: 'Desenvolver dashboard', description: 'Criar interface principal do usuário', priority: 'alta' },
                { id: 5, title: 'Implementar notificações', description: 'Sistema de notificações em tempo real', priority: 'media' }
            ]
        },
        {
            id: 3,
            title: 'Revisão',
            cards: [
                { id: 6, title: 'Testar componentes', description: 'Testes unitários dos componentes React', priority: 'alta' }
            ]
        },
        {
            id: 4,
            title: 'Concluído',
            cards: [
                { id: 7, title: 'Setup do projeto', description: 'Configuração inicial do ambiente', priority: 'alta' },
                { id: 8, title: 'Design system', description: 'Criação do sistema de design', priority: 'media' }
            ]
        }
    ];

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'alta': return '#ef4444';
            case 'media': return '#f59e0b';
            case 'baixa': return '#10b981';
            default: return '#6b7280';
        }
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
                                            <button className="card-btn">✏️</button>
                                            <button className="card-btn">🗑️</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button className="add-card-btn">+ Adicionar cartão</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Kanban; 