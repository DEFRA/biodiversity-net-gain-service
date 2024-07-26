import constants from '../../utils/constants.js'
import { getValidReferrerUrl } from '../../utils/helpers.js'
import { FormError } from '../../utils/form-error.js'
import { routeDefinition } from '../utils.js'

const createUploadMetricRoute = (uploadRoute, checkRoute) => routeDefinition(
  uploadRoute,
  [
    constants.redisKeys.METRIC_LOCATION,
    constants.redisKeys.METRIC_FILE_SIZE,
    constants.redisKeys.METRIC_FILE_TYPE,
    constants.redisKeys.METRIC_DATA
  ],
  () => checkRoute
)

const createCheckUploadMetricRoute = (checkRoute, uploadRoute, nextRoute) => routeDefinition(
  checkRoute,
  [constants.redisKeys.METRIC_FILE_CHECKED],
  (session) => {
    const checkUploadMetric = session.get(constants.redisKeys.METRIC_FILE_CHECKED)
    if (checkUploadMetric === 'no') {
      return uploadRoute
    } else if (checkUploadMetric === 'yes') {
      session.set(constants.redisKeys.METRIC_UPLOADED_ANSWER, true)
      const referrerUrl = getValidReferrerUrl(session, constants.LAND_METRIC_VALID_REFERRERS)
      return referrerUrl || nextRoute
    } else {
      const message = 'Select yes if this is the correct file'
      throw new FormError(message, {
        text: message,
        href: '#check-upload-correct-yes'
      })
    }
  }
)

const createCheckHabitatBaselineRoute = (checkRoute, nextRoute) => routeDefinition(
  checkRoute,
  [constants.redisKeys.METRIC_HABITAT_BASELINE_CHECKED],
  (session) => {
    const referrerUrl = getValidReferrerUrl(session, constants.LAND_METRIC_VALID_REFERRERS)
    return referrerUrl || nextRoute
  }
)

const createCheckHabitatCreatedRoute = (checkRoute, nextRoute) => routeDefinition(
  checkRoute,
  [constants.redisKeys.METRIC_HABITAT_CREATED_CHECKED],
  (session) => {
    const referrerUrl = getValidReferrerUrl(session, constants.LAND_METRIC_VALID_REFERRERS)
    return referrerUrl || nextRoute
  }
)

const createCheckMetricDetailsRoute = (checkRoute, taskListRoute) => routeDefinition(
  checkRoute,
  [],
  () => taskListRoute
)

export {
  createUploadMetricRoute,
  createCheckUploadMetricRoute,
  createCheckHabitatBaselineRoute,
  createCheckHabitatCreatedRoute,
  createCheckMetricDetailsRoute
}
