import constants from '../../utils/constants.js'
import {
  routeDefinition,
  journeyStepFromRoute
} from '../utils.js'

const UPLOAD_METRIC = routeDefinition(
  constants.routes.DEVELOPER_UPLOAD_METRIC,
  [constants.redisKeys.DEVELOPER_METRIC_FILE_NAME]
)

const addMetricCalculationsJourneys = [
  [
    journeyStepFromRoute(UPLOAD_METRIC)
  ]
]

export {
  addMetricCalculationsJourneys
}
