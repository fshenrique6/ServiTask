import React, { useState } from 'react';

export default function SignUpForm({ onSignUp, onToggleMode }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }
    
    if (!formData.name.trim()) {
      alert('Por favor, digite seu nome.');
      return;
    }
    
    if (!formData.email.trim() || !formData.password.trim()) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // Simular cadastro bem-sucedido
    onSignUp();
  };

  return (
    <>
      <div className="form-header">
        <h3>Criar Conta</h3>
        <p>Preencha seus dados para começar</p>
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
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
          />
        </div>

        <button type="submit" className="submit-btn">
          🚀 Criar Conta
        </button>

        <div className="form-divider">
          <span>ou</span>
        </div>

        <button type="button" className="google-btn">
          <span className="google-icon">G</span>
          Cadastrar com Google
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