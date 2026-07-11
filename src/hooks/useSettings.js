import { useCallback, useEffect, useState } from 'react'
import { api } from '../ipc/api.js'

export function useSettings() {
  const [settings, setSettings] = useState(null)

  useEffect(() => {
    let cancelled = false
    api.settings.get().then((data) => {
      if (!cancelled) setSettings(data)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const updateSettings = useCallback(async (partial) => {
    const updated = await api.settings.update(partial)
    setSettings(updated)
    return updated
  }, [])

  return { settings, updateSettings }
}
