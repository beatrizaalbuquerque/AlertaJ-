const OPEN_METEO_URL = 'https://api.open-meteo.com/v1/forecast'
const currentFields = ['temperature_2m', 'precipitation', 'rain']

export async function fetchCurrentWeather(latitude, longitude, signal) {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    throw new Error('Coordenadas inválidas para a consulta meteorológica.')
  }

  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: currentFields.join(','),
    hourly: 'precipitation,precipitation_probability',
    forecast_days: '1',
    timezone: 'auto'
  })

  const response = await fetch(`${OPEN_METEO_URL}?${params}`, { signal })
  if (!response.ok) {
    throw new Error(`Open-Meteo respondeu com erro (${response.status}).`)
  }

  const data = await response.json()
  const hasCurrentData = currentFields.every(field =>
    Number.isFinite(data.current?.[field]) &&
    typeof data.current_units?.[field] === 'string'
  )

  if (
    !hasCurrentData ||
    typeof data.current.time !== 'string' ||
    typeof data.timezone !== 'string'
  ) {
    throw new Error('A resposta da Open-Meteo não contém os dados atuais esperados.')
  }

  return data
}