import React, { useState } from 'react';

export default function LoginForm({ onLogin, onToggleMode }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
    
    if (!formData.email.trim() || !formData.password.trim()) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // Simular login bem-sucedido
    onLogin();
  };

  return (
    <>
      <div className="form-header">
        <h3>Entrar</h3>
        <p>Entre com suas credenciais</p>
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
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

        <button type="submit" className="submit-btn">
          🔑 Entrar
        </button>

        <div className="form-divider">
          <span>ou</span>
        </div>

        <button type="button" className="google-btn">
          <span className="google-icon">G</span>
          Entrar com Google
        </button>

        <div className="forgot-password">
          <a href="#forgot">Esqueceu sua senha?</a>
        </div>

        <div className="toggle-mode">
          <p>
            Não tem uma conta?
            <button type="button" onClick={onToggleMode} className="toggle-btn">
              Criar conta
            </button>
          </p>
        </div>
      </form>
    </>
  );
} 