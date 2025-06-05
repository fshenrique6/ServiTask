import { useState } from 'react'
import Kanban from './components/Kanban/Kanban'
import LandingPage from './pages/LandingPage/LandingPage'
import Login from './pages/Login/Login'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('landing') // 'landing', 'login', 'kanban'

  const handleGetStarted = () => {
    setCurrentPage('login')
  }

  const handleLogin = () => {
    setCurrentPage('kanban')
  }

  const handleBackToLanding = () => {
    setCurrentPage('landing')
  }

  const handleBackToLogin = () => {
    setCurrentPage('login')
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return (
          <Login 
            onLogin={handleLogin} 
            onBackToLanding={handleBackToLanding}
          />
        )
      case 'kanban':
        return (
          <div>
            <button 
              className="back-to-landing-btn" 
              onClick={handleBackToLanding}
              title="Voltar para página inicial"
            >
              ← Voltar
            </button>
            <Kanban />
          </div>
        )
      default:
        return (
          <LandingPage onGetStarted={handleGetStarted} />
        )
    }
  }

  return (
    <div className="app-container">
      {renderPage()}
    </div>
  )
}

export default App
