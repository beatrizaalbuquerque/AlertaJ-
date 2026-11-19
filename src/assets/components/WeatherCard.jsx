import { CloudRain, Droplets, Thermometer } from 'lucide-react'
import { useWeather } from '../hooks/useWeather'
import FeedbackMessage from './FeedbackMessage'
import LoadingState from './LoadingState'

export default function WeatherCard({
  latitude,
  longitude,
  locationName
}) {
  const { weather, loading, error } =
    useWeather(latitude, longitude)

  if (loading) {
    return <div className="border-y border-white/[0.08] bg-[#17171d]/60 p-5 sm:p-6">
      <LoadingState>Consultando dados meteorológicos...</LoadingState>
    </div>
  }

  if (error) {
    return <div className="border-y border-white/[0.08] bg-[#17171d]/60 p-5 sm:p-6">
      <FeedbackMessage variant="error">{error}</FeedbackMessage>
    </div>
  }

  if (!weather) {
    return <div className="border-y border-white/[0.08] bg-[#17171d]/60 p-5 text-sm text-gray-300 sm:p-6">
      Localização necessária para consultar o clima.
    </div>
  }

  const updatedTime = weather.current.time.split('T')[1]?.slice(0, 5)

  return (
    <section className="min-w-0 border-y border-white/[0.08] bg-[#17171d]/60 p-5 sm:p-6">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-sky-300">AGORA</p>
          <h2 className="mt-1 font-semibold tracking-tight text-white">
            Condições meteorológicas
          </h2>
        </div>
        {locationName && (
          <span className="inline-flex items-center gap-1.5 border-l border-sky-300/50 pl-2.5 text-xs text-gray-400">
            <CloudRain size={14} aria-hidden="true" />
            {locationName}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 divide-y divide-white/[0.08] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        <div className="py-3 sm:px-4 sm:first:pl-0">
          <Thermometer className="mb-2 text-orange-300" size={18} aria-hidden="true" />
          <p className="font-mono text-2xl font-medium tracking-tight">
            {weather.current.temperature_2m} {weather.current_units.temperature_2m}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Temperatura
          </p>
        </div>

        <div className="py-3 sm:px-4">
          <Droplets className="mb-2 text-sky-300" size={18} aria-hidden="true" />
          <p className="font-mono text-2xl font-medium tracking-tight">
            {weather.current.precipitation} {weather.current_units.precipitation}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Precipitação atual
          </p>
        </div>

        <div className="py-3 sm:px-4 sm:last:pr-0">
          <CloudRain className="mb-2 text-indigo-300" size={18} aria-hidden="true" />
          <p className="font-mono text-2xl font-medium tracking-tight">
            {weather.current.rain} {weather.current_units.rain}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Chuva atual
          </p>
        </div>
      </div>

      <p className="mt-4 text-xs leading-5 text-gray-500">
        Atualizado às {updatedTime} · Fonte: Open-Meteo. Dados meteorológicos, não um alerta oficial.
      </p>
    </section>
  )
}