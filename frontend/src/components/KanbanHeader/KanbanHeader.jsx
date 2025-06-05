import React from 'react';

export default function KanbanHeader({ boardName, onAddColumn }) {
  return (
    <div className="kanban-header">
      <h1>{boardName}</h1>
      <AddColumnButton onClick={onAddColumn} />
    </div>
  );
}

import AddColumnButton from '../AddColumnButton/AddColumnButton'; 