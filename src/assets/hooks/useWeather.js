import { useEffect, useState } from 'react'

export function useWeather(latitude, longitude) {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (
      latitude == null ||
      longitude == null
    ) return

    const controller = new AbortController()

    async function loadWeather() {
      try {
        setLoading(true)
        setError('')

        const params = new URLSearchParams({
          latitude: String(latitude),
          longitude: String(longitude),
          current: 'temperature_2m,precipitation,rain',
          hourly: 'precipitation,precipitation_probability',
          forecast_days: '1',
          timezone: 'auto'
        })

        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?${params}`,
          { signal: controller.signal }
        )

        if (!response.ok) {
          throw new Error('Falha ao consultar meteorologia')
        }

        const data = await response.json()

        setWeather(data)
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message)
        }
      } finally {
        setLoading(false)
      }
    }

    loadWeather()

    return () => controller.abort()
  }, [latitude, longitude])

  return {
    weather,
    loading,
    error
  }
}