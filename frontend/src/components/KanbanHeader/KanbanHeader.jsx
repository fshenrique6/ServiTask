import React from 'react';
import AddColumnButton from '../AddColumnButton/AddColumnButton';

export default function KanbanHeader({ 
    boardName, 
    onAddColumn, 
    onEditBoardName,
    isEditingBoardName,
    editBoardName,
    setEditBoardName,
    onSaveBoardName,
    onCancelEditBoardName
}) {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSaveBoardName();
    } else if (e.key === 'Escape') {
      onCancelEditBoardName();
    }
  };

  return (
    <div className="kanban-header">
      <div className="board-title-container">
        {isEditingBoardName ? (
          <div className="board-title-edit">
            <input
              type="text"
              value={editBoardName}
              onChange={(e) => setEditBoardName(e.target.value)}
              onKeyDown={handleKeyPress}
              className="board-title-input"
              autoFocus
            />
            <div className="edit-actions">
              <button 
                className="btn-save-title" 
                onClick={onSaveBoardName}
                title="Salvar"
              >
                ✓
              </button>
              <button 
                className="btn-cancel-title" 
                onClick={onCancelEditBoardName}
                title="Cancelar"
              >
                ✕
              </button>
            </div>
          </div>
        ) : (
          <div className="board-title-display">
            <h1>{boardName}</h1>
            <button 
              className="btn-edit-title" 
              onClick={onEditBoardName}
              title="Editar nome do quadro"
            >
              ✏️
            </button>
          </div>
        )}
      </div>
      <AddColumnButton onClick={onAddColumn} />
    </div>
  );
} 