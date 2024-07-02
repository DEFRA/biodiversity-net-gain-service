import constants from '../../utils/constants.js'
import {
  ANY,
  routeDefinition,
  journeyStep,
  journeyStepFromRoute
} from '../utils.js'
import { getValidReferrerUrl } from '../../utils/helpers.js'
import { FormError } from '../../utils/form-error.js'

const UPLOAD_LAND_BOUNDARY = routeDefinition(
  constants.routes.UPLOAD_LAND_BOUNDARY,
  [
    constants.redisKeys.LAND_BOUNDARY_LOCATION,
    constants.redisKeys.LAND_BOUNDARY_FILE_SIZE,
    constants.redisKeys.LAND_BOUNDARY_FILE_TYPE
  ],
  () => {
    return constants.routes.CHECK_LAND_BOUNDARY
  }
)

const CHECK_LAND_BOUNDARY = routeDefinition(
  constants.routes.CHECK_LAND_BOUNDARY,
  [constants.redisKeys.LAND_BOUNDARY_CHECKED],
  (session) => {
    const checkLandBoundary = session.get(constants.redisKeys.LAND_BOUNDARY_CHECKED)
    if (checkLandBoundary === 'no') {
      return constants.routes.UPLOAD_LAND_BOUNDARY
    } else if (checkLandBoundary === 'yes') {
      const referrerUrl = getValidReferrerUrl(session, constants.LAND_BOUNDARY_VALID_REFERRERS)
      return (session.get(constants.redisKeys.LAND_BOUNDARY_GRID_REFERENCE) && referrerUrl) || constants.routes.ADD_GRID_REFERENCE
    } else {
      const message = 'Select yes if this is the correct file'
      throw new FormError(message, {
        text: message,
        href: '#check-upload-correct-yes'
      })
    }
  }
)

const ADD_GRID_REFERENCE = routeDefinition(
  constants.routes.ADD_GRID_REFERENCE,
  [constants.redisKeys.LAND_BOUNDARY_GRID_REFERENCE],
  (session) => {
    const referrerUrl = getValidReferrerUrl(session, constants.LAND_BOUNDARY_VALID_REFERRERS)
    return (session.get(constants.redisKeys.LAND_BOUNDARY_HECTARES) && referrerUrl) || constants.routes.ADD_HECTARES
  }
)

const ADD_HECTARES = routeDefinition(
  constants.routes.ADD_HECTARES,
  [constants.redisKeys.LAND_BOUNDARY_HECTARES],
  (session) => {
    const referrerUrl = getValidReferrerUrl(session, constants.LAND_BOUNDARY_VALID_REFERRERS)
    return referrerUrl || constants.routes.CHECK_LAND_BOUNDARY_DETAILS
  }
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

const siteBoundaryRouteDefinitions = [
  UPLOAD_LAND_BOUNDARY,
  CHECK_LAND_BOUNDARY,
  ADD_GRID_REFERENCE,
  ADD_HECTARES
]

export {
  siteBoundaryJourneys,
  siteBoundaryRouteDefinitions
}
