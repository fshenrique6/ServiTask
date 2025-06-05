import { useState } from 'react'
import Kanban from './components/Kanban/Kanban'
import LandingPage from './pages/LandingPage/LandingPage'
import Auth from './pages/Auth/Auth'
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

  const handleGoToKanban = () => {
    setCurrentPage('kanban')
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return (
          <Auth 
            onLogin={handleLogin} 
            onBackToLanding={handleBackToLanding}
          />
        )
      case 'kanban':
        return <Kanban />
      default:
        return (
          <LandingPage 
            onGetStarted={handleGetStarted} 
            onGoToKanban={handleGoToKanban}
          />
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
