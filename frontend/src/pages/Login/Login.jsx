import React, { useState } from 'react';
import './Login.css';

export default function Login({ onLogin, onBackToLanding }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
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
    
    if (isSignUp) {
      if (formData.password !== formData.confirmPassword) {
        alert('As senhas não coincidem!');
        return;
      }
      if (!formData.name.trim()) {
        alert('Por favor, digite seu nome.');
        return;
      }
    }
    
    if (!formData.email.trim() || !formData.password.trim()) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // Simular login/cadastro bem-sucedido
    onLogin();
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      name: ''
    });
  };

  return (
    <div className="login-page">
      {/* Background decorativo */}
      <div className="login-background">
        <div className="background-shape shape-1"></div>
        <div className="background-shape shape-2"></div>
        <div className="background-shape shape-3"></div>
      </div>

      {/* Header com logo */}
      <header className="login-header">
        <div className="login-logo" onClick={onBackToLanding}>
          <span className="logo-icon">📋</span>
          <span className="logo-text">ServiTask</span>
        </div>
        <button className="back-btn" onClick={onBackToLanding}>
          ← Voltar
        </button>
      </header>

      {/* Container principal */}
      <div className="login-container">
        <div className="login-card">
          {/* Lado esquerdo - Informações */}
          <div className="login-info">
            <div className="info-content">
              <h2>
                {isSignUp ? 'Junte-se ao ServiTask' : 'Bem-vindo de volta!'}
              </h2>
              <p>
                {isSignUp 
                  ? 'Crie sua conta e comece a organizar seus projetos de forma mais eficiente.' 
                  : 'Entre na sua conta e continue organizando suas tarefas de onde parou.'
                }
              </p>
              
              <div className="features-list">
                <div className="feature-item">
                  <span className="feature-icon">⚡</span>
                  <span>Organize tarefas rapidamente</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🎯</span>
                  <span>Acompanhe o progresso visualmente</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">📊</span>
                  <span>Gerencie múltiplos projetos</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🔄</span>
                  <span>Sincronize em todos os dispositivos</span>
                </div>
              </div>

              {!isSignUp && (
                <div className="demo-access">
                  <p>Ou experimente sem cadastro:</p>
                  <button className="demo-btn" onClick={onLogin}>
                    🚀 Acessar Demo
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Lado direito - Formulário */}
          <div className="login-form-section">
            <div className="form-header">
              <h3>{isSignUp ? 'Criar Conta' : 'Entrar'}</h3>
              <p>{isSignUp ? 'Preencha seus dados para começar' : 'Entre com suas credenciais'}</p>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
              {isSignUp && (
                <div className="form-group">
                  <label htmlFor="name">Nome completo *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Digite seu nome completo"
                    required={isSignUp}
                  />
                </div>
              )}

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

              {isSignUp && (
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirmar senha *</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirme sua senha"
                    required={isSignUp}
                  />
                </div>
              )}

              <button type="submit" className="submit-btn">
                {isSignUp ? '🚀 Criar Conta' : '🔑 Entrar'}
              </button>

              <div className="form-divider">
                <span>ou</span>
              </div>

              <button type="button" className="google-btn">
                <span className="google-icon">G</span>
                {isSignUp ? 'Cadastrar com Google' : 'Entrar com Google'}
              </button>

              {!isSignUp && (
                <div className="forgot-password">
                  <a href="#forgot">Esqueceu sua senha?</a>
                </div>
              )}

              <div className="toggle-mode">
                <p>
                  {isSignUp ? 'Já tem uma conta?' : 'Não tem uma conta?'}
                  <button type="button" onClick={toggleMode} className="toggle-btn">
                    {isSignUp ? 'Fazer login' : 'Criar conta'}
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="login-footer">
        <p>&copy; 2024 ServiTask. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
} 