import constants from '../../utils/constants.js'
import {
  ANY,
  journeyStep,
  journeyStepFromRoute
} from '../utils.js'
import {
  createUploadMetricRoute,
  createCheckUploadMetricRoute,
  createCheckHabitatBaselineRoute,
  createCheckHabitatCreatedRoute,
  createCheckMetricDetailsRoute
} from '../shared/habitat-info.js'

const UPLOAD_METRIC = createUploadMetricRoute(
  constants.routes.UPLOAD_METRIC,
  constants.routes.CHECK_UPLOAD_METRIC
)

const CHECK_UPLOAD_METRIC = createCheckUploadMetricRoute(
  constants.routes.CHECK_UPLOAD_METRIC,
  constants.routes.UPLOAD_METRIC,
  constants.routes.CHECK_HABITAT_BASELINE
)

const CHECK_HABITAT_BASELINE = createCheckHabitatBaselineRoute(
  constants.routes.CHECK_HABITAT_BASELINE,
  constants.routes.CHECK_HABITAT_CREATED
)

const CHECK_HABITAT_CREATED = createCheckHabitatCreatedRoute(
  constants.routes.CHECK_HABITAT_CREATED,
  constants.routes.CHECK_METRIC_DETAILS
)

const CHECK_METRIC_DETAILS = createCheckMetricDetailsRoute(
  constants.routes.CHECK_METRIC_DETAILS,
  constants.routes.REGISTER_LAND_TASK_LIST
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
  CHECK_HABITAT_CREATED,
  CHECK_METRIC_DETAILS
]

export {
  habitatInfoJourneys,
  habitatInfoRouteDefinitions
}
