import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import GlassCard from '../common/GlassCard.jsx'

function formatDay(dateStr) {
  const date = new Date(`${dateStr}T00:00:00`)
  return date.toLocaleDateString(undefined, { weekday: 'short' })
}

export default function WeeklyChart({ weekly }) {
  const data = weekly.map((entry) => ({ day: formatDay(entry.day), total: entry.total }))

  return (
    <GlassCard>
      <div className="mb-3 text-sm font-semibold text-hydri-ink/80 dark:text-white/70">Weekly Progress</div>
      <div style={{ width: '100%', height: 220 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <XAxis dataKey="day" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} width={32} />
            <Tooltip formatter={(value) => [`${value} ml`, 'Intake']} />
            <Bar dataKey="total" fill="#3aa1d6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  )
}
