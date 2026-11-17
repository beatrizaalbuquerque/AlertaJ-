export default function StatCard({
  title,
  value,
  description,
  icon: Icon
}) {
  return (
    <article className="bg-[#1b1b22] border border-white/10 rounded-2xl p-5">
      <div className="flex justify-between items-center">
        <p className="text-gray-400 text-sm">
          {title}
        </p>

        {Icon && (
          <Icon className="text-pink-400" size={22} />
        )}
      </div>

      <h2 className="text-3xl font-bold mt-4">
        {value}
      </h2>

      <p className="text-gray-500 text-xs mt-2">
        {description}
      </p>
    </article>
  )
}