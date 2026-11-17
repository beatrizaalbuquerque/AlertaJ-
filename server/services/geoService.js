import { ApiError } from '../middlewares/errors.js'

function pointInRing(longitude, latitude, ring) {
  let inside = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i]
    const [xj, yj] = ring[j]
    const cross = (longitude - xi) * (yj - yi) - (latitude - yi) * (xj - xi)
    if (
      Math.abs(cross) < 1e-10 &&
      longitude >= Math.min(xi, xj) && longitude <= Math.max(xi, xj) &&
      latitude >= Math.min(yi, yj) && latitude <= Math.max(yi, yj)
    ) return true
    const intersects = ((yi > latitude) !== (yj > latitude)) &&
      longitude < ((xj - xi) * (latitude - yi)) / (yj - yi) + xi
    if (intersects) inside = !inside
  }
  return inside
}

function polygonContains(coordinates, longitude, latitude) {
  return pointInRing(longitude, latitude, coordinates[0]) &&
    !coordinates.slice(1).some(ring => pointInRing(longitude, latitude, ring))
}

export function isInsidePilotArea(area, latitude, longitude) {
  if (!area) return false
  const geometry = area.type === 'Feature' ? area.geometry : area
  const polygons = geometry.type === 'Polygon'
    ? [geometry.coordinates]
    : geometry.coordinates
  return polygons.some(coordinates =>
    polygonContains(coordinates, longitude, latitude)
  )
}

function ringCentroid(ring) {
  let twiceArea = 0
  let longitudeSum = 0
  let latitudeSum = 0
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [x0, y0] = ring[j]
    const [x1, y1] = ring[i]
    const cross = x0 * y1 - x1 * y0
    twiceArea += cross
    longitudeSum += (x0 + x1) * cross
    latitudeSum += (y0 + y1) * cross
  }
  if (Math.abs(twiceArea) < Number.EPSILON) {
    throw new Error('Não foi possível calcular o centroide da região piloto.')
  }
  return {
    area: Math.abs(twiceArea / 2),
    longitude: longitudeSum / (3 * twiceArea),
    latitude: latitudeSum / (3 * twiceArea)
  }
}

export function getPilotAreaCenter(area) {
  if (!area) {
    throw new Error('A região piloto não está configurada.')
  }
  const geometry = area.type === 'Feature' ? area.geometry : area
  const polygons = geometry.type === 'Polygon'
    ? [geometry.coordinates]
    : geometry.coordinates
  const weightedCenters = polygons.map(polygon => {
    const outer = ringCentroid(polygon[0])
    let remainingArea = outer.area
    let longitudeTotal = outer.longitude * outer.area
    let latitudeTotal = outer.latitude * outer.area

    for (const hole of polygon.slice(1)) {
      const centroid = ringCentroid(hole)
      remainingArea -= centroid.area
      longitudeTotal -= centroid.longitude * centroid.area
      latitudeTotal -= centroid.latitude * centroid.area
    }

    return {
      area: remainingArea,
      longitude: longitudeTotal / remainingArea,
      latitude: latitudeTotal / remainingArea
    }
  })
  const totalArea = weightedCenters.reduce((sum, item) => sum + item.area, 0)
  const center = weightedCenters.reduce((result, item) => ({
    longitude: result.longitude + item.longitude * item.area / totalArea,
    latitude: result.latitude + item.latitude * item.area / totalArea
  }), { longitude: 0, latitude: 0 })

  return [center.latitude, center.longitude]
}

export function validatePilotArea(area) {
  if (!area) return
  const geometry = area.type === 'Feature' ? area.geometry : area
  const validRing = ring =>
    Array.isArray(ring) &&
    ring.length >= 4 &&
    ring.every(position =>
      Array.isArray(position) &&
      position.length >= 2 &&
      Number.isFinite(position[0]) &&
      Number.isFinite(position[1]) &&
      position[0] >= -180 && position[0] <= 180 &&
      position[1] >= -90 && position[1] <= 90
    ) &&
    ring[0][0] === ring.at(-1)[0] &&
    ring[0][1] === ring.at(-1)[1]
  const validPolygon = polygon =>
    Array.isArray(polygon) &&
    polygon.length > 0 &&
    polygon.every(validRing)
  const valid = geometry && (
    (geometry.type === 'Polygon' && validPolygon(geometry.coordinates)) ||
    (geometry.type === 'MultiPolygon' &&
      Array.isArray(geometry.coordinates) &&
      geometry.coordinates.length > 0 &&
      geometry.coordinates.every(validPolygon))
  )
  if (!valid) {
    throw new Error('A região piloto precisa ser um GeoJSON Polygon, MultiPolygon ou Feature correspondente.')
  }
  const feature = area.type === 'Feature' ? area : null
  if (feature?.properties?.codarea && feature.properties.codarea !== '3523107') {
    throw new Error('PILOT_AREA_GEOJSON deve corresponder ao município Itaquaquecetuba (IBGE 3523107).')
  }
}

export function assertInsidePilotArea(area, latitude, longitude) {
  if (!area) {
    throw new ApiError(
      503,
      'PILOT_AREA_NOT_CONFIGURED',
      'A região piloto ainda não foi configurada. O registro de ocorrências está pendente.'
    )
  }
  if (!isInsidePilotArea(area, latitude, longitude)) {
    throw new ApiError(403, 'OUTSIDE_PILOT_AREA', 'O ponto está fora da região piloto.')
  }
}
