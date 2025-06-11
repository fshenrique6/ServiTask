import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

export default function LandingPage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/auth');
  };

  const handleGoToKanban = () => {
    navigate('/kanban');
  };

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="landing-header">
        <div className="container constrained">
          <div className="logo">
            <span className="logo-icon">📋</span>
            <span className="logo-text">ServiTask</span>
          </div>
          <nav className="nav">
            <a href="#features">Recursos</a>
            <a href="#about">Sobre</a>
            <button className="btn-header" onClick={handleGetStarted}>
              Começar Agora
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1>Organize suas tarefas com <span className="highlight">ServiTask</span></h1>
              <p className="hero-description">
                A ferramenta de gerenciamento de projetos que simplifica sua vida. 
                Organize, priorize e acompanhe suas tarefas de forma visual e intuitiva.
              </p>
              <div className="hero-buttons">
                <button className="btn-primary-hero" onClick={handleGetStarted}>
                  🚀 Começar Gratuitamente
                </button>
              </div>
              <div className="hero-features">
                <div className="feature-item">
                  <span className="feature-icon">⚡</span>
                  <span>Rápido e Intuitivo</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🎯</span>
                  <span>Foco na Produtividade</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">📱</span>
                  <span>Responsivo</span>
                </div>
              </div>
            </div>
            <div className="hero-visual">
              <div className="mockup-kanban">
                <div className="mockup-header">
                  <div className="mockup-title">Projeto Exemplo</div>
                  <div className="mockup-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
                <div className="mockup-columns">
                  <div className="mockup-column">
                    <div className="column-title">A Fazer</div>
                    <div className="mockup-card alta">
                      <div className="card-title">Design da Interface</div>
                      <div className="priority-badge alta">Alta</div>
                    </div>
                    <div className="mockup-card media">
                      <div className="card-title">Documentação</div>
                      <div className="priority-badge media">Média</div>
                    </div>
                  </div>
                  <div className="mockup-column">
                    <div className="column-title">Em Progresso</div>
                    <div className="mockup-card baixa">
                      <div className="card-title">Desenvolvimento</div>
                      <div className="priority-badge baixa">Baixa</div>
                    </div>
                  </div>
                  <div className="mockup-column">
                    <div className="column-title">Concluído</div>
                    <div className="mockup-card done alta">
                      <div className="card-title">Planejamento</div>
                      <div className="priority-badge alta">Alta</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="container constrained">
          <div className="section-header">
            <h2>Recursos Poderosos</h2>
            <p>Tudo que você precisa para gerenciar seus projetos de forma eficiente</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-large">🎨</div>
              <h3>Interface Intuitiva</h3>
              <p>Design limpo e moderno que facilita o uso diário. Visualize suas tarefas de forma clara e organizada.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-large">🔥</div>
              <h3>Priorização Inteligente</h3>
              <p>Sistema de prioridades com cores para identificar rapidamente as tarefas mais importantes.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-large">📊</div>
              <h3>Quadros Kanban</h3>
              <p>Metodologia visual para acompanhar o progresso das tarefas em tempo real.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-large">⚡</div>
              <h3>Drag & Drop</h3>
              <p>Mova cartões entre colunas de forma simples e rápida, apenas arrastando e soltando.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-large">🎯</div>
              <h3>Múltiplos Projetos</h3>
              <p>Gerencie vários projetos simultaneamente com quadros independentes para cada um.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-large">📱</div>
              <h3>Totalmente Responsivo</h3>
              <p>Acesse de qualquer dispositivo - desktop, tablet ou smartphone com a mesma experiência.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="container constrained">
          <div className="about-content">
            <div className="about-text">
              <h2>Por que escolher o ServiTask?</h2>
              <p>
                O ServiTask foi desenvolvido pensando na simplicidade e eficiência. 
                Sabemos que gerenciar projetos pode ser complexo, por isso criamos 
                uma ferramenta que torna esse processo mais visual e intuitivo.
              </p>
              <div className="about-stats">
                <div className="stat">
                  <div className="stat-number">🚀</div>
                  <div className="stat-label">Produtividade Aumentada</div>
                </div>
                <div className="stat">
                  <div className="stat-number">⏱️</div>
                  <div className="stat-label">Economia de Tempo</div>
                </div>
                <div className="stat">
                  <div className="stat-number">✨</div>
                  <div className="stat-label">Interface Moderna</div>
                </div>
              </div>
            </div>
            <div className="about-image">
              <div className="productivity-visual">
                <div className="productivity-circle">
                  <div className="productivity-text">
                    <span className="productivity-number">100%</span>
                    <span className="productivity-label">Organizado</span>
                  </div>
                </div>
                <div className="productivity-items">
                  <div className="productivity-item">📝 Tarefas Claras</div>
                  <div className="productivity-item">🎯 Objetivos Definidos</div>
                  <div className="productivity-item">📈 Progresso Visível</div>
                  <div className="productivity-item">✅ Resultados Alcançados</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container constrained">
          <div className="cta-content">
            <h2>Pronto para aumentar sua produtividade?</h2>
            <p>Comece a usar o ServiTask agora mesmo e transforme a forma como você gerencia seus projetos.</p>
            <button className="btn-cta" onClick={handleGetStarted}>
              🚀 Começar Agora - É Grátis!
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container constrained">
          <div className="footer-content">
            <div className="footer-logo">
              <span className="logo-icon">📋</span>
              <span className="logo-text">ServiTask</span>
            </div>
            <p className="footer-text">
              Simplificando o gerenciamento de projetos, uma tarefa por vez.
            </p>
            {/* Botão temporário para acessar Kanban */}
            <button className="temp-kanban-btn" onClick={handleGoToKanban}>
              🚀 Acesso Temporário ao Kanban
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
} 