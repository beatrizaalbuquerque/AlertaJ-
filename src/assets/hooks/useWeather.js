import { useEffect, useState } from 'react'

export function useWeather(latitude, longitude) {
  const coordinatesKey = latitude == null || longitude == null
    ? ''
    : `${latitude},${longitude}`
  const [request, setRequest] = useState({
    key: '',
    weather: null,
    loading: false,
    error: ''
  })

  useEffect(() => {
    if (!coordinatesKey) return undefined

    const controller = new AbortController()

    async function loadWeather() {
      try {
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

        if (!controller.signal.aborted) {
          setRequest({
            key: coordinatesKey,
            weather: data,
            loading: false,
            error: ''
          })
        }
      } catch (err) {
        if (err.name !== 'AbortError' && !controller.signal.aborted) {
          setRequest({
            key: coordinatesKey,
            weather: null,
            loading: false,
            error: 'Não foi possível consultar os dados meteorológicos.'
          })
        }
      }
    }

    loadWeather()

    return () => controller.abort()
  }, [latitude, longitude, coordinatesKey])

  const currentRequest = request.key === coordinatesKey

  return {
    weather: currentRequest ? request.weather : null,
    loading: Boolean(coordinatesKey) && (!currentRequest || request.loading),
    error: currentRequest ? request.error : ''
  }
}