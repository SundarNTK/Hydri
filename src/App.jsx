import { useEffect } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import DashboardPage from './pages/DashboardPage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import CharacterLabPage from './pages/CharacterLabPage.jsx'
import CompanionOverlayPage from './pages/CompanionOverlayPage.jsx'
import { api } from './ipc/api.js'

export default function App() {
  const navigate = useNavigate()

  useEffect(() => {
    return api.navigation.onNavigate((path) => navigate(path))
  }, [navigate])

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/character-lab" element={<CharacterLabPage />} />
      <Route path="/companion" element={<CompanionOverlayPage />} />
    </Routes>
  )
}
