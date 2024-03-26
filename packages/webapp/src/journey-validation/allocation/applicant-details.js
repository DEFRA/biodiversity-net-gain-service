import constants from '../../utils/constants.js'
import {
  routeDefinition,
  journeyStepFromRoute
} from '../utils.js'

const APPLICANT_DETAILS = routeDefinition(
  constants.routes.DEVELOPER_AGENT_ACTING_FOR_CLIENT,
  [constants.redisKeys.DEVELOPER_IS_AGENT]
)

const applicantDetailsJourneys = [
  [
    journeyStepFromRoute(APPLICANT_DETAILS)
  ]
]

export {
  applicantDetailsJourneys
}
