import { useRef } from 'react'

export default function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Confirmar',
  busy = false,
  onCancel,
  onConfirm
}) {
  const dialogRef = useRef(null)

  function handleKeyDown(event) {
    if (event.key === 'Escape' && !busy) {
      onCancel()
      return
    }

    if (event.key !== 'Tab') return

    const buttons = dialogRef.current?.querySelectorAll('button:not(:disabled)')
    if (!buttons?.length) return

    const firstButton = buttons[0]
    const lastButton = buttons[buttons.length - 1]
    const focusIsInside = dialogRef.current.contains(document.activeElement)

    if (!focusIsInside || (event.shiftKey && document.activeElement === firstButton)) {
      event.preventDefault()
      ;(event.shiftKey ? lastButton : firstButton).focus()
    } else if (!event.shiftKey && document.activeElement === lastButton) {
      event.preventDefault()
      firstButton.focus()
    }
  }

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 p-4"
      role="presentation"
      onMouseDown={event => {
        if (event.target === event.currentTarget && !busy) onCancel()
      }}
    >
      <section
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
        className="w-full max-w-md rounded-2xl border border-white/10 bg-[#1b1b22] p-5 shadow-2xl sm:p-6"
        onKeyDown={handleKeyDown}
      >
        <h2 id="confirm-dialog-title" className="break-words text-lg font-semibold text-white">
          {title}
        </h2>
        <p id="confirm-dialog-description" className="mt-2 break-words text-sm leading-6 text-gray-300">
          {message}
        </p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            autoFocus
            disabled={busy}
            onClick={onCancel}
            className="min-h-11 rounded-lg border border-white/15 px-4 py-2 text-sm font-medium text-gray-200 transition hover:bg-white/5 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={onConfirm}
            className="min-h-11 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? 'Excluindo...' : confirmLabel}
          </button>
        </div>
      </section>
    </div>
  )
}
