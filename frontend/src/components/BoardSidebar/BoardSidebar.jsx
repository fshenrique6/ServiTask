import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../utils/iconMapping.jsx';
import BoardListItem from '../BoardListItem/BoardListItem';
import AddBoardButton from '../AddBoardButton/AddBoardButton';

export default function BoardSidebar({ boards, activeBoardId, selectBoard, openDeleteBoardModal, setIsBoardModalOpen }) {
  const navigate = useNavigate();

  const handleBackToDashboard = () => {
    navigate('/kanban');
  };

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
      
      {/* Botão para voltar ao dashboard */}
      <button className="back-dashboard-btn" onClick={handleBackToDashboard}>
        <span><Icon emoji="📊" /></span> Dashboard
      </button>
    </div>
  );
} 