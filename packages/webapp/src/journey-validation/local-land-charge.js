import constants from '../utils/constants.js'
import {
  ANY,
  routeDefinition,
  journeyStep
} from './helpers.js'

const UPLOAD_LOCAL_LAND_CHARGE = routeDefinition(
  constants.routes.UPLOAD_LOCAL_LAND_CHARGE,
  [
    constants.redisKeys.LOCAL_LAND_CHARGE_LOCATION,
    constants.redisKeys.LOCAL_LAND_CHARGE_FILE_SIZE,
    constants.redisKeys.LOCAL_LAND_CHARGE_FILE_TYPE
  ]
)

const CHECK_LOCAL_LAND_CHARGE_FILE = routeDefinition(
  constants.routes.CHECK_LOCAL_LAND_CHARGE_FILE,
  [constants.redisKeys.LOCAL_LAND_CHARGE_CHECKED]
)

const localLandChargeJourneys = [
  [
    journeyStep(
      UPLOAD_LOCAL_LAND_CHARGE.startUrl,
      [
        ...UPLOAD_LOCAL_LAND_CHARGE.sessionKeys,
        ...CHECK_LOCAL_LAND_CHARGE_FILE.sessionKeys
      ],
      [ANY, ANY, ANY, 'yes']
    )
  ]
]

export {
  localLandChargeJourneys
}
