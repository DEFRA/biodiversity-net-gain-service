import constants from '../../utils/constants.js'
import {
  routeDefinition,
  journeyStep,
  ANY
} from '../utils.js'

const PLANNING_DECISION_UPLOAD = routeDefinition(
  constants.reusedRoutes.COMBINED_CASE_UPLOAD_PLANNING_DECISION_NOTICE,
  [
    constants.redisKeys.DEVELOPER_PLANNING_DECISION_NOTICE_LOCATION,
    constants.redisKeys.DEVELOPER_PLANNING_DECISION_NOTICE_FILE_SIZE,
    constants.redisKeys.DEVELOPER_PLANNING_DECISION_NOTICE_FILE_TYPE
  ],
  (session) => {
    return constants.reusedRoutes.COMBINED_CASE_CHECK_PLANNING_DECISION_NOTICE_FILE
  }
)

const CHECK_PLANNING_DECISION = routeDefinition(
  constants.reusedRoutes.COMBINED_CASE_UPLOAD_PLANNING_DECISION_NOTICE,
  [constants.redisKeys.DEVELOPER_PLANNING_DECISION_NOTICE_CHECKED]
)

const planningDecisionNoticeJourneys = [
  [
    journeyStep(
      PLANNING_DECISION_UPLOAD.startUrl,
      [
        ...PLANNING_DECISION_UPLOAD.sessionKeys,
        ...CHECK_PLANNING_DECISION.sessionKeys
      ],
      [ANY, ANY, ANY, 'yes']
    )
  ]
]

const planningDecisionNoticeRouteDefinitions = [
  PLANNING_DECISION_UPLOAD,
  CHECK_PLANNING_DECISION
]

export {
  planningDecisionNoticeJourneys,
  planningDecisionNoticeRouteDefinitions
}
