import { Link } from 'react-router-dom'

const tones = {
  pink: { border: 'border-pink-400', icon: 'text-pink-300' },
  orange: { border: 'border-orange-300', icon: 'text-orange-200' },
  blue: { border: 'border-sky-300', icon: 'text-sky-200' },
  teal: { border: 'border-teal-300', icon: 'text-teal-200' }
}

export default function StatCard({
  title,
  value,
  description,
  icon: Icon,
  to,
  tone = 'pink'
}) {
  const colors = tones[tone] || tones.pink
  const card = (
    <article className={`group h-full min-w-0 border-l-2 ${colors.border} py-3 pl-4 pr-3 transition-colors group-hover:bg-white/[0.025] sm:py-4 sm:pl-5`}>
      <div className="flex items-start justify-between gap-3">
        <p className="min-w-0 break-words pt-1 text-sm font-medium text-gray-400">
          {title}
        </p>
        {Icon && (
          <Icon
            size={18}
            aria-hidden="true"
            className={`mt-0.5 shrink-0 ${colors.icon}`}
          />
        )}
      </div>

      <p className="mt-4 break-words font-mono text-3xl font-medium tracking-tight text-white sm:text-4xl">
        {value}
      </p>

      <p className="mt-2 break-words text-xs leading-5 text-gray-500">
        {description}
      </p>
      {to && (
        <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-pink-300 transition group-hover:gap-2 group-hover:text-pink-200">
          {to === '/abrigos' ? 'Ver abrigos' : 'Ver ocorrências'}
          <span aria-hidden="true">→</span>
        </span>
      )}
    </article>
  )

  if (!to) return card

  return (
    <Link
      to={to}
      aria-label={`${title}: ${value}. ${description}.`}
      className="group block h-full rounded-sm focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-400"
    >
      {card}
    </Link>
  )
}