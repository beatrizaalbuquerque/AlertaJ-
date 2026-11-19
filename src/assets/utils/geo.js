function isPointOnSegment(point, start, end) {
  const [longitude, latitude] = point
  const [startLongitude, startLatitude] = start
  const [endLongitude, endLatitude] = end
  const cross =
    (latitude - startLatitude) * (endLongitude - startLongitude) -
    (longitude - startLongitude) * (endLatitude - startLatitude)

  if (Math.abs(cross) > 1e-10) return false

  return longitude >= Math.min(startLongitude, endLongitude) - 1e-10 &&
    longitude <= Math.max(startLongitude, endLongitude) + 1e-10 &&
    latitude >= Math.min(startLatitude, endLatitude) - 1e-10 &&
    latitude <= Math.max(startLatitude, endLatitude) + 1e-10
}

function isPointInRing(point, ring) {
  let inside = false

  for (let index = 0, previous = ring.length - 1; index < ring.length; previous = index++) {
    const start = ring[previous]
    const end = ring[index]

    if (isPointOnSegment(point, start, end)) return true

    const intersects = (end[1] > point[1]) !== (start[1] > point[1]) &&
      point[0] < ((start[0] - end[0]) * (point[1] - end[1])) /
        (start[1] - end[1]) + end[0]

    if (intersects) inside = !inside
  }

  return inside
}

function isPointInPolygon(point, rings) {
  return Boolean(rings?.length) &&
    isPointInRing(point, rings[0]) &&
    !rings.slice(1).some(ring => isPointInRing(point, ring))
}

export function isPointInsideBoundary(latitude, longitude, boundary) {
  const geometry = boundary?.geometry || boundary
  if (!geometry || !Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return false
  }

  const point = [longitude, latitude]
  if (geometry.type === 'Polygon') {
    return isPointInPolygon(point, geometry.coordinates)
  }
  if (geometry.type === 'MultiPolygon') {
    return geometry.coordinates.some(polygon => isPointInPolygon(point, polygon))
  }

  return false
}
