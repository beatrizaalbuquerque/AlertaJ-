import { BookOpen } from 'lucide-react'

export default function GuidanceCard({
  title,
  description
}) {
  return (
    <article className="bg-[#1b1b22] border border-white/10 rounded-xl p-5">
      <BookOpen className="text-pink-400 mb-3" />

      <h3 className="font-semibold mb-2">
        {title}
      </h3>

      <p className="text-sm text-gray-400 leading-relaxed">
        {description}
      </p>
    </article>
  )
}