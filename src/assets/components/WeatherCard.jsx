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
    return <div className="rounded-2xl border border-white/[0.08] bg-[#17171d] p-5 sm:p-6">
      <LoadingState>Consultando dados meteorológicos...</LoadingState>
    </div>
  }

  if (error) {
    return <div className="rounded-2xl border border-white/[0.08] bg-[#17171d] p-5 sm:p-6">
      <FeedbackMessage variant="error">{error}</FeedbackMessage>
    </div>
  }

  if (!weather) {
    return <div className="rounded-2xl border border-white/[0.08] bg-[#17171d] p-5 text-sm text-gray-300 sm:p-6">
      Localização necessária para consultar o clima.
    </div>
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#17171d] p-5 sm:p-6">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-sky-300">AGORA</p>
          <h2 className="mt-1 font-semibold tracking-tight text-white">
            Condições meteorológicas
          </h2>
        </div>
        {locationName && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] px-3 py-1.5 text-xs text-gray-400">
            <CloudRain size={14} aria-hidden="true" />
            {locationName}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-3">
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <Thermometer className="mb-3 text-orange-300" size={19} aria-hidden="true" />
          <p className="text-2xl font-semibold tracking-tight">
            {weather.current.temperature_2m}°
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Temperatura
          </p>
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <Droplets className="mb-3 text-sky-300" size={19} aria-hidden="true" />
          <p className="text-2xl font-semibold tracking-tight">
            {weather.current.precipitation} mm
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Precipitação atual
          </p>
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <CloudRain className="mb-3 text-indigo-300" size={19} aria-hidden="true" />
          <p className="text-2xl font-semibold tracking-tight">
            {weather.current.rain} mm
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Chuva atual
          </p>
        </div>
      </div>

      <p className="mt-4 text-xs leading-5 text-gray-500">
        Fonte: Open-Meteo. Dados meteorológicos, não um alerta oficial.
      </p>
    </section>
  )
}