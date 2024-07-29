import constants from '../../utils/constants.js'
import {
  ANY,
  routeDefinition,
  journeyStep
} from '../utils.js'
import { getValidReferrerUrl } from '../../utils/helpers.js'
import { FormError } from '../../utils/form-error.js'

const UPLOAD_LOCAL_LAND_CHARGE = routeDefinition(
  constants.reusedRoutes.COMBINED_CASE_UPLOAD_LOCAL_LAND_CHARGE,
  [
    constants.redisKeys.LOCAL_LAND_CHARGE_LOCATION,
    constants.redisKeys.LOCAL_LAND_CHARGE_FILE_SIZE,
    constants.redisKeys.LOCAL_LAND_CHARGE_FILE_TYPE
  ],
  () => {
    return constants.reusedRoutes.COMBINED_CASE_CHECK_LOCAL_LAND_CHARGE_FILE
  }
)

const CHECK_LOCAL_LAND_CHARGE_FILE = routeDefinition(
  constants.reusedRoutes.COMBINED_CASE_CHECK_LOCAL_LAND_CHARGE_FILE,
  [constants.redisKeys.LOCAL_LAND_CHARGE_CHECKED],
  (session) => {
    const checkLocalLandCharge = session.get(constants.redisKeys.LOCAL_LAND_CHARGE_CHECKED)
    if (checkLocalLandCharge === 'no') {
      session.set(constants.redisKeys.LOCAL_LAND_CHARGE_FILE_OPTION, 'no')
      return constants.reusedRoutes.COMBINED_CASE_UPLOAD_LOCAL_LAND_CHARGE
    } else if (checkLocalLandCharge === 'yes') {
      session.set(constants.redisKeys.LOCAL_LAND_CHARGE_FILE_OPTION, 'yes')
      const referrerUrl = getValidReferrerUrl(session, ['/land/check-and-submit'])
      const redirectUrl = referrerUrl ||
        constants.routes.COMBINED_CASE_TASK_LIST
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
