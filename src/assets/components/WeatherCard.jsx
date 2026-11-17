import { CloudRain, Droplets, Thermometer } from 'lucide-react'
import { useWeather } from '../hooks/useWeather'

export default function WeatherCard({
  latitude,
  longitude,
  locationName
}) {
  const { weather, loading, error } =
    useWeather(latitude, longitude)

  if (loading) {
    return <div className="bg-[#1b1b22] rounded-2xl p-5">
      Consultando previsão meteorológica...
    </div>
  }

  if (error) {
    return <div className="bg-[#1b1b22] rounded-2xl p-5">
      Não foi possível consultar os dados meteorológicos.
    </div>
  }

  if (!weather) {
    return <div className="bg-[#1b1b22] rounded-2xl p-5">
      Localização necessária para consultar o clima.
    </div>
  }

  return (
    <section className="bg-[#1b1b22] border border-white/10 rounded-2xl p-5">
      <h2 className="font-semibold mb-5">
        Condições meteorológicas{locationName ? ` — ${locationName}` : ''}
      </h2>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <Thermometer className="text-pink-400 mb-2" />
          <p className="text-xl font-bold">
            {weather.current.temperature_2m}°
          </p>
          <p className="text-xs text-gray-400">
            Temperatura
          </p>
        </div>

        <div>
          <Droplets className="text-pink-400 mb-2" />
          <p className="text-xl font-bold">
            {weather.current.precipitation} mm
          </p>
          <p className="text-xs text-gray-400">
            Precipitação atual
          </p>
        </div>

        <div>
          <CloudRain className="text-pink-400 mb-2" />
          <p className="text-xl font-bold">
            {weather.current.rain} mm
          </p>
          <p className="text-xs text-gray-400">
            Chuva atual
          </p>
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-5">
        Fonte: Open-Meteo. Dados meteorológicos, não um alerta oficial.
      </p>
    </section>
  )
}