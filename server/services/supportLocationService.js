import { ApiError } from '../middlewares/errors.js'
import { isInsidePilotArea } from './geoService.js'

export function createSupportLocationService(db, pilotArea) {
  const findAll = db.prepare(`
    SELECT id, type, name, address, description, latitude, longitude, source
    FROM support_locations
    ORDER BY name
  `)

  return {
    list(type) {
      if (type && !['shelter', 'support_point'].includes(type)) {
        throw new ApiError(400, 'INVALID_SUPPORT_LOCATION_TYPE', 'Tipo de local inválido.')
      }

      return findAll.all()
        .filter(location =>
          (!type || location.type === type) &&
          isInsidePilotArea(pilotArea, location.latitude, location.longitude)
        )
    }
  }
}
