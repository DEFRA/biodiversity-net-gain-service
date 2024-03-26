import constants from '../../utils/constants.js'
import {
  routeDefinition,
  journeyStepFromRoute
} from '../utils.js'

const PLANNING_DECISION_UPLOAD = routeDefinition(
  constants.routes.DEVELOPER_PLANNING_DECISION_UPLOAD,
  [constants.redisKeys.DEVELOPER_PLANNING_DECISION_CHECKED]
)

const planningDecisionNoticeJourneys = [
  [
    journeyStepFromRoute(PLANNING_DECISION_UPLOAD)
  ]
]

export {
  planningDecisionNoticeJourneys
}
