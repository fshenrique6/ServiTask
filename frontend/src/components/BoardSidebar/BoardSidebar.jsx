import React from 'react';
import BoardListItem from '../BoardListItem/BoardListItem';
import AddBoardButton from '../AddBoardButton/AddBoardButton';

export default function BoardSidebar({ boards, activeBoardId, selectBoard, openDeleteBoardModal, setIsBoardModalOpen, onLogout }) {
  return (
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
            <BoardListItem
              key={board.id}
              board={board}
              active={activeBoardId === board.id}
              selectBoard={selectBoard}
              openDeleteBoardModal={openDeleteBoardModal}
            />
          ))
        )}
        <AddBoardButton onClick={() => setIsBoardModalOpen(true)} />
      </div>
      <button className="logout-btn" onClick={onLogout}>
        <span>🚪</span> Sair
      </button>
    </div>
  );
} 