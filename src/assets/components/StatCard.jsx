export default function StatCard({
  title,
  value,
  description,
  icon: Icon
}) {
  return (
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
}