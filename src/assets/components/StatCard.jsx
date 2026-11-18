import { Link } from 'react-router-dom'

export default function StatCard({
  title,
  value,
  description,
  icon: Icon,
  to
}) {
  const card = (
    <article className="min-w-0 rounded-2xl border border-white/10 bg-[#1b1b22] p-4 sm:p-5">
      <div className="flex justify-between items-center">
        <p className="min-w-0 break-words text-sm text-gray-400">
          {title}
        </p>

        {Icon && (
          <Icon className="shrink-0 text-pink-400" size={22} aria-hidden="true" />
        )}
      </div>

      <p className="mt-4 break-words text-2xl font-bold sm:text-3xl">
        {value}
      </p>

      <p className="mt-2 break-words text-xs text-gray-400">
        {description}
      </p>
    </article>
  )

  if (!to) return card

  return (
    <Link
      to={to}
      aria-label={`${title}: ${value}. ${description}. Abrir relatos.`}
      className="block h-full rounded-2xl transition duration-200 hover:-translate-y-0.5 hover:border-pink-500/40 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-400"
    >
      {card}
    </Link>
  )
}