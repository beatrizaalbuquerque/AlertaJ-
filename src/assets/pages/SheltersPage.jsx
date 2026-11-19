import { useCallback, useEffect, useState } from 'react'
import { Search, X } from 'lucide-react'
import { api } from '../services/api'
import FeedbackMessage from '../components/FeedbackMessage'
import LoadingState from '../components/LoadingState'
import EmptyState from '../components/EmptyState'

export default function SheltersPage() {
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')

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

  const visibleLocations = locations.filter(location => {
    const matchesType = typeFilter === 'all' || location.type === typeFilter
    const searchableText = `${location.name} ${location.address} ${location.description || ''}`.toLocaleLowerCase('pt-BR')
    return matchesType && searchableText.includes(query.trim().toLocaleLowerCase('pt-BR'))
  })

  return (
    <main className="min-w-0 space-y-6 p-4 sm:p-5 md:space-y-7 md:p-8">
      <header className="border-b border-white/10 pb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal-300">Apoio no território</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Abrigos e pontos de apoio</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400">
          Consulte os locais cadastrados para Itaquaquecetuba. As informações só aparecem quando há uma fonte validada.
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
      <section className="min-w-0">
        <div className="mb-4 flex flex-col gap-3 border-b border-white/[0.08] pb-4 sm:flex-row sm:items-end sm:justify-between">
          <label className="min-w-0 flex-1 text-xs font-medium text-gray-400 sm:max-w-md">
            Buscar por nome, endereço ou descrição
            <span className="mt-2 flex min-h-11 items-center gap-2 rounded-lg border border-white/10 bg-[#17171d] px-3 focus-within:border-teal-300/50">
              <Search size={17} className="shrink-0 text-gray-500" aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={event => setQuery(event.target.value)}
                placeholder="Ex.: nome do local ou bairro"
                className="min-w-0 flex-1 bg-transparent text-sm text-gray-100 outline-none placeholder:text-gray-600"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Limpar busca"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-400 hover:bg-white/5 hover:text-white focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-teal-300"
                >
                  <X size={15} aria-hidden="true" />
                </button>
              )}
            </span>
          </label>
          <label className="flex flex-col gap-2 text-xs font-medium text-gray-400 sm:w-56">
            Tipo de local
            <select
              value={typeFilter}
              onChange={event => setTypeFilter(event.target.value)}
              className="min-h-11 rounded-lg border border-white/10 bg-[#17171d] px-3 text-sm text-gray-100 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-300"
            >
              <option value="all">Todos</option>
              <option value="shelter">Abrigos</option>
              <option value="support_point">Pontos de apoio</option>
            </select>
          </label>
        </div>
        {!loading && !error && (
          <p className="mb-3 text-xs text-gray-500" aria-live="polite">
            {visibleLocations.length} {visibleLocations.length === 1 ? 'local encontrado' : 'locais encontrados'}
          </p>
        )}
        {loading ? (
          <LoadingState>Carregando locais...</LoadingState>
        ) : visibleLocations.length ? (
          <ul className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
            {visibleLocations.map(location => (
              <li key={location.id} className="grid gap-2 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start sm:gap-6">
                <div className="min-w-0">
                  <p className="break-words font-medium text-gray-100">{location.name}</p>
                  <p className="mt-1 break-words text-sm text-gray-400">{location.address}</p>
                  {location.description && (
                    <p className="mt-2 text-sm leading-6 text-gray-500">{location.description}</p>
                  )}
                  {location.source && (
                    <p className="mt-2 text-xs text-gray-600">Fonte: {location.source}</p>
                  )}
                </div>
                <span className="w-fit rounded border border-teal-300/20 px-2 py-1 text-xs text-teal-200">
                  {location.type === 'shelter' ? 'Abrigo' : 'Ponto de apoio'}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState className="border-x-0 border-t-0 rounded-none bg-transparent px-0">
            {locations.length
              ? 'Nenhum local corresponde à busca e aos filtros selecionados.'
              : 'Nenhum abrigo ou ponto de apoio oficial está cadastrado para Itaquaquecetuba neste momento.'}
          </EmptyState>
        )}
      </section>
    </main>
  )
}