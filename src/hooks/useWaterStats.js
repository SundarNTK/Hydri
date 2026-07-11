import { useCallback, useEffect, useState } from 'react'
import { api } from '../ipc/api.js'

export function useWaterStats() {
  const [stats, setStats] = useState(null)

  const refresh = useCallback(async () => {
    const data = await api.water.getStats()
    setStats(data)
    return data
  }, [])

  useEffect(() => {
    refresh()
    return api.reminders.onStatsUpdated((updated) => setStats(updated))
  }, [refresh])

  return { stats, refresh }
}
