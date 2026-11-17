import { useCallback, useEffect, useState } from 'react'
import { api } from '../services/api'

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
    <main className="space-y-4 p-5 md:p-8">
      <header>
        <h1 className="text-2xl font-bold">Abrigos e pontos de apoio</h1>
        <p className="mt-1 text-sm text-gray-400">
          Locais oficiais serão exibidos quando uma fonte validada for cadastrada.
        </p>
      </header>
      {error && (
        <div role="alert" className="flex items-center justify-between gap-3 text-red-400">
          {error}
          <button type="button" onClick={loadLocations} className="underline">
            Tentar novamente
          </button>
        </div>
      )}
      <section className="rounded-2xl border border-white/10 bg-[#1b1b22] p-5">
        {loading ? (
          <p className="text-sm text-gray-400">Carregando locais...</p>
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
          <p className="text-sm text-gray-400">
            Nenhum abrigo ou ponto de apoio oficial foi cadastrado para Itaquaquecetuba.
          </p>
        )}
      </section>
    </main>
  )
}