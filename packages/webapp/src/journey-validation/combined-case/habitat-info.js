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
  constants.reusedRoutes.COMBINED_CASE_UPLOAD_METRIC,
  constants.reusedRoutes.COMBINED_CASE_CHECK_UPLOAD_METRIC
)

const CHECK_UPLOAD_METRIC = createCheckUploadMetricRoute(
  constants.reusedRoutes.COMBINED_CASE_CHECK_UPLOAD_METRIC,
  constants.reusedRoutes.COMBINED_CASE_UPLOAD_METRIC,
  constants.reusedRoutes.COMBINED_CASE_CHECK_HABITAT_BASELINE
)

const CHECK_HABITAT_BASELINE = createCheckHabitatBaselineRoute(
  constants.reusedRoutes.COMBINED_CASE_CHECK_HABITAT_BASELINE,
  constants.reusedRoutes.COMBINED_CASE_CHECK_HABITAT_CREATED
)

const CHECK_HABITAT_CREATED = createCheckHabitatCreatedRoute(
  constants.reusedRoutes.COMBINED_CASE_CHECK_HABITAT_CREATED,
  constants.reusedRoutes.COMBINED_CASE_CHECK_METRIC_DETAILS
)

const CHECK_METRIC_DETAILS = createCheckMetricDetailsRoute(
  constants.reusedRoutes.COMBINED_CASE_CHECK_METRIC_DETAILS,
  constants.routes.COMBINED_CASE_TASK_LIST
)

const habitatInfoJourneys = [
  [
    journeyStep(
      UPLOAD_METRIC.startUrl,
      [
        ...UPLOAD_METRIC.sessionKeys,
        ...CHECK_UPLOAD_METRIC.sessionKeys
      ],
      [ANY, ANY, ANY, ANY]
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
