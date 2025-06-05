import React, { useState } from 'react';
import AuthLayout from './AuthLayout';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import './Auth.css';

export default function Auth({ onLogin, onBackToLanding }) {
  const [isSignUpMode, setIsSignUpMode] = useState(false);

  const handleToggleMode = () => {
    setIsSignUpMode(!isSignUpMode);
  };

  const handleLogin = () => {
    onLogin();
  };

  const handleSignUp = () => {
    // Por enquanto, após o cadastro, redireciona para login
    // Futuramente pode fazer login automático
    setIsSignUpMode(false);
    alert('Conta criada com sucesso! Faça login para continuar.');
  };



  return (
    <AuthLayout
      title={isSignUpMode ? "Crie sua conta" : "Bem-vindo de volta!"}
      subtitle={isSignUpMode 
        ? "Comece a organizar suas tarefas de forma inteligente" 
        : "Entre para continuar gerenciando suas tarefas"}
      isSignUp={isSignUpMode}
      onBackToLanding={onBackToLanding}
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