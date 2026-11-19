import { ChevronDown } from 'lucide-react'

export default function GuidanceCard({
  title,
  description,
  index,
  source,
  sourceUrl
}) {
  return (
    <details className="group border-b border-white/[0.09] py-4 first:border-t">
      <summary className="flex min-h-11 cursor-pointer list-none items-center gap-4 rounded-sm text-left focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-300 [&::-webkit-details-marker]:hidden">
        <span className="w-8 shrink-0 font-mono text-sm text-pink-300/80">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="flex-1 font-medium text-gray-100 transition group-hover:text-pink-100">
          {title}
        </span>
        <ChevronDown
          size={18}
          aria-hidden="true"
          className="shrink-0 text-gray-500 transition-transform group-open:rotate-180 group-hover:text-pink-300"
        />
      </summary>
      <p className="pb-2 pl-12 pr-8 pt-2 text-sm leading-6 text-gray-400">
        {description}
      </p>
      {source && sourceUrl && (
        <a
          href={sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="mb-2 ml-12 inline-flex min-h-10 items-center text-xs text-pink-300 underline underline-offset-2 hover:text-pink-200 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-300"
        >
          Fonte: {source}
        </a>
      )}
    </details>
  )
}