import constants from '../../utils/constants.js'
import {
  routeDefinition,
  journeyStepFromRoute
} from '../utils.js'
import { getValidReferrerUrl } from '../../utils/helpers.js'

const ADD_DEVELOPMENT_PROJECT_INFORMATION = routeDefinition(
  constants.reusedRoutes.COMBINED_CASE_DEVELOPMENT_PROJECT_INFORMATION,
  [
    constants.redisKeys.DEVELOPER_PLANNING_AUTHORITY_LIST
  ],
  (session) => {
    const referrerUrl = getValidReferrerUrl(session, ['/combined-case/check-and-submit', 'combined-case/tasklist'])
    return referrerUrl || constants.routes.COMBINED_CASE_TASK_LIST
  }
)

const addDevelopmentProjectInformationJourneys = [
  [
    journeyStepFromRoute(ADD_DEVELOPMENT_PROJECT_INFORMATION)
  ]
]

const addDevelopmentProjectInformationJourneysRouteDefinitions = [
  ADD_DEVELOPMENT_PROJECT_INFORMATION
]

export {
  addDevelopmentProjectInformationJourneys,
  addDevelopmentProjectInformationJourneysRouteDefinitions
}
