import { useState } from 'react'
import { fetchAlternativeRoutes } from '../services/routeService'

export function useRoutePlanner() {
  const [origin, setOrigin] = useState(null)
  const [destination, setDestination] = useState(null)
  const [routes, setRoutes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function chooseOrigin(point) {
    setOrigin(point)
    setRoutes([])
    setError('')
  }

  function chooseDestination(point) {
    setDestination(point)
    setRoutes([])
    setError('')
  }

  async function calculate(hasConfirmedFloodReports) {
    setRoutes([])
    setError('')

    if (hasConfirmedFloodReports) {
      setError('Há alagamentos confirmados na região. O serviço de rotas não consegue excluí-los do trajeto; por segurança, o cálculo foi bloqueado.')
      return
    }
    if (!origin || !destination) {
      setError('Selecione a origem e o destino no mapa antes de consultar.')
      return
    }

    setLoading(true)
    try {
      setRoutes(await fetchAlternativeRoutes(origin, destination))
    } catch (requestError) {
      setError(requestError instanceof TypeError
        ? 'Não foi possível conectar ao serviço público de rotas. Verifique a conexão ou tente novamente mais tarde.'
        : requestError.message || 'Não foi possível consultar o serviço de rotas.')
    } finally {
      setLoading(false)
    }
  }

  function clear() {
    setOrigin(null)
    setDestination(null)
    setRoutes([])
    setError('')
  }

  return {
    origin,
    destination,
    routes,
    loading,
    error,
    chooseOrigin,
    chooseDestination,
    calculate,
    clear,
    setError
  }
}
