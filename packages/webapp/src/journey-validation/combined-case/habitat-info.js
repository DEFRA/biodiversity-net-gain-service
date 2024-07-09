import constants from '../../utils/constants.js'
import {
  ANY,
  routeDefinition,
  journeyStep,
  journeyStepFromRoute
} from '../utils.js'
import { getValidReferrerUrl } from '../../utils/helpers.js'
import { FormError } from '../../utils/form-error.js'

const UPLOAD_METRIC = routeDefinition(
  constants.reusedRoutes.COMBINED_CASE_UPLOAD_METRIC,
  [
    constants.redisKeys.METRIC_LOCATION,
    constants.redisKeys.METRIC_FILE_SIZE,
    constants.redisKeys.METRIC_FILE_TYPE,
    constants.redisKeys.METRIC_DATA
  ],
  () => {
    return constants.reusedRoutes.COMBINED_CASE_CHECK_UPLOAD_METRIC
  }
)

const CHECK_UPLOAD_METRIC = routeDefinition(
  constants.reusedRoutes.COMBINED_CASE_CHECK_UPLOAD_METRIC,
  [constants.redisKeys.METRIC_FILE_CHECKED],
  (session) => {
    const checkUploadMetric = session.get(constants.redisKeys.METRIC_FILE_CHECKED)
    if (checkUploadMetric === 'no') {
      return constants.reusedRoutes.COMBINED_CASE_UPLOAD_METRIC
    } else if (checkUploadMetric === 'yes') {
      session.set(constants.redisKeys.METRIC_UPLOADED_ANSWER, true)
      const referrerUrl = getValidReferrerUrl(session, constants.LAND_METRIC_VALID_REFERRERS)
      return (referrerUrl || constants.reusedRoutes.COMBINED_CASE_CHECK_HABITAT_BASELINE)
    } else {
      const message = 'Select yes if this is the correct file'
      throw new FormError(message, {
        text: message,
        href: '#check-upload-correct-yes'
      })
    }
  }
)

const CHECK_HABITAT_BASELINE = routeDefinition(
  constants.reusedRoutes.COMBINED_CASE_CHECK_HABITAT_BASELINE,
  [constants.redisKeys.METRIC_HABITAT_BASELINE_CHECKED],
  (session) => {
    const referrerUrl = getValidReferrerUrl(session, constants.LAND_METRIC_VALID_REFERRERS)
    return (referrerUrl || constants.reusedRoutes.COMBINED_CASE_CHECK_HABITAT_CREATED)
  }
)

const CHECK_HABITAT_CREATED = routeDefinition(
  constants.reusedRoutes.COMBINED_CASE_CHECK_HABITAT_CREATED,
  [constants.redisKeys.METRIC_HABITAT_CREATED_CHECKED],
  (session) => {
    const referrerUrl = getValidReferrerUrl(session, constants.LAND_METRIC_VALID_REFERRERS)
    return (referrerUrl || constants.reusedRoutes.COMBINED_CASE_CHECK_METRIC_DETAILS)
  }
)

const habitatInfoJourneys = [
  [
    journeyStep(
      UPLOAD_METRIC.startUrl,
      [
        ...UPLOAD_METRIC.sessionKeys,
        ...CHECK_UPLOAD_METRIC.sessionKeys
      ],
      [ANY, ANY, ANY, ANY, 'yes']
    ),
    journeyStepFromRoute(CHECK_HABITAT_BASELINE, [true]),
    journeyStepFromRoute(CHECK_HABITAT_CREATED, [true])
  ]
]

const habitatInfoRouteDefinitions = [
  UPLOAD_METRIC,
  CHECK_UPLOAD_METRIC,
  CHECK_HABITAT_BASELINE,
  CHECK_HABITAT_CREATED
]

export {
  habitatInfoJourneys,
  habitatInfoRouteDefinitions
}
