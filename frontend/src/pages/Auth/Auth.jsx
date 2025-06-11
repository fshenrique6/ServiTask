import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import './Auth.css';

export default function Auth() {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const navigate = useNavigate();

  const handleToggleMode = () => {
    setIsSignUpMode(!isSignUpMode);
  };

  const handleLogin = () => {
    navigate('/kanban');
  };

  const handleSignUp = () => {
    // Por enquanto, após o cadastro, redireciona para login
    // Futuramente pode fazer login automático
    setIsSignUpMode(false);
    alert('Conta criada com sucesso! Faça login para continuar.');
  };

  const handleBackToLanding = () => {
    navigate('/');
  };

  return (
    <AuthLayout
      title={isSignUpMode ? "Crie sua conta" : "Bem-vindo de volta!"}
      subtitle={isSignUpMode 
        ? "Comece a organizar suas tarefas de forma inteligente" 
        : "Entre para continuar gerenciando suas tarefas"}
      isSignUp={isSignUpMode}
      onBackToLanding={handleBackToLanding}
    >
      {isSignUpMode ? (
        <SignUpForm
          onSignUp={handleSignUp}
          onToggleMode={handleToggleMode}
        />
      ) : (
        <LoginForm
          onLogin={handleLogin}
          onToggleMode={handleToggleMode}
        />
      )}
    </AuthLayout>
  );
} 