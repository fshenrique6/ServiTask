import React from 'react';

function getPriorityIcon(priority) {
  let color = '#10b981', letter = 'B';
  if (priority === 'media') { color = '#f59e0b'; letter = 'M'; }
  if (priority === 'alta') { color = '#ef4444'; letter = 'A'; }
  return (
    <span className="priority-circle" style={{ background: color }}>
      {letter}
    </span>
  );
}

export default function CardModal({ isOpen, formData, setFormData, onClose, onSave, editingCard }) {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-card-form spaced">
        <div className="modal-header-row">
          <h2>Adicionar Novo Cartão</h2>
          <button className="modal-close-btn" onClick={onClose}>&times;</button>
        </div>
        <form className="styled-form" onSubmit={e => { e.preventDefault(); onSave(e); }}>
          <div className="form-group">
            <label htmlFor="title">Título *</label>
            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Digite o título do cartão"
              className="styled-input"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Descrição</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Digite a descrição do cartão"
              className="styled-input"
            />
          </div>
          <div className="form-group priority-group">
            <label htmlFor="priority">Prioridade</label>
            <div className="priority-select-wrapper">
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={e => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                className="styled-input"
              >
                <option value="alta">Alta</option>
                <option value="media">Média</option>
                <option value="baixa">Baixa</option>
              </select>
              {getPriorityIcon(formData.priority)}
            </div>
          </div>
          <div className="modal-actions-row spaced">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-blue">Adicionar Cartão</button>
          </div>
        </form>
      </div>
    </div>
  );
} 