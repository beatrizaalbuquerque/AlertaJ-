import { useEffect, useState } from 'react'
import { fetchCurrentWeather } from '../services/weatherService'

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
        const data = await fetchCurrentWeather(latitude, longitude, controller.signal)

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
            error: err.message || 'Não foi possível consultar os dados meteorológicos.'
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