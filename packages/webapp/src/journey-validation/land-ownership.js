import constants from '../utils/constants.js'
import {
  ANY,
  routeDefinition,
  journeyStep,
  journeyStepFromRoute
} from './helpers.js'

const UPLOAD_LAND_OWNERSHIP = routeDefinition(
  constants.routes.UPLOAD_LAND_OWNERSHIP,
  [constants.redisKeys.LAND_OWNERSHIP_PROOFS]
)

const CHECK_PROOF_OF_OWNERSHIP = routeDefinition(
  constants.routes.CHECK_PROOF_OF_OWNERSHIP,
  [constants.redisKeys.LAND_OWNERSHIP_CHECKED]
)

const LAND_OWNERSHIP_PROOF_LIST = routeDefinition(
  constants.routes.LAND_OWNERSHIP_PROOF_LIST,
  [constants.redisKeys.LAND_OWNERSHIP_PROOF_LIST_KEY]
)

const landOwnershipJourneys = [
  [
    journeyStep(
      UPLOAD_LAND_OWNERSHIP.startUrl,
      [
        ...UPLOAD_LAND_OWNERSHIP.sessionKeys,
        ...CHECK_PROOF_OF_OWNERSHIP.sessionKeys
      ],
      [ANY, 'yes']
    ),
    journeyStepFromRoute(LAND_OWNERSHIP_PROOF_LIST, ['yes'])
  ]
]

export {
  landOwnershipJourneys
}
