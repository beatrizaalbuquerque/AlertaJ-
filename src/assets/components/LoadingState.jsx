export default function LoadingState({ children = 'Carregando...' }) {
  return (
    <p
      role="status"
      aria-live="polite"
      className="flex items-center gap-3 py-3 text-sm text-gray-300"
    >
      <span
        aria-hidden="true"
        className="h-4 w-4 animate-spin rounded-full border-2 border-pink-400/30 border-t-pink-400"
      />
      {children}
    </p>
  )
}
