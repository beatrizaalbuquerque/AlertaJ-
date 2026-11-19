import { Link } from 'react-router-dom'

const tones = {
  pink: 'bg-pink-500/10 text-pink-300 ring-pink-400/15',
  orange: 'bg-orange-500/10 text-orange-300 ring-orange-400/15',
  blue: 'bg-sky-500/10 text-sky-300 ring-sky-400/15',
  teal: 'bg-teal-500/10 text-teal-300 ring-teal-400/15'
}

export default function StatCard({
  title,
  value,
  description,
  icon: Icon,
  to,
  tone = 'pink'
}) {
  const card = (
    <article className="h-full min-w-0 rounded-2xl border border-white/[0.08] bg-[#17171d] p-4 transition duration-200 group-hover:-translate-y-0.5 group-hover:border-white/[0.14] group-hover:bg-[#1b1b22] sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="min-w-0 break-words pt-1 text-sm font-medium text-gray-400">
          {title}
        </p>
        {Icon && (
          <span className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset ${tones[tone] || tones.pink}`}>
            <Icon size={19} aria-hidden="true" />
          </span>
        )}
      </div>

      <p className="mt-5 break-words text-2xl font-semibold tracking-tight text-white sm:text-3xl">
        {value}
      </p>

      <p className="mt-2 break-words text-xs leading-5 text-gray-500">
        {description}
      </p>
      {to && (
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-pink-300 transition group-hover:gap-2.5 group-hover:text-pink-200">
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
      className="group block h-full rounded-2xl focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-400"
    >
      {card}
    </Link>
  )
}