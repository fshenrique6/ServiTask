import React, { useState } from 'react';
import Icon from '../../utils/iconMapping.jsx';
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
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasNumber: false,
    hasUppercase: false,
    hasLowercase: false,
    hasSpecialChar: false
  });

  const validatePassword = (password) => {
    const validation = {
      minLength: password.length >= 8,
      hasNumber: /\d/.test(password),
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    };
    
    setPasswordValidation(validation);
    return Object.values(validation).every(Boolean);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateName = (name) => {
    return name && name.trim().length >= 2 && name.trim().length <= 100;
  };

  const getPasswordValidationMessage = () => {
    const requirements = [];
    if (!passwordValidation.minLength) requirements.push('mínimo 8 caracteres');
    if (!passwordValidation.hasNumber) requirements.push('1 número');
    if (!passwordValidation.hasUppercase) requirements.push('1 letra maiúscula');
    if (!passwordValidation.hasLowercase) requirements.push('1 letra minúscula');
    if (!passwordValidation.hasSpecialChar) requirements.push('1 caractere especial (!@#$%^&*...)');
    
    if (requirements.length > 0) {
      return `A senha deve conter: ${requirements.join(', ')}.`;
    }
    return '';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === 'password') {
      validatePassword(value);
    }
    
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validação de nome
    if (!validateName(formData.name)) {
      setError('Nome deve ter entre 2 e 100 caracteres.');
      return;
    }
    
    // Validação de email
    if (!formData.email.trim()) {
      setError('Por favor, digite seu email.');
      return;
    }
    
    if (!validateEmail(formData.email)) {
      setError('Por favor, digite um email válido.');
      return;
    }
    
    // Validação de senha
    if (!formData.password.trim()) {
      setError('Por favor, digite sua senha.');
      return;
    }

    if (!validatePassword(formData.password)) {
      setError(getPasswordValidationMessage());
      return;
    }
    
    // Validação de confirmação de senha
    if (!formData.confirmPassword.trim()) {
      setError('Por favor, confirme sua senha.');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem!');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await apiService.register(
        formData.name.trim(),
        formData.email.trim().toLowerCase(),
        formData.password,
        formData.confirmPassword
      );
      console.log('Cadastro bem-sucedido:', response);
      onSignUp();
    } catch (error) {
      console.error('Erro no cadastro:', error);
      
      // Tratamento específico de erros
      if (error.message.includes('email já está em uso')) {
        setError('Este email já está cadastrado. Tente fazer login ou use outro email.');
      } else if (error.message.includes('senha')) {
        setError('Erro na senha: ' + error.message);
      } else {
        setError(error.message || 'Erro ao criar conta. Verifique os dados e tente novamente.');
      }
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
          {formData.password && (
            <div style={{ 
              marginTop: '0.5rem', 
              fontSize: '0.8rem',
              padding: '0.5rem',
              backgroundColor: '#f8fafc',
              borderRadius: '6px',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ marginBottom: '0.25rem', fontWeight: '600', color: '#374151' }}>
                Requisitos da senha:
              </div>
              <div style={{ 
                color: passwordValidation.minLength ? '#10b981' : '#ef4444',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                <span>{passwordValidation.minLength ? '✓' : '✗'}</span>
                Mínimo 8 caracteres
              </div>
              <div style={{ 
                color: passwordValidation.hasNumber ? '#10b981' : '#ef4444',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                <span>{passwordValidation.hasNumber ? '✓' : '✗'}</span>
                Pelo menos 1 número
              </div>
              <div style={{ 
                color: passwordValidation.hasUppercase ? '#10b981' : '#ef4444',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                <span>{passwordValidation.hasUppercase ? '✓' : '✗'}</span>
                Pelo menos 1 letra maiúscula
              </div>
                             <div style={{ 
                 color: passwordValidation.hasLowercase ? '#10b981' : '#ef4444',
                 display: 'flex',
                 alignItems: 'center',
                 gap: '0.25rem'
               }}>
                 <span>{passwordValidation.hasLowercase ? '✓' : '✗'}</span>
                 Pelo menos 1 letra minúscula
               </div>
               <div style={{ 
                 color: passwordValidation.hasSpecialChar ? '#10b981' : '#ef4444',
                 display: 'flex',
                 alignItems: 'center',
                 gap: '0.25rem'
               }}>
                 <span>{passwordValidation.hasSpecialChar ? '✓' : '✗'}</span>
                 Pelo menos 1 caractere especial (!@#$%^&*...)
               </div>
             </div>
           )}
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
          {loading ? <><Icon emoji="🔄" /> Criando conta...</> : <><Icon emoji="🚀" /> Criar Conta</>}
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