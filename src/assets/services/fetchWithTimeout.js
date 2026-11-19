const DEFAULT_TIMEOUT_MS = 12_000

export async function withTimeout(
  operation,
  callerSignal,
  timeoutMessage = 'A solicitação excedeu o tempo limite.',
  timeoutMs = DEFAULT_TIMEOUT_MS
) {
  const controller = new AbortController()
  let timedOut = false

  const abortFromCaller = () => controller.abort()
  if (callerSignal?.aborted) {
    controller.abort()
  } else {
    callerSignal?.addEventListener('abort', abortFromCaller, { once: true })
  }

  const timeoutId = setTimeout(() => {
    timedOut = true
    controller.abort()
  }, timeoutMs)

  try {
    return await operation(controller.signal)
  } catch (error) {
    if (timedOut) {
      throw new Error(timeoutMessage, { cause: error })
    }
    throw error
  } finally {
    clearTimeout(timeoutId)
    callerSignal?.removeEventListener('abort', abortFromCaller)
  }
}
