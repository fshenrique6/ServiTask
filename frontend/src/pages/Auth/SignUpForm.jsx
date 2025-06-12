import React, { useState } from 'react';
import apiService from '../../services/api';

export default function SignUpForm({ onSignUp, onToggleMode }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem!');
      return;
    }
    
    if (!formData.name.trim()) {
      setError('Por favor, digite seu nome.');
      return;
    }
    
    if (!formData.email.trim() || !formData.password.trim()) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await apiService.register(
        formData.name,
        formData.email,
        formData.password,
        formData.confirmPassword
      );
      console.log('Cadastro bem-sucedido:', response);
      onSignUp();
    } catch (error) {
      console.error('Erro no cadastro:', error);
      setError(error.message || 'Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="form-header">
        <h3>Criar Conta</h3>
        <p>Preencha seus dados para começar</p>
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
        {error && (
          <div style={{ 
            background: '#fee2e2', 
            color: '#dc2626', 
            padding: '0.75rem', 
            borderRadius: '8px', 
            marginBottom: '1rem',
            fontSize: '0.9rem',
            border: '1px solid #fecaca'
          }}>
            {error}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="name">Nome completo *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Digite seu nome completo"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">E-mail *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Digite seu e-mail"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Senha *</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Digite sua senha"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmar senha *</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Confirme sua senha"
            required
            disabled={loading}
          />
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? '🔄 Criando conta...' : '🚀 Criar Conta'}
        </button>

        <div className="toggle-mode">
          <p>
            Já tem uma conta?
            <button type="button" onClick={onToggleMode} className="toggle-btn">
              Fazer login
            </button>
          </p>
        </div>
      </form>
    </>
  );
} 