export default function SpeechBubble({ text }) {
  return (
    <div className="relative max-w-xs rounded-2xl border border-white/40 bg-white/90 px-4 py-3 text-sm font-medium text-hydri-ink shadow-glass backdrop-blur-glass">
      {text}
      <span className="absolute -bottom-2 left-8 h-4 w-4 rotate-45 border-b border-r border-white/40 bg-white/90" />
    </div>
  )
}
