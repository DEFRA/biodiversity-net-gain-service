import constants from '../utils/constants.js'
import {
  ANY,
  routeDefinition,
  journeyStep,
  journeyStepFromRoute
} from './helpers.js'

const UPLOAD_LAND_BOUNDARY = routeDefinition(
  constants.routes.UPLOAD_LAND_BOUNDARY,
  [
    constants.redisKeys.LAND_BOUNDARY_LOCATION,
    constants.redisKeys.LAND_BOUNDARY_FILE_SIZE,
    constants.redisKeys.LAND_BOUNDARY_FILE_TYPE
  ]
)

const CHECK_LAND_BOUNDARY = routeDefinition(
  constants.routes.CHECK_LAND_BOUNDARY,
  [constants.redisKeys.LAND_BOUNDARY_CHECKED]
)

const ADD_GRID_REFERENCE = routeDefinition(
  constants.routes.ADD_GRID_REFERENCE,
  [constants.redisKeys.LAND_BOUNDARY_GRID_REFERENCE]
)

const ADD_HECTARES = routeDefinition(
  constants.routes.ADD_HECTARES,
  [constants.redisKeys.LAND_BOUNDARY_HECTARES]
)

const siteBoundaryJourneys = [
  [
    journeyStep(
      UPLOAD_LAND_BOUNDARY.startUrl,
      [
        ...UPLOAD_LAND_BOUNDARY.sessionKeys,
        ...CHECK_LAND_BOUNDARY.sessionKeys
      ],
      [ANY, ANY, ANY, 'yes']
    ),
    journeyStepFromRoute(ADD_GRID_REFERENCE),
    journeyStepFromRoute(ADD_HECTARES)
  ]
]

export {
  siteBoundaryJourneys
}
