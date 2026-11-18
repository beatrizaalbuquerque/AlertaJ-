export default function EmptyState({ children, className = '' }) {
  return (
    <p className={`rounded-xl border border-dashed border-white/15 bg-white/[0.02] p-5 text-sm leading-6 text-gray-400 ${className}`}>
      {children}
    </p>
  )
}
