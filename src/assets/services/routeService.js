import { withTimeout } from './fetchWithTimeout.js'

const ROUTING_BASE_URL = 'https://router.project-osrm.org/route/v1/driving'

function isCoordinatePair(point) {
  return Array.isArray(point) &&
    point.length === 2 &&
    Number.isFinite(point[0]) &&
    Number.isFinite(point[1]) &&
    point[0] >= -90 &&
    point[0] <= 90 &&
    point[1] >= -180 &&
    point[1] <= 180
}

export async function fetchAlternativeRoutes(origin, destination, signal) {
  if (!isCoordinatePair(origin) || !isCoordinatePair(destination)) {
    throw new Error('Selecione uma origem e um destino válidos no mapa.')
  }

  const coordinates = [origin, destination]
    .map(([latitude, longitude]) => `${longitude},${latitude}`)
    .join(';')
  const params = new URLSearchParams({
    alternatives: 'true',
    overview: 'full',
    geometries: 'geojson',
    steps: 'false'
  })

  return withTimeout(async timeoutSignal => {
    const response = await fetch(
      `${ROUTING_BASE_URL}/${coordinates}?${params}`,
      { signal: timeoutSignal }
    )

    if (!response.ok) {
      throw new Error(`O serviço de rotas respondeu com erro (${response.status}). Tente novamente mais tarde.`)
    }

    const data = await response.json()
    if (data.code !== 'Ok' || !Array.isArray(data.routes)) {
      if (data.code === 'NoRoute') {
        throw new Error('O serviço não encontrou um trajeto entre os pontos selecionados.')
      }
      throw new Error('O serviço de rotas retornou uma resposta inválida.')
    }

    const routes = data.routes
      .filter(route =>
        Array.isArray(route.geometry?.coordinates) &&
        route.geometry.coordinates.length > 1 &&
        Number.isFinite(route.distance) &&
        Number.isFinite(route.duration)
      )
      .map((route, index) => ({
        id: index,
        coordinates: route.geometry.coordinates.map(([longitude, latitude]) => [latitude, longitude]),
        distance: route.distance,
        duration: route.duration
      }))

    if (!routes.length) {
      throw new Error('O serviço não retornou trajetos válidos para os pontos selecionados.')
    }

    return routes
  }, signal, 'A consulta ao serviço de rotas excedeu o tempo limite. Tente novamente mais tarde.')
}
