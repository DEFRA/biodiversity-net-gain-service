import constants from '../../utils/constants.js'
import {
  ANY,
  routeDefinition,
  journeyStep
} from '../utils.js'
import { getValidReferrerUrl } from '../../utils/helpers.js'
import { FormError } from '../../utils/form-error.js'

const UPLOAD_LOCAL_LAND_CHARGE = routeDefinition(
  constants.routes.UPLOAD_LOCAL_LAND_CHARGE,
  [
    constants.redisKeys.LOCAL_LAND_CHARGE_LOCATION,
    constants.redisKeys.LOCAL_LAND_CHARGE_FILE_SIZE,
    constants.redisKeys.LOCAL_LAND_CHARGE_FILE_TYPE
  ],
  () => {
    return constants.routes.CHECK_LOCAL_LAND_CHARGE_FILE
  }
)

const CHECK_LOCAL_LAND_CHARGE_FILE = routeDefinition(
  constants.routes.CHECK_LOCAL_LAND_CHARGE_FILE,
  [constants.redisKeys.LOCAL_LAND_CHARGE_CHECKED],
  (session) => {
    const checkLocalLandCharge = session.get(constants.redisKeys.LOCAL_LAND_CHARGE_CHECKED)
    if (checkLocalLandCharge === 'no') {
      session.set(constants.redisKeys.LOCAL_LAND_CHARGE_FILE_OPTION, 'no')
      return constants.routes.UPLOAD_LOCAL_LAND_CHARGE
    } else if (checkLocalLandCharge === 'yes') {
      session.set(constants.redisKeys.LOCAL_LAND_CHARGE_FILE_OPTION, 'yes')
      const referrerUrl = getValidReferrerUrl(session, ['/land/check-and-submit', '/combined-case/check-and-submit'])
      const redirectUrl = referrerUrl ||
        constants.routes.REGISTER_LAND_TASK_LIST
      return redirectUrl
    } else {
      const message = 'Select yes if this is the correct file'
      throw new FormError(message, {
        text: message,
        href: '#check-upload-correct-yes'
      })
    }
  }
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

const localLandChargeRouteDefinitions = [
  UPLOAD_LOCAL_LAND_CHARGE,
  CHECK_LOCAL_LAND_CHARGE_FILE
]

export {
  localLandChargeJourneys,
  localLandChargeRouteDefinitions
}
