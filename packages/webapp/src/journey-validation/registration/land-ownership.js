import constants from '../../utils/constants.js'
import {
  ANY,
  routeDefinition,
  journeyStep,
  journeyStepFromRoute
} from '../utils.js'
import { getValidReferrerUrl } from '../../utils/helpers.js'

const UPLOAD_LAND_OWNERSHIP = routeDefinition(
  constants.routes.UPLOAD_LAND_OWNERSHIP,
  [constants.redisKeys.LAND_OWNERSHIP_PROOFS],
  (session) => {
    const tempFileDetails = session.get(constants.redisKeys.TEMP_LAND_OWNERSHIP_PROOF)
    return `${constants.routes.CHECK_PROOF_OF_OWNERSHIP}?id=${tempFileDetails.id}`
  }
)

const CHECK_PROOF_OF_OWNERSHIP = routeDefinition(
  constants.routes.CHECK_PROOF_OF_OWNERSHIP,
  [constants.redisKeys.LAND_OWNERSHIP_CHECKED],
  (session, request) => {
    const checkLandOwnership = session.get(constants.redisKeys.LAND_OWNERSHIP_CHECKED)
    if (checkLandOwnership === 'no') {
      return constants.routes.UPLOAD_LAND_OWNERSHIP
    } else if (checkLandOwnership === 'yes') {
      return constants.routes.LAND_OWNERSHIP_PROOF_LIST
    }
  }
)

const LAND_OWNERSHIP_PROOF_LIST = routeDefinition(
  constants.routes.LAND_OWNERSHIP_PROOF_LIST,
  [constants.redisKeys.LAND_OWNERSHIP_PROOF_LIST_KEY],
  (session) => {
    const landOwnershipProofListKey = session.get(constants.redisKeys.LAND_OWNERSHIP_PROOF_LIST_KEY)
    if (landOwnershipProofListKey) {
      const referrerUrl = getValidReferrerUrl(session, ['/land/check-and-submit'])
      return referrerUrl || constants.routes.REGISTER_LAND_TASK_LIST
    } else {
      return constants.routes.UPLOAD_LAND_OWNERSHIP
    }
  }
)

const landOwnershipJourneys = [
  [
    journeyStep(
      UPLOAD_LAND_OWNERSHIP.startUrl,
      [
        ...UPLOAD_LAND_OWNERSHIP.sessionKeys,
        ...CHECK_PROOF_OF_OWNERSHIP.sessionKeys
      ],
      [[ANY], 'yes']
    ),
    journeyStepFromRoute(LAND_OWNERSHIP_PROOF_LIST, ['yes'])
  ]
]

const landOwnershipRouteDefinitions = [
  UPLOAD_LAND_OWNERSHIP,
  CHECK_PROOF_OF_OWNERSHIP,
  LAND_OWNERSHIP_PROOF_LIST
]

export {
  landOwnershipJourneys,
  landOwnershipRouteDefinitions
}
