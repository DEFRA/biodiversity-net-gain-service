import constants from '../utils/constants.js'
import {
  ANY,
  routeDefinition,
  journeyStep,
  journeyStepFromRoute
} from './utils.js'

const UPLOAD_METRIC = routeDefinition(
  constants.routes.UPLOAD_METRIC,
  [
    constants.redisKeys.METRIC_LOCATION,
    constants.redisKeys.METRIC_FILE_SIZE,
    constants.redisKeys.METRIC_FILE_TYPE,
    constants.redisKeys.METRIC_DATA
  ]
)

const CHECK_UPLOAD_METRIC = routeDefinition(
  constants.routes.CHECK_UPLOAD_METRIC,
  [constants.redisKeys.METRIC_FILE_CHECKED]
)

const CHECK_HABITAT_BASELINE = routeDefinition(
  constants.routes.CHECK_HABITAT_BASELINE,
  [constants.redisKeys.METRIC_HABITAT_BASELINE_CHECKED]
)

const CHECK_HABITAT_CREATED = routeDefinition(
  constants.routes.CHECK_HABITAT_CREATED,
  [constants.redisKeys.METRIC_HABITAT_CREATED_CHECKED]
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

export {
  habitatInfoJourneys
}
