import { Routes, Route, Navigate } from 'react-router-dom'
import Kanban from './components/Kanban/Kanban'
import LandingPage from './pages/LandingPage/LandingPage'
import Auth from './pages/Auth/Auth'
import './App.css'

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/kanban" element={<Kanban />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App
