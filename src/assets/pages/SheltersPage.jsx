import { useCallback, useEffect, useState } from 'react'
import { api } from '../services/api'
import FeedbackMessage from '../components/FeedbackMessage'
import LoadingState from '../components/LoadingState'
import EmptyState from '../components/EmptyState'

export default function SheltersPage() {
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadLocations = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const data = await api.get('/support-locations')
      setLocations(data.locations)
    } catch (requestError) {
      setError(requestError.message || 'Não foi possível carregar os locais.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    Promise.resolve().then(loadLocations)
  }, [loadLocations])

  return (
    <main className="min-w-0 space-y-4 p-4 sm:p-5 md:p-8">
      <header>
        <h1 className="text-2xl font-bold">Abrigos e pontos de apoio</h1>
        <p className="mt-1 text-sm text-gray-400">
          Locais oficiais serão exibidos quando uma fonte validada for cadastrada.
        </p>
      </header>
      {error && (
        <FeedbackMessage variant="error">
          <span>{error}</span>
          <button type="button" onClick={loadLocations} className="min-h-11 rounded-lg px-3 underline focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-400">
            Tentar novamente
          </button>
        </FeedbackMessage>
      )}
      <section className="min-w-0 rounded-2xl border border-white/10 bg-[#1b1b22] p-4 sm:p-5">
        {loading ? (
          <LoadingState>Carregando locais...</LoadingState>
        ) : locations.length ? (
          <div className="space-y-4">
            {locations.map(location => (
              <article key={location.id} className="border-b border-white/10 pb-4 last:border-0">
                <h2 className="font-semibold">{location.name}</h2>
                <p className="text-sm text-gray-400">
                  {location.type === 'shelter' ? 'Abrigo' : 'Ponto de apoio'} · {location.address}
                </p>
                {location.description && (
                  <p className="mt-1 text-sm text-gray-400">{location.description}</p>
                )}
              </article>
            ))}
          </div>
        ) : (
          <EmptyState className="border-0 bg-transparent p-0">
            Nenhum abrigo ou ponto de apoio oficial foi cadastrado para Itaquaquecetuba.
          </EmptyState>
        )}
      </section>
    </main>
  )
}