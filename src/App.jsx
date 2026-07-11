import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import DashboardPage from './pages/DashboardPage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import CharacterLabPage from './pages/CharacterLabPage.jsx'
import CompanionOverlayPage from './pages/CompanionOverlayPage.jsx'
import OnboardingModal from './components/common/OnboardingModal.jsx'
import { useSettings } from './hooks/useSettings.js'
import { api } from './ipc/api.js'

export default function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const { settings, updateSettings } = useSettings()

  useEffect(() => {
    return api.navigation.onNavigate((path) => navigate(path))
  }, [navigate])

  // The companion overlay is its own tiny window with no room for a modal --
  // onboarding only ever shows on the dashboard/settings/character-lab window.
  const showOnboarding = Boolean(settings) && !settings.onboardingSeen && !location.pathname.startsWith('/companion')

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/character-lab" element={<CharacterLabPage />} />
        <Route path="/companion" element={<CompanionOverlayPage />} />
      </Routes>

      {showOnboarding && (
        <OnboardingModal
          onSubmit={(name) => updateSettings({ userName: name, onboardingSeen: true })}
          onSkip={() => updateSettings({ onboardingSeen: true })}
        />
      )}
    </>
  )
}
