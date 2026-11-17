const styles = {
  baixo: 'bg-green-500/15 text-green-400',
  medio: 'bg-yellow-500/15 text-yellow-400',
  alto: 'bg-red-500/15 text-red-400',
  'não confirmado': 'bg-gray-500/15 text-gray-300',
  confirmado: 'bg-green-500/15 text-green-400',
  encerrado: 'bg-gray-500/15 text-gray-400'
}

export default function RiskBadge({ level }) {
  const normalized = String(level || '')
    .toLowerCase()

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        styles[normalized] || 'bg-white/10 text-white'
      }`}
    >
      {level}
    </span>
  )
}