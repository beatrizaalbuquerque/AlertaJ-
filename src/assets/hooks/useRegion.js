import { useCallback, useEffect, useState } from 'react'
import { api } from '../services/api'

export function useRegion() {
  const [region, setRegion] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadRegion = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      setRegion(await api.get('/region'))
    } catch (requestError) {
      setError(requestError.message || 'Não foi possível carregar a região piloto.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    Promise.resolve().then(loadRegion)
  }, [loadRegion])

  return { region, loading, error, loadRegion }
}
