const ITEMS = [
  { left: '8%', top: '8%', delay: '0s', icon: '✨' },
  { left: '78%', top: '12%', delay: '0.15s', icon: '❤️' },
  { left: '82%', top: '55%', delay: '0.3s', icon: '✨' },
  { left: '4%', top: '52%', delay: '0.45s', icon: '❤️' }
]

export default function Sparkles() {
  return (
    <div className="pointer-events-none absolute inset-0">
      {ITEMS.map((item) => (
        <span
          key={`${item.left}-${item.top}`}
          className="absolute animate-ping text-lg"
          style={{ left: item.left, top: item.top, animationDelay: item.delay, animationDuration: '1.1s' }}
        >
          {item.icon}
        </span>
      ))}
    </div>
  )
}
