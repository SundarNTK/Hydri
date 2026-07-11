import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { api } from '../ipc/api.js'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState('light')

  useEffect(() => {
    let cancelled = false
    api.settings.get().then((settings) => {
      if (!cancelled) setThemeState(settings.theme)
    })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  const setTheme = useCallback((next) => {
    setThemeState(next)
    api.settings.update({ theme: next })
  }, [])

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider')
  return ctx
}
