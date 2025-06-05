import React from 'react';

export default function EditColumnModal({ isOpen, columnName, setColumnName, onClose, onSave }) {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Editar Coluna</h2>
        <input
          type="text"
          value={columnName}
          onChange={e => setColumnName(e.target.value)}
          placeholder="Nome da coluna"
          className="modal-input"
        />
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>Cancelar</button>
          <button className="btn-primary" onClick={onSave}>Salvar</button>
        </div>
      </div>
    </div>
  );
} 