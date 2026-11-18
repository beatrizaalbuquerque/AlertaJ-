const styles = {
  error: 'border-red-500/30 bg-red-500/10 text-red-200',
  success: 'border-green-500/30 bg-green-500/10 text-green-200',
  info: 'border-pink-500/20 bg-pink-500/5 text-gray-200'
}

export default function FeedbackMessage({
  variant = 'info',
  children,
  className = ''
}) {
  const isError = variant === 'error'

  return (
    <div
      role={isError ? 'alert' : 'status'}
      aria-live={isError ? 'assertive' : 'polite'}
      className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4 text-sm ${styles[variant] || styles.info} ${className}`}
    >
      {children}
    </div>
  )
}
